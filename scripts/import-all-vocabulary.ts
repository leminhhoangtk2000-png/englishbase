import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function getOrCreateLevel(levelName: string) {
  const order = levelName === 'A1' ? 1 : levelName === 'A2' ? 2 : levelName === 'B1' ? 3 : levelName === 'B2' ? 4 : levelName === 'C1' ? 5 : 6
  
  return await prisma.vocabularyLevel.upsert({
    where: { name: levelName },
    update: {},
    create: {
      name: levelName,
      displayName: levelName === 'A1' ? 'Grundstufe A1' : 
                   levelName === 'A2' ? 'Grundstufe A2' :
                   levelName === 'B1' ? 'Mittelstufe B1' :
                   levelName === 'B2' ? 'Mittelstufe B2' :
                   levelName === 'C1' ? 'Oberstufe C1' : 'Oberstufe C2',
      description: `German language level ${levelName}`,
      order
    }
  })
}

async function importFromGrammatikFiles() {
  console.log('🚀 Starting grammatik vocabulary import...')
  
  const contentDir = '/Users/khoavo/Documents/GitHub/deutsch/Edu-theme/src/content'
  const levels = ['a1niveau', 'a2niveau', 'b1niveau', 'b2niveau']
  
  let totalEntries = 0
  
  for (const levelDir of levels) {
    const levelName = levelDir.replace('niveau', '').toUpperCase()
    const grammatikDir = path.join(contentDir, levelDir, 'grammatik')
    
    if (!fs.existsSync(grammatikDir)) continue
    
    console.log(`📚 Processing ${levelName} Grammatik...`)
    
    const level = await getOrCreateLevel(levelName)
    
    // Get or create Grammatik topic
    const existingTopicsCount = await prisma.vocabularyTopic.count({
      where: { levelId: level.id }
    })
    
    const grammatikTopic = await prisma.vocabularyTopic.upsert({
      where: { 
        levelId_slug: {
          levelId: level.id,
          slug: 'grammatik'
        }
      },
      update: {},
      create: {
        name: 'grammatik',
        displayName: 'Grammatik',
        description: `Ngữ pháp tiếng Đức cấp độ ${levelName}`,
        slug: 'grammatik',
        levelId: level.id,
        order: existingTopicsCount + 1
      }
    })
    
    // Process .mdx files in grammatik directory
    const files = fs.readdirSync(grammatikDir).filter(file => file.endsWith('.mdx'))
    
    for (const file of files) {
      const filePath = path.join(grammatikDir, file)
      const content = fs.readFileSync(filePath, 'utf-8')
      
      // Extract vocabulary from tables in grammatik files
      const tableMatches = content.match(/\| .+? \| .+? \| .+? \|/g)
      if (tableMatches) {
        for (const tableRow of tableMatches) {
          if (tableRow.includes('---') || tableRow.includes('Beispiel') || tableRow.includes('Example')) continue
          
          const columns = tableRow.split('|').map(col => col.trim()).filter(col => col !== '')
          if (columns.length >= 2) {
            const german = columns[0]
            const vietnamese = columns[1]
            
            if (german && vietnamese && german.length > 2 && vietnamese.length > 2) {
              try {
                await prisma.vocabularyEntry.upsert({
                  where: {
                    german_vietnamese_levelId_topicId: {
                      german: german,
                      vietnamese: vietnamese,
                      levelId: level.id,
                      topicId: grammatikTopic.id
                    }
                  },
                  update: {
                    tags: ['grammatik', levelName],
                    frequency: 1
                  },
                  create: {
                    german: german,
                    vietnamese: vietnamese,
                    phonetic: null,
                    plural: null,
                    type: 'OTHER',
                    levelId: level.id,
                    topicId: grammatikTopic.id,
                    exampleGerman: null,
                    exampleVietnamese: null,
                    difficulty: levelName === 'A1' ? 1 : levelName === 'A2' ? 1 : levelName === 'B1' ? 2 : levelName === 'B2' ? 2 : 3,
                    frequency: 1,
                    tags: ['grammatik', levelName]
                  }
                })
                
                totalEntries++
              } catch (error) {
                // Skip duplicates or invalid entries
                continue
              }
            }
          }
        }
      }
    }
    
    console.log(`✅ Completed ${levelName} Grammatik`)
  }
  
  console.log(`🎉 Grammatik import completed! Total entries imported: ${totalEntries}`)
}

// Run the import
importFromGrammatikFiles()
  .catch((e) => {
    console.error('❌ Import failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
