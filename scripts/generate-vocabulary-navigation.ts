#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Mapping topics thành các nhóm chính
const topicGroups = {
  'Politik und Wirtschaft': [
    'politik', 'arbeit im wandel', 'europa', 'migration'
  ],
  'Wissenschaft und Technik': [
    'wissenschaft', 'medien im alltag'
  ],
  'Literatur und Kunst': [
    'literatur', 'kultur'
  ],
  'Umwelt und Natur': [
    'klima und unwelt', 'umwelt'
  ],
  'Gesundheit und Körper': [
    'gesundheit', 'kopf und gesundheit', 'koerperteile'
  ],
  'Alltag und Gesellschaft': [
    'alltag', 'familiengeschichten', 'frauen maenner'
  ],
  'Reisen und Kultur': [
    'ab in den urlaub', 'berlin sehen', 'unterwegs'
  ],
  'Essen und Trinken': [
    'essen und trinken', 'essen'
  ],
  'Bildung und Beruf': [
    'schule und lernen', 'berufe', 'beruf'
  ]
}

async function generateVocabularyNavigation() {
  try {
    console.log('🏗️  Generating complete vocabulary navigation...\n')
    
    // Lấy B2 level
    const b2Level = await prisma.vocabularyLevel.findFirst({
      where: { name: 'B2' }
    })
    
    if (!b2Level) {
      console.log('❌ B2 level not found')
      return
    }
    
    // Lấy tất cả topics có vocabulary cho B2
    const topicsWithEntries = await prisma.vocabularyTopic.findMany({
      where: {
        levelId: b2Level.id
      }
    })
    
    console.log(`Found ${topicsWithEntries.length} topics with B2 vocabulary:`)
    
    // Lấy entry count cho mỗi topic
    const topicsWithCounts = await Promise.all(
      topicsWithEntries.map(async (topic) => {
        const entryCount = await prisma.vocabularyEntry.count({
          where: {
            topicId: topic.id,
            levelId: b2Level.id
          }
        })
        return { ...topic, entryCount }
      })
    )
    
    // Lọc ra chỉ những topics có entries
    const topicsWithData = topicsWithCounts.filter(topic => topic.entryCount > 0)
    
    // Tạo navigation structure
    const navigationGroups: any = {}
    
    for (const group in topicGroups) {
      navigationGroups[group] = {
        title: group,
        collapsible: true,
        collapsed: false,
        items: []
      }
    }
    
    // Map topics vào groups
    for (const topic of topicsWithData) {
      let assigned = false
      
      for (const [groupName, topicNames] of Object.entries(topicGroups)) {
        if (topicNames.some(name => topic.name.toLowerCase().includes(name.toLowerCase()) || 
                                   topic.displayName?.toLowerCase().includes(name.toLowerCase()))) {
          
          const slug = topic.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
          
          navigationGroups[groupName].items.push({
            title: topic.displayName || topic.name,
            description: topic.description || `${topic.entryCount} vocabulary entries`,
            href: `/b2niveau/vokabular/${slug}`,
            tags: ["vocabulary", "B2"],
            entryCount: topic.entryCount
          })
          
          assigned = true
          break
        }
      }
      
      if (!assigned) {
        // Tạo group "Sonstige" cho các topics không được phân loại
        if (!navigationGroups['Sonstige']) {
          navigationGroups['Sonstige'] = {
            title: 'Sonstige',
            collapsible: true,
            collapsed: true,
            items: []
          }
        }
        
        const slug = topic.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        
        navigationGroups['Sonstige'].items.push({
          title: topic.displayName || topic.name,
          description: topic.description || `${topic.entryCount} vocabulary entries`,
          href: `/b2niveau/vokabular/${slug}`,
          tags: ["vocabulary", "B2"],
          entryCount: topic.entryCount
        })
      }
    }
    
    // Hiển thị kết quả
    for (const [groupName, group] of Object.entries(navigationGroups)) {
      if ((group as any).items.length > 0) {
        console.log(`\n📚 ${groupName}:`)
        ;((group as any).items as any[]).forEach((item, index) => {
          console.log(`   ${index + 1}. ${item.title} (${item.entryCount} entries)`)
          console.log(`      → ${item.href}`)
        })
      }
    }
    
    // Tạo TypeScript config
    console.log('\n🔧 Generated TypeScript config:')
    console.log('```typescript')
    console.log('{')
    console.log('  title: "Vokabular",')
    console.log('  collapsible: true,')
    console.log('  collapsed: false,')
    console.log('  items: [')
    
    for (const [groupName, group] of Object.entries(navigationGroups)) {
      if ((group as any).items.length > 0) {
        console.log(`    {`)
        console.log(`      title: "${groupName}",`)
        console.log(`      collapsible: true,`)
        console.log(`      collapsed: false,`)
        console.log(`      items: [`)
        
        ;((group as any).items as any[]).forEach((item) => {
          console.log(`        {`)
          console.log(`          title: "${item.title}",`)
          console.log(`          description: "${item.description}",`)
          console.log(`          href: "${item.href}",`)
          console.log(`          tags: ${JSON.stringify(item.tags)},`)
          console.log(`        },`)
        })
        
        console.log(`      ],`)
        console.log(`    },`)
      }
    }
    
    console.log('  ],')
    console.log('},')
    console.log('```')
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

generateVocabularyNavigation()
