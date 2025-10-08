import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-server';
import { sendCommentWebhook } from '@/lib/webhook-notifications';

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

    // Check if identifier exists
    if (!identifier) {
      return NextResponse.json(
        { error: 'Missing contentId or pageUrl parameter' },
        { status: 400 }
      );
    }

    // Fetch real comments from database
    const comments = await prisma.pageComment.findMany({
      where: {
        contentId: identifier,
        isDeleted: false,
        isApproved: true,
        parentId: null, // Only top-level comments
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        replies: {
          where: {
            isDeleted: false,
            isApproved: true,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        _count: {
          select: {
            likes_records: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform to match frontend interface
    const transformedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      author: {
        id: comment.author?.id || comment.guestId || 'guest',
        name: comment.author?.name || comment.authorName,
        avatar: comment.author?.avatar || null,
        isGuest: comment.isGuest,
      },
      createdAt: comment.createdAt.toISOString(),
      likes: comment._count.likes_records,
      isLiked: false, // TODO: Check if current user liked this comment
      parentId: comment.parentId,
      replies: comment.replies.map(reply => ({
        id: reply.id,
        content: reply.content,
        author: {
          id: reply.author?.id || reply.guestId || 'guest',
          name: reply.author?.name || reply.authorName,
          avatar: reply.author?.avatar || null,
          isGuest: reply.isGuest,
        },
        createdAt: reply.createdAt.toISOString(),
        likes: 0, // Replies don't show likes for now
        isLiked: false,
      })),
    }));

    return NextResponse.json({
      success: true,
      comments: transformedComments,
      total: transformedComments.length
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
    // Check authentication first
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required. Please login to post comments.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { pageUrl, contentId, content, parentId } = body;

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

    const identifier = contentId || pageUrl;

    // Create comment in database
    const newComment = await prisma.pageComment.create({
      data: {
        contentId: identifier,
        content: content.trim(),
        authorId: currentUser.id,
        authorName: currentUser.name || currentUser.username || 'User',
        isGuest: false,
        parentId: parentId || null,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        _count: {
          select: {
            likes_records: true,
          },
        },
      },
    });

    // Transform to match frontend interface
    const transformedComment = {
      id: newComment.id,
      content: newComment.content,
      author: {
        id: newComment.author?.id || currentUser.id,
        name: newComment.author?.name || currentUser.name || 'User',
        avatar: newComment.author?.avatar || null,
        isGuest: false,
      },
      createdAt: newComment.createdAt.toISOString(),
      likes: newComment._count.likes_records,
      isLiked: false,
      parentId: newComment.parentId,
      replies: [],
    };

    // Send webhook notification (async, don't wait)
    const contentUrl = pageUrl || identifier;
    const contentTitle = extractContentTitle(contentUrl, identifier);
    
    sendCommentWebhook({
      contentId: identifier,
      contentTitle,
      contentUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9003'}${contentUrl.startsWith('/') ? contentUrl : `/${contentUrl}`}`,
      commentContent: newComment.content,
      authorName: newComment.authorName,
      authorEmail: currentUser.email,
      isGuest: false
    }).catch(error => {
      console.error('Failed to send webhook notification:', error);
    });

    return NextResponse.json({
      success: true,
      comment: transformedComment,
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

// Helper function to extract content title from URL/contentId
function extractContentTitle(contentUrl: string, contentId: string): string {
  // Try to extract from contentId first
  if (contentId.startsWith('exercise-')) {
    const parts = contentId.replace('exercise-', '').split('/');
    if (parts.length >= 3) {
      return `${parts[0].toUpperCase()} - ${parts[1]} - ${decodeURIComponent(parts[2])}`;
    }
  }

  // Try to extract from URL
  const urlParts = contentUrl.split('/').filter(Boolean);
  if (urlParts.includes('exercises') && urlParts.length >= 3) {
    const exerciseIndex = urlParts.indexOf('exercises');
    if (exerciseIndex >= 0 && urlParts.length > exerciseIndex + 2) {
      const level = urlParts[exerciseIndex + 1];
      const category = urlParts[exerciseIndex + 2];
      const title = urlParts[exerciseIndex + 3] || 'Exercise';
      return `${level.toUpperCase()} - ${category} - ${decodeURIComponent(title)}`;
    }
  }

  // For A1/A2/B1/B2 niveau content
  const niveauMatch = contentUrl.match(/\/([ab][12])niveau\//i);
  if (niveauMatch) {
    return `${niveauMatch[1].toUpperCase()} - Lesson Content`;
  }

  // Fallback
  return contentUrl.split('/').pop()?.replace(/-/g, ' ') || 'Content';
}
