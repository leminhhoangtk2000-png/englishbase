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
 * Analytics API - Track detailed engagement metrics
 * 
 * Tracks:
 * - Reading time (seconds spent on exercise)
 * - Scroll depth (percentage of page scrolled)
 * - Timestamp and user info
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { exerciseId: rawExerciseId, readingTime, scrollDepth } = body;

    if (!rawExerciseId) {
      return NextResponse.json(
        { error: 'exerciseId is required' },
        { status: 400 }
      );
    }

    // Slugify to match database format
    const exerciseId = slugifyExerciseId(rawExerciseId);

    console.log('🟦 [Analytics API] Recording analytics:', {
      exerciseId,
      readingTime,
      scrollDepth,
    });

    // Get user ID (will be replaced with real auth later)
    const defaultUser = await prisma.user.findFirst({
      where: { email: 'user@edu-theme.com' },
    });

    // Get IP and User Agent
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Store analytics in exercise_views table (extend schema later if needed)
    // For now, we'll just log it
    console.log('🟢 [Analytics API] Analytics recorded:', {
      exerciseId,
      userId: defaultUser?.id,
      readingTime,
      scrollDepth,
      ip,
      userAgent,
    });

    // TODO: Create exercise_analytics table for detailed metrics
    // For now, return success
    return NextResponse.json({
      success: true,
      message: 'Analytics recorded',
    });

  } catch (error) {
    console.error('🔴 [Analytics API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to record analytics' },
      { status: 500 }
    );
  }
}
