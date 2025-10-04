import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for ratings (replace with database in production)
interface Rating {
  id: string;
  exerciseId: string;
  userId: string;
  rating: number;
  reason?: string;
  createdAt: string;
}

const ratings: Rating[] = [];

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const exerciseId = searchParams.get('exerciseId');

  if (!exerciseId) {
    return NextResponse.json({ error: 'exerciseId is required' }, { status: 400 });
  }

  // Get all ratings for this exercise
  const exerciseRatings = ratings.filter(r => r.exerciseId === exerciseId);

  // Calculate average
  const totalRatings = exerciseRatings.length;
  const averageRating = totalRatings > 0
    ? exerciseRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings
    : 0;

  return NextResponse.json({
    averageRating,
    totalRatings,
    ratings: exerciseRatings,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { exerciseId, userId, rating, reason } = body;

    // Validation
    if (!exerciseId || !userId || !rating) {
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

    // Check if user already rated this exercise
    const existingRatingIndex = ratings.findIndex(
      r => r.exerciseId === exerciseId && r.userId === userId
    );

    const newRating: Rating = {
      id: Date.now().toString(),
      exerciseId,
      userId,
      rating,
      reason,
      createdAt: new Date().toISOString(),
    };

    if (existingRatingIndex !== -1) {
      // Update existing rating
      ratings[existingRatingIndex] = newRating;
    } else {
      // Add new rating
      ratings.push(newRating);
    }

    // Recalculate average
    const exerciseRatings = ratings.filter(r => r.exerciseId === exerciseId);
    const totalRatings = exerciseRatings.length;
    const averageRating = exerciseRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

    return NextResponse.json({
      rating: newRating,
      averageRating,
      totalRatings,
    });
  } catch (error) {
    console.error('Error submitting rating:', error);
    return NextResponse.json(
      { error: 'Failed to submit rating' },
      { status: 500 }
    );
  }
}
