#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function removeGrammatikTags() {
  try {
    console.log('🔍 Finding entries with "grammatik" tags...\n')
    
    // Tìm tất cả entries có tag "grammatik"
    const entriesWithGrammatikTag = await prisma.vocabularyEntry.findMany({
      where: {
        tags: {
          hasSome: ['grammatik']
        }
      },
      select: {
        id: true,
        german: true,
        vietnamese: true,
        tags: true,
        type: true,
        level: {
          select: {
            name: true
          }
        },
        topic: {
          select: {
            name: true
          }
        }
      }
    })
    
    console.log(`Found ${entriesWithGrammatikTag.length} entries with "grammatik" tag:`)
    
    if (entriesWithGrammatikTag.length > 0) {
      // Hiển thị sample
      entriesWithGrammatikTag.slice(0, 10).forEach((entry, index) => {
        console.log(`${index + 1}. "${entry.german}" → ${entry.vietnamese}`)
        console.log(`   Tags: [${entry.tags.join(', ')}]`)
        console.log(`   Level: ${entry.level.name}, Topic: ${entry.topic.name}`)
        console.log('')
      })
      
      if (entriesWithGrammatikTag.length > 10) {
        console.log(`... and ${entriesWithGrammatikTag.length - 10} more entries\n`)
      }
      
      // Xóa tag "grammatik" khỏi tất cả entries
      console.log('🗑️  Removing "grammatik" tag from all entries...')
      
      for (const entry of entriesWithGrammatikTag) {
        const updatedTags = entry.tags.filter(tag => 
          tag.toLowerCase() !== 'grammatik' && 
          tag.toLowerCase() !== 'grammar'
        )
        
        await prisma.vocabularyEntry.update({
          where: { id: entry.id },
          data: { tags: updatedTags }
        })
      }
      
      console.log(`✅ Removed "grammatik" tag from ${entriesWithGrammatikTag.length} entries`)
    } else {
      console.log('✅ No entries found with "grammatik" tag')
    }
    
    // Kiểm tra tất cả unique tags còn lại
    console.log('\n📊 Checking all remaining unique tags...')
    
    const allEntries = await prisma.vocabularyEntry.findMany({
      select: {
        tags: true
      }
    })
    
    const allTags = new Set<string>()
    allEntries.forEach(entry => {
      entry.tags.forEach(tag => allTags.add(tag))
    })
    
    const sortedTags = Array.from(allTags).sort()
    console.log(`Found ${sortedTags.length} unique tags:`)
    
    // Hiển thị các tags, highlight nếu còn "grammatik"
    sortedTags.forEach((tag, index) => {
      const isGrammatikRelated = tag.toLowerCase().includes('grammatik') || tag.toLowerCase().includes('grammar')
      const marker = isGrammatikRelated ? '⚠️ ' : '✅ '
      console.log(`${marker}${index + 1}. "${tag}"`)
    })
    
    // Kiểm tra xem còn tag nào liên quan đến grammatik không
    const grammatikRelatedTags = sortedTags.filter(tag => 
      tag.toLowerCase().includes('grammatik') || 
      tag.toLowerCase().includes('grammar')
    )
    
    if (grammatikRelatedTags.length > 0) {
      console.log(`\n⚠️  Still found ${grammatikRelatedTags.length} grammar-related tags:`)
      grammatikRelatedTags.forEach(tag => console.log(`- "${tag}"`))
      console.log('\nDo you want to remove these as well?')
    } else {
      console.log('\n✅ No more grammar-related tags found!')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

removeGrammatikTags()
