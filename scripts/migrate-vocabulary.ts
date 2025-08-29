import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Migration script to move old vocabulary files to new structure
async function migrateOldVocabularyFiles() {
  console.log('🔄 Starting migration of old vocabulary files...')
  
  const oldDataDir = path.join(__dirname, '../src/data')
  const oldFiles = [
    'vocabulary-body-comprehensive-b1.json',
    'vocabulary-complete-all-b1.json', 
    'vocabulary-comprehensive-all-b1.json',
    'vocabulary-extended-all-b1.json',
    'vocabulary-verbs-adjectives-b1.json',
    'vocabulary-wohnen.json'
  ]

  // Create mapping for old files to new structure
  const fileMapping: { [key: string]: { level: string, topic: string } } = {
    'vocabulary-body-comprehensive-b1.json': { level: 'B1', topic: 'gesundheit' },
    'vocabulary-complete-all-b1.json': { level: 'B1', topic: 'beruf' },
    'vocabulary-comprehensive-all-b1.json': { level: 'B1', topic: 'kultur' },
    'vocabulary-extended-all-b1.json': { level: 'B1', topic: 'medien' },
    'vocabulary-verbs-adjectives-b1.json': { level: 'B1', topic: 'beruf' },
    'vocabulary-wohnen.json': { level: 'A1', topic: 'wohnen' }
  }

  let totalProcessed = 0
  let totalAdded = 0

  for (const fileName of oldFiles) {
    const filePath = path.join(oldDataDir, fileName)
    
    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  File not found: ${fileName}`)
      continue
    }

    const mapping = fileMapping[fileName]
    if (!mapping) {
      console.log(`⚠️  No mapping found for: ${fileName}`)
      continue
    }

    // Find level and topic in database
    const level = await prisma.vocabularyLevel.findUnique({
      where: { name: mapping.level }
    })

    if (!level) {
      console.log(`⚠️  Level ${mapping.level} not found for file ${fileName}`)
      continue
    }

    const topic = await prisma.vocabularyTopic.findFirst({
      where: {
        levelId: level.id,
        slug: mapping.topic
      }
    })

    if (!topic) {
      console.log(`⚠️  Topic ${mapping.topic} not found for level ${mapping.level}`)
      continue
    }

    console.log(`📖 Processing ${fileName} -> ${mapping.level}/${mapping.topic}`)

    // Read and process vocabulary data
    const vocabularyData = JSON.parse(fs.readFileSync(filePath, 'utf8'))
    totalProcessed += vocabularyData.length

    for (const entry of vocabularyData) {
      try {
        // Check if entry already exists
        const existing = await prisma.vocabularyEntry.findFirst({
          where: {
            german: entry.german,
            vietnamese: entry.vietnamese,
            levelId: level.id,
            topicId: topic.id
          }
        })

        if (existing) {
          console.log(`   ⏭️  Skipping existing entry: ${entry.german}`)
          continue
        }

        // Add new entry
        await prisma.vocabularyEntry.create({
          data: {
            german: entry.german,
            vietnamese: entry.vietnamese,
            phonetic: entry.phonetic || null,
            plural: entry.plural || null,
            type: entry.type?.toUpperCase() || 'OTHER',
            levelId: level.id,
            topicId: topic.id,
            exampleGerman: entry.exampleGerman || null,
            exampleVietnamese: entry.exampleVietnamese || null,
            difficulty: entry.difficulty || 1,
            tags: []
          }
        })

        totalAdded++
        console.log(`   ✅ Added: ${entry.german} -> ${entry.vietnamese}`)

      } catch (error) {
        console.error(`   ❌ Error processing ${entry.german}:`, error)
      }
    }

    console.log(`✅ Completed ${fileName}`)
  }

  console.log(`\n📊 Migration Summary:`)
  console.log(`   Total entries processed: ${totalProcessed}`)
  console.log(`   Total entries added: ${totalAdded}`)
  console.log(`   Total entries skipped: ${totalProcessed - totalAdded}`)
}

// Create additional topics that might be missing
async function createMissingTopics() {
  console.log('🏗️  Creating missing topics...')

  const additionalTopics = {
    'A2': [
      { name: 'Gesundheit', displayName: 'Gesundheit und Körper', description: 'Körperteile und Gesundheit', slug: 'gesundheit', order: 2 }
    ],
    'B1': [
      { name: 'Medien', displayName: 'Medien und Kommunikation', description: 'Internet, TV und moderne Medien', slug: 'medien', order: 2 }
    ]
  }

  for (const [levelName, topics] of Object.entries(additionalTopics)) {
    const level = await prisma.vocabularyLevel.findUnique({
      where: { name: levelName }
    })

    if (!level) {
      console.log(`⚠️  Level ${levelName} not found`)
      continue
    }

    for (const topicData of topics) {
      try {
        await prisma.vocabularyTopic.upsert({
          where: { levelId_slug: { levelId: level.id, slug: topicData.slug } },
          update: { ...topicData, levelId: level.id },
          create: { ...topicData, levelId: level.id }
        })
        console.log(`✅ Created/updated topic: ${levelName}/${topicData.slug}`)
      } catch (error) {
        console.error(`❌ Error creating topic ${topicData.slug}:`, error)
      }
    }
  }
}

async function main() {
  try {
    await createMissingTopics()
    await migrateOldVocabularyFiles()
    
    // Get final statistics
    const stats = await prisma.vocabularyEntry.groupBy({
      by: ['levelId'],
      _count: {
        _all: true
      }
    })

    console.log('\n📈 Final Statistics:')
    for (const stat of stats) {
      const level = await prisma.vocabularyLevel.findUnique({
        where: { id: stat.levelId }
      })
      console.log(`   ${level?.name}: ${stat._count._all} entries`)
    }

    console.log('\n✅ Migration completed successfully!')
  } catch (error) {
    console.error('❌ Migration failed:', error)
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
