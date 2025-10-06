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

    // Get total likes count (only where isLiked = true)
    const totalLikes = await prisma.exercise_likes.count({
      where: { 
        exerciseId,
        isLiked: true 
      }
    });

    // Get user's like status if userId provided
    let userLiked = false;
    if (userId) {
      const userRating = await prisma.exercise_likes.findUnique({
        where: {
          exerciseId_userId: {
            exerciseId,
            userId
          }
        }
      });
      userLiked = userRating?.isLiked || false;
    }

    return NextResponse.json({
      totalLikes,
      userLiked
    });
  } catch (error) {
    console.error('Error fetching likes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch likes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { exerciseId: rawExerciseId, userId, isLiked } = body;

    // Validation
    if (!rawExerciseId || !userId || typeof isLiked !== 'boolean') {
      return NextResponse.json(
        { error: 'exerciseId, userId, and isLiked are required' },
        { status: 400 }
      );
    }

    // Slugify to match database format
    const exerciseId = slugifyExerciseId(rawExerciseId);

    if (isLiked) {
      // Create or update to liked
      await prisma.exercise_likes.upsert({
        where: {
          exerciseId_userId: {
            exerciseId,
            userId
          }
        },
        create: {
          exerciseId,
          userId,
          isLiked: true
        },
        update: {
          isLiked: true,
          updatedAt: new Date()
        }
      });
    } else {
      // Unlike: delete the record
      await prisma.exercise_likes.deleteMany({
        where: {
          exerciseId,
          userId
        }
      });
    }

    // Get updated like count
    const totalLikes = await prisma.exercise_likes.count({
      where: { 
        exerciseId,
        isLiked: true 
      }
    });

    return NextResponse.json({
      totalLikes,
      userLiked: isLiked
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}

