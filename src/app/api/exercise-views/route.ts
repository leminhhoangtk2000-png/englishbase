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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { exerciseId: rawExerciseId, userId } = body;

    if (!rawExerciseId) {
      return NextResponse.json({ error: 'exerciseId is required' }, { status: 400 });
    }

    // Slugify to match database format
    const exerciseId = slugifyExerciseId(rawExerciseId);

    // Get IP and user agent from request
    const ipAddress = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Check if this user/IP already viewed in last 24 hours to prevent spam
    const recentView = await prisma.exercise_views.findFirst({
      where: {
        exerciseId,
        OR: [
          { userId: userId || undefined },
          { ipAddress }
        ],
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000) // Last 24 hours
        }
      }
    });

    if (recentView) {
      // Don't count duplicate views within 24 hours
      return NextResponse.json({
        success: true,
        message: 'View already counted'
      });
    }

    // Create new view record
    await prisma.exercise_views.create({
      data: {
        exerciseId,
        userId: userId || null,
        ipAddress,
        userAgent
      }
    });

    return NextResponse.json({
      success: true,
      message: 'View recorded'
    });

  } catch (error) {
    console.error('Error recording view:', error);
    return NextResponse.json(
      { error: 'Failed to record view' },
      { status: 500 }
    );
  }
}
