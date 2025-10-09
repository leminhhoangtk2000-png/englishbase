#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function testVocabularySearch() {
  try {
    console.log('🧪 Testing vocabulary search for "ärgern"...\n')
    
    // Simulate what the API search does
    const entries = await prisma.vocabularyEntry.findMany({
      where: {
        OR: [
          { german: { contains: 'ärgern', mode: 'insensitive' } },
          { vietnamese: { contains: 'ärgern', mode: 'insensitive' } }
        ]
      },
      include: {
        level: {
          select: {
            name: true,
            displayName: true
          }
        },
        topic: {
          select: {
            name: true,
            displayName: true
          }
        }
      },
      orderBy: [
        { level: { order: 'asc' } },
        { frequency: 'desc' }
      ]
    })
    
    console.log(`Found ${entries.length} entries for "ärgern" search:`)
    
    entries.forEach((entry, index) => {
      console.log(`\n${index + 1}. "${entry.german}" (Level: ${entry.level.name})`)
      console.log(`   Vietnamese: ${entry.vietnamese}`)
      console.log(`   Type: ${entry.type}`)
      console.log(`   Topic: ${entry.topic.displayName}`)
      console.log(`   Frequency: ${entry.frequency}`)
      
      // Simulate API response format
      console.log(`   API Format: { level: "${entry.level.name}", partOfSpeech: "${entry.type}" }`)
    })
    
    console.log('\n✅ Search test completed!')
    console.log('Now when you search "ärgern" in vocabulary page, you should see:')
    console.log('- Level badges with colors (A1=green, A2=blue, B1=amber, B2=orange)')
    console.log('- Type badges with appropriate colors')
    console.log('- Proper level information from database')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testVocabularySearch()
