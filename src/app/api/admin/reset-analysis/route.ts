import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Reset all analysis data
    const result = await prisma.newsArticle.updateMany({
      where: {
        analyzedAt: {
          not: null
        }
      },
      data: {
        analyzedAt: null,
        isHot: false,
        hotScore: null,
        aiAnalysis: null
      }
    });

    return NextResponse.json({
      success: true,
      message: `Reset analysis data for ${result.count} articles`,
      count: result.count
    });

  } catch (error) {
    console.error('Error resetting analysis:', error);
    return NextResponse.json(
      { error: 'Failed to reset analysis data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
