import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

interface NomenVerbEntry {
  german: string
  meaning: string
  vietnamese: string
  example?: string
  exampleVietnamese?: string
}

async function extractNomenVerbFromFile(filePath: string): Promise<NomenVerbEntry[]> {
  const content = fs.readFileSync(filePath, 'utf-8')
  const entries: NomenVerbEntry[] = []
  
  // Extract table content
  const tableMatch = content.match(/\| Kết hợp danh từ-động từ \| Nghĩa tiếng Đức \| Nghĩa tiếng Việt \|([\s\S]*?)\n\n/)
  if (!tableMatch) return entries
  
  const tableContent = tableMatch[1]
  const rows = tableContent.split('\n').filter(row => row.trim().startsWith('|') && !row.includes('---'))
  
  // Extract examples
  const exampleSections = content.split('### ')
  
  for (const row of rows) {
    const columns = row.split('|').map(col => col.trim()).filter(col => col !== '')
    if (columns.length >= 3) {
      const german = columns[0]
      const meaning = columns[1]
      const vietnamese = columns[2]
      
      // Find corresponding example
      const exampleSection = exampleSections.find(section => 
        section.includes(german) && section.includes('**Ví dụ:**')
      )
      
      let example = ''
      let exampleVietnamese = ''
      
      if (exampleSection) {
        const exampleMatch = exampleSection.match(/\*\*Ví dụ:\*\*(.*?)\*\*Dịch:\*\*(.*?)(?:\*\*|$)/)
        if (exampleMatch) {
          example = exampleMatch[1].trim()
          exampleVietnamese = exampleMatch[2].trim()
        }
      }
      
      entries.push({
        german,
        meaning,
        vietnamese,
        example: example || undefined,
        exampleVietnamese: exampleVietnamese || undefined
      })
    }
  }
  
  return entries
}

async function importB2NomenVerbVerbindungen() {
  console.log('🚀 Starting B2 Nomen-Verb-Verbindungen import...')
  
  // Get or create B2 level
  const vocabularyLevel = await prisma.vocabularyLevel.upsert({
    where: { name: 'B2' },
    update: {},
    create: {
      name: 'B2',
      displayName: 'Level B2',
      description: 'German language level B2',
      order: 4
    }
  })
  
  // Get or create Nomen-Verb-Verbindungen topic
  const existingTopicsCount = await prisma.vocabularyTopic.count({
    where: { levelId: vocabularyLevel.id }
  })
  
  const vocabularyTopic = await prisma.vocabularyTopic.upsert({
    where: { 
      levelId_slug: {
        levelId: vocabularyLevel.id,
        slug: 'nomen-verb-verbindungen'
      }
    },
    update: {},
    create: {
      name: 'nomen-verb-verbindungen',
      displayName: 'Nomen-Verb-Verbindungen',
      description: 'Kết hợp danh từ và động từ trong tiếng Đức',
      slug: 'nomen-verb-verbindungen',
      levelId: vocabularyLevel.id,
      order: existingTopicsCount + 1
    }
  })
  
  const contentDir = '/Users/khoavo/Documents/GitHub/deutsch/Edu-theme/src/content/b2niveau/vokabular'
  const folders = ['nomen-verb-verbindungen', 'nomen-verb-verbindungen-2', 'nomen-verb-verbindungen-3']
  
  let totalEntries = 0
  
  for (const folder of folders) {
    const folderPath = path.join(contentDir, folder)
    
    for (let i = 1; i <= 5; i++) {
      const filePath = path.join(folderPath, `teil${i}.md`)
      
      if (fs.existsSync(filePath)) {
        console.log(`📖 Processing ${folder}/teil${i}.md...`)
        
        const entries = await extractNomenVerbFromFile(filePath)
        
        for (const entry of entries) {
          try {
            await prisma.vocabularyEntry.upsert({
              where: {
                german_vietnamese_levelId_topicId: {
                  german: entry.german,
                  vietnamese: entry.vietnamese,
                  levelId: vocabularyLevel.id,
                  topicId: vocabularyTopic.id
                }
              },
              update: {
                exampleGerman: entry.example,
                exampleVietnamese: entry.exampleVietnamese,
                tags: ['nomen-verb-verbindungen', 'B2'],
                frequency: 1
              },
              create: {
                german: entry.german,
                vietnamese: entry.vietnamese,
                phonetic: null,
                plural: null,
                type: 'OTHER', // Nomen-Verb-Verbindungen don't fit standard types
                levelId: vocabularyLevel.id,
                topicId: vocabularyTopic.id,
                exampleGerman: entry.example,
                exampleVietnamese: entry.exampleVietnamese,
                difficulty: 2, // B2 level difficulty
                frequency: 1,
                tags: ['nomen-verb-verbindungen', 'B2']
              }
            })
            
            totalEntries++
          } catch (error) {
            console.error(`❌ Error importing "${entry.german}":`, error)
          }
        }
        
        console.log(`✅ Imported ${entries.length} entries from ${folder}/teil${i}.md`)
      }
    }
  }
  
  console.log(`🎉 Import completed! Total entries imported: ${totalEntries}`)
}

// Run the import
importB2NomenVerbVerbindungen()
  .catch((e) => {
    console.error('❌ Import failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
