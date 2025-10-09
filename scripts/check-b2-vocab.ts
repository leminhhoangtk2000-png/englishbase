import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkB2Vocabulary() {
  console.log('🔍 Checking B2 Nomen-Verb-Verbindungen in database...')
  
  // Check vocabulary level
  const b2Level = await prisma.vocabularyLevel.findFirst({
    where: { name: 'B2' }
  })
  
  if (!b2Level) {
    console.log('❌ B2 level not found')
    return
  }
  
  console.log(`✅ B2 Level found: ${b2Level.displayName}`)
  
  // Check vocabulary topic
  const nomenVerbTopic = await prisma.vocabularyTopic.findFirst({
    where: { 
      levelId: b2Level.id,
      slug: 'nomen-verb-verbindungen'
    }
  })
  
  if (!nomenVerbTopic) {
    console.log('❌ Nomen-Verb-Verbindungen topic not found')
    return
  }
  
  console.log(`✅ Topic found: ${nomenVerbTopic.displayName}`)
  
  // Count vocabulary entries
  const entryCount = await prisma.vocabularyEntry.count({
    where: {
      levelId: b2Level.id,
      topicId: nomenVerbTopic.id
    }
  })
  
  console.log(`📊 Total Nomen-Verb-Verbindungen entries: ${entryCount}`)
  
  // Show some examples
  const sampleEntries = await prisma.vocabularyEntry.findMany({
    where: {
      levelId: b2Level.id,
      topicId: nomenVerbTopic.id
    },
    take: 5,
    select: {
      german: true,
      vietnamese: true,
      exampleGerman: true,
      tags: true
    }
  })
  
  console.log('\n📝 Sample entries:')
  sampleEntries.forEach((entry, index) => {
    console.log(`${index + 1}. ${entry.german} → ${entry.vietnamese}`)
    if (entry.exampleGerman) {
      console.log(`   Example: ${entry.exampleGerman}`)
    }
  })
  
  // Check vocabulary by tags
  const taggedEntries = await prisma.vocabularyEntry.count({
    where: {
      tags: {
        has: 'nomen-verb-verbindungen'
      }
    }
  })
  
  console.log(`\n🏷️ Entries with 'nomen-verb-verbindungen' tag: ${taggedEntries}`)
}

checkB2Vocabulary()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
