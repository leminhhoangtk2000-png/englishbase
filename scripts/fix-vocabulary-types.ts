import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Auto-detect type from German word
function detectGermanType(german: string): string {
  const word = german.toLowerCase().trim()
  
  // Nouns with articles
  if (word.startsWith('der ') || word.startsWith('die ') || word.startsWith('das ')) {
    return 'NOMEN'
  }
  
  // Verbs - common endings
  if (word.endsWith('en') && !word.includes(' ')) {
    return 'VERB'
  }
  
  // Adjectives - common endings  
  if (word.endsWith('lich') || word.endsWith('ig') || word.endsWith('isch') || 
      word.endsWith('bar') || word.endsWith('sam') || word.endsWith('haft')) {
    return 'ADJEKTIV'
  }
  
  // Adverbs - common patterns
  if (word === 'hier' || word === 'dort' || word === 'heute' || word === 'morgen' ||
      word === 'immer' || word === 'nie' || word === 'oft' || word === 'manchmal') {
    return 'ADVERB'
  }
  
  // Prepositions
  if (['in', 'an', 'auf', 'zu', 'mit', 'von', 'bei', 'nach', 'über', 'unter', 'vor', 'hinter'].includes(word)) {
    return 'PREPOSITION'
  }
  
  // Pronouns
  if (['ich', 'du', 'er', 'sie', 'es', 'wir', 'ihr', 'sie', 'mich', 'dich', 'sich', 'uns', 'euch', 'jemand', 'niemand'].includes(word)) {
    return 'PRONOUN'
  }
  
  // Default to NOMEN for German nouns without articles
  return 'NOMEN'
}

async function fixVocabularyTypes() {
  console.log('🔧 Fixing vocabulary types...')
  
  // Get all entries with type OTHER
  const otherEntries = await prisma.vocabularyEntry.findMany({
    where: { type: 'OTHER' }
  })
  
  console.log(`Found ${otherEntries.length} entries with type OTHER`)
  
  let updated = 0
  
  for (const entry of otherEntries) {
    const newType = detectGermanType(entry.german)
    
    if (newType !== 'OTHER') {
      await prisma.vocabularyEntry.update({
        where: { id: entry.id },
        data: { type: newType as any }
      })
      
      console.log(`✅ Updated "${entry.german}" -> ${newType}`)
      updated++
    }
  }
  
  console.log(`🎯 Updated ${updated} vocabulary entries`)
  
  // Show final statistics
  const stats = await prisma.vocabularyEntry.groupBy({
    by: ['type'],
    _count: { type: true }
  })
  
  console.log('\n📊 Final type distribution:')
  stats.forEach(stat => {
    console.log(`${stat.type}: ${stat._count.type}`)
  })
  
  await prisma.$disconnect()
}

fixVocabularyTypes().catch(console.error)
