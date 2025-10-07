import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exerciseId = searchParams.get('exerciseId');
    const userId = searchParams.get('userId');

    if (!exerciseId || !userId) {
      return NextResponse.json(
        { error: 'exerciseId and userId are required' },
        { status: 400 }
      );
    }

    // Check if user has completed this exercise
    const completion = await prisma.exercise_completions.findFirst({
      where: {
        userId,
        exerciseId,
      },
    });

    return NextResponse.json({
      completed: !!completion,
      completedAt: completion?.completedAt || null,
    });
  } catch (error) {
    console.error('Error checking exercise completion:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { exerciseId, userId, completed } = await request.json();

    if (!exerciseId || !userId || typeof completed !== 'boolean') {
      return NextResponse.json(
        { error: 'exerciseId, userId, and completed status are required' },
        { status: 400 }
      );
    }

    if (completed) {
      // Create completion record
      const existingCompletion = await prisma.exercise_completions.findFirst({
        where: {
          userId,
          exerciseId,
        },
      });

      if (existingCompletion) {
        // Update existing record
        const completion = await prisma.exercise_completions.update({
          where: {
            id: existingCompletion.id,
          },
          data: {
            completedAt: new Date(),
            attempts: {
              increment: 1,
            },
          },
        });

        console.log('✅ Exercise completion updated:', {
          exerciseId,
          userId,
          completedAt: completion.completedAt,
        });

        return NextResponse.json({
          success: true,
          completed: true,
          completedAt: completion.completedAt,
        });
      } else {
        // Create new record
        const completion = await prisma.exercise_completions.create({
          data: {
            userId,
            exerciseId,
            completedAt: new Date(),
            attempts: 1,
          },
        });

        console.log('✅ Exercise completion created:', {
          exerciseId,
          userId,
          completedAt: completion.completedAt,
        });

        return NextResponse.json({
          success: true,
          completed: true,
          completedAt: completion.completedAt,
        });
      }
    } else {
      // Remove completion record
      await prisma.exercise_completions.deleteMany({
        where: {
          userId,
          exerciseId,
        },
      });

      return NextResponse.json({
        success: true,
        completed: false,
        completedAt: null,
      });
    }
  } catch (error) {
    console.error('❌ Error updating exercise completion:', error);
    console.error('❌ Error details:', {
      name: error?.name,
      message: error?.message,
      stack: error?.stack,
    });
    return NextResponse.json(
      { error: 'Internal server error', details: error?.message },
      { status: 500 }
    );
  }
}
