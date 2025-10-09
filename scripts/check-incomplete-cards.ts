#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkIncompleteVocabularyCards() {
  try {
    console.log('🔍 Checking vocabulary cards for completeness...\n')
    
    // Tìm các cards thiếu thông tin quan trọng
    const incompleteCards = await prisma.vocabularyEntry.findMany({
      where: {
        OR: [
          { exampleGerman: null },
          { exampleVietnamese: null },
          { exampleGerman: '' },
          { exampleVietnamese: '' },
          { phonetic: null },
          { phonetic: '' },
          { plural: null },
          { plural: '' }
        ]
      },
      include: {
        topic: {
          select: {
            displayName: true,
            level: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: [
        { topic: { level: { name: 'asc' } } },
        { topic: { displayName: 'asc' } },
        { german: 'asc' }
      ]
    })

    console.log(`📊 Found ${incompleteCards.length} vocabulary cards with missing information:\n`)

    // Phân loại theo loại thiếu sót
    const missingCategories = {
      exampleGerman: incompleteCards.filter(card => !card.exampleGerman || card.exampleGerman.trim() === ''),
      exampleVietnamese: incompleteCards.filter(card => !card.exampleVietnamese || card.exampleVietnamese.trim() === ''),
      phonetic: incompleteCards.filter(card => !card.phonetic || card.phonetic.trim() === ''),
      plural: incompleteCards.filter(card => !card.plural || card.plural.trim() === '')
    }

    console.log('📈 Missing information breakdown:')
    console.log(`- Missing German examples: ${missingCategories.exampleGerman.length}`)
    console.log(`- Missing Vietnamese examples: ${missingCategories.exampleVietnamese.length}`)
    console.log(`- Missing phonetic: ${missingCategories.phonetic.length}`)
    console.log(`- Missing plural forms: ${missingCategories.plural.length}`)

    // Show some examples của những cards thiếu thông tin
    console.log('\n🔍 Sample incomplete cards:')
    incompleteCards.slice(0, 10).forEach((card, index) => {
      const missing = []
      if (!card.exampleGerman || card.exampleGerman.trim() === '') missing.push('German example')
      if (!card.exampleVietnamese || card.exampleVietnamese.trim() === '') missing.push('Vietnamese example')
      if (!card.phonetic || card.phonetic.trim() === '') missing.push('phonetic')
      if (!card.plural || card.plural.trim() === '') missing.push('plural')

      console.log(`${index + 1}. "${card.german}" (${card.vietnamese})`)
      console.log(`   Topic: ${card.topic.displayName} (${card.topic.level.name})`)
      console.log(`   Type: ${card.type}`)
      console.log(`   Missing: ${missing.join(', ')}`)
      console.log('')
    })

    // Tính tổng số cards
    const totalCards = await prisma.vocabularyEntry.count()
    const completeCards = totalCards - incompleteCards.length
    const completionRate = ((completeCards / totalCards) * 100).toFixed(1)

    console.log(`\n📊 Overall completion status:`)
    console.log(`- Complete cards: ${completeCards}/${totalCards} (${completionRate}%)`)
    console.log(`- Incomplete cards: ${incompleteCards.length}`)

    if (incompleteCards.length > 0) {
      console.log('\n💡 Next steps:')
      console.log('1. Create script to auto-generate missing phonetic')
      console.log('2. Create script to auto-generate missing plural forms')
      console.log('3. Create script to auto-generate missing examples')
      console.log('4. Use AI to fill in missing information')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkIncompleteVocabularyCards()
