import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 Scheduled cleanup started at:', new Date().toISOString());

    // Delete all articles (daily cleanup at midnight)
    const deleteResult = await prisma.newsArticle.deleteMany({});

    console.log(`🗑️ Deleted ${deleteResult.count} articles`);

    // Also cleanup old crawl jobs
    const crawlJobsResult = await prisma.crawlJob.deleteMany({});
    
    console.log(`🗑️ Deleted ${crawlJobsResult.count} crawl jobs`);

    const totalDeleted = deleteResult.count + crawlJobsResult.count;

    console.log(`🏁 Scheduled cleanup completed. Total items deleted: ${totalDeleted}`);

    return NextResponse.json({
      success: true,
      message: `Scheduled cleanup completed`,
      timestamp: new Date().toISOString(),
      summary: {
        articlesDeleted: deleteResult.count,
        crawlJobsDeleted: crawlJobsResult.count,
        totalDeleted
      }
    });

  } catch (error) {
    console.error('❌ Error in scheduled cleanup:', error);
    return NextResponse.json(
      { 
        error: 'Failed to perform scheduled cleanup', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
