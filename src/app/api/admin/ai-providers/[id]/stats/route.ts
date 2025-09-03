import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface StatsParams {
  params: {
    id: string;
  };
}

export async function GET(
  request: NextRequest,
  { params }: StatsParams
) {
  try {
    const { id } = params;
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '7');

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get usage statistics
    const usageStats = await prisma.aIUsage.aggregate({
      where: {
        providerId: id,
        createdAt: {
          gte: startDate
        }
      },
      _sum: {
        promptTokens: true,
        responseTokens: true,
        totalTokens: true,
        cost: true,
      },
      _count: {
        id: true,
      },
    });

    // Get test results statistics
    const testStats = await prisma.aITestResult.aggregate({
      where: {
        providerId: id,
        createdAt: {
          gte: startDate
        }
      },
      _sum: {
        tokensUsed: true,
        cost: true,
        responseTime: true,
      },
      _count: {
        id: true,
      },
      _avg: {
        responseTime: true,
      },
    });

    // Get success rate for tests
    const successfulTests = await prisma.aITestResult.count({
      where: {
        providerId: id,
        success: true,
        createdAt: {
          gte: startDate
        }
      }
    });

    // Get daily usage for charts
    const dailyUsage = await prisma.aIUsage.groupBy({
      by: ['createdAt'],
      where: {
        providerId: id,
        createdAt: {
          gte: startDate
        }
      },
      _sum: {
        totalTokens: true,
        cost: true,
      },
      _count: {
        id: true,
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    // Process daily data
    const dailyData = dailyUsage.reduce((acc: any[], item) => {
      const date = item.createdAt.toISOString().split('T')[0];
      const existing = acc.find(d => d.date === date);
      
      if (existing) {
        existing.tokens += item._sum.totalTokens || 0;
        existing.cost += item._sum.cost || 0;
        existing.requests += item._count.id;
      } else {
        acc.push({
          date,
          tokens: item._sum.totalTokens || 0,
          cost: item._sum.cost || 0,
          requests: item._count.id,
        });
      }
      
      return acc;
    }, []);

    const stats = {
      usage: {
        totalRequests: usageStats._count.id || 0,
        totalTokens: usageStats._sum.totalTokens || 0,
        promptTokens: usageStats._sum.promptTokens || 0,
        responseTokens: usageStats._sum.responseTokens || 0,
        totalCost: usageStats._sum.cost || 0,
      },
      tests: {
        totalTests: testStats._count.id || 0,
        successfulTests,
        successRate: testStats._count.id ? (successfulTests / testStats._count.id * 100) : 0,
        averageResponseTime: testStats._avg.responseTime || 0,
        totalTestTokens: testStats._sum.tokensUsed || 0,
        totalTestCost: testStats._sum.cost || 0,
      },
      dailyData,
      period: {
        days,
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
      }
    };

    return NextResponse.json({
      success: true,
      stats
    });

  } catch (error: any) {
    console.error('Error fetching provider stats:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
