import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status');

    const where: any = {};
    
    if (status) {
      where.status = status;
    }

    const crawlJobs = await prisma.crawlJob.findMany({
      where,
      orderBy: {
        startedAt: 'desc'
      },
      take: limit,
      skip: (page - 1) * limit,
    });

    const total = await prisma.crawlJob.count({ where });

    return NextResponse.json(crawlJobs);

  } catch (error) {
    console.error('Error fetching crawl jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch crawl jobs' },
      { status: 500 }
    );
  }
}
