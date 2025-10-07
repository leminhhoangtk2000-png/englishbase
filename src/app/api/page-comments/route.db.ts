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

    // Fetch real comments from database
    const comments = await prisma.pageComment.findMany({
      where: {
        contentId: identifier,
        isDeleted: false,
        isApproved: true,
        parentId: null // Only top-level comments
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            avatar: true,
            username: true
          }
        },
        replies: {
          where: {
            isDeleted: false,
            isApproved: true
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatar: true,
                username: true
              }
            },
            _count: {
              select: { likes_records: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        _count: {
          select: { likes_records: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Transform data to match frontend interface
    const transformedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      author: {
        id: comment.isGuest ? comment.guestId : comment.author?.id,
        name: comment.authorName,
        avatar: comment.author?.avatar || null,
        isGuest: comment.isGuest
      },
      createdAt: comment.createdAt.toISOString(),
      likes: comment._count.likes_records,
      isLiked: false, // TODO: Check if current user liked this comment
      replies: comment.replies.map(reply => ({
        id: reply.id,
        content: reply.content,
        author: {
          id: reply.isGuest ? reply.guestId : reply.author?.id,
          name: reply.authorName,
          avatar: reply.author?.avatar || null,
          isGuest: reply.isGuest
        },
        createdAt: reply.createdAt.toISOString(),
        likes: reply._count.likes_records,
        isLiked: false
      }))
    }));

    return NextResponse.json({
      success: true,
      comments: transformedComments,
      total: comments.length
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contentId, content, authorName, authorEmail, parentId } = body;

    if (!contentId || !content || !authorName) {
      return NextResponse.json(
        { error: 'contentId, content, and authorName are required' },
        { status: 400 }
      );
    }

    // Get client IP for guest ID
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               '127.0.0.1';
    const guestId = generateGuestId(ip);

    // Create new comment in database
    const newComment = await prisma.pageComment.create({
      data: {
        contentId,
        content,
        authorName,
        authorEmail,
        guestId,
        isGuest: true, // For now, assume all are guest users
        parentId: parentId || null
      },
      include: {
        _count: {
          select: { likes_records: true }
        }
      }
    });

    // Transform response to match frontend interface
    const responseComment = {
      id: newComment.id,
      content: newComment.content,
      author: {
        id: newComment.guestId,
        name: newComment.authorName,
        avatar: null,
        isGuest: true
      },
      createdAt: newComment.createdAt.toISOString(),
      likes: 0,
      isLiked: false,
      replies: []
    };

    return NextResponse.json({
      success: true,
      comment: responseComment
    });

  } catch (error) {
    console.error('Error creating comment:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      contentId,
      authorName
    });
    return NextResponse.json(
      { error: 'Failed to create comment', details: error.message },
      { status: 500 }
    );
  }
}
