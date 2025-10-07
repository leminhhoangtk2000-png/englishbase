import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-server';

// GET: Get user's exercise completions
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    // 🔧 TEMPORARY: Use first available user if not logged in (for development only)
    let userId = currentUser?.id;
    
    if (!userId) {
      const defaultUser = await prisma.user.findFirst({
        where: { email: 'user@edu-theme.com' }
      });
      userId = defaultUser?.id || 'user_test_1';
    }

    const { searchParams } = new URL(request.url);
    const level = searchParams.get('level'); // Optional filter by level (a1, a2, b1, b2)
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get user's completed exercises
    const completions = await prisma.exercise_completions.findMany({
      where: {
        userId,
        // Filter by level if provided
        ...(level && {
          exerciseId: {
            startsWith: level.toLowerCase()
          }
        })
      },
      orderBy: {
        completedAt: 'desc'
      },
      take: limit,
      skip: offset
    });

    // Get total count for pagination
    const totalCount = await prisma.exercise_completions.count({
      where: {
        userId,
        ...(level && {
          exerciseId: {
            startsWith: level.toLowerCase()
          }
        })
      }
    });

    // Calculate stats
    const stats = await prisma.exercise_completions.groupBy({
      by: ['exerciseId'],
      where: {
        userId
      },
      _count: {
        exerciseId: true
      }
    });

    const totalCompleted = stats.length;
    
    // Calculate level breakdown
    const levelStats = {
      a1: completions.filter(c => c.exerciseId.startsWith('a1')).length,
      a2: completions.filter(c => c.exerciseId.startsWith('a2')).length,
      b1: completions.filter(c => c.exerciseId.startsWith('b1')).length,
      b2: completions.filter(c => c.exerciseId.startsWith('b2')).length,
    };

    return NextResponse.json({
      completions,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount
      },
      stats: {
        totalCompleted,
        levelBreakdown: levelStats
      }
    });

  } catch (error) {
    console.error('Error fetching completions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch completions' },
      { status: 500 }
    );
  }
}
