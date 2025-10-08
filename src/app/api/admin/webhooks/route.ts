import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const webhooks = await prisma.webhookConfig.findMany({
      orderBy: { id: 'asc' }
    });
    return NextResponse.json(webhooks);
  } catch (error) {
    console.error('Error fetching webhooks:', error);
    return NextResponse.json({ error: 'Failed to fetch webhooks' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, name, url, levels, isActive } = body;

    if (!id || !name || !url || !levels) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const webhook = await prisma.webhookConfig.upsert({
      where: { id },
      create: {
        id,
        name,
        url,
        levels: levels.join(','),
        isActive: isActive ?? true
      },
      update: {
        name,
        url,
        levels: levels.join(','),
        isActive: isActive ?? true
      }
    });

    return NextResponse.json(webhook);
  } catch (error) {
    console.error('Error saving webhook:', error);
    return NextResponse.json({ error: 'Failed to save webhook' }, { status: 500 });
  }
}
