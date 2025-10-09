import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { VocabularyType } from '@prisma/client'

// Helper function to determine topic based on word content
function classifyTopic(german: string, vietnamese: string, type: string): string {
  const word = german.toLowerCase()
  const viWord = vietnamese.toLowerCase()
  
  // Family and relationships
  if (word.includes('vater') || word.includes('mutter') || word.includes('kind') || 
      word.includes('eltern') || word.includes('familie') ||
      viWord.includes('cha') || viWord.includes('mẹ') || 
      viWord.includes('con') || viWord.includes('gia đình') || viWord.includes('bố') || viWord.includes('má')) {
    return 'familie'
  }
  
  // Body parts
  if (word.includes('kopf') || word.includes('hand') || word.includes('fuß') ||
      word.includes('auge') || word.includes('körper') || word.includes('nase') ||
      viWord.includes('đầu') || viWord.includes('tay') ||
      viWord.includes('chân') || viWord.includes('mắt') || viWord.includes('cơ thể')) {
    return 'koerper'
  }
  
  // Food and drinks
  if (word.includes('essen') || word.includes('trinken') || word.includes('brot') ||
      word.includes('wasser') || word.includes('küche') || word.includes('restaurant') ||
      viWord.includes('ăn') || viWord.includes('uống') ||
      viWord.includes('bánh') || viWord.includes('nước') || viWord.includes('thức ăn')) {
    return 'essen-trinken'
  }
  
  // Home and living (household items)
  if (word.includes('kühlschrank') || word.includes('bett') || word.includes('tisch') ||
      word.includes('stuhl') || word.includes('fenster') || word.includes('tür') ||
      word.includes('haus') || word.includes('wohnung') ||
      viWord.includes('tủ lạnh') || viWord.includes('giường') || viWord.includes('bàn') ||
      viWord.includes('ghế') || viWord.includes('cửa sổ') || viWord.includes('nhà')) {
    return 'wohnen'
  }
  
  // Clothing
  if (word.includes('kleid') || word.includes('hose') || word.includes('hemd') ||
      word.includes('schuhe') || word.includes('jacke') ||
      viWord.includes('quần áo') || viWord.includes('áo') || viWord.includes('quần') ||
      viWord.includes('giày') || viWord.includes('váy')) {
    return 'kleidung'
  }
  
  // Colors
  if (word.includes('rot') || word.includes('blau') || word.includes('grün') ||
      word.includes('gelb') || word.includes('schwarz') || word.includes('weiß') ||
      viWord.includes('đỏ') || viWord.includes('xanh') ||
      viWord.includes('vàng') || viWord.includes('màu')) {
    return 'farben'
  }
  
  // Numbers
  if (word.includes('eins') || word.includes('zwei') || word.includes('drei') ||
      word.includes('zahl') || word.includes('nummer') ||
      viWord.includes('một') || viWord.includes('hai') || viWord.includes('ba') ||
      viWord.includes('số')) {
    return 'zahlen'
  }
  
  // Time
  if (word.includes('zeit') || word.includes('tag') || word.includes('woche') ||
      word.includes('monat') || word.includes('jahr') || word.includes('uhr') ||
      viWord.includes('thời gian') || viWord.includes('ngày') ||
      viWord.includes('tuần') || viWord.includes('tháng') || viWord.includes('giờ')) {
    return 'zeit'
  }
  
  // Work and profession
  if (word.includes('arbeit') || word.includes('beruf') || word.includes('job') ||
      word.includes('büro') || word.includes('firma') ||
      viWord.includes('công việc') || viWord.includes('nghề') || viWord.includes('làm việc')) {
    return 'beruf'
  }
  
  // Transportation
  if (word.includes('auto') || word.includes('bus') || word.includes('zug') ||
      word.includes('flugzeug') || word.includes('fahren') ||
      viWord.includes('xe') || viWord.includes('máy bay') || viWord.includes('tàu')) {
    return 'verkehr'
  }
  
  // School and education
  if (word.includes('schule') || word.includes('lehrer') || word.includes('student') ||
      word.includes('lernen') || word.includes('buch') ||
      viWord.includes('học') || viWord.includes('trường') || viWord.includes('giáo viên')) {
    return 'schule'
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
    'wohnen': 'Nhà ở',
    'kleidung': 'Quần áo',
    'farben': 'Màu sắc',
    'zahlen': 'Số đếm',
    'zeit': 'Thời gian',
    'verben': 'Động từ',
    'adjektive': 'Tính từ',
    'beruf': 'Nghề nghiệp',
    'verkehr': 'Giao thông',
    'schule': 'Trường học',
    'allgemein': 'Tổng quát'
  }
  
  // Get the highest order for this level to avoid conflicts
  const maxOrderTopic = await prisma.vocabularyTopic.findFirst({
    where: { levelId },
    orderBy: { order: 'desc' }
  })
  
  const nextOrder = (maxOrderTopic?.order || 0) + 1
  
  return await prisma.vocabularyTopic.create({
    data: {
      name: topicSlug,
      displayName: topicNames[topicSlug] || 'Tổng quát',
      slug: topicSlug,
      levelId,
      order: nextOrder,
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

    // Check word count limit (maximum 3 words per search)
    const wordCount = word.trim().split(/\s+/).length
    if (wordCount > 3) {
      return NextResponse.json(
        { 
          error: 'Giới hạn tìm kiếm', 
          message: 'Chúng tôi chỉ hỗ trợ tìm kiếm tối đa 3 từ trong 1 lần. Vui lòng thử lại với ít từ hơn.',
          maxWords: 3,
          currentWords: wordCount
        },
        { status: 400 }
      )
    }
    
    // First check if word already exists in database
    const existingWords = await prisma.vocabularyEntry.findMany({
      where: {
        OR: [
          { german: { contains: word, mode: 'insensitive' } },
          { vietnamese: { contains: word, mode: 'insensitive' } }
        ]
      },
      include: {
        level: true,
        topic: true
      },
      orderBy: [
        { level: { order: 'asc' } },
        { frequency: 'desc' }
      ]
    })
    
    let existingWord = null;
    
    if (existingWords.length > 0) {
      // Check if any existing word has complete information
      const completeWords = existingWords.filter(word => 
        word.vietnamese !== 'chưa có nghĩa' &&
        word.vietnamese !== 'Từ mới (cần bổ sung)' &&
        word.phonetic !== '/không xác định/' &&
        word.phonetic !== '' &&
        word.phonetic
      );
      
      // If we have complete words, return the first one (best match)
      if (completeWords.length > 0) {
        const bestMatch = completeWords[0];
        
        // Transform database model to match VocabularyEntry interface
        const transformedEntry = {
          id: bestMatch.id,
          word: bestMatch.german,
          pronunciation: bestMatch.phonetic,
          partOfSpeech: bestMatch.type,
          level: bestMatch.level.name as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2',
          definitions: {
            german: bestMatch.german,
            vietnamese: bestMatch.vietnamese,
          },
          examples: bestMatch.exampleGerman && bestMatch.exampleVietnamese ? [{
            german: bestMatch.exampleGerman,
            vietnamese: bestMatch.exampleVietnamese
          }] : [],
          createdAt: bestMatch.createdAt.toISOString(),
          updatedAt: bestMatch.updatedAt.toISOString(),
          source: 'database' as const,
          // Add alternative entries for context
          alternatives: completeWords.slice(1, 5).map(alt => ({
            id: alt.id,
            word: alt.german,
            vietnamese: alt.vietnamese,
            level: alt.level.name,
            type: alt.type,
            examples: alt.exampleGerman && alt.exampleVietnamese ? [{
              german: alt.exampleGerman,
              vietnamese: alt.exampleVietnamese
            }] : []
          }))
        }

        return NextResponse.json({
          success: true,
          data: transformedEntry,
          source: 'database'
        })
      }
      
      // If only incomplete data exists, continue to AI generation to update
      existingWord = existingWords[0];
      console.log('Found existing word with incomplete data, updating with AI:', existingWord.german);
    }
    
    // If not found or incomplete, use AI Management system to translate and classify
    console.log(`AI Management system translating word: ${word}`)
    
    // Get AI vocabulary configuration
    const configResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:9002'}/api/admin/ai-vocabulary-config`);
    const configData = await configResponse.json();
    
    if (!configData.success || !configData.data.config.preferredProviderId) {
      return NextResponse.json(
        { error: 'No AI provider configured for vocabulary search' },
        { status: 500 }
      )
    }

    const config = configData.data.config;
    const providers = configData.data.providers;
    
    // Try providers with enhanced retry logic
    const providersToTry = [config.preferredProviderId];
    if (config.enableAutoFallback) {
      providersToTry.push(...config.fallbackProviderIds);
    }
    
    let lastError = null;
    let aiResult = null;
    let successfulProviderId = null;
    
    for (let i = 0; i < Math.min(providersToTry.length, config.maxRetries); i++) {
      const providerId = providersToTry[i];
      
      try {
        console.log(`Trying AI provider ${i + 1}/${providersToTry.length}: ${providerId}`)
        
        // Enhanced retry for each provider (up to 2 attempts per provider)
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            console.log(`Provider ${providerId}, attempt ${attempt}/2`);
            
            const aiResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:9002'}/api/admin/ai-providers/${providerId}/test`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                testPrompt: `You are a German-Vietnamese dictionary expert. Create a vocabulary entry for "${word}".

CRITICAL: Return ONLY valid JSON. No explanations, no markdown, no code blocks.

Required JSON format:
{
  "german": "German word with article if noun",
  "plural": "Plural form or '-'",
  "phonetic": "IPA pronunciation",
  "vietnamese": "Vietnamese translation",
  "type": "NOMEN or VERB or ADJEKTIV or ADVERB",
  "level": "A1 or A2 or B1 or B2 or C1 or C2",
  "exampleGerman": "German example sentence",
  "exampleVietnamese": "Vietnamese example sentence"
}

Rules:
- Nouns: include der/die/das
- Verbs: infinitive form
- Adjectives: base form
- Type: UPPERCASE only
- Examples: simple, practical sentences

Word: "${word}"`
              }),
            });

            if (aiResponse.ok) {
              const result = await aiResponse.json();
              console.log(`AI Provider ${providerId} response:`, JSON.stringify(result, null, 2));
              
              if (result.success && result.result?.response) {
                console.log(`Successfully got response from provider ${providerId} on attempt ${attempt}`);
                console.log(`Raw AI response text:`, result.result.response);
                aiResult = result;
                successfulProviderId = providerId;
                break; // Success, exit retry loop
              } else {
                console.log(`Provider ${providerId} attempt ${attempt} returned unsuccessful result:`, result);
                if (attempt === 2) {
                  lastError = `Provider ${providerId} returned no valid response after 2 attempts`;
                }
              }
            } else {
              console.log(`Provider ${providerId} attempt ${attempt} HTTP error:`, aiResponse.status, aiResponse.statusText);
              if (attempt === 2) {
                lastError = `Provider ${providerId} HTTP error: ${aiResponse.status}`;
              }
            }
          } catch (attemptError) {
            console.error(`Provider ${providerId} attempt ${attempt} failed:`, attemptError);
            if (attempt === 2) {
              lastError = `Provider ${providerId} failed: ${attemptError instanceof Error ? attemptError.message : 'Unknown error'}`;
            }
          }
          
          // Small delay between attempts
          if (attempt === 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
        
        if (aiResult && successfulProviderId) {
          break; // Success, exit provider loop
        }
        
      } catch (error) {
        lastError = `Provider ${providerId} failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
        console.error(`AI provider ${providerId} failed:`, error);
      }
    }
    
    if (!aiResult || !aiResult.success || !aiResult.result?.response) {
      return NextResponse.json(
        { error: lastError || 'All AI providers failed to generate vocabulary' },
        { status: 500 }
      )
    }

    // Parse AI response with multiple fallback strategies
    let aiData: any;
    try {
      let responseText = aiResult.result.response;
      console.log('Raw AI response:', responseText);
      
      // Strategy 1: Clean response text thoroughly
      responseText = responseText.trim();
      
      // Remove markdown code blocks
      if (responseText.includes('```json')) {
        responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
      }
      if (responseText.includes('```')) {
        responseText = responseText.replace(/```\s*/g, '');
      }
      
      // Strategy 2: Extract JSON from text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        responseText = jsonMatch[0];
      }
      
      // Strategy 3: Clean common AI response patterns
      responseText = responseText
        .replace(/^[^{]*/, '') // Remove text before first {
        .replace(/[^}]*$/, '') // Remove text after last }
        .replace(/^\s*JSON:\s*/, '') // Remove "JSON:" prefix
        .replace(/^\s*Response:\s*/, '') // Remove "Response:" prefix
        .trim();
      
      console.log('Cleaned response:', responseText);
      
      // Strategy 4: Parse JSON
      aiData = JSON.parse(responseText);
      
      // Strategy 5: Validate and fix required fields
      const requiredFields = {
        'german': 'Unknown word',
        'vietnamese': 'Từ chưa xác định', 
        'type': 'NOMEN',
        'level': 'A1',
        'phonetic': '/unknown/',
        'plural': '-',
        'exampleGerman': `Das ist ${word}.`,
        'exampleVietnamese': `Đây là ${word}.`
      };
      
      for (const [field, defaultValue] of Object.entries(requiredFields)) {
        if (!aiData[field] || aiData[field].trim() === '') {
          aiData[field] = defaultValue;
          console.log(`Fixed missing field ${field} with default: ${defaultValue}`);
        }
      }
      
      // Normalize type field
      if (aiData.type) {
        aiData.type = aiData.type.toUpperCase();
        // Map PHRASE to OTHER since it's not in our enum
        if (aiData.type === 'PHRASE') {
          aiData.type = 'OTHER';
        }
        if (!['NOMEN', 'VERB', 'ADJEKTIV', 'ADVERB', 'PRONOUN', 'PREPOSITION', 'CONJUNCTION', 'OTHER'].includes(aiData.type)) {
          aiData.type = 'OTHER'; // Default fallback for unsupported types
        }
      }
      
      // Normalize level field
      if (aiData.level) {
        aiData.level = aiData.level.toUpperCase();
        if (!['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(aiData.level)) {
          aiData.level = 'A1'; // Default fallback
        }
      }
      
      console.log('Processed AI data:', aiData);
      
    } catch (parseError) {
      console.error('JSON parsing failed, trying simple translation fallback...');
      console.error('Parse error:', parseError);
      console.error('Original response:', aiResult.result.response);
      
      // Strategy 6: Simple translation fallback - try to get basic translation
      try {
        console.log('Attempting simple translation for:', word);
        
        // Try a simpler prompt for just translation using the same provider logic
        const simplePrompt = `Translate the German word "${word}" to Vietnamese. Respond with just the Vietnamese translation, nothing else.`;
        
        // Use the same provider from previous attempt
        const simpleResponse = await fetch(`/api/admin/ai-providers/${config.preferredProviderId}/test`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ testPrompt: simplePrompt })
        });
        
        if (simpleResponse.ok) {
          const simpleResult = await simpleResponse.json();
          
          if (simpleResult.success && simpleResult.result?.response) {
            const vietnameseTranslation = simpleResult.result.response.trim()
              .replace(/["""'']/g, '') // Remove quotes
              .replace(/\.$/, '') // Remove trailing period
              .trim();
            
            console.log('Got simple translation:', vietnameseTranslation);
            
            aiData = {
              german: word,
              vietnamese: vietnameseTranslation || 'chưa có nghĩa',
              phonetic: '/không xác định/',
              plural: '-',
              type: 'NOMEN',
              level: 'A1',
              exampleGerman: `Das ist ${word}.`,
              exampleVietnamese: `Đây là ${vietnameseTranslation || word}.`
            };
          } else {
            throw new Error('Simple translation API failed');
          }
        } else {
          throw new Error('Simple translation request failed');
        }
        
      } catch (simpleError) {
        console.error('Simple translation also failed:', simpleError);
        
        // Strategy 7: Complete fallback - create manual entry
        aiData = {
          german: word,
          vietnamese: 'chưa có nghĩa',
          phonetic: '/không xác định/',
          plural: '-',
          type: 'NOMEN',
          level: 'A1',
          exampleGerman: `Das ist ${word}.`,
          exampleVietnamese: `Đây là ${word}.`
        };
      }
      
      console.log('Using fallback data:', aiData);
    }

    // Track AI usage in database
    if (successfulProviderId && aiResult) {
      try {
        await prisma.aIUsage.create({
          data: {
            providerId: successfulProviderId,
            operation: 'vocabulary_search',
            model: 'default',
            promptTokens: aiResult.result.tokensUsed ? Math.round(aiResult.result.tokensUsed * 0.7) : 0,
            responseTokens: aiResult.result.tokensUsed ? Math.round(aiResult.result.tokensUsed * 0.3) : 0,
            totalTokens: aiResult.result.tokensUsed || 0,
            cost: aiResult.result.cost || 0,
            metadata: { 
              word, 
              source: 'vocabulary_search',
              parsing_success: true,
              provider_attempts: providersToTry.indexOf(successfulProviderId) + 1
            },
            success: true
          }
        });
        console.log(`Tracked AI usage: ${aiResult.result.tokensUsed || 0} tokens, $${aiResult.result.cost || 0}`);
      } catch (trackingError) {
        console.error('Failed to track AI usage:', trackingError);
      }
    }
    
    // Get or create level and topic with error handling
    let level, topic;
    try {
      level = await getOrCreateLevel(aiData.level)
      const topicSlug = classifyTopic(aiData.german, aiData.vietnamese, aiData.type)
      topic = await getOrCreateTopic(topicSlug, level.id)
      console.log(`Level: ${level.name}, Topic: ${topic.slug}`);
    } catch (levelTopicError) {
      console.error('Error creating level/topic:', levelTopicError);
      // Fallback to default level/topic
      level = await getOrCreateLevel('A1');
      topic = await getOrCreateTopic('allgemein', level.id);
    }
    
    // Save to database with comprehensive error handling
    let newVocabulary;
    try {
      if (existingWord && 
          (existingWord.vietnamese === 'chưa có nghĩa' || 
           existingWord.vietnamese === 'Từ mới (cần bổ sung)' ||
           existingWord.phonetic === '/không xác định/' ||
           existingWord.phonetic === '' ||
           !existingWord.phonetic)) {
        // Update existing incomplete entry
        newVocabulary = await prisma.vocabularyEntry.update({
          where: { id: existingWord.id },
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
            frequency: existingWord.frequency + 1, // Increment frequency
            tags: []
          },
          include: {
            level: true,
            topic: true
          }
        })
        console.log(`Updated existing vocabulary: ${aiData.german} -> ${aiData.vietnamese}`)
      } else {
        // Create new entry
        newVocabulary = await prisma.vocabularyEntry.create({
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
        console.log(`Saved new vocabulary: ${aiData.german} -> ${aiData.vietnamese}`)
      }
      
    } catch (saveError) {
      console.error('Error saving vocabulary to database:', saveError);
      
      // Return AI data without saving if database fails
      const responseData = {
        id: 'temp-' + Date.now(),
        word: aiData.german,
        pronunciation: aiData.phonetic,
        partOfSpeech: aiData.type,
        level: aiData.level as 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2',
        definitions: {
          german: aiData.german,
          vietnamese: aiData.vietnamese,
        },
        examples: [{
          german: aiData.exampleGerman,
          vietnamese: aiData.exampleVietnamese,
        }],
        tags: [],
        difficulty: 3,
        frequency: 1,
        plural: aiData.plural,
        createdAt: new Date(),
        updatedAt: new Date(),
        source: 'ai_generated' as const
      };
      
      return NextResponse.json({
        success: true,
        data: responseData,
        source: 'ai_generated',
        warning: 'Created by AI but not saved to database due to error'
      });
    }
    
    // Transform database model to match VocabularyEntry interface (only if successfully saved)
    if (newVocabulary) {
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
        tags: [],
        difficulty: newVocabulary.difficulty,
        frequency: newVocabulary.frequency,
        plural: newVocabulary.plural,
        createdAt: newVocabulary.createdAt,
        updatedAt: newVocabulary.updatedAt,
        source: 'ai_generated' as const
      }
      
      // Determine if this was an update or create
      const isUpdate = existingWord && 
        (existingWord.vietnamese === 'chưa có nghĩa' || 
         existingWord.vietnamese === 'Từ mới (cần bổ sung)' ||
         existingWord.phonetic === '/không xác định/' ||
         existingWord.phonetic === '' ||
         !existingWord.phonetic);
      
      return NextResponse.json({
        success: true,
        data: transformedEntry,
        source: isUpdate ? 'ai_updated' : 'ai_generated'
      })
    }
    
    // This should not be reached due to early returns in catch blocks
    throw new Error('Unexpected state: newVocabulary is undefined')
    
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
