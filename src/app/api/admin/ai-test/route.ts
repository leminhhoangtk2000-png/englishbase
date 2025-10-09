import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Test different AI providers
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { providerId, prompt, model, temperature } = body;

    if (!providerId || !prompt) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const provider = await prisma.aIProvider.findUnique({
      where: { id: providerId }
    });

    if (!provider) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }

    const startTime = Date.now();
    let testResult;

    try {
      let response, tokensUsed, cost;

      switch (provider.name) {
        case 'openai':
          ({ response, tokensUsed, cost } = await testOpenAI(provider, prompt, model, temperature));
          break;
        case 'gemini':
          ({ response, tokensUsed, cost } = await testGemini(provider, prompt, model, temperature));
          break;
        case 'claude':
          ({ response, tokensUsed, cost } = await testClaude(provider, prompt, model, temperature));
          break;
        default:
          throw new Error(`Unsupported provider: ${provider.name}`);
      }

      const responseTime = Date.now() - startTime;

      // Save test result
      testResult = await prisma.aITestResult.create({
        data: {
          providerId,
          model: model || provider.defaultModel || 'default',
          prompt,
          response,
          success: true,
          responseTime,
          tokensUsed,
          cost
        }
      });

      return NextResponse.json({
        success: true,
        response,
        responseTime,
        tokensUsed,
        cost,
        testId: testResult.id
      });

    } catch (error: any) {
      const responseTime = Date.now() - startTime;

      // Save failed test result
      testResult = await prisma.aITestResult.create({
        data: {
          providerId,
          model: model || provider.defaultModel || 'default',
          prompt,
          success: false,
          error: error.message,
          responseTime
        }
      });

      return NextResponse.json({
        success: false,
        error: error.message,
        responseTime,
        testId: testResult.id
      });
    }

  } catch (error: any) {
    console.error('Error testing AI provider:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error: ' + error.message 
    }, { status: 500 });
  }
}

async function testOpenAI(provider: any, prompt: string, model?: string, temperature?: number) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${provider.apiKey}`
    },
    body: JSON.stringify({
      model: model || provider.defaultModel || 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: temperature ?? provider.temperature ?? 0.7,
      max_tokens: 5000 // Fixed limit
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const responseText = data.choices[0]?.message?.content || 'No response';
  const tokensUsed = data.usage?.total_tokens || 0;
  
  // Rough cost calculation (GPT-3.5-turbo pricing)
  const cost = tokensUsed * 0.000002; // $0.002 per 1K tokens

  return { response: responseText, tokensUsed, cost };
}

async function testGemini(provider: any, prompt: string, model?: string, temperature?: number) {
  const modelName = model || provider.defaultModel || 'gemini-pro';
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
        temperature: temperature ?? provider.temperature ?? 0.7,
        maxOutputTokens: 5000 // Fixed limit
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Gemini API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
  const tokensUsed = data.usageMetadata?.totalTokenCount || 0;
  
  // Rough cost calculation (Gemini Pro pricing)
  const cost = tokensUsed * 0.000001; // $0.001 per 1K tokens

  return { response: responseText, tokensUsed, cost };
}

async function testClaude(provider: any, prompt: string, model?: string, temperature?: number) {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': provider.apiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: model || provider.defaultModel || 'claude-3-sonnet-20240229',
      messages: [{ role: 'user', content: prompt }],
      temperature: temperature ?? provider.temperature ?? 0.7,
      max_tokens: 5000 // Fixed limit
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Claude API error: ${error.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const responseText = data.content?.[0]?.text || 'No response';
  const tokensUsed = data.usage?.input_tokens + data.usage?.output_tokens || 0;
  
  // Rough cost calculation (Claude pricing)
  const cost = tokensUsed * 0.000015; // $0.015 per 1K tokens

  return { response: responseText, tokensUsed, cost };
}
