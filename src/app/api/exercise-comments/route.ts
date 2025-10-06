import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Helper function to slugify exerciseId to match database format
function slugifyExerciseId(id: string): string {
  return id
    .toLowerCase()
    .replace(/\//g, '-')            // slashes to hyphens  
    .replace(/\s+/g, '-')           // spaces to hyphens
    .replace(/[^\w\-]/g, '-')       // special chars to hyphens
    .replace(/-+/g, '-')            // multiple hyphens to single
    .replace(/^-+|-+$/g, '');       // trim hyphens
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawExerciseId = searchParams.get('exerciseId');
    
    if (!rawExerciseId) {
      return NextResponse.json({ error: 'exerciseId is required' }, { status: 400 });
    }

    // Slugify to match database format
    const exerciseId = slugifyExerciseId(rawExerciseId);

    const comments = await prisma.exercise_comments.findMany({
      where: {
        exerciseId,
        published: true,
        parentId: null, // Only top-level comments
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
        other_exercise_comments: {
          include: {
            users: {
              select: {
                id: true,
                name: true,
                avatar: true,
                role: true,
              },
            },
            exercise_comment_likes: true,
          },
          orderBy: {
            createdAt: 'asc',
          },
        },
        exercise_comment_likes: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform data to include isLiked status for current user
    const transformedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      author: comment.users,
      createdAt: comment.createdAt.toISOString(),
      likes: comment.exercise_comment_likes.length,
      isLiked: false, // TODO: Check if current user liked this comment
      replies: comment.other_exercise_comments?.map(reply => ({
        id: reply.id,
        content: reply.content,
        author: reply.users,
        createdAt: reply.createdAt.toISOString(),
        likes: reply.exercise_comment_likes.length,
        isLiked: false, // TODO: Check if current user liked this reply
      })) || [],
    }));

    return NextResponse.json({ 
      comments: transformedComments,
      total: comments.length 
    });
  } catch (error) {
    console.error('Error fetching exercise comments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, exerciseId: rawExerciseId, exerciseUrl, parentId } = body;

    if (!content || !rawExerciseId) {
      return NextResponse.json({ error: 'Content and exerciseId are required' }, { status: 400 });
    }

    // Slugify to match database format
    const exerciseId = slugifyExerciseId(rawExerciseId);

    // TODO: Get current user from auth
    // For now, use a default user
    const defaultUserId = 'cmf3wfn7k0001bm5kf1qdusnk'; // Replace with actual user authentication

    const comment = await prisma.exercise_comments.create({
      data: {
        id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        content,
        exerciseId,
        exerciseUrl,
        parentId,
        authorId: defaultUserId,
        updatedAt: new Date(),
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            avatar: true,
            role: true,
          },
        },
        exercise_comment_likes: true,
      },
    });

    const transformedComment = {
      id: comment.id,
      content: comment.content,
      author: comment.users,
      createdAt: comment.createdAt.toISOString(),
      likes: comment.exercise_comment_likes.length,
      isLiked: false,
      replies: [],
    };

    return NextResponse.json({ comment: transformedComment }, { status: 201 });
  } catch (error) {
    console.error('Error creating exercise comment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
