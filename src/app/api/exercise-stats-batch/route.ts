import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

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

/**
 * Batch Stats API - Fetch stats for multiple exercises in one request
 * Usage: /api/exercise-stats-batch?ids=ex1&ids=ex2&ids=ex3
 * NOW USES CACHED COUNTS from exercises_master for 100x faster queries!
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawIds = searchParams.getAll('ids');

    if (!rawIds || rawIds.length === 0) {
      return NextResponse.json({ error: 'At least one exercise ID is required' }, { status: 400 });
    }

    const ids = rawIds.map(id => slugifyExerciseId(id));
    console.log('🟦 [Batch Stats API] Fetching cached stats for', ids.length, 'exercises');

    // Fetch all stats from exercises_master in ONE query!
    const exerciseStats = await prisma.exercises_master.findMany({
      where: { slugId: { in: ids } },
      select: {
        slugId: true,
        likesCount: true,
        viewsCount: true,
        commentsCount: true
      }
    });

    // Fetch completions
    const completions = await prisma.exercise_completions.groupBy({
      by: ['exerciseId'],
      where: { exerciseId: { in: ids } },
      _count: { id: true }
    });

    // Create stats map
    const statsMap: Record<string, {
      views: number;
      comments: number;
      likes: number;
      completions: number;
    }> = {};

    // Initialize with zeros
    ids.forEach(id => {
      statsMap[id] = { views: 0, comments: 0, likes: 0, completions: 0 };
    });

    // Populate from exercises_master
    exerciseStats.forEach(item => {
      if (statsMap[item.slugId]) {
        statsMap[item.slugId].views = item.viewsCount;
        statsMap[item.slugId].comments = item.commentsCount;
        statsMap[item.slugId].likes = item.likesCount;
      }
    });

    // Populate completions
    completions.forEach(item => {
      if (statsMap[item.exerciseId]) {
        statsMap[item.exerciseId].completions = item._count.id;
      }
    });

    console.log('🟢 [Batch Stats API] Successfully fetched cached stats');

    return NextResponse.json({ success: true, stats: statsMap });

  } catch (error) {
    console.error('🔴 [Batch Stats API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch batch stats', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
