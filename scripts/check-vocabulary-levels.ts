#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkVocabularyLevels() {
  try {
    console.log('🔍 Checking vocabulary levels for "ärgern" entries...\n')
    
    const entries = await prisma.vocabularyEntry.findMany({
      where: {
        german: { contains: 'ärgern' }
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
      }
    })
    
    console.log(`Found ${entries.length} entries with "ärgern":`)
    
    entries.forEach((entry, index) => {
      console.log(`\n${index + 1}. "${entry.german}":`)
      console.log(`   Vietnamese: ${entry.vietnamese}`)
      console.log(`   Level: ${entry.level.name} (${entry.level.displayName})`)
      console.log(`   Topic: ${entry.topic.displayName}`)
      console.log(`   Type: ${entry.type}`)
      console.log(`   ID: ${entry.id}`)
    })
    
    // Test the specific search format
    console.log('\n🧪 Testing API search format...')
    
    // Simulate what the API would return
    const simulatedApiResponse = entries.map(entry => ({
      id: entry.id,
      word: entry.german,
      pronunciation: entry.phonetic,
      partOfSpeech: entry.type,
      level: entry.level.name, // This should be the level!
      definitions: {
        german: entry.german,
        vietnamese: entry.vietnamese,
      },
      examples: entry.exampleGerman && entry.exampleVietnamese ? [{
        german: entry.exampleGerman,
        vietnamese: entry.exampleVietnamese
      }] : [],
      tags: [],
      difficulty: entry.difficulty,
      frequency: entry.frequency,
      plural: entry.plural,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      source: 'database' as const
    }))
    
    console.log('\nSimulated API response format:')
    simulatedApiResponse.forEach((entry, index) => {
      console.log(`${index + 1}. Level field: "${entry.level}"`)
    })

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkVocabularyLevels()
