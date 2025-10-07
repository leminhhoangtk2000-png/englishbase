import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ExerciseStats {
  views: number;
  likes: number;
}

export async function POST(request: NextRequest) {
  try {
    const { exerciseIds }: { exerciseIds: string[] } = await request.json();

    if (!exerciseIds || exerciseIds.length === 0) {
      return NextResponse.json(
        { error: 'exerciseIds is required' },
        { status: 400 }
      );
    }

    // 🚀 Tối ưu: 1 query để lấy tất cả stats cho nhiều exercises
    const exercisesStats = await prisma.exercises_master.findMany({
      where: {
        OR: [
          { slug: { in: exerciseIds } },
          { slugId: { in: exerciseIds.map(id => id.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')) } }
        ]
      },
      select: {
        slug: true,
        slugId: true,
        likesCount: true,
        viewsCount: true,
      }
    });

    // Transform data to expected format
    const statsMap: Record<string, ExerciseStats> = {};
    
    exercisesStats.forEach(exercise => {
      // Map both slug and slugId to same stats
      const stats = {
        views: exercise.viewsCount,
        likes: exercise.likesCount,
      };
      
      statsMap[exercise.slug] = stats;
      statsMap[exercise.slugId] = stats;
      
      // Also map original exerciseId format
      exerciseIds.forEach(id => {
        if (id === exercise.slug || id === exercise.slugId) {
          statsMap[id] = stats;
        }
      });
    });

    // For exercises not found in cache, provide defaults
    exerciseIds.forEach(id => {
      if (!statsMap[id]) {
        statsMap[id] = { views: 0, likes: 0 };
      }
    });

    return NextResponse.json(statsMap);

  } catch (error) {
    console.error('Error fetching batch exercise stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 🚀 Alternative GET method for URL params (for smaller batches)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exerciseIds = searchParams.get('ids')?.split(',') || [];

    if (exerciseIds.length === 0) {
      return NextResponse.json(
        { error: 'ids parameter is required' },
        { status: 400 }
      );
    }

    // Same logic as POST
    const exercisesStats = await prisma.exercises_master.findMany({
      where: {
        OR: [
          { slug: { in: exerciseIds } },
          { slugId: { in: exerciseIds.map(id => id.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')) } }
        ]
      },
      select: {
        slug: true,
        slugId: true,
        likesCount: true,
        viewsCount: true,
      }
    });

    const statsMap: Record<string, ExerciseStats> = {};
    
    exercisesStats.forEach(exercise => {
      const stats = {
        views: exercise.viewsCount,
        likes: exercise.likesCount,
      };
      
      statsMap[exercise.slug] = stats;
      statsMap[exercise.slugId] = stats;
    });

    exerciseIds.forEach(id => {
      if (!statsMap[id]) {
        statsMap[id] = { views: 0, likes: 0 };
      }
    });

    return NextResponse.json(statsMap);

  } catch (error) {
    console.error('Error fetching batch exercise stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
