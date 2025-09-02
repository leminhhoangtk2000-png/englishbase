import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Calculate date threshold (24 hours ago)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    // Delete articles older than 24 hours
    const deleteResult = await prisma.newsArticle.deleteMany({
      where: {
        createdAt: {
          lt: yesterday
        }
      }
    });

    // Delete old crawl jobs
    await prisma.crawlJob.deleteMany({
      where: {
        startedAt: {
          lt: yesterday
        }
      }
    });

    // Reset auto-increment or any other cleanup needed
    console.log(`Daily cleanup completed: ${deleteResult.count} articles deleted`);

    return NextResponse.json({ 
      success: true,
      deletedArticles: deleteResult.count,
      message: `Daily reset completed. Deleted ${deleteResult.count} old articles.`
    });

  } catch (error) {
    console.error('Error during daily reset:', error);
    return NextResponse.json(
      { success: false, error: 'Daily reset failed' }, 
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Get statistics about current articles
    const stats = await prisma.newsArticle.aggregate({
      _count: {
        id: true,
      },
      where: {
        isActive: true
      }
    });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayArticles = await prisma.newsArticle.count({
      where: {
        createdAt: {
          gte: todayStart
        },
        isActive: true
      }
    });

    const hotArticles = await prisma.newsArticle.count({
      where: {
        isHot: true,
        isActive: true
      }
    });

    return NextResponse.json({
      totalArticles: stats._count.id,
      todayArticles,
      hotArticles,
      lastResetNeeded: stats._count.id > 1000 // Suggest reset if too many articles
    });

  } catch (error) {
    console.error('Error getting reset stats:', error);
    return NextResponse.json(
      { error: 'Failed to get reset statistics' }, 
      { status: 500 }
    );
  }
}
