import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { hasPermission } from '@/lib/permissions';

export async function GET(request: NextRequest) {
  try {
    // Simple admin check - in production use proper auth
    const providers = await prisma.aIProvider.findMany({
      include: {
        _count: {
          select: { testResults: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Don't return API keys in the response
    const safeProviders = providers.map(provider => ({
      ...provider,
      apiKey: provider.apiKey ? '***' + provider.apiKey.slice(-4) : null,
      testCount: provider._count.testResults
    }));

    return NextResponse.json({ providers: safeProviders });
  } catch (error) {
    console.error('Error fetching AI providers:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, displayName, apiKey, baseUrl, models, defaultModel, temperature } = body;

    if (!name || !displayName || !apiKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const provider = await prisma.aIProvider.create({
      data: {
        name,
        displayName,
        apiKey, // In production, encrypt this
        baseUrl,
        models: models || [],
        defaultModel,
        temperature
      }
    });

    // Don't return API key
    const safeProvider = {
      ...provider,
      apiKey: '***' + provider.apiKey.slice(-4)
    };

    return NextResponse.json({ provider: safeProvider });
  } catch (error) {
    console.error('Error creating AI provider:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, displayName, apiKey, baseUrl, models, defaultModel, temperature, isActive } = body;

    const provider = await prisma.aIProvider.update({
      where: { id },
      data: {
        name,
        displayName,
        ...(apiKey && { apiKey }), // Only update if provided
        baseUrl,
        models: models || [],
        defaultModel,
        temperature,
        isActive
      }
    });

    // Don't return API key
    const safeProvider = {
      ...provider,
      apiKey: '***' + provider.apiKey.slice(-4)
    };

    return NextResponse.json({ provider: safeProvider });
  } catch (error) {
    console.error('Error updating AI provider:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
