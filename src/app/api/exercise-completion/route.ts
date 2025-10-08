import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-server';

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

// GET: Check if exercise is completed
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    // 🔧 TEMPORARY: Use first available user if not logged in (for development only)
    let userId = currentUser?.id;
    
    if (!userId) {
      // Find any user from database to use as default
      const defaultUser = await prisma.user.findFirst({
        where: { email: 'user@edu-theme.com' }
      });
      userId = defaultUser?.id || 'user_test_1';
      console.log('🔧 Using default user:', userId);
    }
    
    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get('exerciseId');

    if (!exerciseId) {
      return NextResponse.json({ error: 'exerciseId is required' }, { status: 400 });
    }

    console.log('🔍 GET completion check for exerciseId:', exerciseId);

    const completion = await prisma.exercise_completions.findUnique({
      where: {
        userId_exerciseId: {
          userId,
          exerciseId
        }
      }
    });

    return NextResponse.json({
      completed: !!completion,
      completedAt: completion?.completedAt,
      timeSpent: completion?.timeSpent,
      attempts: completion?.attempts
    });

  } catch (error) {
    console.error('Error checking completion:', error);
    return NextResponse.json(
      { error: 'Failed to check completion' },
      { status: 500 }
    );
  }
}

// POST: Mark exercise as completed
export async function POST(request: NextRequest) {
  console.log('🟦 POST /api/exercise-completion - Request received');
  
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
      
      console.log('🔧 Using default user:', userId);
    }
    
    console.log('🟦 User ID:', userId);

    const body = await request.json();
    const { exerciseId, timeSpent } = body;
    
    console.log('🟦 Request body:', { exerciseId, timeSpent });

    if (!exerciseId) {
      console.log('🔴 Missing exerciseId');
      return NextResponse.json(
        { error: 'exerciseId is required' },
        { status: 400 }
      );
    }

    // Upsert completion (create or increment attempts)
    const completion = await prisma.exercise_completions.upsert({
      where: {
        userId_exerciseId: {
          userId,
          exerciseId
        }
      },
      update: {
        attempts: {
          increment: 1
        },
        timeSpent: timeSpent || undefined,
        completedAt: new Date()
      },
      create: {
        userId,
        exerciseId,
        timeSpent: timeSpent || null,
        attempts: 1
      }
    });
    
    console.log('🟢 Completion saved:', completion);

    return NextResponse.json({
      success: true,
      completion
    });

  } catch (error) {
    console.error('🔴 Error marking completion:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: 'Failed to mark completion', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// DELETE: Unmark exercise completion
export async function DELETE(request: NextRequest) {
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
      
      console.log('🔧 Using default user:', userId);
    }

    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get('exerciseId');

    if (!exerciseId) {
      return NextResponse.json(
        { error: 'exerciseId is required' },
        { status: 400 }
      );
    }

    await prisma.exercise_completions.delete({
      where: {
        userId_exerciseId: {
          userId,
          exerciseId
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Completion removed'
    });

  } catch (error) {
    console.error('Error removing completion:', error);
    return NextResponse.json(
      { error: 'Failed to remove completion' },
      { status: 500 }
    );
  }
}
