import { NextRequest, NextResponse } from 'next/server';
import { NewspaperCrawler } from '../../../../../scripts/news-crawler/newspaper-crawler';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    // Create a crawl job for the scheduled run
    const crawlJob = await prisma.crawlJob.create({
      data: {
        source: 'scheduled-all-sources',
        status: 'RUNNING',
        articlesFound: 0,
        articlesAdded: 0,
      }
    });

    let totalArticlesFound = 0;
    let totalArticlesAdded = 0;
    let errorMessage = '';

    try {
      const crawler = new NewspaperCrawler();
      
      // Crawl all German news sources
      const crawlResult = await crawler.crawlAllSources(5, 2000); // Max 5 articles per source, min 2000 chars

      if (!crawlResult.success) {
        throw new Error(crawlResult.error || 'Scheduled crawl failed');
      }

      totalArticlesFound = crawlResult.articles_found;

      // Save articles to database
      for (const article of crawlResult.articles) {
        try {
          // Check if article already exists
          const existingArticle = await prisma.newsArticle.findUnique({
            where: { url: article.url }
          });

          if (!existingArticle) {
            await prisma.newsArticle.create({
              data: {
                title: article.title,
                url: article.url,
                content: article.content,
                excerpt: article.excerpt,
                author: article.authors.length > 0 ? article.authors.join(', ') : null,
                publishedAt: article.publish_date ? new Date(article.publish_date) : null,
                source: article.source,
                wordCount: article.word_count,
                language: article.language,
                isActive: true,
                tags: article.keywords || []
              }
            });
            totalArticlesAdded++;
            console.log(`Saved article: ${article.title}`);
          }
        } catch (saveError) {
          console.error(`Error saving article ${article.url}:`, saveError);
        }
      }

      // Update crawl job as completed
      await prisma.crawlJob.update({
        where: { id: crawlJob.id },
        data: {
          status: 'COMPLETED',
          articlesFound: totalArticlesFound,
          articlesAdded: totalArticlesAdded,
          completedAt: new Date(),
        }
      });

      return NextResponse.json({
        message: `Scheduled crawl completed successfully. Found ${totalArticlesFound} articles, added ${totalArticlesAdded} new articles.`,
        crawlJobId: crawlJob.id,
        articlesFound: totalArticlesFound,
        articlesAdded: totalArticlesAdded,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Update crawl job as failed
      await prisma.crawlJob.update({
        where: { id: crawlJob.id },
        data: {
          status: 'FAILED',
          errorMessage,
          completedAt: new Date(),
        }
      });

      throw error;
    }

  } catch (error) {
    console.error('Error executing scheduled crawl:', error);
    return NextResponse.json(
      { error: 'Failed to execute scheduled crawl', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return cron job schedule info
    const scheduledTimes = [
      { time: '07:00', timezone: 'Europe/Berlin', description: 'Morning crawl' },
      { time: '18:00', timezone: 'Europe/Berlin', description: 'Evening crawl' }
    ];

    // Get recent crawl jobs
    const recentJobs = await prisma.crawlJob.findMany({
      where: {
        source: 'scheduled-all-sources'
      },
      orderBy: {
        startedAt: 'desc'
      },
      take: 5
    });

    return NextResponse.json({
      schedule: scheduledTimes,
      timezone: 'Europe/Berlin',
      currentTime: new Date().toISOString(),
      recentJobs,
      nextScheduledRuns: [
        '07:00 CET - Morning News Crawl',
        '18:00 CET - Evening News Crawl'
      ]
    });

  } catch (error) {
    console.error('Error getting cron job status:', error);
    return NextResponse.json(
      { error: 'Failed to get cron job status' },
      { status: 500 }
    );
  }
}
