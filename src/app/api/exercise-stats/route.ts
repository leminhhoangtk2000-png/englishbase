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
    const searchParams = request.nextUrl.searchParams;
    const exerciseId = searchParams.get('exerciseId');

    if (!exerciseId) {
      return NextResponse.json({ error: 'exerciseId is required' }, { status: 400 });
    }

    // Slugify to match database format
    const slugifiedId = slugifyExerciseId(exerciseId);

    // Get views count
    const viewsCount = await prisma.exercise_views.count({
      where: { exerciseId: slugifiedId }
    });

    // Get comments count from database
    const commentsCount = await prisma.exercise_comments.count({
      where: { 
        exerciseId: slugifiedId,
        published: true 
      }
    });

    // Get likes stats
    const likesCount = await prisma.exercise_likes.count({
      where: { 
        exerciseId: slugifiedId,
        isLiked: true 
      }
    });

    return NextResponse.json({
      success: true,
      stats: {
        views: viewsCount,
        comments: commentsCount,
        likes: likesCount
      }
    });

  } catch (error) {
    console.error('Error fetching exercise stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch exercise stats', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
