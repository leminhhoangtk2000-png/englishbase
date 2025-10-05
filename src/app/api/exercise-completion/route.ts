import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-server';

// GET: Check if exercise is completed
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    // 🔧 TEMPORARY: Use test user if not logged in (for development only)
    const userId = currentUser?.id || 'user_test_1'; // user@edu-theme.com
    
    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get('exerciseId');

    if (!exerciseId) {
      return NextResponse.json({ error: 'exerciseId is required' }, { status: 400 });
    }

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
  try {
    const currentUser = await getCurrentUser();
    
    // 🔧 TEMPORARY: Use test user if not logged in (for development only)
    const userId = currentUser?.id || 'user_test_1'; // user@edu-theme.com
    console.log('🔧 [TEMP] Marking completion for user:', userId, currentUser ? '(logged in)' : '(fallback user)');

    const body = await request.json();
    const { exerciseId, timeSpent } = body;

    if (!exerciseId) {
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

    console.log('✅ Completion saved:', { exerciseId, userId, attempts: completion.attempts });

    return NextResponse.json({
      success: true,
      completion
    });

  } catch (error) {
    console.error('Error marking completion:', error);
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
    
    // 🔧 TEMPORARY: Use test user if not logged in (for development only)
    const userId = currentUser?.id || 'user_test_1'; // user@edu-theme.com

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
