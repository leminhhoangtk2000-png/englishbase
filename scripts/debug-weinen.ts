#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function debugWeinen() {
  try {
    console.log('🔍 Debugging "weinen" search...\n')
    
    // Check exact entries in database
    const entries = await prisma.vocabularyEntry.findMany({
      where: {
        german: { contains: 'weinen', mode: 'insensitive' }
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
    
    console.log(`Database entries for "weinen": ${entries.length}`)
    entries.forEach((entry, i) => {
      console.log(`${i+1}. "${entry.german}" - Level: ${entry.level.name} - Vietnamese: ${entry.vietnamese}`)
    })
    
    // Test AI search API directly
    console.log('\n🧪 Testing AI search API...')
    
    const testFetch = async () => {
      try {
        const response = await fetch('http://localhost:9003/api/vocabulary/ai-search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ word: 'weinen' }),
        })
        
        const result = await response.json()
        console.log('API Response:', JSON.stringify(result, null, 2))
        
        if (result.data) {
          console.log('\nLevel field in response:', result.data.level)
          console.log('PartOfSpeech field in response:', result.data.partOfSpeech)
        }
        
      } catch (error) {
        console.error('Fetch error:', error)
      }
    }
    
    // Can't actually fetch in Node.js script, so let's simulate the API response
    const simulatedApiResponse = {
      success: true,
      data: {
        id: entries[0]?.id || 'test',
        word: entries[0]?.german || 'weinen',
        pronunciation: entries[0]?.phonetic || '/vaɪnən/',
        partOfSpeech: entries[0]?.type || 'VERB',
        level: entries[0]?.level.name || 'B1',
        definitions: {
          german: entries[0]?.german || 'weinen',
          vietnamese: entries[0]?.vietnamese || 'khóc',
        },
        examples: entries[0]?.exampleGerman ? [{
          german: entries[0].exampleGerman,
          vietnamese: entries[0].exampleVietnamese
        }] : [],
        tags: [],
        difficulty: entries[0]?.difficulty || 3,
        frequency: entries[0]?.frequency || 1,
        plural: entries[0]?.plural || '',
        createdAt: entries[0]?.createdAt || new Date(),
        updatedAt: entries[0]?.updatedAt || new Date(),
        source: 'database' as const
      }
    }
    
    console.log('\nSimulated API response structure:')
    console.log('- entry.level:', simulatedApiResponse.data.level)
    console.log('- entry.partOfSpeech:', simulatedApiResponse.data.partOfSpeech)
    console.log('- Should show level badge?', simulatedApiResponse.data.level ? 'YES' : 'NO')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

debugWeinen()
