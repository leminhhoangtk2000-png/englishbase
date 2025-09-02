import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { NewspaperCrawler } from '../../../../../scripts/news-crawler/newspaper-crawler';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, minWordCount = 2000, maxWordCount = 4000, maxArticles = 10 } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Create a new crawl job
    const crawlJob = await prisma.crawlJob.create({
      data: {
        source: url,
        status: 'RUNNING',
        articlesFound: 0,
        articlesAdded: 0,
      }
    });

    let crawlResult;
    let articlesAdded = 0;
    let errorMessage = '';

    try {
      const crawler = new NewspaperCrawler();
      
      // Determine if this is a single article or a news site
      const isArticleUrl = url.includes('/artikel/') || 
                          url.includes('/article/') || 
                          url.includes('/news/') ||
                          url.includes('/politik/') ||
                          url.includes('/wirtschaft/') ||
                          url.includes('/sport/') ||
                          url.includes('/kultur/') ||
                          url.includes('/panorama/') ||
                          url.includes('/wissenschaft/');

      if (isArticleUrl) {
        // Crawl single article
        crawlResult = await crawler.crawlSingleArticle(url, minWordCount, maxWordCount);
      } else {
        // Crawl news site for multiple articles
        crawlResult = await crawler.crawlNewsSource(url, maxArticles, minWordCount, maxWordCount);
      }

      if (!crawlResult.success) {
        throw new Error(crawlResult.error || 'Crawling failed');
      }

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
            articlesAdded++;
            console.log(`Saved article: ${article.title}`);
          } else {
            console.log(`Article already exists: ${article.url}`);
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
          articlesFound: crawlResult.articles_found,
          articlesAdded,
          completedAt: new Date(),
        }
      });

      return NextResponse.json({
        message: `Crawl completed. Found ${crawlResult.articles_found} articles, added ${articlesAdded} new articles.`,
        crawlJobId: crawlJob.id,
        articlesFound: crawlResult.articles_found,
        articlesAdded,
        success: crawlResult.success
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
    console.error('Error in crawl-news:', error);
    return NextResponse.json(
      { error: 'Failed to crawl news', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
