#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function enhanceVocabularyCardsSimple() {
  try {
    console.log('🔧 Enhancing vocabulary cards with simple auto-generation...\n')
    
    // Lấy một số cards thiếu examples
    const incompleteCards = await prisma.vocabularyEntry.findMany({
      where: {
        OR: [
          { exampleGerman: null },
          { exampleVietnamese: null },
          { exampleGerman: '' },
          { exampleVietnamese: '' }
        ]
      },
      include: {
        topic: {
          select: {
            displayName: true,
            level: { select: { name: true } }
          }
        }
      },
      take: 20 // Start small
    })

    console.log(`📝 Found ${incompleteCards.length} cards to enhance`)
    
    let updateCount = 0
    
    for (const card of incompleteCards) {
      try {
        // Generate simple examples based on word type
        let germanExample = ''
        let vietnameseExample = ''
        
        switch (card.type) {
          case 'NOMEN':
            if (card.german.includes('das ')) {
              germanExample = `${card.german} ist sehr wichtig.`
              vietnameseExample = `${card.vietnamese} rất quan trọng.`
            } else if (card.german.includes('die ')) {
              germanExample = `Ich sehe ${card.german}.`
              vietnameseExample = `Tôi thấy ${card.vietnamese}.`
            } else if (card.german.includes('der ')) {
              germanExample = `${card.german} ist groß.`
              vietnameseExample = `${card.vietnamese} lớn.`
            } else {
              germanExample = `Das ist ${card.german}.`
              vietnameseExample = `Đó là ${card.vietnamese}.`
            }
            break
            
          case 'VERB':
            germanExample = `Ich ${card.german} gerne.`
            vietnameseExample = `Tôi thích ${card.vietnamese}.`
            break
            
          case 'ADJEKTIV':
            germanExample = `Das ist sehr ${card.german}.`
            vietnameseExample = `Điều đó rất ${card.vietnamese}.`
            break
            
          default:
            germanExample = `${card.german} ist wichtig.`
            vietnameseExample = `${card.vietnamese} quan trọng.`
        }
        
        // Update card với examples đơn giản
        await prisma.vocabularyEntry.update({
          where: { id: card.id },
          data: {
            exampleGerman: germanExample,
            exampleVietnamese: vietnameseExample
          }
        })
        
        console.log(`✅ "${card.german}" enhanced:`)
        console.log(`   🇩🇪 ${germanExample}`)
        console.log(`   🇻🇳 ${vietnameseExample}`)
        
        updateCount++
        
      } catch (error) {
        console.error(`❌ Error updating "${card.german}":`, error)
        continue
      }
    }
    
    console.log(`\n📊 Enhancement completed:`)
    console.log(`- Cards enhanced: ${updateCount}/${incompleteCards.length}`)
    
    // Check current completion rate
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
    
    if (completeCards < totalCards) {
      const remaining = totalCards - completeCards
      console.log(`\n🔄 ${remaining} cards still need enhancement`)
      console.log('Run this script again to continue...')
    } else {
      console.log('\n🎉 All cards now have examples!')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

enhanceVocabularyCardsSimple()
