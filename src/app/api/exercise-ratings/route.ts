import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-server';

// Helper function to slugify exerciseId to match database format
function slugifyExerciseId(id: string): string {
  // First decode any URL encoding (e.g., %20 or -20 for spaces)
  let decoded = id;
  try {
    // Try to decode URI component (handles %20, %E2%80%93, etc.)
    decoded = decodeURIComponent(id);
  } catch (e) {
    // If decoding fails, try to handle common patterns
    decoded = id
      .replace(/-20/g, ' ')           // Replace -20 with space
      .replace(/-2D/g, '-')           // Replace -2D with hyphen
      .replace(/-E2-80-93/g, '-');    // Replace -E2-80-93 with en-dash
  }
  
  // Then slugify to match exercises_master format
  return decoded
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
    const currentUser = await getCurrentUser();
    
    // 🔧 TEMPORARY: Use first available user if not logged in (for development only)
    let userId = currentUser?.id;
    
    if (!userId) {
      // Find any user from database to use as default
      const defaultUser = await prisma.user.findFirst({
        where: { email: 'user@edu-theme.com' }
      });
      userId = defaultUser?.id;
      
      if (!userId) {
        console.log('🔴 No user found in database');
        return NextResponse.json(
          { error: 'No user available' },
          { status: 401 }
        );
      }
      
      console.log('🔧 Using default user for like:', userId);
    }

    const body = await request.json();
    const { exerciseId: rawExerciseId, isLiked } = body;

    // Validation
    if (!rawExerciseId || typeof isLiked !== 'boolean') {
      return NextResponse.json(
        { error: 'exerciseId and isLiked are required' },
        { status: 400 }
      );
    }

    // Slugify to match database format
    const exerciseId = slugifyExerciseId(rawExerciseId);

    // Use transaction to update both exercise_likes and exercises_master
    const result = await prisma.$transaction(async (tx) => {
      if (isLiked) {
        // Create or update to liked
        await tx.exercise_likes.upsert({
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
        await tx.exercise_likes.deleteMany({
          where: {
            exerciseId,
            userId
          }
        });
      }

      // Get updated like count
      const totalLikes = await tx.exercise_likes.count({
        where: { 
          exerciseId,
          isLiked: true 
        }
      });

      // 🔥 Update cached count in exercises_master
      await tx.exercises_master.updateMany({
        where: { slugId: exerciseId },
        data: { likesCount: totalLikes }
      });

      return { totalLikes, userLiked: isLiked };
    });

    console.log('✅ Like updated and count synchronized:', result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}

