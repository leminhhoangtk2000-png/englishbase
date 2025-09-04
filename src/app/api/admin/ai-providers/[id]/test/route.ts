import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface TestParams {
  params: Promise<{
    id: string;
  }>;
}

export async function POST(
  request: NextRequest,
  { params }: TestParams
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { testPrompt = "Hello, this is a test message. Please respond with 'Test successful'." } = body;

    // Get provider from database
    const provider = await prisma.aIProvider.findUnique({
      where: { id }
    });

    if (!provider) {
      return NextResponse.json(
        { success: false, error: 'Provider not found' },
        { status: 404 }
      );
    }

    const startTime = Date.now();
    let testResult: any = {
      providerId: id,
      model: provider.defaultModel || provider.models[0] || 'unknown',
      prompt: testPrompt,
      success: false,
      responseTime: 0,
      tokensUsed: 0,
      cost: 0,
    };

    try {
      // Test the AI provider based on its type
      let response: any;
      let apiResponse: string = '';
      let tokensUsed = 0;
      
      if (provider.name === 'openai') {
        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${provider.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: provider.defaultModel || 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: testPrompt }],
            max_tokens: 100,
            temperature: provider.temperature || 0.7,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        apiResponse = data.choices[0]?.message?.content || 'No response';
        tokensUsed = data.usage?.total_tokens || 0;
        
      } else if (provider.name === 'gemini') {
        const apiKey = provider.apiKey;
        const model = provider.defaultModel || 'gemini-pro';
        
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: testPrompt }]
            }],
            generationConfig: {
              temperature: provider.temperature || 0.7,
              maxOutputTokens: 100,
            }
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Gemini API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        apiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
        tokensUsed = data.usageMetadata?.totalTokenCount || 0;
        
      } else if (provider.name === 'claude') {
        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': provider.apiKey,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: provider.defaultModel || 'claude-3-haiku-20240307',
            max_tokens: 100,
            messages: [{ role: 'user', content: testPrompt }],
            temperature: provider.temperature || 0.7,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Claude API error: ${response.status} - ${errorText}`);
        }

        const data = await response.json();
        apiResponse = data.content?.[0]?.text || 'No response';
        tokensUsed = data.usage?.input_tokens + data.usage?.output_tokens || 0;
        
      } else {
        throw new Error(`Provider type '${provider.name}' not supported for testing`);
      }

      const responseTime = Date.now() - startTime;
      
      // Calculate estimated cost (rough estimates)
      let cost = 0;
      if (provider.name === 'openai') {
        // Rough pricing for GPT models (per 1K tokens)
        const pricePerToken = provider.defaultModel?.includes('gpt-4') ? 0.00003 : 0.000002;
        cost = tokensUsed * pricePerToken;
      } else if (provider.name === 'gemini') {
        // Gemini pricing is generally lower
        cost = tokensUsed * 0.000001;
      } else if (provider.name === 'claude') {
        // Claude pricing
        cost = tokensUsed * 0.000008;
      }

      testResult = {
        ...testResult,
        response: apiResponse,
        success: true,
        responseTime,
        tokensUsed,
        cost: parseFloat(cost.toFixed(6)),
      };

    } catch (error: any) {
      const responseTime = Date.now() - startTime;
      testResult = {
        ...testResult,
        error: error.message,
        success: false,
        responseTime,
      };
    }

    // Save test result to database
    const savedResult = await prisma.aITestResult.create({
      data: testResult
    });

    return NextResponse.json({
      success: true,
      result: savedResult
    });

  } catch (error: any) {
    console.error('Error testing provider:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
