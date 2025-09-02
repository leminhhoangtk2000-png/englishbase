import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId } = body;

    if (!articleId) {
      return NextResponse.json(
        { error: 'Article ID is required' },
        { status: 400 }
      );
    }

    // Get the article
    const article = await prisma.newsArticle.findUnique({
      where: { id: articleId }
    });

    if (!article) {
      return NextResponse.json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

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
        { error: 'No AI provider configured' },
        { status: 400 }
      );
    }

    let analysisResult;
    
    if (aiProvider.name === 'gemini') {
      analysisResult = await analyzeWithGemini(article.title, article.excerpt || '', aiProvider.apiKey);
    } else if (aiProvider.name === 'openai') {
      analysisResult = await analyzeWithOpenAI(article.title, article.excerpt || '', aiProvider.apiKey);
    }

    if (!analysisResult) {
      return NextResponse.json(
        { error: 'AI analysis failed' },
        { status: 500 }
      );
    }

    // Update article with analysis results
    const updatedArticle = await prisma.newsArticle.update({
      where: { id: articleId },
      data: {
        isHot: analysisResult.isInteresting,
        hotScore: analysisResult.score,
        aiAnalysis: analysisResult.explanation,
        analyzedAt: new Date()
      }
    });

    // Note: AIProvider model doesn't have tokensUsed field, so we skip this for now
    // This can be added to the schema if needed for tracking usage

    return NextResponse.json({ 
      success: true, 
      article: updatedArticle,
      analysis: analysisResult
    });

  } catch (error) {
    console.error('Error analyzing article:', error);
    return NextResponse.json(
      { error: 'Failed to analyze article', details: error instanceof Error ? error.message : 'Unknown error' },
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
            text: `Analyze this German news article for Vietnamese learners studying German. Consider:

1. Language learning value (vocabulary, grammar complexity)
2. Cultural relevance for Vietnamese people
3. Current events significance
4. Educational potential

Title: "${title}"
Excerpt: "${excerpt}"

Rate from 1-10 how interesting this would be for Vietnamese German learners and explain why.
Respond in this exact JSON format:
{
  "score": 8,
  "isInteresting": true,
  "explanation": "This article about German economy would be very relevant for Vietnamese learners because...",
  "topics": ["economy", "culture", "language"],
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
      isInteresting: result.score >= 7,
      score: result.score,
      explanation: result.explanation,
      topics: result.topics || [],
      difficulty: result.difficulty || 'intermediate',
      tokensUsed: 150
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
          content: `Analyze this German news article for Vietnamese learners studying German. Consider:

1. Language learning value (vocabulary, grammar complexity)
2. Cultural relevance for Vietnamese people  
3. Current events significance
4. Educational potential

Title: "${title}"
Excerpt: "${excerpt}"

Rate from 1-10 how interesting this would be for Vietnamese German learners and explain why.
Respond in this exact JSON format:
{
  "score": 8,
  "isInteresting": true,
  "explanation": "This article about German economy would be very relevant for Vietnamese learners because...",
  "topics": ["economy", "culture", "language"],
  "difficulty": "intermediate"
}`
        }],
        temperature: 0.3,
        max_tokens: 300
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
      isInteresting: result.score >= 7,
      score: result.score,
      explanation: result.explanation,
      topics: result.topics || [],
      difficulty: result.difficulty || 'intermediate',
      tokensUsed: data.usage?.total_tokens || 200
    };

  } catch (error) {
    console.error('OpenAI analysis error:', error);
    return null;
  }
}
