#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkVocabularyTopics() {
  try {
    console.log('🔍 Checking vocabulary topics and their distribution...\n')
    
    // Lấy tất cả các topics trong database
    const topics = await prisma.vocabularyTopic.findMany({
      orderBy: {
        name: 'asc'
      }
    })
    
    console.log('📚 Available vocabulary topics:')
    for (let i = 0; i < topics.length; i++) {
      const topic = topics[i]
      
      // Đếm entries cho topic này
      const entryCount = await prisma.vocabularyEntry.count({
        where: { topicId: topic.id }
      })
      
      console.log(`${i + 1}. ${topic.name} (${topic.description})`)
      console.log(`   - Entries: ${entryCount}`)
      console.log(`   - ID: ${topic.id}`)
      console.log('')
    }
    
    // Lấy một số vocabulary entries theo chủ đề
    console.log('🏷️  Sample entries by topic:')
    
    for (const topic of topics.slice(0, 5)) {
      console.log(`\n📖 Topic: ${topic.name}`)
      const sampleEntries = await prisma.vocabularyEntry.findMany({
        where: {
          topicId: topic.id
        },
        select: {
          german: true,
          vietnamese: true,
          type: true,
          tags: true
        },
        take: 5
      })
      
      sampleEntries.forEach((entry, index) => {
        console.log(`   ${index + 1}. ${entry.german} → ${entry.vietnamese} (${entry.type})`)
        if (entry.tags.length > 0) {
          console.log(`      Tags: ${entry.tags.join(', ')}`)
        }
      })
    }
    
    // Kiểm tra B2 level entries
    console.log('\n🎯 B2 Level vocabulary distribution:')
    const b2Level = await prisma.vocabularyLevel.findFirst({
      where: { name: 'B2' }
    })
    
    if (b2Level) {
      const b2TopicStats = await prisma.vocabularyEntry.groupBy({
        by: ['topicId'],
        where: {
          levelId: b2Level.id
        },
        _count: {
          id: true
        },
        orderBy: {
          _count: {
            id: 'desc'
          }
        }
      })
      
      for (const stat of b2TopicStats) {
        const topic = topics.find(t => t.id === stat.topicId)
        if (topic) {
          console.log(`- ${topic.name}: ${stat._count.id} entries`)
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkVocabularyTopics()
