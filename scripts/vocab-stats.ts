import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function getVocabularyStats() {
  console.log('📊 Vocabulary Database Statistics\n')
  
  // Total entries
  const totalEntries = await prisma.vocabularyEntry.count()
  console.log(`🎯 Total vocabulary entries: ${totalEntries}`)
  
  // By level
  const levels = await prisma.vocabularyLevel.findMany({
    include: {
      _count: {
        select: { vocabularyEntries: true }
      }
    },
    orderBy: { order: 'asc' }
  })
  
  console.log('\n📚 By Level:')
  for (const level of levels) {
    console.log(`  ${level.displayName}: ${level._count.vocabularyEntries} entries`)
  }
  
  // By topic
  const topics = await prisma.vocabularyTopic.findMany({
    include: {
      _count: {
        select: { vocabularyEntries: true }
      },
      level: true
    },
    orderBy: [
      { level: { order: 'asc' } },
      { order: 'asc' }
    ]
  })
  
  console.log('\n🏷️ By Topic:')
  for (const topic of topics) {
    if (topic._count.vocabularyEntries > 0) {
      console.log(`  ${topic.level.name} - ${topic.displayName}: ${topic._count.vocabularyEntries} entries`)
    }
  }
  
  // By type
  const typeStats = await prisma.vocabularyEntry.groupBy({
    by: ['type'],
    _count: {
      type: true
    }
  })
  
  console.log('\n📝 By Type:')
  for (const stat of typeStats) {
    console.log(`  ${stat.type}: ${stat._count.type} entries`)
  }
  
  // Most common tags
  const allEntries = await prisma.vocabularyEntry.findMany({
    select: { tags: true }
  })
  
  const tagCounts = new Map<string, number>()
  for (const entry of allEntries) {
    for (const tag of entry.tags) {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
    }
  }
  
  console.log('\n🏷️ Top Tags:')
  const sortedTags = Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
  
  for (const [tag, count] of sortedTags) {
    console.log(`  ${tag}: ${count} entries`)
  }
  
  // Recent B2 Nomen-Verb-Verbindungen
  const b2NomenVerb = await prisma.vocabularyEntry.findMany({
    where: {
      tags: {
        hasEvery: ['nomen-verb-verbindungen', 'B2']
      }
    },
    take: 5,
    select: {
      german: true,
      vietnamese: true,
      exampleGerman: true
    }
  })
  
  console.log('\n💎 Sample B2 Nomen-Verb-Verbindungen:')
  for (const entry of b2NomenVerb) {
    console.log(`  "${entry.german}" → "${entry.vietnamese}"`)
    if (entry.exampleGerman) {
      console.log(`    Example: ${entry.exampleGerman}`)
    }
  }
}

getVocabularyStats()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
