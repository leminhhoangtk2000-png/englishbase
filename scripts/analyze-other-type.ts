import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function analyzeOtherType() {
  console.log('🔍 Analyzing entries with type "OTHER"...\n')
  
  // Get some examples of OTHER type entries
  const otherEntries = await prisma.vocabularyEntry.findMany({
    where: { type: 'OTHER' },
    take: 20,
    include: {
      level: true,
      topic: true
    },
    orderBy: { createdAt: 'desc' }
  })
  
  console.log('📝 Recent OTHER entries:')
  for (const entry of otherEntries) {
    console.log(`  "${entry.german}" → "${entry.vietnamese}"`)
    console.log(`    Level: ${entry.level.name}, Topic: ${entry.topic.displayName}`)
    console.log(`    Tags: [${entry.tags.join(', ')}]`)
    console.log()
  }
  
  // Count OTHER by topic
  const otherByTopic = await prisma.vocabularyEntry.groupBy({
    by: ['topicId'],
    where: { type: 'OTHER' },
    _count: { topicId: true },
    orderBy: { _count: { topicId: 'desc' } }
  })
  
  console.log('📊 OTHER entries by topic:')
  for (const group of otherByTopic.slice(0, 10)) {
    const topic = await prisma.vocabularyTopic.findUnique({
      where: { id: group.topicId },
      include: { level: true }
    })
    if (topic) {
      console.log(`  ${topic.level.name} - ${topic.displayName}: ${group._count.topicId} entries`)
    }
  }
  
  // Check if we can categorize some of these better
  console.log('\n🔍 Analyzing content to suggest better types:')
  
  const sampleOthers = await prisma.vocabularyEntry.findMany({
    where: { type: 'OTHER' },
    take: 50,
    select: { german: true, vietnamese: true, tags: true }
  })
  
  const suggestions = {
    possibleNouns: [] as string[],
    possibleVerbs: [] as string[],
    possibleAdjectives: [] as string[],
    possiblePhrases: [] as string[]
  }
  
  for (const entry of sampleOthers) {
    const german = entry.german.toLowerCase()
    
    // Check for nouns (articles or noun patterns)
    if (german.includes('der ') || german.includes('die ') || german.includes('das ')) {
      suggestions.possibleNouns.push(entry.german)
    }
    // Check for verbs (infinitive endings or verb patterns)
    else if (german.endsWith('en') || german.endsWith('n') || german.includes('zu ')) {
      suggestions.possibleVerbs.push(entry.german)
    }
    // Check for adjectives (adjective patterns)
    else if (german.includes('-') && !german.includes(' ')) {
      suggestions.possibleAdjectives.push(entry.german)
    }
    // Check for phrases/expressions
    else if (german.includes(' ') && german.split(' ').length > 2) {
      suggestions.possiblePhrases.push(entry.german)
    }
  }
  
  console.log(`  Possible Nouns (${suggestions.possibleNouns.length}):`, suggestions.possibleNouns.slice(0, 5))
  console.log(`  Possible Verbs (${suggestions.possibleVerbs.length}):`, suggestions.possibleVerbs.slice(0, 5))
  console.log(`  Possible Adjectives (${suggestions.possibleAdjectives.length}):`, suggestions.possibleAdjectives.slice(0, 5))
  console.log(`  Possible Phrases (${suggestions.possiblePhrases.length}):`, suggestions.possiblePhrases.slice(0, 5))
}

analyzeOtherType()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
