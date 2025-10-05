import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-server';

export const dynamic = 'force-dynamic';

// GET /api/comments?type=article&id=a1/Grammatik/wfragen
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const commentableType = searchParams.get('type');
    const commentableId = searchParams.get('id');

    if (!commentableType || !commentableId) {
      return NextResponse.json(
        { error: 'Missing type or id parameter' },
        { status: 400 }
      );
    }

    // Validate commentableType
    const validTypes = ['article', 'exercise', 'vocabulary', 'news', 'post'];
    if (!validTypes.includes(commentableType)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Fetch comments using raw SQL
    const comments = await prisma.$queryRaw<any[]>`
      SELECT 
        c.id,
        c."userId",
        c."commentableType",
        c."commentableId",
        c.content,
        c."parentId",
        c."isApproved",
        c."isEdited",
        c."editedAt",
        c."createdAt",
        c."updatedAt",
        u.id as "user_id",
        u.name as "user_name",
        u.username as "user_username",
        u.avatar as "user_avatar",
        (
          SELECT COUNT(*)::int
          FROM comments r
          WHERE r."parentId" = c.id AND r."isApproved" = TRUE
        ) as "replyCount"
      FROM comments c
      LEFT JOIN users u ON c."userId" = u.id
      WHERE 
        c."commentableType" = ${commentableType}
        AND c."commentableId" = ${commentableId}
        AND c."isApproved" = TRUE
        AND c."parentId" IS NULL
      ORDER BY c."createdAt" DESC
    `;

    // Transform response
    const transformedComments = comments.map(c => ({
      id: c.id,
      userId: c.userId,
      commentableType: c.commentableType,
      commentableId: c.commentableId,
      content: c.content,
      parentId: c.parentId,
      isApproved: c.isApproved,
      isEdited: c.isEdited,
      editedAt: c.editedAt,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      user: {
        id: c.user_id,
        name: c.user_name,
        username: c.user_username,
        avatar: c.user_avatar,
      },
      replyCount: c.replyCount
    }));

    return NextResponse.json({
      comments: transformedComments,
      total: transformedComments.length
    });

  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    );
  }
}

// POST /api/comments - Create new comment
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    // 🔧 TEMPORARY: Use test user if not logged in
    const userId = currentUser?.id || 'user_test_1';
    
    const body = await request.json();
    const { commentableType, commentableId, content, parentId } = body;

    // Validation
    if (!commentableType || !commentableId || !content) {
      return NextResponse.json(
        { error: 'Missing required fields: commentableType, commentableId, content' },
        { status: 400 }
      );
    }

    const validTypes = ['article', 'exercise', 'vocabulary', 'news', 'post'];
    if (!validTypes.includes(commentableType)) {
      return NextResponse.json(
        { error: `Invalid type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    if (content.trim().length < 3) {
      return NextResponse.json(
        { error: 'Comment must be at least 3 characters' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Comment must be less than 1000 characters' },
        { status: 400 }
      );
    }

    // If parentId exists, verify parent comment
    if (parentId) {
      const [parentComment] = await prisma.$queryRaw<any[]>`
        SELECT id FROM comments WHERE id = ${parentId}
      `;
      
      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }
    }

    // Create comment
    const commentId = `cmt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    await prisma.$executeRaw`
      INSERT INTO comments (
        id, "userId", "commentableType", "commentableId", 
        content, "parentId", "isApproved", "createdAt", "updatedAt"
      )
      VALUES (
        ${commentId}, ${userId}, ${commentableType}, ${commentableId},
        ${content}, ${parentId || null}, FALSE, NOW(), NOW()
      )
    `;

    // Fetch created comment
    const [newComment] = await prisma.$queryRaw<any[]>`
      SELECT 
        c.*,
        u.name as "user_name",
        u.username as "user_username",
        u.avatar as "user_avatar"
      FROM comments c
      LEFT JOIN users u ON c."userId" = u.id
      WHERE c.id = ${commentId}
    `;

    return NextResponse.json({
      success: true,
      comment: {
        ...newComment,
        user: {
          id: newComment.userId,
          name: newComment.user_name,
          username: newComment.user_username,
          avatar: newComment.user_avatar,
        }
      },
      message: 'Comment submitted successfully. It will appear after admin approval.'
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    );
  }
}
