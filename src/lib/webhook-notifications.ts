import { prisma } from '@/lib/prisma';

interface CommentNotificationData {
  contentId: string;
  contentTitle: string;
  contentUrl: string;
  commentContent: string;
  authorName: string;
  authorEmail?: string;
  isGuest: boolean;
}

export async function sendCommentWebhook(data: CommentNotificationData) {
  try {
    // Determine content level from contentId or URL
    const level = extractLevelFromContent(data.contentId, data.contentUrl);
    
    if (!level) {
      console.log('Could not determine content level, skipping webhook');
      return;
    }

    // Get relevant webhooks for this level
    const webhooks = await prisma.webhookConfig.findMany({
      where: {
        isActive: true,
        levels: {
          contains: level
        }
      }
    });

    if (webhooks.length === 0) {
      console.log(`No active webhooks found for level ${level}`);
      return;
    }

    // Create Discord embed
    const embed = {
      title: '🆕 Bình luận mới',
      description: `Có bình luận mới trên **${data.contentTitle}**`,
      color: 0x3b82f6, // Blue color
      fields: [
        {
          name: '👤 Người dùng',
          value: data.isGuest ? `${data.authorName} (Khách)` : data.authorName,
          inline: true
        },
        {
          name: '📚 Cấp độ',
          value: level,
          inline: true
        },
        {
          name: '💬 Nội dung',
          value: data.commentContent.length > 200 
            ? `${data.commentContent.substring(0, 200)}...` 
            : data.commentContent,
          inline: false
        },
        {
          name: '🔗 Link trả lời',
          value: `[Xem và trả lời](${data.contentUrl})`,
          inline: false
        }
      ],
      footer: {
        text: 'Edu-theme Comment System'
      },
      timestamp: new Date().toISOString()
    };

    const payload = {
      content: `📢 **${level}** - Bình luận mới cần attention!`,
      embeds: [embed]
    };

    // Send to all relevant webhooks
    const promises = webhooks.map(async (webhook) => {
      try {
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        });

        if (!response.ok) {
          console.error(`Failed to send webhook to ${webhook.name}:`, response.status);
        } else {
          console.log(`✅ Webhook sent to ${webhook.name} for ${level} comment`);
        }
      } catch (error) {
        console.error(`Error sending webhook to ${webhook.name}:`, error);
      }
    });

    await Promise.all(promises);
  } catch (error) {
    console.error('Error in sendCommentWebhook:', error);
  }
}

function extractLevelFromContent(contentId: string, contentUrl: string): string | null {
  // Try to extract level from contentId (e.g., "exercise-a1/..." or "lesson-b2/...")
  const contentIdMatch = contentId.match(/(?:exercise|lesson|content)-([ab][12])/i);
  if (contentIdMatch) {
    return contentIdMatch[1].toUpperCase();
  }

  // Try to extract from URL (e.g., "/exercises/a1/..." or "/a2niveau/...")
  const urlMatch = contentUrl.match(/\/(?:exercises\/)?([ab][12])(?:niveau)?\//i);
  if (urlMatch) {
    return urlMatch[1].toUpperCase();
  }

  // Try to extract from path segments
  const pathSegments = contentUrl.split('/').filter(Boolean);
  for (const segment of pathSegments) {
    const levelMatch = segment.match(/^([ab][12])(?:niveau)?$/i);
    if (levelMatch) {
      return levelMatch[1].toUpperCase();
    }
  }

  return null;
}

// Helper function to determine webhook target based on level
export function getWebhookTarget(level: string): string {
  const upperLevel = level.toUpperCase();
  
  if (upperLevel === 'A1') {
    return 'a1';
  } else if (upperLevel === 'A2') {
    return 'a2';
  } else if (upperLevel === 'B1') {
    return 'b1';
  } else if (upperLevel === 'B2') {
    return 'b2';
  }
  
  return '';
}
