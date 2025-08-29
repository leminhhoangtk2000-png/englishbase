import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { translateWord } from '@/ai/flows/vocabulary-flow'
import { VocabularyType } from '@prisma/client'

// Helper function to determine topic based on word content
function classifyTopic(german: string, vietnamese: string, type: string): string {
  const word = german.toLowerCase()
  const viWord = vietnamese.toLowerCase()
  
  // Family and relationships
  if (word.includes('vater') || word.includes('mutter') || word.includes('kind') || 
      word.includes('eltern') || viWord.includes('cha') || viWord.includes('mẹ') || 
      viWord.includes('con') || viWord.includes('gia đình')) {
    return 'familie'
  }
  
  // Body parts
  if (word.includes('kopf') || word.includes('hand') || word.includes('fuß') ||
      word.includes('auge') || viWord.includes('đầu') || viWord.includes('tay') ||
      viWord.includes('chân') || viWord.includes('mắt')) {
    return 'koerper'
  }
  
  // Food and drinks
  if (word.includes('essen') || word.includes('trinken') || word.includes('brot') ||
      word.includes('wasser') || viWord.includes('ăn') || viWord.includes('uống') ||
      viWord.includes('bánh') || viWord.includes('nước')) {
    return 'essen-trinken'
  }
  
  // Colors
  if (word.includes('rot') || word.includes('blau') || word.includes('grün') ||
      word.includes('gelb') || viWord.includes('đỏ') || viWord.includes('xanh') ||
      viWord.includes('vàng')) {
    return 'farben'
  }
  
  // Numbers
  if (word.includes('eins') || word.includes('zwei') || word.includes('drei') ||
      viWord.includes('một') || viWord.includes('hai') || viWord.includes('ba')) {
    return 'zahlen'
  }
  
  // Time
  if (word.includes('zeit') || word.includes('tag') || word.includes('woche') ||
      word.includes('monat') || viWord.includes('thời gian') || viWord.includes('ngày') ||
      viWord.includes('tuần') || viWord.includes('tháng')) {
    return 'zeit'
  }
  
  // Verbs
  if (type.toLowerCase().includes('verb')) {
    return 'verben'
  }
  
  // Adjectives
  if (type.toLowerCase().includes('adjektiv')) {
    return 'adjektive'
  }
  
  // Default to general
  return 'allgemein'
}

// Helper function to get or create level
async function getOrCreateLevel(levelName: string) {
  const level = await prisma.vocabularyLevel.findFirst({
    where: { name: levelName.toUpperCase() }
  })
  
  if (level) return level
  
  // Create new level if it doesn't exist
  const displayNames: Record<string, string> = {
    'A1': 'Cơ bản A1',
    'A2': 'Cơ bản A2', 
    'B1': 'Trung cấp B1',
    'B2': 'Trung cấp B2',
    'C1': 'Nâng cao C1',
    'C2': 'Thành thạo C2'
  }
  
  return await prisma.vocabularyLevel.create({
    data: {
      name: levelName.toUpperCase(),
      displayName: displayNames[levelName.toUpperCase()] || levelName.toUpperCase(),
      description: `Từ vựng cấp độ ${levelName.toUpperCase()}`,
      order: levelName.charCodeAt(0) + parseInt(levelName.slice(1)),
      isActive: true
    }
  })
}

// Helper function to get or create topic
async function getOrCreateTopic(topicSlug: string, levelId: string) {
  const topic = await prisma.vocabularyTopic.findFirst({
    where: { slug: topicSlug, levelId }
  })
  
  if (topic) return topic
  
  // Create new topic if it doesn't exist
  const topicNames: Record<string, string> = {
    'familie': 'Gia đình',
    'koerper': 'Cơ thể',
    'essen-trinken': 'Ăn uống',
    'farben': 'Màu sắc',
    'zahlen': 'Số đếm',
    'zeit': 'Thời gian',
    'verben': 'Động từ',
    'adjektive': 'Tính từ',
    'allgemein': 'Tổng quát'
  }
  
  return await prisma.vocabularyTopic.create({
    data: {
      name: topicSlug,
      displayName: topicNames[topicSlug] || 'Tổng quát',
      slug: topicSlug,
      levelId,
      order: Object.keys(topicNames).indexOf(topicSlug) + 1,
      isActive: true
    }
  })
}

// Helper function to map AI type to Prisma enum
function mapTypeToEnum(type: string): VocabularyType {
  const typeMap: Record<string, VocabularyType> = {
    'nomen': VocabularyType.NOMEN,
    'noun': VocabularyType.NOMEN,
    'substantiv': VocabularyType.NOMEN,
    'verb': VocabularyType.VERB,
    'adjektiv': VocabularyType.ADJEKTIV,
    'adjective': VocabularyType.ADJEKTIV,
    'adverb': VocabularyType.ADVERB,
    'pronoun': VocabularyType.PRONOUN,
    'pronomen': VocabularyType.PRONOUN,
    'preposition': VocabularyType.PREPOSITION,
    'präposition': VocabularyType.PREPOSITION,
    'conjunction': VocabularyType.CONJUNCTION,
    'konjunktion': VocabularyType.CONJUNCTION
  }
  
  const normalizedType = type.toLowerCase().trim()
  return typeMap[normalizedType] || VocabularyType.OTHER
}

export async function POST(request: NextRequest) {
  try {
    const { word } = await request.json()
    
    if (!word || typeof word !== 'string') {
      return NextResponse.json(
        { error: 'Word parameter is required' },
        { status: 400 }
      )
    }
    
    // First check if word already exists in database
    const existingWord = await prisma.vocabularyEntry.findFirst({
      where: {
        OR: [
          { german: { contains: word, mode: 'insensitive' } },
          { vietnamese: { contains: word, mode: 'insensitive' } }
        ]
      },
      include: {
        level: true,
        topic: true
      }
    })
    
    if (existingWord) {
      return NextResponse.json({
        success: true,
        data: existingWord,
        source: 'database'
      })
    }
    
    // If not found, use AI to translate and classify
    console.log(`AI translating word: ${word}`)
    const aiResult = await translateWord({ word })
    
    // Get or create level and topic
    const level = await getOrCreateLevel(aiResult.level)
    const topicSlug = classifyTopic(aiResult.german, aiResult.vietnamese, aiResult.type)
    const topic = await getOrCreateTopic(topicSlug, level.id)
    
    // Save to database
    const newVocabulary = await prisma.vocabularyEntry.create({
      data: {
        german: aiResult.german,
        vietnamese: aiResult.vietnamese,
        phonetic: aiResult.phonetic,
        plural: aiResult.plural,
        type: mapTypeToEnum(aiResult.type),
        exampleGerman: aiResult.exampleGerman,
        exampleVietnamese: aiResult.exampleVietnamese,
        levelId: level.id,
        topicId: topic.id,
        difficulty: 3, // Medium difficulty as default
        frequency: 1, // First time searched
        tags: []
      },
      include: {
        level: true,
        topic: true
      }
    })
    
    console.log(`Saved new vocabulary: ${newVocabulary.german} -> ${newVocabulary.vietnamese}`)
    
    return NextResponse.json({
      success: true,
      data: newVocabulary,
      source: 'ai_generated'
    })
    
  } catch (error) {
    console.error('Error in vocabulary AI search:', error)
    return NextResponse.json(
      { 
        error: 'Failed to process vocabulary request',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
