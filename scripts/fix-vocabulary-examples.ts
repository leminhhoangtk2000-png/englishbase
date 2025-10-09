#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Từ điển gender cho các từ phổ biến
const genderDictionary: { [key: string]: string } = {
  // Feminine nouns
  'Wohnung': 'die', 'Küche': 'die', 'Straße': 'die', 'Toilette': 'die', 'Terrasse': 'die',
  'Garage': 'die', 'Stehlampe': 'die', 'Intonation': 'die', 'Möbel': 'die',
  'Altbauwohnung': 'die', 'Wohnküche': 'die',
  
  // Masculine nouns  
  'Garten': 'der', 'Balkon': 'der', 'Bauernhof': 'der', 'Flur': 'der', 'Keller': 'der',
  'Küchenschrank': 'der', 'Sessel': 'der', 'Schreibtisch': 'der', 'Schrank': 'der',
  'Teppich': 'der', 'Spiegel': 'der', 'Küchentisch': 'der', 'Altbau': 'der',
  'Kontrastakzent': 'der',
  
  // Neuter nouns
  'Fachwerkhaus': 'das', 'Hochhaus': 'das', 'Reihenhaus': 'das', 'Einfamilienhaus': 'das',
  'Studentenwohnheim': 'das', 'Wohnheim': 'das', 'Bad': 'das', 'Kinderzimmer': 'das',
  'Badezimmer': 'das', 'Bett': 'das', 'Sofa': 'das', 'Kompositum': 'das'
}

// Template ví dụ được cải thiện
const improvedTemplates = {
  NOMEN: [
    {
      german: 'Das ist {article} {word}.',
      vietnamese: 'Đây là {vietnamese}.'
    },
    {
      german: 'Ich sehe {article} {word}.',
      vietnamese: 'Tôi thấy {vietnamese}.'
    },
    {
      german: 'Wo ist {article} {word}?',
      vietnamese: '{Vietnamese} ở đâu?'
    },
    {
      german: '{Article} {word} ist sehr schön.',
      vietnamese: '{Vietnamese} rất đẹp.'
    },
    {
      german: 'Ich brauche {article} {word}.',
      vietnamese: 'Tôi cần {vietnamese}.'
    }
  ],
  VERB: [
    {
      german: 'Ich {word} gerne.',
      vietnamese: 'Tôi thích {vietnamese}.'
    },
    {
      german: 'Wir {word} zusammen.',
      vietnamese: 'Chúng tôi cùng {vietnamese}.'
    },
    {
      german: 'Sie {word} jeden Tag.',
      vietnamese: 'Họ {vietnamese} mỗi ngày.'
    },
    {
      german: 'Kannst du {word}?',
      vietnamese: 'Bạn có thể {vietnamese} không?'
    }
  ],
  ADJEKTIV: [
    {
      german: 'Das ist sehr {word}.',
      vietnamese: 'Điều đó rất {vietnamese}.'
    },
    {
      german: 'Die Wohnung ist {word}.',
      vietnamese: 'Căn hộ {vietnamese}.'
    },
    {
      german: 'Ich bin {word}.',
      vietnamese: 'Tôi {vietnamese}.'
    },
    {
      german: 'Das Haus ist {word}.',
      vietnamese: 'Ngôi nhà {vietnamese}.'
    }
  ]
}

// Hàm lấy article cho danh từ
function getArticle(word: string): string {
  // Kiểm tra từ điển trước
  if (genderDictionary[word]) {
    return genderDictionary[word]
  }
  
  // Pattern matching cho các từ không có trong từ điển
  if (word.endsWith('ung') || word.endsWith('heit') || word.endsWith('keit') || word.endsWith('ion')) {
    return 'die'
  }
  if (word.endsWith('chen') || word.endsWith('lein') || word.endsWith('haus')) {
    return 'das'
  }
  if (word.endsWith('er') && !word.includes(' ')) {
    return 'der'
  }
  
  // Default fallback
  return 'das'
}

// Hàm tạo ví dụ cải tiến
function generateImprovedExamples(entry: any): { german: string, vietnamese: string } | null {
  const templates = improvedTemplates[entry.type as keyof typeof improvedTemplates]
  if (!templates) return null
  
  const randomIndex = Math.floor(Math.random() * templates.length)
  const template = templates[randomIndex]
  
  let germanExample = template.german
  let vietnameseExample = template.vietnamese
  
  if (entry.type === 'NOMEN') {
    const article = getArticle(entry.german)
    const capitalizedArticle = article.charAt(0).toUpperCase() + article.slice(1)
    
    germanExample = germanExample
      .replace('{article}', article)
      .replace('{Article}', capitalizedArticle)
      .replace('{word}', entry.german)
    
    vietnameseExample = vietnameseExample
      .replace('{vietnamese}', entry.vietnamese)
      .replace('{Vietnamese}', entry.vietnamese.charAt(0).toUpperCase() + entry.vietnamese.slice(1))
  } else {
    germanExample = germanExample.replace('{word}', entry.german)
    vietnameseExample = vietnameseExample.replace('{vietnamese}', entry.vietnamese)
  }
  
  return {
    german: germanExample,
    vietnamese: vietnameseExample
  }
}

async function fixAndAddExamples() {
  try {
    console.log('🔧 Fixing and adding improved examples...\n')
    
    // Lấy các entries cần sửa (các từ cơ bản không phải grammar patterns)
    const entriesNeedingFix = await prisma.vocabularyEntry.findMany({
      where: {
        AND: [
          {
            type: {
              in: ['NOMEN', 'VERB', 'ADJEKTIV']
            }
          },
          {
            german: {
              not: {
                startsWith: '**'
              }
            }
          },
          {
            german: {
              not: {
                contains: '('
              }
            }
          }
        ]
      },
      select: {
        id: true,
        german: true,
        vietnamese: true,
        type: true,
        exampleGerman: true,
        exampleVietnamese: true
      },
      take: 30 // Xử lý 30 entries
    })
    
    console.log(`Processing ${entriesNeedingFix.length} entries...\n`)
    
    let successCount = 0
    
    for (const entry of entriesNeedingFix) {
      const examples = generateImprovedExamples(entry)
      
      if (examples) {
        try {
          await prisma.vocabularyEntry.update({
            where: { id: entry.id },
            data: {
              exampleGerman: examples.german,
              exampleVietnamese: examples.vietnamese
            }
          })
          
          console.log(`✅ ${entry.german} (${entry.type})`)
          console.log(`   German: ${examples.german}`)
          console.log(`   Vietnamese: ${examples.vietnamese}\n`)
          
          successCount++
        } catch (error) {
          console.log(`❌ Failed to update ${entry.german}: ${error}`)
        }
      }
    }
    
    console.log(`\n📊 Successfully updated: ${successCount} entries`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixAndAddExamples()
