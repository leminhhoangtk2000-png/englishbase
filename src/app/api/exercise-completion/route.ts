import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-server';

// GET: Check if exercise is completed
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json({ completed: false });
    }

    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get('exerciseId');

    if (!exerciseId) {
      return NextResponse.json({ error: 'exerciseId is required' }, { status: 400 });
    }

    const completion = await prisma.exercise_completions.findUnique({
      where: {
        userId_exerciseId: {
          userId: currentUser.id,
          exerciseId
        }
      }
    });

    return NextResponse.json({
      completed: !!completion,
      completedAt: completion?.completedAt,
      timeSpent: completion?.timeSpent,
      score: completion?.score,
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
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { exerciseId, timeSpent, score } = body;

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
          userId: currentUser.id,
          exerciseId
        }
      },
      update: {
        attempts: {
          increment: 1
        },
        timeSpent: timeSpent || undefined,
        score: score || undefined,
        completedAt: new Date()
      },
      create: {
        userId: currentUser.id,
        exerciseId,
        timeSpent: timeSpent || null,
        score: score || null,
        attempts: 1
      }
    });

    return NextResponse.json({
      success: true,
      completion
    });

  } catch (error) {
    console.error('Error marking completion:', error);
    return NextResponse.json(
      { error: 'Failed to mark completion' },
      { status: 500 }
    );
  }
}

// DELETE: Unmark exercise completion
export async function DELETE(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
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
          userId: currentUser.id,
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
