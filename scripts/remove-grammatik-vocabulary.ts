#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeGrammatikVocabulary() {
  try {
    console.log('🗑️  Removing all Grammatik vocabulary entries...\n')
    
    // Tìm tất cả topics có tên "grammatik"
    const grammatikTopics = await prisma.vocabularyTopic.findMany({
      where: {
        name: {
          contains: 'grammatik',
          mode: 'insensitive'
        }
      }
    })
    
    console.log(`Found ${grammatikTopics.length} Grammatik topics:`)
    grammatikTopics.forEach((topic, index) => {
      console.log(`${index + 1}. ${topic.name} (${topic.description}) - Level: ${topic.levelId}`)
    })
    
    // Đếm vocabulary entries sẽ bị xóa
    const entriesToDelete = await prisma.vocabularyEntry.findMany({
      where: {
        topic: {
          name: {
            contains: 'grammatik',
            mode: 'insensitive'
          }
        }
      },
      include: {
        topic: true,
        level: true
      }
    })
    
    console.log(`\n📊 Found ${entriesToDelete.length} vocabulary entries to delete:`)
    
    // Nhóm theo level
    const entriesByLevel = entriesToDelete.reduce((acc, entry) => {
      const levelName = entry.level.name
      if (!acc[levelName]) acc[levelName] = 0
      acc[levelName]++
      return acc
    }, {} as Record<string, number>)
    
    Object.entries(entriesByLevel).forEach(([level, count]) => {
      console.log(`- ${level}: ${count} entries`)
    })
    
    // Hiển thị một số examples
    console.log('\n🔍 Sample entries to be deleted:')
    entriesToDelete.slice(0, 10).forEach((entry, index) => {
      console.log(`${index + 1}. "${entry.german}" → ${entry.vietnamese} (${entry.level.name})`)
    })
    
    if (entriesToDelete.length > 10) {
      console.log(`... and ${entriesToDelete.length - 10} more entries`)
    }
    
    // Xóa tất cả vocabulary entries có topic grammatik
    console.log('\n🗑️  Deleting vocabulary entries...')
    const deleteResult = await prisma.vocabularyEntry.deleteMany({
      where: {
        topic: {
          name: {
            contains: 'grammatik',
            mode: 'insensitive'
          }
        }
      }
    })
    
    console.log(`✅ Deleted ${deleteResult.count} vocabulary entries`)
    
    // Kiểm tra xem có topics nào trở thành rỗng không
    console.log('\n🔍 Checking for empty topics...')
    for (const topic of grammatikTopics) {
      const remainingEntries = await prisma.vocabularyEntry.count({
        where: { topicId: topic.id }
      })
      
      if (remainingEntries === 0) {
        console.log(`📝 Topic "${topic.name}" is now empty`)
        // Có thể xóa topic rỗng nếu muốn
        // await prisma.vocabularyTopic.delete({ where: { id: topic.id } })
      }
    }
    
    // Thống kê sau khi xóa
    const totalVocabulary = await prisma.vocabularyEntry.count()
    console.log(`\n📊 Total vocabulary entries remaining: ${totalVocabulary}`)
    
    console.log('\n✅ Successfully removed all Grammatik vocabulary!')
    console.log('💡 Note: Grammar topics were kept but are now empty.')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

removeGrammatikVocabulary()
