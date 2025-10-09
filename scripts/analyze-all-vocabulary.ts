#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function analyzeAllVocabularyTopics() {
  try {
    console.log('🔍 Analyzing vocabulary topics across all levels...\n')
    
    // Lấy tất cả levels
    const levels = await prisma.vocabularyLevel.findMany({
      orderBy: { name: 'asc' }
    })
    
    console.log('📊 Vocabulary distribution by level and topic:\n')
    
    for (const level of levels) {
      console.log(`🎯 Level ${level.name}:`)
      
      // Lấy topics cho level này
      const topics = await prisma.vocabularyTopic.findMany({
        where: { levelId: level.id },
        orderBy: { name: 'asc' }
      })
      
      const topicsWithCounts = await Promise.all(
        topics.map(async (topic) => {
          const entryCount = await prisma.vocabularyEntry.count({
            where: { topicId: topic.id }
          })
          return { ...topic, entryCount }
        })
      )
      
      // Chỉ hiển thị topics có vocabulary
      const topicsWithData = topicsWithCounts.filter(t => t.entryCount > 0)
      
      if (topicsWithData.length > 0) {
        topicsWithData.forEach((topic, index) => {
          console.log(`   ${index + 1}. ${topic.name} (${topic.entryCount} entries)`)
          if (topic.description) {
            console.log(`      → ${topic.description}`)
          }
        })
      } else {
        console.log('   (No vocabulary available)')
      }
      console.log('')
    }
    
    // Tìm các topics có nhiều vocabulary nhất
    console.log('🏆 Top 10 topics with most vocabulary:')
    const allTopics = await prisma.vocabularyTopic.findMany({
      include: {
        level: true
      }
    })
    
    const allTopicsWithCounts = await Promise.all(
      allTopics.map(async (topic) => {
        const entryCount = await prisma.vocabularyEntry.count({
          where: { topicId: topic.id }
        })
        return { ...topic, entryCount }
      })
    )
    
    const topTopics = allTopicsWithCounts
      .filter(t => t.entryCount > 0)
      .sort((a, b) => b.entryCount - a.entryCount)
      .slice(0, 10)
    
    topTopics.forEach((topic, index) => {
      console.log(`${index + 1}. ${topic.name} (${topic.level.name}) - ${topic.entryCount} entries`)
    })
    
    // Đề xuất những topics nên được thêm vào navigation
    console.log('\n💡 Suggestions for navigation expansion:')
    
    const suggestedTopics = allTopicsWithCounts
      .filter(t => t.entryCount >= 50) // Chỉ topics có ít nhất 50 entries
      .filter(t => !['nomen-verb-verbindungen', 'grammatik'].includes(t.name.toLowerCase()))
      .sort((a, b) => b.entryCount - a.entryCount)
      .slice(0, 15)
    
    suggestedTopics.forEach((topic, index) => {
      console.log(`${index + 1}. ${topic.name} (${topic.level.name}) - ${topic.entryCount} entries`)
      console.log(`   → Could be added as "/b2niveau/vokabular/${topic.name.toLowerCase().replace(/\s+/g, '-')}"`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

analyzeAllVocabularyTopics()
