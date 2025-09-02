import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('Starting batch analysis for Vietnamese learners...');

    // Get all unanalyzed articles
    const articles = await prisma.newsArticle.findMany({
      where: {
        analyzedAt: null,
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to avoid API timeouts
    });

    if (articles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No articles to analyze',
        analyzed: 0
      });
    }

    console.log(`Found ${articles.length} articles to analyze`);

    // Check if we have AI provider configured
    const aiProvider = await prisma.aIProvider.findFirst({
      where: { 
        isActive: true,
        OR: [
          { name: 'gemini' },
          { name: 'openai' }
        ]
      }
    });

    if (!aiProvider) {
      return NextResponse.json(
        { error: 'No AI provider configured for batch analysis' },
        { status: 400 }
      );
    }

    console.log(`Using AI provider: ${aiProvider.displayName}`);

    let analyzedCount = 0;
    const errors = [];
    const analysisResults = [];

    // First pass: Analyze all articles and collect scores
    for (let i = 0; i < articles.length; i++) {
      const article = articles[i];
      
      try {
        console.log(`Analyzing article ${i + 1}/${articles.length}: ${article.title.substring(0, 50)}...`);

        let analysisResult;
        
        if (aiProvider.name === 'gemini') {
          analysisResult = await analyzeWithGemini(article.title, article.excerpt || '', aiProvider.apiKey);
        } else if (aiProvider.name === 'openai') {
          analysisResult = await analyzeWithOpenAI(article.title, article.excerpt || '', aiProvider.apiKey);
        }

        if (analysisResult) {
          analysisResults.push({
            article,
            score: analysisResult.score,
            explanation: analysisResult.explanation,
            topics: analysisResult.topics || [],
            difficulty: analysisResult.difficulty || 'intermediate'
          });

          analyzedCount++;
          console.log(`✅ Article analyzed - Score: ${analysisResult.score}/10`);
        } else {
          errors.push(`Failed to analyze article: ${article.title}`);
          console.log(`❌ Failed to analyze article: ${article.title}`);
        }

        // Add delay between requests to be respectful to API
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        const errorMsg = `Error analyzing article "${article.title}": ${error instanceof Error ? error.message : 'Unknown error'}`;
        errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    // Second pass: Sort by score and select only top 3 as interesting
    analysisResults.sort((a, b) => b.score - a.score);
    const top3 = analysisResults.slice(0, 3);
    let interestingCount = 0;

    // Update all analyzed articles in database
    for (const result of analysisResults) {
      const isInteresting = top3.includes(result);
      
      await prisma.newsArticle.update({
        where: { id: result.article.id },
        data: {
          isHot: isInteresting,
          hotScore: result.score,
          aiAnalysis: result.explanation,
          analyzedAt: new Date()
        }
      });

      if (isInteresting) {
        interestingCount++;
        console.log(`🌟 Top article selected: ${result.article.title.substring(0, 50)}... (Score: ${result.score})`);
      }
    }

    console.log(`Batch analysis completed. Analyzed: ${analyzedCount}, Interesting: ${interestingCount}`);

    return NextResponse.json({
      success: true,
      message: `Batch analysis completed successfully`,
      analyzed: analyzedCount,
      interesting: interestingCount,
      total: articles.length,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (error) {
    console.error('Error in batch analysis:', error);
    return NextResponse.json(
      { error: 'Failed to perform batch analysis', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

async function analyzeWithGemini(title: string, excerpt: string, apiKey: string) {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `You are an expert German language educator specializing in teaching Vietnamese students. Analyze this German news article for its educational value for Vietnamese learners studying German.

IMPORTANT: This analysis is part of a batch process where only the TOP 3 HIGHEST-SCORING articles will be selected as "interesting". Rate strictly and competitively.

Consider these specific criteria for Vietnamese learners:

1. **Language Learning Value (40%)**: 
   - Contains useful vocabulary for Vietnamese learners
   - Demonstrates important German grammar structures
   - Uses authentic, contemporary German language
   - Appropriate difficulty level for intermediate learners

2. **Cultural Relevance for Vietnamese (30%)**:
   - Topics that Vietnamese people find engaging or relatable
   - German cultural aspects that contrast/compare with Vietnamese culture
   - Current events that matter globally or affect Vietnam-Germany relations
   - Social, economic, or political topics relevant to Vietnamese expatriates in Germany

3. **Educational Engagement (20%)**:
   - Clear, well-structured content that facilitates learning
   - Interesting subject matter that motivates continued reading
   - Real-world applicability for Vietnamese students/workers in Germany

4. **Current Relevance (10%)**:
   - Recent, timely content
   - Trending topics in German society

Article to analyze:
Title: "${title}"
Excerpt: "${excerpt}"

Rate from 1-10 (be selective - only exceptional articles should score 8+):
- 1-4: Poor/unsuitable for Vietnamese learners
- 5-6: Average, some value but not compelling  
- 7-8: Good, high educational value for Vietnamese learners
- 9-10: Excellent, must-read for Vietnamese German students

Respond in this exact JSON format:
{
  "score": 7,
  "explanation": "This article about German work culture provides excellent insights for Vietnamese professionals planning to work in Germany. The vocabulary about employment laws and workplace customs is highly practical for Vietnamese learners.",
  "topics": ["work", "culture", "society"],
  "difficulty": "intermediate"
}`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!text) {
      throw new Error('No response from Gemini');
    }

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Gemini');
    }

    const result = JSON.parse(jsonMatch[0]);
    
    return {
      score: result.score,
      explanation: result.explanation,
      topics: result.topics || [],
      difficulty: result.difficulty || 'intermediate'
    };

  } catch (error) {
    console.error('Gemini analysis error:', error);
    return null;
  }
}

async function analyzeWithOpenAI(title: string, excerpt: string, apiKey: string) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'user',
          content: `You are an expert German language educator specializing in teaching Vietnamese students. Analyze this German news article for its educational value for Vietnamese learners studying German.

IMPORTANT: This analysis is part of a batch process where only the TOP 3 HIGHEST-SCORING articles will be selected as "interesting". Rate strictly and competitively.

Consider these specific criteria for Vietnamese learners:

1. **Language Learning Value (40%)**: 
   - Contains useful vocabulary for Vietnamese learners
   - Demonstrates important German grammar structures
   - Uses authentic, contemporary German language
   - Appropriate difficulty level for intermediate learners

2. **Cultural Relevance for Vietnamese (30%)**:
   - Topics that Vietnamese people find engaging or relatable
   - German cultural aspects that contrast/compare with Vietnamese culture
   - Current events that matter globally or affect Vietnam-Germany relations
   - Social, economic, or political topics relevant to Vietnamese expatriates in Germany

3. **Educational Engagement (20%)**:
   - Clear, well-structured content that facilitates learning
   - Interesting subject matter that motivates continued reading
   - Real-world applicability for Vietnamese students/workers in Germany

4. **Current Relevance (10%)**:
   - Recent, timely content
   - Trending topics in German society

Article to analyze:
Title: "${title}"
Excerpt: "${excerpt}"

Rate from 1-10 (be selective - only exceptional articles should score 8+):
- 1-4: Poor/unsuitable for Vietnamese learners
- 5-6: Average, some value but not compelling  
- 7-8: Good, high educational value for Vietnamese learners
- 9-10: Excellent, must-read for Vietnamese German students

Respond in this exact JSON format:
{
  "score": 7,
  "explanation": "This article about German work culture provides excellent insights for Vietnamese professionals planning to work in Germany. The vocabulary about employment laws and workplace customs is highly practical for Vietnamese learners.",
  "topics": ["work", "culture", "society"],
  "difficulty": "intermediate"
}`
        }],
        temperature: 0.3,
        max_tokens: 500
      })
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content;
    
    if (!text) {
      throw new Error('No response from OpenAI');
    }

    // Parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from OpenAI');
    }

    const result = JSON.parse(jsonMatch[0]);
    
    return {
      score: result.score,
      explanation: result.explanation,
      topics: result.topics || [],
      difficulty: result.difficulty || 'intermediate'
    };

  } catch (error) {
    console.error('OpenAI analysis error:', error);
    return null;
  }
}
