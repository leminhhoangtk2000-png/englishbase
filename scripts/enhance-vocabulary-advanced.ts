#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Improved example generation với logic thông minh hơn
function generateBetterExamples(card: any) {
  const german = card.german.toLowerCase()
  const vietnamese = card.vietnamese.toLowerCase()
  
  let germanExample = ''
  let vietnameseExample = ''
  
  switch (card.type) {
    case 'NOMEN':
      if (german.includes('das ')) {
        const noun = german.replace('das ', '')
        if (noun.includes('zimmer') || noun.includes('raum')) {
          germanExample = `${card.german} ist sehr gemütlich.`
          vietnameseExample = `${card.vietnamese} rất ấm cúng.`
        } else if (noun.includes('haus') || noun.includes('gebäude')) {
          germanExample = `${card.german} ist sehr schön.`
          vietnameseExample = `${card.vietnamese} rất đẹp.`
        } else if (noun.includes('essen') || noun.includes('food')) {
          germanExample = `${card.german} schmeckt gut.`
          vietnameseExample = `${card.vietnamese} có vị ngon.`
        } else {
          germanExample = `Wo ist ${card.german}?`
          vietnameseExample = `${card.vietnamese} ở đâu?`
        }
      } else if (german.includes('die ')) {
        const noun = german.replace('die ', '')
        if (noun.includes('lampe') || noun.includes('beleuchtung')) {
          germanExample = `${card.german} ist sehr hell.`
          vietnameseExample = `${card.vietnamese} rất sáng.`
        } else if (noun.includes('küche') || noun.includes('bad')) {
          germanExample = `${card.german} ist sehr modern.`
          vietnameseExample = `${card.vietnamese} rất hiện đại.`
        } else {
          germanExample = `Ich brauche ${card.german}.`
          vietnameseExample = `Tôi cần ${card.vietnamese}.`
        }
      } else if (german.includes('der ')) {
        const noun = german.replace('der ', '')
        if (noun.includes('stuhl') || noun.includes('tisch')) {
          germanExample = `${card.german} steht im Wohnzimmer.`
          vietnameseExample = `${card.vietnamese} đặt ở phòng khách.`
        } else if (noun.includes('schrank') || noun.includes('regal')) {
          germanExample = `${card.german} ist sehr praktisch.`
          vietnameseExample = `${card.vietnamese} rất tiện dụng.`
        } else {
          germanExample = `${card.german} ist neu.`
          vietnameseExample = `${card.vietnamese} mới.`
        }
      } else {
        // Noun without article
        germanExample = `Das ist ein schönes ${card.german}.`
        vietnameseExample = `Đó là một ${card.vietnamese} đẹp.`
      }
      break
      
    case 'VERB':
      const verb = german.replace(/^(sich )?/, '') // Remove reflexive prefix
      if (verb.includes('wohnen') || verb.includes('leben')) {
        germanExample = `Ich ${card.german} in Deutschland.`
        vietnameseExample = `Tôi ${card.vietnamese} ở Đức.`
      } else if (verb.includes('kaufen') || verb.includes('verkaufen')) {
        germanExample = `Ich möchte das ${card.german}.`
        vietnameseExample = `Tôi muốn ${card.vietnamese} cái đó.`
      } else if (verb.includes('lernen') || verb.includes('studieren')) {
        germanExample = `Ich ${card.german} Deutsch.`
        vietnameseExample = `Tôi ${card.vietnamese} tiếng Đức.`
      } else if (verb.includes('essen') || verb.includes('trinken')) {
        germanExample = `Wir ${card.german} zusammen.`
        vietnameseExample = `Chúng tôi ${card.vietnamese} cùng nhau.`
      } else {
        germanExample = `Ich kann ${card.german}.`
        vietnameseExample = `Tôi có thể ${card.vietnamese}.`
      }
      break
      
    case 'ADJEKTIV':
      if (vietnamese.includes('đẹp') || vietnamese.includes('tốt')) {
        germanExample = `Das Wetter ist heute ${card.german}.`
        vietnameseExample = `Thời tiết hôm nay ${card.vietnamese}.`
      } else if (vietnamese.includes('lớn') || vietnamese.includes('nhỏ')) {
        germanExample = `Das Haus ist sehr ${card.german}.`
        vietnameseExample = `Ngôi nhà rất ${card.vietnamese}.`
      } else if (vietnamese.includes('nhanh') || vietnamese.includes('chậm')) {
        germanExample = `Das Auto fährt sehr ${card.german}.`
        vietnameseExample = `Xe ô tô chạy rất ${card.vietnamese}.`
      } else {
        germanExample = `Diese Idee ist ${card.german}.`
        vietnameseExample = `Ý tưởng này ${card.vietnamese}.`
      }
      break
      
    case 'ADVERB':
      if (vietnamese.includes('luôn') || vietnamese.includes('thường')) {
        germanExample = `Ich gehe ${card.german} zur Schule.`
        vietnameseExample = `Tôi ${card.vietnamese} đi học.`
      } else if (vietnamese.includes('rất') || vietnamese.includes('quá')) {
        germanExample = `Das ist ${card.german} interessant.`
        vietnameseExample = `Điều đó ${card.vietnamese} thú vị.`
      } else {
        germanExample = `Er arbeitet ${card.german}.`
        vietnameseExample = `Anh ấy làm việc ${card.vietnamese}.`
      }
      break
      
    case 'PREPOSITION':
      germanExample = `Ich gehe ${card.german} der Schule.`
      vietnameseExample = `Tôi đi ${card.vietnamese} trường.`
      break
      
    default:
      // OTHER or other types
      if (german.includes('zu hause') || german.includes('zu haus')) {
        germanExample = `Ich bin ${card.german}.`
        vietnameseExample = `Tôi đang ${card.vietnamese}.`
      } else {
        germanExample = `${card.german} ist wichtig.`
        vietnameseExample = `${card.vietnamese} quan trọng.`
      }
  }
  
  return { germanExample, vietnameseExample }
}

async function enhanceVocabularyCardsAdvanced() {
  try {
    console.log('🚀 Advanced vocabulary cards enhancement...\n')
    
    // Lấy batch tiếp theo
    const incompleteCards = await prisma.vocabularyEntry.findMany({
      where: {
        OR: [
          { exampleGerman: null },
          { exampleVietnamese: null },
          { exampleGerman: '' },
          { exampleVietnamese: '' }
        ]
      },
      take: 100, // Larger batch
      orderBy: { createdAt: 'asc' }
    })

    console.log(`📝 Processing ${incompleteCards.length} cards with smart examples...`)
    
    let updateCount = 0
    
    for (const card of incompleteCards) {
      try {
        const { germanExample, vietnameseExample } = generateBetterExamples(card)
        
        await prisma.vocabularyEntry.update({
          where: { id: card.id },
          data: {
            exampleGerman: germanExample,
            exampleVietnamese: vietnameseExample
          }
        })
        
        console.log(`✅ "${card.german}":`)
        console.log(`   🇩🇪 ${germanExample}`)
        console.log(`   🇻🇳 ${vietnameseExample}`)
        
        updateCount++
        
      } catch (error) {
        console.error(`❌ Error updating "${card.german}":`, error)
        continue
      }
    }
    
    // Progress report
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
    
    console.log(`\n📊 Batch completed:`)
    console.log(`- Cards enhanced this run: ${updateCount}`)
    console.log(`- Total completion: ${completeCards}/${totalCards} (${completionRate}%)`)
    
    const remaining = totalCards - completeCards
    if (remaining > 0) {
      console.log(`\n🔄 ${remaining} cards remaining`)
      console.log('Run script again to continue enhancement...')
    } else {
      console.log('\n🎉 All vocabulary cards now have examples!')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

enhanceVocabularyCardsAdvanced()
