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

/**
 * Batch Stats API - Fetch stats for multiple exercises in one request
 * 
 * Usage: /api/exercise-stats-batch?ids=ex1&ids=ex2&ids=ex3
 * 
 * This solves the N+1 query problem on listing pages
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawIds = searchParams.getAll('ids');

    if (!rawIds || rawIds.length === 0) {
      return NextResponse.json({ error: 'At least one exercise ID is required' }, { status: 400 });
    }

    // Slugify all IDs to match database format
    const ids = rawIds.map(id => slugifyExerciseId(id));

    console.log('🟦 [Batch Stats API] Fetching stats for', ids.length, 'exercises');

    // Fetch all views in one query
    const views = await prisma.exercise_views.groupBy({
      by: ['exerciseId'],
      where: {
        exerciseId: { in: ids }
      },
      _count: {
        id: true
      }
    });

    // Fetch all comments in one query
    const comments = await prisma.exercise_comments.groupBy({
      by: ['exerciseId'],
      where: {
        exerciseId: { in: ids },
        published: true
      },
      _count: {
        id: true
      }
    });

    // Fetch all ratings in one query
    const ratings = await prisma.exercise_ratings.groupBy({
      by: ['exerciseId'],
      where: {
        exerciseId: { in: ids }
      },
      _avg: {
        rating: true
      },
      _count: {
        id: true
      }
    });

    // Fetch all completions in one query
    const completions = await prisma.exercise_completions.groupBy({
      by: ['exerciseId'],
      where: {
        exerciseId: { in: ids }
      },
      _count: {
        id: true
      }
    });

    // Build stats map
    const statsMap: Record<string, any> = {};

    // Initialize all IDs with zero stats
    ids.forEach(id => {
      statsMap[id] = {
        views: 0,
        comments: 0,
        rating: 0,
        totalRatings: 0,
        completions: 0
      };
    });

    // Populate views
    views.forEach(item => {
      statsMap[item.exerciseId].views = item._count.id;
    });

    // Populate comments
    comments.forEach(item => {
      statsMap[item.exerciseId].comments = item._count.id;
    });

    // Populate ratings
    ratings.forEach(item => {
      statsMap[item.exerciseId].rating = item._avg.rating || 0;
      statsMap[item.exerciseId].totalRatings = item._count.id;
    });

    // Populate completions
    completions.forEach(item => {
      statsMap[item.exerciseId].completions = item._count.id;
    });

    console.log('🟢 [Batch Stats API] Successfully fetched stats for', ids.length, 'exercises');

    return NextResponse.json({
      success: true,
      stats: statsMap
    });

  } catch (error) {
    console.error('🔴 [Batch Stats API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch batch stats', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
