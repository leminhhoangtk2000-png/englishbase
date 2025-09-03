import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
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
      // Transform database model to match VocabularyEntry interface
      const transformedEntry = {
        id: existingWord.id,
        word: existingWord.german,
        pronunciation: existingWord.phonetic,
        partOfSpeech: existingWord.type,
        level: existingWord.level.name as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2',
        definitions: {
          german: existingWord.german,
          vietnamese: existingWord.vietnamese,
        },
        examples: existingWord.exampleGerman && existingWord.exampleVietnamese ? [{
          german: existingWord.exampleGerman,
          vietnamese: existingWord.exampleVietnamese
        }] : [],
        createdAt: existingWord.createdAt.toISOString(),
        updatedAt: existingWord.updatedAt.toISOString(),
        source: 'database' as const
      }
      
      return NextResponse.json({
        success: true,
        data: transformedEntry,
        source: 'database'
      })
    }
    
    // If not found, use AI Management system to translate and classify
    console.log(`AI Management system translating word: ${word}`)
    
    // Get active AI provider from AI Management system
    const providersResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:9002'}/api/admin/ai-providers`);
    const providersData = await providersResponse.json();
    const activeProvider = providersData.providers?.find((p: any) => p.isActive);
    
    if (!activeProvider) {
      return NextResponse.json(
        { error: 'No active AI provider available' },
        { status: 500 }
      )
    }

    // Call the AI provider test endpoint for vocabulary definition
    const aiResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:9002'}/api/admin/ai-providers/${activeProvider.id}/test`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        testPrompt: `Provide a German-Vietnamese vocabulary definition for the word "${word}". Create vocabulary cards that exactly match this format:

For the word "${word}", provide JSON with these exact keys:

{
  "german": "The complete German word with article (der/die/das) if it's a noun",
  "plural": "Plural form (use '-' if no plural exists)",
  "phonetic": "IPA phonetic transcription like /vɔrt/",
  "vietnamese": "Vietnamese translation",
  "type": "Word type (Nomen, Verb, Adjektiv, etc.)",
  "level": "CEFR level (A1, A2, B1, B2, C1, or C2)",
  "exampleGerman": "Example sentence in German using the word",
  "exampleVietnamese": "Vietnamese translation of the example sentence"
}

Requirements:
- For nouns: Include article (der/die/das) in "german" field
- For verbs: Use infinitive form
- Level should be one of: A1, A2, B1, B2, C1, C2
- Provide realistic, useful examples
- Ensure Vietnamese translations are accurate

Respond with ONLY the JSON object, no additional text.`
      }),
    });

    if (!aiResponse.ok) {
      return NextResponse.json(
        { error: 'AI provider failed to generate vocabulary' },
        { status: 500 }
      )
    }

    const aiResult = await aiResponse.json();
    
    if (!aiResult.success || !aiResult.result?.response) {
      return NextResponse.json(
        { error: 'AI provider returned invalid response' },
        { status: 500 }
      )
    }

    // Parse AI response
    let aiData: any;
    try {
      let responseText = aiResult.result.response;
      
      // Clean up markdown code blocks if present
      if (responseText.includes('```json')) {
        responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      }
      if (responseText.includes('```')) {
        responseText = responseText.replace(/```\s*/g, '');
      }
      
      aiData = JSON.parse(responseText.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      return NextResponse.json(
        { error: 'AI response is not valid JSON' },
        { status: 500 }
      )
    }

    // Track AI usage in database
    try {
      await prisma.aIUsage.create({
        data: {
          providerId: activeProvider.id,
          operation: 'vocabulary_search',
          promptTokens: aiResult.result.tokensUsed ? Math.round(aiResult.result.tokensUsed * 0.7) : 0, // Estimate prompt tokens
          responseTokens: aiResult.result.tokensUsed ? Math.round(aiResult.result.tokensUsed * 0.3) : 0, // Estimate response tokens
          totalTokens: aiResult.result.tokensUsed || 0,
          cost: aiResult.result.cost || 0,
          requestData: { word },
          responseData: aiData,
          success: true,
          duration: aiResult.result.responseTime || 0
        }
      });
      console.log(`Tracked AI usage: ${aiResult.result.tokensUsed} tokens, $${aiResult.result.cost}`);
    } catch (trackingError) {
      console.error('Failed to track AI usage:', trackingError);
      // Don't fail the request if tracking fails
    }
    
    // Get or create level and topic
    const level = await getOrCreateLevel(aiData.level)
    const topicSlug = classifyTopic(aiData.german, aiData.vietnamese, aiData.type)
    const topic = await getOrCreateTopic(topicSlug, level.id)
    
    // Save to database
    const newVocabulary = await prisma.vocabularyEntry.create({
      data: {
        german: aiData.german,
        vietnamese: aiData.vietnamese,
        phonetic: aiData.phonetic,
        plural: aiData.plural,
        type: mapTypeToEnum(aiData.type),
        exampleGerman: aiData.exampleGerman,
        exampleVietnamese: aiData.exampleVietnamese,
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
    
    // Transform database model to match VocabularyEntry interface
    const transformedEntry = {
      id: newVocabulary.id,
      word: newVocabulary.german,
      pronunciation: newVocabulary.phonetic,
      partOfSpeech: newVocabulary.type,
      level: newVocabulary.level.name as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2',
      definitions: {
        german: newVocabulary.german,
        vietnamese: newVocabulary.vietnamese,
      },
      examples: newVocabulary.exampleGerman && newVocabulary.exampleVietnamese ? [{
        german: newVocabulary.exampleGerman,
        vietnamese: newVocabulary.exampleVietnamese
      }] : [],
      createdAt: newVocabulary.createdAt.toISOString(),
      updatedAt: newVocabulary.updatedAt.toISOString(),
      source: 'ai' as const
    }
    
    return NextResponse.json({
      success: true,
      data: transformedEntry,
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
