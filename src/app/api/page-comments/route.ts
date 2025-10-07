import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper function to generate simple user ID from IP
function generateGuestId(ip: string): string {
  return `guest_${Buffer.from(ip).toString('base64').slice(0, 8)}`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageUrl = searchParams.get('pageUrl');
    const contentId = searchParams.get('contentId');

    if (!pageUrl && !contentId) {
      return NextResponse.json(
        { error: 'pageUrl or contentId is required' },
        { status: 400 }
      );
    }

    // Use contentId or pageUrl as identifier
    const identifier = contentId || pageUrl;

    // For now, return mock data - can be replaced with real database later
    const mockComments = [
      {
        id: `${identifier}_1`,
        content: 'Bài viết rất hay và bổ ích! Cảm ơn tác giả đã chia sẻ.',
        author: {
          id: 'guest_1',
          name: 'Người đọc A',
          avatar: null,
          isGuest: true
        },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        likes: 3,
        isLiked: false,
        replies: [
          {
            id: `${identifier}_1_1`,
            content: 'Đồng ý! Tôi cũng học được nhiều điều mới.',
            author: {
              id: 'guest_2',
              name: 'Người đọc B',
              avatar: null,
              isGuest: true
            },
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
            likes: 1,
            isLiked: false
          }
        ]
      },
      {
        id: `${identifier}_2`,
        content: 'Có thể giải thích thêm về phần này không ạ? Tôi chưa hiểu lắm.',
        author: {
          id: 'guest_3',
          name: 'Học viên C',
          avatar: null,
          isGuest: true
        },
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        likes: 0,
        isLiked: false,
        replies: []
      }
    ];

    return NextResponse.json({
      success: true,
      comments: mockComments,
      total: mockComments.length
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pageUrl, contentId, content, authorName, parentId } = body;

    // Validation
    if (!pageUrl && !contentId) {
      return NextResponse.json(
        { error: 'pageUrl or contentId is required' },
        { status: 400 }
      );
    }

    if (!content || content.trim().length < 3) {
      return NextResponse.json(
        { error: 'Comment content must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (!authorName || authorName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Author name must be at least 2 characters' },
        { status: 400 }
      );
    }

    // Get IP address for guest ID
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : '127.0.0.1';
    
    const identifier = contentId || pageUrl;
    const guestId = generateGuestId(ip);

    // Create new comment (mock for now)
    const newComment = {
      id: `${identifier}_${Date.now()}`,
      content: content.trim(),
      author: {
        id: guestId,
        name: authorName.trim(),
        avatar: null,
        isGuest: true
      },
      createdAt: new Date().toISOString(),
      likes: 0,
      isLiked: false,
      parentId: parentId || null,
      replies: []
    };

    return NextResponse.json({
      success: true,
      comment: newComment,
      message: 'Comment posted successfully!'
    });

  } catch (error) {
    console.error('Error posting comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
