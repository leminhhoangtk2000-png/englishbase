#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkAllTagsInVocabulary() {
  try {
    console.log('🔍 Checking all tags in vocabulary entries...\n')
    
    // Lấy tất cả tags unique
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
    
    console.log(`📊 Found ${sortedTags.length} unique tags in vocabulary:`)
    sortedTags.forEach((tag, index) => {
      const isGrammatikRelated = tag.toLowerCase().includes('grammatik') || 
                                 tag.toLowerCase().includes('grammar')
      const marker = isGrammatikRelated ? '⚠️ ' : '✅ '
      console.log(`${marker}${index + 1}. "${tag}"`)
    })
    
    // Kiểm tra các tags có từ "grammatik"
    const grammatikTags = sortedTags.filter(tag => 
      tag.toLowerCase().includes('grammatik') || 
      tag.toLowerCase().includes('grammar')
    )
    
    if (grammatikTags.length > 0) {
      console.log(`\n⚠️  Found ${grammatikTags.length} grammar-related tags:`)
      grammatikTags.forEach(tag => console.log(`- "${tag}"`))
    } else {
      console.log('\n✅ No grammar-related tags found!')
    }
    
    // Kiểm tra một số entries mới nhất để confirm
    console.log('\n🔍 Sample of recent vocabulary entries with their tags:')
    const recentEntries = await prisma.vocabularyEntry.findMany({
      take: 5,
      orderBy: { updatedAt: 'desc' },
      select: {
        german: true,
        vietnamese: true,
        tags: true,
        type: true
      }
    })
    
    recentEntries.forEach((entry, index) => {
      console.log(`${index + 1}. "${entry.german}" → ${entry.vietnamese} (${entry.type})`)
      console.log(`   Tags: [${entry.tags.join(', ')}]`)
    })
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkAllTagsInVocabulary()
