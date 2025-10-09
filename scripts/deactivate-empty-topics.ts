#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deactivateEmptyTopics() {
  try {
    console.log('🔧 Deactivating empty vocabulary topics...\n')
    
    // Deactivate those specific 3 B2 topics that are showing empty
    const emptyB2Topics = [
      'cmggf19k4001346kph05htyg1', // Literatur und Kunst
      'cmggf19jz000z46kplyeeuz8u', // Politik und Wirtschaft  
      'cmggf19k1001146kpgbpewolf'  // Wissenschaft und Technik
    ]
    
    // Also deactivate all grammatik topics since we cleaned those out
    const grammatikTopics = [
      'cmgj7rrrt00yb46goqm48hkdk', // B2 Grammatik
      'cmgj7rqli000246go48u2ddhs', // A1 Grammatik
      'cmgj7rqzo00bx46goc63wvwcg', // A2 Grammatik
      'cmgj7rr9900jk46gos1wu4k84'  // B1 Grammatik
    ]
    
    const allTopicsToDeactivate = [...emptyB2Topics, ...grammatikTopics]
    
    // Get current info before deactivating
    const topicsInfo = await prisma.vocabularyTopic.findMany({
      where: {
        id: { in: allTopicsToDeactivate }
      },
      include: {
        level: {
          select: {
            name: true,
            displayName: true
          }
        }
      }
    })
    
    console.log('📋 Topics to deactivate:')
    topicsInfo.forEach((topic, index) => {
      console.log(`${index + 1}. "${topic.displayName}" (${topic.level.name})`)
    })
    
    // Deactivate them
    const result = await prisma.vocabularyTopic.updateMany({
      where: {
        id: { in: allTopicsToDeactivate }
      },
      data: {
        isActive: false
      }
    })
    
    console.log(`\n✅ Successfully deactivated ${result.count} empty topics`)
    console.log('These topics will no longer appear in vocabulary search interface')
    
    // Double check - count remaining active topics
    const activeTopics = await prisma.vocabularyTopic.count({
      where: { isActive: true }
    })
    
    console.log(`\n📊 Remaining active topics: ${activeTopics}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

deactivateEmptyTopics()
