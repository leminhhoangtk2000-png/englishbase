#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Danh sách template ví dụ cho từng loại từ
const exampleTemplates = {
  NOMEN: {
    templates: [
      'Das ist {gender} {word}.',
      'Ich sehe {gender} {word}.',
      'Wo ist {gender} {word}?',
      '{Gender} {word} ist sehr schön.',
      'Ich brauche {gender} {word}.'
    ],
    vietnameseTemplates: [
      'Đây là {vietnamese}.',
      'Tôi thấy {vietnamese}.',
      'Ở đâu có {vietnamese}?',
      '{Vietnamese} rất đẹp.',
      'Tôi cần {vietnamese}.'
    ]
  },
  VERB: {
    templates: [
      'Ich {word} gerne.',
      'Wir {word} zusammen.',
      'Sie {word} jeden Tag.',
      'Kannst du {word}?',
      'Er will {word}.'
    ],
    vietnameseTemplates: [
      'Tôi thích {vietnamese}.',
      'Chúng tôi cùng {vietnamese}.',
      'Họ {vietnamese} mỗi ngày.',
      'Bạn có thể {vietnamese} không?',
      'Anh ấy muốn {vietnamese}.'
    ]
  },
  ADJEKTIV: {
    templates: [
      'Das ist sehr {word}.',
      'Ein {word}er Mann.',
      'Die Frau ist {word}.',
      'Das Haus ist {word}.',
      'Ich bin {word}.'
    ],
    vietnameseTemplates: [
      'Điều đó rất {vietnamese}.',
      'Một người đàn ông {vietnamese}.',
      'Người phụ nữ {vietnamese}.',
      'Ngôi nhà {vietnamese}.',
      'Tôi {vietnamese}.'
    ]
  }
}

// Hàm để lấy gender article cho danh từ
function getGenderArticle(word: string): string {
  // Một số pattern cơ bản để đoán gender
  if (word.endsWith('e')) return 'die' // Nhiều danh từ nữ kết thúc bằng -e
  if (word.endsWith('ung') || word.endsWith('heit') || word.endsWith('keit')) return 'die'
  if (word.endsWith('er') && !word.includes(' ')) return 'der' // Nhiều danh từ nam kết thúc bằng -er
  if (word.endsWith('chen') || word.endsWith('lein')) return 'das' // Diminutive
  
  // Default fallback
  return 'das'
}

// Hàm tạo ví dụ cho một entry
function generateExamples(entry: any): { german: string, vietnamese: string } | null {
  const templates = exampleTemplates[entry.type as keyof typeof exampleTemplates]
  if (!templates) return null
  
  const randomIndex = Math.floor(Math.random() * templates.templates.length)
  let germanTemplate = templates.templates[randomIndex]
  let vietnameseTemplate = templates.vietnameseTemplates[randomIndex]
  
  if (entry.type === 'NOMEN') {
    const gender = getGenderArticle(entry.german)
    const capitalizedGender = gender.charAt(0).toUpperCase() + gender.slice(1)
    
    germanTemplate = germanTemplate
      .replace('{gender}', gender)
      .replace('{Gender}', capitalizedGender)
      .replace('{word}', entry.german)
    
    vietnameseTemplate = vietnameseTemplate
      .replace('{vietnamese}', entry.vietnamese)
      .replace('{Vietnamese}', entry.vietnamese.charAt(0).toUpperCase() + entry.vietnamese.slice(1))
  } else {
    germanTemplate = germanTemplate.replace('{word}', entry.german)
    vietnameseTemplate = vietnameseTemplate.replace('{vietnamese}', entry.vietnamese)
  }
  
  return {
    german: germanTemplate,
    vietnamese: vietnameseTemplate
  }
}

async function addExamplesToBasicWords() {
  try {
    console.log('🔧 Adding examples to basic vocabulary entries...\n')
    
    // Chỉ xử lý các từ cơ bản (NOMEN, VERB, ADJEKTIV) mà thiếu ví dụ
    const entriesNeedingExamples = await prisma.vocabularyEntry.findMany({
      where: {
        AND: [
          {
            type: {
              in: ['NOMEN', 'VERB', 'ADJEKTIV']
            }
          },
          {
            OR: [
              { exampleGerman: null },
              { exampleVietnamese: null },
              { exampleGerman: '' },
              { exampleVietnamese: '' }
            ]
          },
          {
            // Chỉ xử lý từ vựng đơn giản (không phải grammar patterns)
            german: {
              not: {
                startsWith: '**'
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
      take: 50 // Xử lý 50 entries đầu tiên
    })
    
    console.log(`Found ${entriesNeedingExamples.length} basic entries to process...\n`)
    
    let successCount = 0
    let skipCount = 0
    
    for (const entry of entriesNeedingExamples) {
      const examples = generateExamples(entry)
      
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
          skipCount++
        }
      } else {
        console.log(`⏭️  Skipped ${entry.german} (${entry.type}) - no template available`)
        skipCount++
      }
    }
    
    console.log(`\n📊 Summary:`)
    console.log(`✅ Successfully added examples: ${successCount}`)
    console.log(`⏭️  Skipped: ${skipCount}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

addExamplesToBasicWords()
