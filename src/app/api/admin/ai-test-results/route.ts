import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const providerId = url.searchParams.get('providerId');
    const page = parseInt(url.searchParams.get('page') || '1');
    const limit = parseInt(url.searchParams.get('limit') || '20');

    const skip = (page - 1) * limit;

    const where = providerId ? { providerId } : {};

    const [testResults, totalCount] = await Promise.all([
      prisma.aITestResult.findMany({
        where,
        include: {
          provider: {
            select: {
              name: true,
              displayName: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.aITestResult.count({ where })
    ]);

    return NextResponse.json({
      testResults,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching test results:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
