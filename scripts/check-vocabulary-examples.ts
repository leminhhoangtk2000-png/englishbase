#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function ensureAllEntriesHaveExamples() {
  try {
    console.log('🔍 Checking vocabulary entries without examples...\n')
    
    // Tìm các entries thiếu ví dụ
    const entriesWithoutExamples = await prisma.vocabularyEntry.findMany({
      where: {
        OR: [
          { exampleGerman: null },
          { exampleVietnamese: null },
          { exampleGerman: '' },
          { exampleVietnamese: '' }
        ]
      },
      select: {
        id: true,
        german: true,
        vietnamese: true,
        type: true,
        exampleGerman: true,
        exampleVietnamese: true,
        tags: true
      },
      orderBy: {
        german: 'asc'
      }
    })
    
    console.log(`Found ${entriesWithoutExamples.length} entries without complete examples:\n`)
    
    // Hiển thị top 20 entries thiếu ví dụ
    const sampleEntries = entriesWithoutExamples.slice(0, 20)
    
    sampleEntries.forEach((entry, index) => {
      console.log(`${index + 1}. "${entry.german}" (${entry.type})`)
      console.log(`   Vietnamese: ${entry.vietnamese}`)
      console.log(`   German Example: ${entry.exampleGerman || '❌ MISSING'}`)
      console.log(`   Vietnamese Example: ${entry.exampleVietnamese || '❌ MISSING'}`)
      console.log(`   Tags: ${entry.tags.join(', ')}`)
      console.log('')
    })
    
    if (entriesWithoutExamples.length > 20) {
      console.log(`... và ${entriesWithoutExamples.length - 20} entries khác\n`)
    }
    
    // Thống kê theo type
    const statsByType = await prisma.vocabularyEntry.groupBy({
      by: ['type'],
      where: {
        OR: [
          { exampleGerman: null },
          { exampleVietnamese: null },
          { exampleGerman: '' },
          { exampleVietnamese: '' }
        ]
      },
      _count: {
        id: true
      }
    })
    
    console.log('📊 Statistics by type (entries without examples):')
    statsByType.forEach(stat => {
      console.log(`- ${stat.type}: ${stat._count.id} entries`)
    })
    
    // Kiểm tra entries đã có đầy đủ ví dụ
    const completeEntries = await prisma.vocabularyEntry.count({
      where: {
        AND: [
          { exampleGerman: { not: null } },
          { exampleVietnamese: { not: null } },
          { exampleGerman: { not: '' } },
          { exampleVietnamese: { not: '' } }
        ]
      }
    })
    
    const totalEntries = await prisma.vocabularyEntry.count()
    const completionRate = ((completeEntries / totalEntries) * 100).toFixed(1)
    
    console.log(`\n✅ Complete entries: ${completeEntries}/${totalEntries} (${completionRate}%)`)
    console.log(`❌ Incomplete entries: ${entriesWithoutExamples.length}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

ensureAllEntriesHaveExamples()
