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
    const rawExerciseId = searchParams.get('exerciseId');
    const userId = searchParams.get('userId');

    if (!rawExerciseId) {
      return NextResponse.json({ error: 'exerciseId is required' }, { status: 400 });
    }

    // Slugify to match database format
    const exerciseId = slugifyExerciseId(rawExerciseId);

    // Get all ratings for this exercise
    const exerciseRatings = await prisma.exercise_ratings.findMany({
      where: { exerciseId },
      select: {
        id: true,
        userId: true,
        rating: true,
        reason: true,
        createdAt: true
      }
    });

    // Calculate average
    const totalRatings = exerciseRatings.length;
    const averageRating = totalRatings > 0
      ? exerciseRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
      : 0;

    // Get user's rating if userId provided
    let userRating = null;
    if (userId) {
      userRating = await prisma.exercise_ratings.findUnique({
        where: {
          exerciseId_userId: {
            exerciseId,
            userId
          }
        }
      });
    }

    return NextResponse.json({
      averageRating,
      totalRatings,
      ratings: exerciseRatings,
      userRating
    });
  } catch (error) {
    console.error('Error fetching ratings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ratings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { exerciseId: rawExerciseId, userId, rating, reason } = body;

    // Validation
    if (!rawExerciseId || !userId || !rating) {
      return NextResponse.json(
        { error: 'exerciseId, userId, and rating are required' },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Slugify to match database format
    const exerciseId = slugifyExerciseId(rawExerciseId);

    // Upsert rating (create or update)
    const newRating = await prisma.exercise_ratings.upsert({
      where: {
        exerciseId_userId: {
          exerciseId,
          userId
        }
      },
      create: {
        exerciseId,
        userId,
        rating,
        reason: reason || null
      },
      update: {
        rating,
        reason: reason || null,
        updatedAt: new Date()
      }
    });

    // Recalculate average
    const exerciseRatings = await prisma.exercise_ratings.findMany({
      where: { exerciseId }
    });

    const totalRatings = exerciseRatings.length;
    const averageRating = exerciseRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

    return NextResponse.json({
      rating: newRating,
      averageRating,
      totalRatings
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json(
      { error: 'Failed to submit rating' },
      { status: 500 }
    );
  }
}

