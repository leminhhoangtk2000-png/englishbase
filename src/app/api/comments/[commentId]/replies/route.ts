import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// GET /api/comments/[commentId]/replies - Get replies for a comment
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const { commentId } = await params;

    // Fetch replies using raw SQL
    const replies = await prisma.$queryRaw<any[]>`
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
        u.avatar as "user_avatar"
      FROM comments c
      LEFT JOIN users u ON c."userId" = u.id
      WHERE 
        c."parentId" = ${commentId}
        AND c."isApproved" = TRUE
      ORDER BY c."createdAt" ASC
    `;

    // Transform response
    const transformedReplies = replies.map(r => ({
      id: r.id,
      userId: r.userId,
      commentableType: r.commentableType,
      commentableId: r.commentableId,
      content: r.content,
      parentId: r.parentId,
      isApproved: r.isApproved,
      isEdited: r.isEdited,
      editedAt: r.editedAt,
      createdAt: r.createdAt,
      updatedAt: r.updatedAt,
      user: {
        id: r.user_id,
        name: r.user_name,
        username: r.user_username,
        avatar: r.user_avatar,
      }
    }));

    return NextResponse.json({
      replies: transformedReplies,
      total: transformedReplies.length
    });

  } catch (error) {
    console.error('Error fetching replies:', error);
    return NextResponse.json(
      { error: 'Failed to fetch replies' },
      { status: 500 }
    );
  }
}
