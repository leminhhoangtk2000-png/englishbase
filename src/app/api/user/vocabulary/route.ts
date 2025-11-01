import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-server';
import { checkRateLimit, getClientIdentifier, createRateLimitResponse, rateLimits } from '@/lib/rate-limit';

/**
 * GET /api/user/vocabulary
 * Load all saved vocabulary for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request);
    const rateLimitResult = checkRateLimit({
      ...rateLimits.api,
      identifier,
    });

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    // Check authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // Filter by learning status
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where clause
    const where: any = {
      userId: currentUser.id,
    };

    if (status) {
      where.status = status;
    }

    // Fetch user's saved vocabulary with full details
    const userVocabulary = await prisma.userVocabulary.findMany({
      where,
      include: {
        vocabulary: {
          include: {
            level: {
              select: {
                name: true,
                displayName: true,
              },
            },
            topic: {
              select: {
                name: true,
                displayName: true,
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        updatedAt: 'desc', // Most recently updated first
      },
      take: limit,
      skip: offset,
    });

    // Get total count
    const total = await prisma.userVocabulary.count({ where });

    // Transform data to include vocabulary details
    const vocabulary = userVocabulary.map((uv) => ({
      id: uv.vocabulary.id,
      german: uv.vocabulary.german,
      vietnamese: uv.vocabulary.vietnamese,
      phonetic: uv.vocabulary.phonetic,
      plural: uv.vocabulary.plural,
      type: uv.vocabulary.type,
      exampleGerman: uv.vocabulary.exampleGerman,
      exampleVietnamese: uv.vocabulary.exampleVietnamese,
      difficulty: uv.vocabulary.difficulty,
      tags: uv.vocabulary.tags,
      level: uv.vocabulary.level,
      topic: uv.vocabulary.topic,
      // User-specific data
      userStatus: uv.status,
      correctCount: uv.correctCount,
      totalAttempts: uv.totalAttempts,
      lastReviewed: uv.lastReviewed,
      nextReview: uv.nextReview,
      savedAt: uv.createdAt,
      updatedAt: uv.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      data: vocabulary,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + vocabulary.length < total,
      },
    });
  } catch (error) {
    console.error('Error fetching user vocabulary:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/user/vocabulary
 * Save vocabulary to user's list
 */
export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request);
    const rateLimitResult = checkRateLimit({
      ...rateLimits.api,
      identifier,
    });

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    // Check authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { vocabularyId } = body;

    if (!vocabularyId) {
      return NextResponse.json(
        { success: false, error: 'vocabularyId is required' },
        { status: 400 }
      );
    }

    // Check if vocabulary exists
    const vocabulary = await prisma.vocabularyEntry.findUnique({
      where: { id: vocabularyId },
    });

    if (!vocabulary) {
      return NextResponse.json(
        { success: false, error: 'Vocabulary not found' },
        { status: 404 }
      );
    }

    // Create or update user vocabulary
    const userVocabulary = await prisma.userVocabulary.upsert({
      where: {
        userId_vocabularyId: {
          userId: currentUser.id,
          vocabularyId,
        },
      },
      create: {
        userId: currentUser.id,
        vocabularyId,
        status: 'NEW',
        difficulty: vocabulary.difficulty,
      },
      update: {
        updatedAt: new Date(),
      },
      include: {
        vocabulary: {
          include: {
            level: true,
            topic: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Vocabulary saved successfully',
      data: userVocabulary,
    });
  } catch (error) {
    console.error('Error saving vocabulary:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/user/vocabulary
 * Remove vocabulary from user's saved list
 */
export async function DELETE(request: NextRequest) {
  try {
    // Rate limiting
    const identifier = getClientIdentifier(request);
    const rateLimitResult = checkRateLimit({
      ...rateLimits.api,
      identifier,
    });

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    // Check authentication
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const vocabularyId = searchParams.get('vocabularyId');

    if (!vocabularyId) {
      return NextResponse.json(
        { success: false, error: 'vocabularyId is required' },
        { status: 400 }
      );
    }

    // Delete user vocabulary
    await prisma.userVocabulary.delete({
      where: {
        userId_vocabularyId: {
          userId: currentUser.id,
          vocabularyId,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Vocabulary removed successfully',
    });
  } catch (error) {
    // Handle case where the record doesn't exist
    if ((error as any).code === 'P2025') {
      return NextResponse.json({
        success: true,
        message: 'Vocabulary already removed',
      });
    }

    console.error('Error removing vocabulary:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

