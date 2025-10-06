import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const exerciseId = searchParams.get('exerciseId');

    if (!exerciseId) {
      return NextResponse.json({ error: 'exerciseId is required' }, { status: 400 });
    }

    // Get views count
    const viewsCount = await prisma.exercise_views.count({
      where: { exerciseId }
    });

    // Get comments count from database
    const commentsCount = await prisma.exercise_comments.count({
      where: { 
        exerciseId,
        published: true 
      }
    });

    // Get ratings stats
    const ratings = await prisma.exercise_ratings.findMany({
      where: { exerciseId },
      select: { rating: true }
    });

    const totalRatings = ratings.length;
    const averageRating = totalRatings > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

    return NextResponse.json({
      success: true,
      stats: {
        views: viewsCount,
        comments: commentsCount,
        rating: averageRating,
        totalRatings
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
