import { PrismaClient } from '@prisma/client'
import { extractGender, addGenderToNoun } from '../src/lib/gender-utils'

const prisma = new PrismaClient()

async function fixNounGenders() {
  console.log('🔧 Fixing noun genders...\n')

  try {
    // Tìm các danh từ chưa có gender
    const nounsWithoutGender = await prisma.vocabularyEntry.findMany({
      where: {
        type: 'NOMEN',
        NOT: {
          OR: [
            { german: { startsWith: 'der ' } },
            { german: { startsWith: 'die ' } },
            { german: { startsWith: 'das ' } }
          ]
        }
      },
      include: {
        level: true,
        topic: true
      }
    })

    console.log(`Found ${nounsWithoutGender.length} nouns without gender:\n`)

    const fixedEntries = []
    const unfixableEntries = []

    for (const entry of nounsWithoutGender) {
      console.log(`Processing: "${entry.german}"`)
      
      const gender = extractGender(entry.german)
      if (gender) {
        const newGerman = addGenderToNoun(entry.german, gender)
        
        if (newGerman !== entry.german) {
          try {
            const updated = await prisma.vocabularyEntry.update({
              where: { id: entry.id },
              data: { german: newGerman }
            })
            
            fixedEntries.push({
              id: entry.id,
              original: entry.german,
              fixed: newGerman,
              gender: gender
            })
            
            console.log(`  ✅ Fixed: "${entry.german}" → "${newGerman}"`)
          } catch (error) {
            console.log(`  ❌ Error updating: ${error}`)
            unfixableEntries.push(entry)
          }
        } else {
          console.log(`  ℹ️  Already has gender`)
        }
      } else {
        unfixableEntries.push(entry)
        console.log(`  ⚠️  Cannot determine gender for: "${entry.german}"`)
      }
    }

    console.log(`\n📊 Summary:`)
    console.log(`  ✅ Fixed: ${fixedEntries.length} entries`)
    console.log(`  ⚠️  Unfixable: ${unfixableEntries.length} entries`)

    if (fixedEntries.length > 0) {
      console.log(`\n✅ Fixed entries:`)
      fixedEntries.forEach((entry, index) => {
        console.log(`  ${index + 1}. "${entry.original}" → "${entry.fixed}" (${entry.gender})`)
      })
    }

    if (unfixableEntries.length > 0) {
      console.log(`\n⚠️  Entries that need manual review:`)
      unfixableEntries.forEach((entry, index) => {
        console.log(`  ${index + 1}. "${entry.german}" (Level: ${entry.level.name}, Topic: ${entry.topic.name})`)
      })
    }

    // Final statistics
    const totalNouns = await prisma.vocabularyEntry.count({
      where: { type: 'NOMEN' }
    })

    const nounsWithGender = await prisma.vocabularyEntry.count({
      where: {
        type: 'NOMEN',
        OR: [
          { german: { startsWith: 'der ' } },
          { german: { startsWith: 'die ' } },
          { german: { startsWith: 'das ' } }
        ]
      }
    })

    console.log(`\n🎯 Final noun statistics:`)
    console.log(`  Total nouns: ${totalNouns}`)
    console.log(`  Nouns with gender: ${nounsWithGender}`)
    console.log(`  Coverage: ${((nounsWithGender / totalNouns) * 100).toFixed(1)}%`)

  } catch (error) {
    console.error('❌ Error during gender fixing:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Chạy fix
fixNounGenders()
