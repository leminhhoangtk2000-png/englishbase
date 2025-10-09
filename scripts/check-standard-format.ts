#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function ensureStandardVocabularyFormat() {
  try {
    console.log('🎯 Ensuring all vocabulary cards follow standard format...\n')
    
    // 1. Kiểm tra entries có đầy đủ ví dụ tiếng Đức và tiếng Việt
    const completeEntries = await prisma.vocabularyEntry.findMany({
      where: {
        AND: [
          { exampleGerman: { not: null } },
          { exampleVietnamese: { not: null } },
          { exampleGerman: { not: '' } },
          { exampleVietnamese: { not: '' } }
        ]
      },
      select: {
        german: true,
        vietnamese: true,
        exampleGerman: true,
        exampleVietnamese: true,
        plural: true,
        type: true
      },
      take: 10
    })
    
    console.log('✅ Sample of properly formatted entries:')
    completeEntries.forEach((entry, index) => {
      console.log(`${index + 1}. ${entry.german} (${entry.type})`)
      console.log(`   Vietnamese: ${entry.vietnamese}`)
      console.log(`   German Example: ${entry.exampleGerman}`)
      console.log(`   Vietnamese Example: ${entry.exampleVietnamese}`)
      if (entry.plural && entry.type === 'NOMEN') {
        console.log(`   Plural: ${entry.plural}`)
      }
      console.log('')
    })
    
    // 2. Đếm entries theo yêu cầu định dạng chuẩn
    const standardFormatCounts = await prisma.vocabularyEntry.groupBy({
      by: ['type'],
      where: {
        AND: [
          { exampleGerman: { not: null } },
          { exampleVietnamese: { not: null } },
          { exampleGerman: { not: '' } },
          { exampleVietnamese: { not: '' } }
        ]
      },
      _count: {
        id: true
      }
    })
    
    console.log('📊 Entries with standard format (German + Vietnamese examples):')
    standardFormatCounts.forEach(count => {
      console.log(`- ${count.type}: ${count._count.id} entries`)
    })
    
    // 3. Đếm danh từ có số nhiều
    const nounsWithPlural = await prisma.vocabularyEntry.count({
      where: {
        AND: [
          { type: 'NOMEN' },
          { plural: { not: null } },
          { plural: { not: '' } }
        ]
      }
    })
    
    const totalNouns = await prisma.vocabularyEntry.count({
      where: { type: 'NOMEN' }
    })
    
    console.log(`\n📝 Nouns with plural forms: ${nounsWithPlural}/${totalNouns} (${((nounsWithPlural/totalNouns)*100).toFixed(1)}%)`)
    
    // 4. Tóm tắt về tiêu chuẩn định dạng
    const totalEntries = await prisma.vocabularyEntry.count()
    const completeFormatEntries = await prisma.vocabularyEntry.count({
      where: {
        AND: [
          { exampleGerman: { not: null } },
          { exampleVietnamese: { not: null } },
          { exampleGerman: { not: '' } },
          { exampleVietnamese: { not: '' } }
        ]
      }
    })
    
    console.log('\n🎯 Standard Format Compliance:')
    console.log(`✅ Complete format: ${completeFormatEntries}/${totalEntries} (${((completeFormatEntries/totalEntries)*100).toFixed(1)}%)`)
    console.log(`❌ Missing examples: ${totalEntries - completeFormatEntries}`)
    
    console.log('\n📋 Standard Format Requirements:')
    console.log('✅ German word/phrase')
    console.log('✅ Vietnamese translation') 
    console.log('✅ German example sentence')
    console.log('✅ Vietnamese example sentence')
    console.log('✅ Plural form (for nouns when applicable)')
    console.log('✅ Proper type classification (NOMEN, VERB, ADJEKTIV, etc.)')
    
    // 5. Ví dụ hoàn hảo về định dạng chuẩn
    console.log('\n🌟 Perfect format example - "die Schwester":')
    const schwesterExample = await prisma.vocabularyEntry.findFirst({
      where: { german: 'die Schwester' }
    })
    
    if (schwesterExample) {
      console.log(`📚 ${schwesterExample.german}`)
      console.log(`🇻🇳 ${schwesterExample.vietnamese}`)
      console.log(`🇩🇪 "${schwesterExample.exampleGerman}"`) 
      console.log(`🇻🇳 "${schwesterExample.exampleVietnamese}"`)
      if (schwesterExample.plural) {
        console.log(`📝 Plural: ${schwesterExample.plural}`)
      }
      console.log(`🏷️  Type: ${schwesterExample.type}`)
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

ensureStandardVocabularyFormat()
