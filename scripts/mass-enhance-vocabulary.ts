#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Batch processing lớn hơn với examples tốt hơn
async function massEnhanceVocabulary() {
  try {
    console.log('🚀 Mass vocabulary enhancement starting...\n')
    
    // Process 500 cards per batch
    const batchSize = 500
    
    while (true) {
      const incompleteCards = await prisma.vocabularyEntry.findMany({
        where: {
          OR: [
            { exampleGerman: null },
            { exampleVietnamese: null },
            { exampleGerman: '' },
            { exampleVietnamese: '' }
          ]
        },
        take: batchSize,
        orderBy: { createdAt: 'asc' }
      })
      
      if (incompleteCards.length === 0) {
        console.log('🎉 All vocabulary cards now have examples!')
        break
      }
      
      console.log(`📝 Processing batch of ${incompleteCards.length} cards...`)
      
      for (const card of incompleteCards) {
        try {
          let germanExample = ''
          let vietnameseExample = ''
          
          // Generate better examples based on word type and content
          switch (card.type) {
            case 'NOMEN':
              if (card.german.includes('das ')) {
                const noun = card.german.replace('das ', '').toLowerCase()
                if (noun.includes('haus') || noun.includes('gebäude')) {
                  germanExample = `${card.german} ist sehr schön.`
                  vietnameseExample = `${card.vietnamese} rất đẹp.`
                } else if (noun.includes('zimmer') || noun.includes('raum')) {
                  germanExample = `${card.german} ist gemütlich.`
                  vietnameseExample = `${card.vietnamese} ấm cúng.`
                } else if (noun.includes('essen') || noun.includes('brot') || noun.includes('fleisch')) {
                  germanExample = `${card.german} schmeckt gut.`
                  vietnameseExample = `${card.vietnamese} ngon.`
                } else if (noun.includes('auto') || noun.includes('fahrzeug')) {
                  germanExample = `${card.german} fährt schnell.`
                  vietnameseExample = `${card.vietnamese} chạy nhanh.`
                } else if (noun.includes('buch') || noun.includes('heft')) {
                  germanExample = `Ich lese ${card.german}.`
                  vietnameseExample = `Tôi đọc ${card.vietnamese}.`
                } else {
                  germanExample = `Ich brauche ${card.german}.`
                  vietnameseExample = `Tôi cần ${card.vietnamese}.`
                }
              } else if (card.german.includes('die ')) {
                const noun = card.german.replace('die ', '').toLowerCase()
                if (noun.includes('küche') || noun.includes('bad')) {
                  germanExample = `${card.german} ist modern.`
                  vietnameseExample = `${card.vietnamese} hiện đại.`
                } else if (noun.includes('schule') || noun.includes('universität')) {
                  germanExample = `Ich gehe zur ${card.german.replace('die ', '')}.`
                  vietnameseExample = `Tôi đi đến ${card.vietnamese}.`
                } else if (noun.includes('musik') || noun.includes('party')) {
                  germanExample = `${card.german} ist toll.`
                  vietnameseExample = `${card.vietnamese} tuyệt vời.`
                } else {
                  germanExample = `${card.german} ist wichtig.`
                  vietnameseExample = `${card.vietnamese} quan trọng.`
                }
              } else if (card.german.includes('der ')) {
                const noun = card.german.replace('der ', '').toLowerCase()
                if (noun.includes('tisch') || noun.includes('stuhl')) {
                  germanExample = `${card.german} steht hier.`
                  vietnameseExample = `${card.vietnamese} ở đây.`
                } else if (noun.includes('tag') || noun.includes('morgen') || noun.includes('abend')) {
                  germanExample = `${card.german} ist schön.`
                  vietnameseExample = `${card.vietnamese} đẹp.`
                } else if (noun.includes('freund') || noun.includes('kollege')) {
                  germanExample = `${card.german} ist nett.`
                  vietnameseExample = `${card.vietnamese} tốt bụng.`
                } else {
                  germanExample = `${card.german} ist neu.`
                  vietnameseExample = `${card.vietnamese} mới.`
                }
              } else {
                // Noun without article
                germanExample = `Das ist ${card.german}.`
                vietnameseExample = `Đó là ${card.vietnamese}.`
              }
              break
              
            case 'VERB':
              const verbLower = card.german.toLowerCase()
              if (verbLower.includes('gehen') || verbLower.includes('fahren') || verbLower.includes('reisen')) {
                germanExample = `Ich ${card.german} nach Deutschland.`
                vietnameseExample = `Tôi ${card.vietnamese} đến Đức.`
              } else if (verbLower.includes('essen') || verbLower.includes('trinken')) {
                germanExample = `Wir ${card.german} zusammen.`
                vietnameseExample = `Chúng tôi ${card.vietnamese} cùng nhau.`
              } else if (verbLower.includes('lernen') || verbLower.includes('studieren')) {
                germanExample = `Ich ${card.german} Deutsch.`
                vietnameseExample = `Tôi ${card.vietnamese} tiếng Đức.`
              } else if (verbLower.includes('kaufen') || verbLower.includes('verkaufen')) {
                germanExample = `Sie ${card.german} ein Auto.`
                vietnameseExample = `Họ ${card.vietnamese} một ô tô.`
              } else if (verbLower.includes('arbeiten') || verbLower.includes('verdienen')) {
                germanExample = `Er ${card.german} hier.`
                vietnameseExample = `Anh ấy ${card.vietnamese} ở đây.`
              } else {
                germanExample = `Ich kann ${card.german}.`
                vietnameseExample = `Tôi có thể ${card.vietnamese}.`
              }
              break
              
            case 'ADJEKTIV':
              const vietnameseLower = card.vietnamese.toLowerCase()
              if (vietnameseLower.includes('đẹp') || vietnameseLower.includes('tốt') || vietnameseLower.includes('hay')) {
                germanExample = `Das Wetter ist ${card.german}.`
                vietnameseExample = `Thời tiết ${card.vietnamese}.`
              } else if (vietnameseLower.includes('lớn') || vietnameseLower.includes('nhỏ') || vietnameseLower.includes('cao') || vietnameseLower.includes('thấp')) {
                germanExample = `Das Haus ist ${card.german}.`
                vietnameseExample = `Ngôi nhà ${card.vietnamese}.`
              } else if (vietnameseLower.includes('nhanh') || vietnameseLower.includes('chậm')) {
                germanExample = `Das Auto ist ${card.german}.`
                vietnameseExample = `Ô tô ${card.vietnamese}.`
              } else {
                germanExample = `Das ist ${card.german}.`
                vietnameseExample = `Điều đó ${card.vietnamese}.`
              }
              break
              
            case 'ADVERB':
              if (card.vietnamese.includes('luôn') || card.vietnamese.includes('thường')) {
                germanExample = `Ich arbeite ${card.german}.`
                vietnameseExample = `Tôi ${card.vietnamese} làm việc.`
              } else if (card.vietnamese.includes('rất') || card.vietnamese.includes('quá')) {
                germanExample = `Das ist ${card.german} schön.`
                vietnameseExample = `Điều đó ${card.vietnamese} đẹp.`
              } else {
                germanExample = `Er spricht ${card.german}.`
                vietnameseExample = `Anh ấy nói ${card.vietnamese}.`
              }
              break
              
            default:
              // OTHER and other types
              germanExample = `Das ist ${card.german}.`
              vietnameseExample = `Đó là ${card.vietnamese}.`
          }
          
          await prisma.vocabularyEntry.update({
            where: { id: card.id },
            data: {
              exampleGerman: germanExample,
              exampleVietnamese: vietnameseExample
            }
          })
          
        } catch (error) {
          // Skip problematic entries
          continue
        }
      }
      
      // Progress check
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
      console.log(`✅ Batch completed. Progress: ${completeCards}/${totalCards} (${completionRate}%)`)
      
      if (completeCards >= totalCards) {
        console.log('\n🎉 All vocabulary cards completed!')
        break
      }
    }
    
    // Final report
    console.log('\n📊 Mass enhancement completed!')
    console.log('🎯 All vocabulary cards now have German and Vietnamese examples!')

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

massEnhanceVocabulary()
