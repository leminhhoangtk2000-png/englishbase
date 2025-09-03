import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Map Vietnamese types to Prisma enum
function mapVocabularyType(vietnameseType: string): any {
  const typeMap: Record<string, string> = {
    'Danh từ': 'NOMEN',
    'DANH TỪ': 'NOMEN',
    'Động từ': 'VERB', 
    'ĐỘNG TỪ': 'VERB',
    'Tính từ': 'ADJEKTIV',
    'TÍNH TỪ': 'ADJEKTIV',
    'Trạng từ': 'ADVERB',
    'TRẠNG TỪ': 'ADVERB',
    'Đại từ': 'PRONOUN',
    'ĐẠI TỪ': 'PRONOUN',
    'Giới từ': 'PREPOSITION',
    'GIỚI TỪ': 'PREPOSITION',
    'Liên từ': 'CONJUNCTION',
    'LIÊN TỪ': 'CONJUNCTION'
  }
  
  return typeMap[vietnameseType] || 'OTHER'
}

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

// Define vocabulary levels
const vocabularyLevels = [
  { name: 'A1', displayName: 'Grundstufe A1', description: 'Anfänger Niveau', order: 1 },
  { name: 'A2', displayName: 'Grundstufe A2', description: 'Grundlegende Kenntnisse', order: 2 },
  { name: 'B1', displayName: 'Mittelstufe B1', description: 'Fortgeschrittene Grundkenntnisse', order: 3 },
  { name: 'B2', displayName: 'Mittelstufe B2', description: 'Selbständige Sprachverwendung', order: 4 },
  { name: 'C1', displayName: 'Oberstufe C1', description: 'Fachkundige Sprachkenntnisse', order: 5 },
  { name: 'C2', displayName: 'Oberstufe C2', description: 'Annähernd muttersprachliche Kenntnisse', order: 6 }
]

// Define topics for each level
const vocabularyTopics = {
  A1: [
    { name: 'Start', displayName: 'Start auf Deutsch', description: 'Grundlegende Begriffe für den Deutschstart', slug: 'start', order: 0 },
    { name: 'Familie', displayName: 'Familie und Verwandtschaft', description: 'Grundlegende Familienbegriffe', slug: 'familie', order: 1 },
    { name: 'Wohnen', displayName: 'Wohnen und Zuhause', description: 'Haus, Wohnung und Einrichtung', slug: 'wohnen', order: 2 },
    { name: 'Essen', displayName: 'Essen und Trinken', description: 'Lebensmittel und Getränke', slug: 'essen', order: 3 },
    { name: 'Kleidung', displayName: 'Kleidung und Mode', description: 'Kleidungsstücke und Accessoires', slug: 'kleidung', order: 4 },
    { name: 'Freizeit', displayName: 'Freizeit und Hobbys', description: 'Freizeitaktivitäten und Hobbys', slug: 'freizeit', order: 5 }
  ],
  A2: [
    { name: 'Reisen', displayName: 'Reisen und Verkehr', description: 'Transport und Urlaubsreisen', slug: 'reisen', order: 1 },
    { name: 'Gesundheit', displayName: 'Gesundheit und Körper', description: 'Körperteile und Gesundheit', slug: 'gesundheit', order: 2 },
    { name: 'Schule', displayName: 'Schule und Bildung', description: 'Bildungssystem und Schulfächer', slug: 'schule', order: 3 },
    { name: 'Einkaufen', displayName: 'Einkaufen und Geld', description: 'Shopping und Finanzen', slug: 'einkaufen', order: 4 }
  ],
  B1: [
    { name: 'Beruf', displayName: 'Beruf und Karriere', description: 'Arbeitswelt und Berufe', slug: 'beruf', order: 1 },
    { name: 'Medien', displayName: 'Medien und Kommunikation', description: 'Internet, TV und moderne Medien', slug: 'medien', order: 2 },
    { name: 'Umwelt', displayName: 'Umwelt und Natur', description: 'Umweltschutz und Natur', slug: 'umwelt', order: 3 },
    { name: 'Kultur', displayName: 'Kultur und Gesellschaft', description: 'Kulturelle Themen und Gesellschaft', slug: 'kultur', order: 4 }
  ],
  B2: [
    { name: 'Politik', displayName: 'Politik und Wirtschaft', description: 'Politische und wirtschaftliche Themen', slug: 'politik', order: 1 },
    { name: 'Wissenschaft', displayName: 'Wissenschaft und Technik', description: 'Wissenschaftliche und technische Begriffe', slug: 'wissenschaft', order: 2 },
    { name: 'Literatur', displayName: 'Literatur und Kunst', description: 'Literarische und künstlerische Begriffe', slug: 'literatur', order: 3 }
  ]
}

async function seedVocabularyStructure() {
  console.log('🌱 Seeding vocabulary structure...')
  
  // Create levels
  for (const levelData of vocabularyLevels) {
    await prisma.vocabularyLevel.upsert({
      where: { name: levelData.name },
      update: levelData,
      create: levelData
    })
  }
  
  // Create topics
  for (const [levelName, topics] of Object.entries(vocabularyTopics)) {
    const level = await prisma.vocabularyLevel.findUnique({
      where: { name: levelName }
    })
    
    if (level) {
      for (const topicData of topics) {
        await prisma.vocabularyTopic.upsert({
          where: { levelId_slug: { levelId: level.id, slug: topicData.slug } },
          update: { ...topicData, levelId: level.id },
          create: { ...topicData, levelId: level.id }
        })
      }
    }
  }
}

async function loadVocabularyFromFiles() {
  console.log('📚 Loading vocabulary from files...')
  
  const vocabularyDir = path.join(__dirname, '../src/data/vocabulary')
  
  if (!fs.existsSync(vocabularyDir)) {
    console.log('Vocabulary directory not found, skipping vocabulary loading.')
    return
  }
  
  // Read all level directories
  const levelDirs = fs.readdirSync(vocabularyDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
  
  for (const levelName of levelDirs) {
    const level = await prisma.vocabularyLevel.findUnique({
      where: { name: levelName.toUpperCase() }
    })
    
    if (!level) {
      console.log(`Level ${levelName.toUpperCase()} not found in database, skipping...`)
      continue
    }
    
    const levelDir = path.join(vocabularyDir, levelName)
    const topicFiles = fs.readdirSync(levelDir)
      .filter(file => file.endsWith('.json'))
    
    for (const topicFile of topicFiles) {
      const topicName = path.basename(topicFile, '.json')
      const topic = await prisma.vocabularyTopic.findFirst({
        where: { 
          levelId: level.id,
          slug: topicName
        }
      })
      
      if (!topic) {
        console.log(`Topic ${topicName} not found for level ${levelName}, skipping...`)
        continue
      }
      
      const filePath = path.join(levelDir, topicFile)
      const vocabularyData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
      
      console.log(`Processing ${vocabularyData.length} words from ${levelName}/${topicName}`)
      
      for (const entry of vocabularyData) {
        try {
          // Determine vocabulary type
          let vocabularyType = 'OTHER'
          if (entry.type) {
            vocabularyType = mapVocabularyType(entry.type)
          } else {
            vocabularyType = detectGermanType(entry.german)
          }
          
          await prisma.vocabularyEntry.upsert({
            where: {
              german_vietnamese_levelId_topicId: {
                german: entry.german,
                vietnamese: entry.vietnamese,
                levelId: level.id,
                topicId: topic.id
              }
            },
            update: {
              phonetic: entry.phonetic,
              plural: entry.plural,
              type: vocabularyType as any,
              exampleGerman: entry.exampleGerman,
              exampleVietnamese: entry.exampleVietnamese,
              difficulty: entry.difficulty || 1,
              tags: entry.tags || []
            },
            create: {
              german: entry.german,
              vietnamese: entry.vietnamese,
              phonetic: entry.phonetic,
              plural: entry.plural,
              type: vocabularyType as any,
              levelId: level.id,
              topicId: topic.id,
              exampleGerman: entry.exampleGerman,
              exampleVietnamese: entry.exampleVietnamese,
              difficulty: entry.difficulty || 1,
              tags: entry.tags || []
            }
          })
        } catch (error) {
          console.error(`Error processing entry ${entry.german}:`, error)
        }
      }
    }
  }
}

async function main() {
  try {
    await seedVocabularyStructure()
    await loadVocabularyFromFiles()
    
    console.log('✅ Seeding completed successfully!')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
