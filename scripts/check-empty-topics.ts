#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkVocabularyTopicsWithNoEntries() {
  try {
    console.log('🔍 Checking topics that appear in vocabulary search but have no entries...\n')
    
    // Lấy tất cả topics
    const allTopics = await prisma.vocabularyTopic.findMany({
      include: {
        level: {
          select: {
            name: true,
            displayName: true
          }
        }
      },
      orderBy: {
        displayName: 'asc'
      }
    })
    
    // Kiểm tra entry count cho mỗi topic
    const topicsWithCounts = await Promise.all(
      allTopics.map(async (topic) => {
        const entryCount = await prisma.vocabularyEntry.count({
          where: { topicId: topic.id }
        })
        return { ...topic, entryCount }
      })
    )
    
    // Tìm những topics có 0 entries
    const emptyTopics = topicsWithCounts.filter(t => t.entryCount === 0)
    
    console.log(`📊 Found ${emptyTopics.length} topics with 0 entries:`)
    
    emptyTopics.forEach((topic, index) => {
      console.log(`${index + 1}. "${topic.displayName}" (${topic.name})`)
      console.log(`   Level: ${topic.level.name} (${topic.level.displayName})`)
      console.log(`   ID: ${topic.id}`)
      console.log(`   Slug: ${topic.slug}`)
      console.log(`   Active: ${topic.isActive}`)
      console.log('')
    })
    
    // Kiểm tra xem có những topics nào khớp với những gì xuất hiện trong vocabulary search
    const suspiciousTopics = emptyTopics.filter(t => 
      t.displayName.includes('Politik') || 
      t.displayName.includes('Wirtschaft') ||
      t.displayName.includes('Wissenschaft') ||
      t.displayName.includes('Technik') ||
      t.displayName.includes('Literatur') ||
      t.displayName.includes('Kunst')
    )
    
    if (suspiciousTopics.length > 0) {
      console.log(`⚠️  Found ${suspiciousTopics.length} empty topics that might appear in vocabulary search:`)
      suspiciousTopics.forEach((topic, index) => {
        console.log(`${index + 1}. "${topic.displayName}" (Level: ${topic.level.name})`)
      })
      
      console.log('\n💡 These topics should be either:')
      console.log('- Deactivated (set isActive = false)')
      console.log('- Deleted from database') 
      console.log('- Populated with vocabulary entries')
    }
    
    // Đề xuất action
    if (emptyTopics.length > 0) {
      console.log('\n🗑️  To clean up, you can:')
      console.log('1. Deactivate empty topics:')
      emptyTopics.forEach(topic => {
        console.log(`   UPDATE vocabulary_topics SET isActive = false WHERE id = '${topic.id}';`)
      })
      
      console.log('\n2. Or delete empty topics:')
      emptyTopics.forEach(topic => {
        console.log(`   DELETE FROM vocabulary_topics WHERE id = '${topic.id}';`)
      })
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkVocabularyTopicsWithNoEntries()
