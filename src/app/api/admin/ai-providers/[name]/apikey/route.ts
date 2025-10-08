import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface UpdateKeyParams {
  params: {
    name: string;
  };
}

export async function PUT(
  request: NextRequest,
  { params }: UpdateKeyParams
) {
  try {
    const { apiKey } = await request.json();
    const { name } = params;

    if (!apiKey) {
      return NextResponse.json({ error: 'API key is required' }, { status: 400 });
    }

    // Update the provider's API key
    const provider = await prisma.aIProvider.update({
      where: { name: name },
      data: { apiKey: apiKey }
    });

    return NextResponse.json({ 
      success: true, 
      message: `${provider.displayName} API key updated successfully` 
    });
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json(
      { error: 'Failed to update API key' },
      { status: 500 }
    );
  }
}
