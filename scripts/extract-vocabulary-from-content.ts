#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const prisma = new PrismaClient()

interface VocabularyItem {
  german: string
  vietnamese: string
  phonetic?: string
  exampleGerman?: string
  exampleVietnamese?: string
}

// Extract vocabulary từ markdown content
function extractVocabularyFromMarkdown(content: string): VocabularyItem[] {
  const items: VocabularyItem[] = []
  
  // Pattern 1: Table format
  // | **aufstehen** | verb | [ˈaʊ̯fˌʃteːən] | thức dậy |
  const tablePattern = /\|\s*\*\*([^*]+)\*\*\s*\|\s*(\w+)\s*\|\s*\[([^\]]+)\]\s*\|\s*([^|]+)\s*\|/g
  let match
  
  while ((match = tablePattern.exec(content)) !== null) {
    const german = match[1].trim()
    const phonetic = match[3].trim()
    const vietnamese = match[4].trim()
    
    items.push({
      german,
      vietnamese,
      phonetic
    })
  }
  
  // Pattern 2: Examples - Ví dụ và Giải nghĩa
  // 1. **aufstehen** _(thức dậy)_
  //    - **Ví dụ:** Ich stehe jeden Morgen um 6 Uhr auf...
  //    - **Giải nghĩa:** Tôi thức dậy lúc 6 giờ mỗi sáng...
  
  const examplePattern = /\d+\.\s*\*\*([^*]+)\*\*\s*_\(([^)]+)\)_[\s\S]*?-\s*\*\*Ví dụ:\*\*\s*([^-\n]+)[\s\S]*?-\s*\*\*Giải nghĩa:\*\*\s*([^-\n]+)/g
  
  while ((match = examplePattern.exec(content)) !== null) {
    const german = match[1].trim()
    const vietnamese = match[2].trim()
    const exampleGerman = match[3].trim()
    const exampleVietnamese = match[4].trim()
    
    // Tìm item tương ứng và update examples
    const existingItem = items.find(item => 
      item.german === german || item.german.includes(german)
    )
    
    if (existingItem) {
      existingItem.exampleGerman = exampleGerman
      existingItem.exampleVietnamese = exampleVietnamese
    } else {
      // Add new item nếu chưa có
      items.push({
        german,
        vietnamese,
        exampleGerman,
        exampleVietnamese
      })
    }
  }
  
  return items
}

// Scan all markdown files trong content directories
async function scanContentFiles(): Promise<{ filePath: string, items: VocabularyItem[] }[]> {
  const results: { filePath: string, items: VocabularyItem[] }[] = []
  const contentDir = '/Users/khoavo/Documents/GitHub/deutsch/Edu-theme/src/content'
  
  function scanDirectory(dir: string) {
    const entries = fs.readdirSync(dir, { withFileTypes: true })
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      
      if (entry.isDirectory()) {
        scanDirectory(fullPath)
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        try {
          const fileContent = fs.readFileSync(fullPath, 'utf-8')
          const { content } = matter(fileContent)
          
          const items = extractVocabularyFromMarkdown(content)
          
          if (items.length > 0) {
            results.push({
              filePath: fullPath,
              items
            })
          }
        } catch (error: any) {
          console.error(`❌ Error reading ${fullPath}:`, error.message)
        }
      }
    }
  }
  
  scanDirectory(contentDir)
  return results
}

async function enhanceVocabularyFromContent() {
  try {
    console.log('🔍 Scanning content files for vocabulary examples...\n')
    
    const contentResults = await scanContentFiles()
    
    console.log(`📂 Found ${contentResults.length} files with vocabulary`)
    
    let totalItemsFound = 0
    let totalUpdated = 0
    
    for (const result of contentResults) {
      const fileName = path.basename(result.filePath)
      console.log(`\n📄 Processing: ${fileName}`)
      console.log(`   Found ${result.items.length} vocabulary items`)
      
      totalItemsFound += result.items.length
      
      // Update database với examples từ content
      for (const item of result.items) {
        try {
          // Tìm vocabulary entry trong database
          const dbEntry = await prisma.vocabularyEntry.findFirst({
            where: {
              OR: [
                { german: { contains: item.german.toLowerCase() } },
                { german: item.german },
                { vietnamese: { contains: item.vietnamese } }
              ]
            }
          })
          
          if (dbEntry) {
            // Update với examples từ content
            const updateData: any = {}
            
            if (item.exampleGerman && (!dbEntry.exampleGerman || dbEntry.exampleGerman.trim() === '')) {
              updateData.exampleGerman = item.exampleGerman
            }
            
            if (item.exampleVietnamese && (!dbEntry.exampleVietnamese || dbEntry.exampleVietnamese.trim() === '')) {
              updateData.exampleVietnamese = item.exampleVietnamese
            }
            
            if (item.phonetic && (!dbEntry.phonetic || dbEntry.phonetic.trim() === '')) {
              updateData.phonetic = item.phonetic
            }
            
            if (Object.keys(updateData).length > 0) {
              await prisma.vocabularyEntry.update({
                where: { id: dbEntry.id },
                data: updateData
              })
              
              console.log(`   ✅ Updated "${item.german}": ${Object.keys(updateData).join(', ')}`)
              totalUpdated++
            }
          } else {
            console.log(`   ⚠️  No match found for "${item.german}"`)
          }
          
        } catch (error: any) {
          console.error(`   ❌ Error updating "${item.german}":`, error.message)
        }
      }
    }
    
    // Final statistics
    console.log(`\n📊 Enhancement Summary:`)
    console.log(`- Files processed: ${contentResults.length}`)
    console.log(`- Vocabulary items found: ${totalItemsFound}`)
    console.log(`- Database entries updated: ${totalUpdated}`)
    
    // Check completion rate
    const totalCards = await prisma.vocabularyEntry.count()
    const completeCards = await prisma.vocabularyEntry.count({
      where: {
        AND: [
          { exampleGerman: { not: null } },
          { exampleVietnamese: { not: null } },
          { exampleGerman: { not: '' } },
          { exampleVietnamese: { not: '' } }
        ]
      }
    })
    
    const completionRate = ((completeCards / totalCards) * 100).toFixed(1)
    console.log(`\n📈 Current completion rate: ${completeCards}/${totalCards} (${completionRate}%)`)

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

enhanceVocabularyFromContent()
