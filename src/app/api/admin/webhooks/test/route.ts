import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { webhookId, message } = body;

    if (!webhookId) {
      return NextResponse.json({ error: 'webhookId is required' }, { status: 400 });
    }

    // Get webhook config
    const webhook = await prisma.webhookConfig.findUnique({
      where: { id: webhookId }
    });

    if (!webhook || !webhook.isActive) {
      return NextResponse.json({ error: 'Webhook not found or inactive' }, { status: 404 });
    }

    // Send test message to Discord
    const discordPayload = {
      content: message || `🧪 Test webhook cho ${webhook.name}`,
      embeds: [{
        title: '🔔 Test Webhook',
        description: `Webhook **${webhook.name}** đang hoạt động bình thường!`,
        color: 0x00ff00,
        fields: [
          {
            name: 'Cấp độ',
            value: webhook.levels.replace(/,/g, ', '),
            inline: true
          },
          {
            name: 'Thời gian',
            value: new Date().toLocaleString('vi-VN'),
            inline: true
          }
        ],
        footer: {
          text: 'Edu-theme Webhook System'
        }
      }]
    };

    const response = await fetch(webhook.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(discordPayload)
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.status}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error testing webhook:', error);
    return NextResponse.json({ error: 'Failed to test webhook' }, { status: 500 });
  }
}
