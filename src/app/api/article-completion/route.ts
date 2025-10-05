import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET - Check if article is completed
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const articleId = searchParams.get('articleId');

    console.log('[GET] Article completion check for:', articleId);

    if (!articleId) {
      return NextResponse.json(
        { error: 'articleId is required' },
        { status: 400 }
      );
    }

    // TODO: Get real user from session
    // For now, use a default test user
    const testUser = await prisma.user.findFirst({
      where: { email: 'user@edu-theme.com' }
    });

    console.log('[GET] Test user found:', testUser?.id);

    if (!testUser) {
      console.log('[GET] No test user, returning completed: false');
      return NextResponse.json({
        completed: false
      });
    }

    const completion = await prisma.articleCompletion.findUnique({
      where: {
        userId_articleId: {
          userId: testUser.id,
          articleId: articleId
        }
      }
    });

    console.log('[GET] Completion found:', completion ? 'yes' : 'no');

    if (!completion) {
      return NextResponse.json({
        completed: false
      });
    }

    return NextResponse.json({
      completed: true,
      completedAt: completion.completedAt.toISOString(),
      timeSpent: completion.timeSpent,
      attempts: completion.attempts
    });

  } catch (error) {
    console.error('Error fetching article completion:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack');
    return NextResponse.json(
      { error: 'Failed to fetch completion status', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

// POST - Mark article as completed
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { articleId, timeSpent } = body;

    if (!articleId) {
      return NextResponse.json(
        { error: 'articleId is required' },
        { status: 400 }
      );
    }

    // TODO: Get real user from session
    const testUser = await prisma.user.findFirst({
      where: { email: 'user@edu-theme.com' }
    });

    if (!testUser) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    // Check if already completed
    const existing = await prisma.articleCompletion.findUnique({
      where: {
        userId_articleId: {
          userId: testUser.id,
          articleId: articleId
        }
      }
    });

    let completion;

    if (existing) {
      // Update existing completion (increment attempts)
      completion = await prisma.articleCompletion.update({
        where: {
          userId_articleId: {
            userId: testUser.id,
            articleId: articleId
          }
        },
        data: {
          completedAt: new Date(),
          timeSpent: timeSpent || existing.timeSpent,
          attempts: existing.attempts + 1
        }
      });
    } else {
      // Create new completion
      completion = await prisma.articleCompletion.create({
        data: {
          userId: testUser.id,
          articleId: articleId,
          timeSpent: timeSpent || null,
          attempts: 1
        }
      });
    }

    return NextResponse.json({
      success: true,
      completion: {
        completedAt: completion.completedAt.toISOString(),
        timeSpent: completion.timeSpent,
        attempts: completion.attempts
      }
    });

  } catch (error) {
    console.error('Error marking article completion:', error);
    return NextResponse.json(
      { error: 'Failed to mark completion' },
      { status: 500 }
    );
  }
}

// DELETE - Unmark article completion
export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const articleId = searchParams.get('articleId');

    if (!articleId) {
      return NextResponse.json(
        { error: 'articleId is required' },
        { status: 400 }
      );
    }

    // TODO: Get real user from session
    const testUser = await prisma.user.findFirst({
      where: { email: 'user@edu-theme.com' }
    });

    if (!testUser) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    await prisma.articleCompletion.delete({
      where: {
        userId_articleId: {
          userId: testUser.id,
          articleId: articleId
        }
      }
    });

    return NextResponse.json({
      success: true
    });

  } catch (error) {
    console.error('Error deleting article completion:', error);
    return NextResponse.json(
      { error: 'Failed to delete completion' },
      { status: 500 }
    );
  }
}
