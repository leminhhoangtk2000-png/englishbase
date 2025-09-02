import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    // Get total tokens and cost from all test results
    const stats = await prisma.aITestResult.aggregate({
      _sum: {
        tokensUsed: true,
        cost: true,
      },
      _count: {
        id: true,
      },
    });

    // Get stats by provider
    const providerStats = await prisma.aITestResult.groupBy({
      by: ['providerId'],
      _sum: {
        tokensUsed: true,
        cost: true,
      },
      _count: {
        id: true,
      },
    });

    // Get provider names for the grouped results
    const providerIds = providerStats.map(stat => stat.providerId);
    const providers = await prisma.aIProvider.findMany({
      where: {
        id: {
          in: providerIds,
        },
      },
      select: {
        id: true,
        name: true,
        displayName: true,
      },
    });

    // Combine provider info with stats
    const enrichedProviderStats = providerStats.map(stat => {
      const provider = providers.find(p => p.id === stat.providerId);
      return {
        ...stat,
        provider,
      };
    });

    return NextResponse.json({
      totalTokens: stats._sum.tokensUsed || 0,
      totalCost: stats._sum.cost || 0,
      totalTests: stats._count.id || 0,
      providerStats: enrichedProviderStats,
    });
  } catch (error) {
    console.error('Error fetching AI stats:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
