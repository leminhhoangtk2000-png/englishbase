#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'
import { generate } from '@genkit-ai/ai'
import { gemini15Flash } from '@genkit-ai/googleai'

const prisma = new PrismaClient()

async function enhanceVocabularyCards() {
  try {
    console.log('🚀 Starting vocabulary cards enhancement with AI...\n')
    
    // Lấy những cards thiếu examples (batch đầu tiên)
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
            level: {
              select: {
                name: true
              }
            }
          }
        }
      },
      take: 50, // Process 50 cards at a time
      orderBy: {
        createdAt: 'asc'
      }
    })

    console.log(`📝 Processing ${incompleteCards.length} vocabulary cards...`)
    
    let successCount = 0
    let errorCount = 0
    
    for (const card of incompleteCards) {
      try {
        console.log(`\n🔄 Processing: "${card.german}" (${card.vietnamese})`)
        
        // Generate examples using AI
        const prompt = `Create German and Vietnamese example sentences for the vocabulary word:

German word: ${card.german}
Vietnamese translation: ${card.vietnamese}
Word type: ${card.type}
Level: ${card.topic.level.name}
Topic: ${card.topic.displayName}

Requirements:
- Create 1 simple German sentence using "${card.german}"
- Create 1 Vietnamese sentence that demonstrates the same meaning
- Keep sentences appropriate for ${card.topic.level.name} level
- Make sentences practical and commonly used
- German sentence should be 5-15 words
- Vietnamese sentence should be natural translation

Format your response as JSON:
{
  "german": "German example sentence",
  "vietnamese": "Vietnamese example sentence"
}`

        const response = await generate({
          model: gemini15Flash,
          prompt: prompt,
          config: {
            temperature: 0.3,
            maxOutputTokens: 500
          }
        })

        let examples
        try {
          // Try to parse JSON response
          const cleanResponse = response.text().replace(/```json\n?|\n?```/g, '').trim()
          examples = JSON.parse(cleanResponse)
        } catch (parseError) {
          // If JSON parsing fails, try to extract manually
          const text = response.text()
          const germanMatch = text.match(/"german":\s*"([^"]+)"/i)
          const vietnameseMatch = text.match(/"vietnamese":\s*"([^"]+)"/i)
          
          if (germanMatch && vietnameseMatch) {
            examples = {
              german: germanMatch[1],
              vietnamese: vietnameseMatch[1]
            }
          } else {
            throw new Error('Could not extract examples from AI response')
          }
        }

        // Update database
        await prisma.vocabularyEntry.update({
          where: { id: card.id },
          data: {
            exampleGerman: examples.german,
            exampleVietnamese: examples.vietnamese
          }
        })

        console.log(`✅ Updated successfully:`)
        console.log(`   German: "${examples.german}"`)
        console.log(`   Vietnamese: "${examples.vietnamese}"`)
        
        successCount++
        
        // Add small delay to avoid API rate limits
        await new Promise(resolve => setTimeout(resolve, 1000))
        
      } catch (error) {
        console.error(`❌ Error processing "${card.german}":`, error.message)
        errorCount++
        continue
      }
    }
    
    console.log(`\n📊 Enhancement completed:`)
    console.log(`- Successfully enhanced: ${successCount} cards`)
    console.log(`- Errors: ${errorCount} cards`)
    console.log(`- Completion rate: ${((successCount / incompleteCards.length) * 100).toFixed(1)}%`)
    
    if (successCount > 0) {
      console.log('\n✅ Vocabulary cards have been enhanced with examples!')
      console.log('Run the script again to process more cards.')
    }

  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

enhanceVocabularyCards()
