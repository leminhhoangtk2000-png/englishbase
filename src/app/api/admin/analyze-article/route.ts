import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { articleId, providerId } = await request.json();

    if (!articleId) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    // Get the article
    const article = await prisma.newsArticle.findUnique({
      where: { id: articleId }
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Get AI provider if specified, otherwise use first active one
    let provider;
    if (providerId) {
      provider = await prisma.aIProvider.findUnique({
        where: { id: providerId }
      });
    } else {
      provider = await prisma.aIProvider.findFirst({
        where: { isActive: true }
      });
    }

    if (!provider) {
      return NextResponse.json({ error: 'No active AI provider found' }, { status: 404 });
    }

    // Create AI analysis prompt
    const analysisPrompt = `
Analyze this German news article for interest and educational value. Rate from 0.0 to 1.0:

Title: ${article.title}
Source: ${article.source}
Content: ${article.content.substring(0, 2000)}...

Criteria:
1. Current events relevance (0.3 weight)
2. Educational value for German learners (0.3 weight) 
3. Unique/interesting content (0.2 weight)
4. Cultural significance (0.2 weight)

Return ONLY a JSON object:
{
  "score": 0.0-1.0,
  "reasoning": "brief explanation in English",
  "isHot": true/false,
  "tags": ["tag1", "tag2", "tag3"]
}

Articles scoring 0.7+ should be marked as "hot".
`;

    const startTime = Date.now();
    let analysisResult;

    try {
      // Call AI based on provider type
      switch (provider.name) {
        case 'openai':
          analysisResult = await analyzeWithOpenAI(provider, analysisPrompt);
          break;
        case 'gemini':
          analysisResult = await analyzeWithGemini(provider, analysisPrompt);
          break;
        case 'claude':
          analysisResult = await analyzeWithClaude(provider, analysisPrompt);
          break;
        default:
          throw new Error(`Unsupported provider: ${provider.name}`);
      }

      const responseTime = Date.now() - startTime;

      // Parse AI response
      let parsedResult;
      try {
        parsedResult = JSON.parse(analysisResult.response);
      } catch (e) {
        // Fallback if AI doesn't return valid JSON
        parsedResult = {
          score: 0.5,
          reasoning: "AI analysis parsing failed",
          isHot: false,
          tags: ["general"]
        };
      }

      // Update article with AI analysis
      const updatedArticle = await prisma.newsArticle.update({
        where: { id: articleId },
        data: {
          isHot: parsedResult.isHot || parsedResult.score >= 0.7,
          hotScore: parsedResult.score,
          aiAnalysis: parsedResult.reasoning,
          analyzedAt: new Date(),
          tags: parsedResult.tags || []
        }
      });

      return NextResponse.json({
        success: true,
        article: {
          id: updatedArticle.id,
          title: updatedArticle.title,
          isHot: updatedArticle.isHot,
          hotScore: updatedArticle.hotScore,
          aiAnalysis: updatedArticle.aiAnalysis,
          tags: updatedArticle.tags
        },
        analysis: parsedResult,
        responseTime,
        provider: provider.displayName
      });

    } catch (error: any) {
      console.error('Error in AI analysis:', error);
      
      // Save failed analysis attempt
      await prisma.newsArticle.update({
        where: { id: articleId },
        data: {
          aiAnalysis: `Analysis failed: ${error.message || 'Unknown error'}`,
          analyzedAt: new Date()
        }
      });

      return NextResponse.json({
        success: false,
        error: error.message || 'AI analysis failed',
        responseTime: Date.now() - startTime
      });
    }

  } catch (error) {
    console.error('Error analyzing article:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// AI Provider Functions
async function analyzeWithOpenAI(provider: any, prompt: string) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${provider.apiKey}`
    },
    body: JSON.stringify({
      model: provider.defaultModel || 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return { response: data.choices[0]?.message?.content || 'No response' };
}

async function analyzeWithGemini(provider: any, prompt: string) {
  const modelName = provider.defaultModel || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${provider.apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 500
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return { response: data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response' };
}

async function analyzeWithClaude(provider: any, prompt: string) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': provider.apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: provider.defaultModel || 'claude-3-haiku-20240307',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Claude API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  return { response: data.content?.[0]?.text || 'No response' };
}
