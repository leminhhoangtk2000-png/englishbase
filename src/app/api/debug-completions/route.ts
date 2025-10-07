import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const completions = await prisma.exercise_completions.findMany({
      take: 10,
      orderBy: {
        completedAt: 'desc'
      },
      select: {
        id: true,
        userId: true,
        exerciseId: true,
        completedAt: true,
        attempts: true
      }
    });

    return NextResponse.json({
      message: 'Recent exercise completions',
      count: completions.length,
      completions
    });
  } catch (error) {
    console.error('Error fetching completions:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
