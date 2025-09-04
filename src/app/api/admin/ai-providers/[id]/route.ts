import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const body = await request.json();
    const { id } = await params;
    const { name, displayName, apiKey, baseUrl, models, defaultModel, temperature, isActive } = body;

    const provider = await prisma.aIProvider.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(displayName && { displayName }),
        ...(apiKey && { apiKey }), // Only update if provided
        ...(baseUrl !== undefined && { baseUrl }),
        ...(models && { models }),
        ...(defaultModel && { defaultModel }),
        ...(temperature !== undefined && { temperature }),
        ...(isActive !== undefined && { isActive })
      }
    });

    // Don't return API key
    const safeProvider = {
      ...provider,
      apiKey: provider.apiKey ? '***' + provider.apiKey.slice(-4) : null
    };

    return NextResponse.json({ provider: safeProvider, success: true });
  } catch (error) {
    console.error('Error updating AI provider:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await prisma.aIProvider.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting AI provider:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
