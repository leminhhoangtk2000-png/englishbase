import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import axios from 'axios';
import * as cheerio from 'cheerio';

interface CrawlResult {
  title: string;
  url: string;
  content: string;
  excerpt?: string;
  author?: string;
  publishedAt?: Date;
  source: string;
  wordCount: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, minWordCount = 2000 } = body;

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

    let articlesFound = 0;
    let articlesAdded = 0;
    let errorMessage = '';

    try {
      // Determine if this is a single article or a news site
      const isArticleUrl = url.includes('/artikel/') || 
                          url.includes('/article/') || 
                          url.includes('/news/') ||
                          url.includes('/politik/') ||
                          url.includes('/wirtschaft/') ||
                          url.includes('/sport/') ||
                          url.includes('/kultur/');

      if (isArticleUrl) {
        // Crawl single article
        const article = await crawlSingleArticle(url, minWordCount);
        if (article) {
          articlesFound = 1;
          const saved = await saveArticle(article);
          if (saved) articlesAdded = 1;
        }
      } else {
        // Crawl news site for multiple articles
        const articles = await crawlNewsSite(url, minWordCount);
        articlesFound = articles.length;
        
        for (const article of articles) {
          const saved = await saveArticle(article);
          if (saved) articlesAdded++;
        }
      }

      // Update crawl job as completed
      await prisma.crawlJob.update({
        where: { id: crawlJob.id },
        data: {
          status: 'COMPLETED',
          articlesFound,
          articlesAdded,
          completedAt: new Date(),
        }
      });

      return NextResponse.json({
        message: `Crawl completed. Found ${articlesFound} articles, added ${articlesAdded} new articles.`,
        crawlJobId: crawlJob.id,
        articlesFound,
        articlesAdded
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

async function crawlSingleArticle(url: string, minWordCount: number): Promise<CrawlResult | null> {
  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 30000
    });

    const $ = cheerio.load(response.data);
    
    // Extract article content based on common German news site patterns
    const title = extractTitle($);
    const content = extractContent($);
    const author = extractAuthor($);
    const publishedAt = extractPublishedDate($);
    const source = extractSource(url);

    if (!title || !content) {
      console.log(`Failed to extract title or content from ${url}`);
      return null;
    }

    const wordCount = content.replace(/\s+/g, ' ').trim().length;
    
    if (wordCount < minWordCount) {
      console.log(`Article too short: ${wordCount} characters (min: ${minWordCount})`);
      return null;
    }

    return {
      title,
      url,
      content,
      excerpt: content.substring(0, 300) + '...',
      author,
      publishedAt,
      source,
      wordCount
    };

  } catch (error) {
    console.error(`Error crawling article ${url}:`, error);
    return null;
  }
}

async function crawlNewsSite(siteUrl: string, minWordCount: number): Promise<CrawlResult[]> {
  try {
    const response = await axios.get(siteUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      timeout: 30000
    });

    const $ = cheerio.load(response.data);
    const articleUrls = new Set<string>();

    // Extract article links based on common patterns
    $('a[href*="/artikel/"], a[href*="/article/"], a[href*="/news/"], a[href*="/politik/"], a[href*="/wirtschaft/"]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        let fullUrl = href;
        if (href.startsWith('/')) {
          const baseUrl = new URL(siteUrl);
          fullUrl = baseUrl.origin + href;
        }
        articleUrls.add(fullUrl);
      }
    });

    console.log(`Found ${articleUrls.size} potential article URLs from ${siteUrl}`);

    const articles: CrawlResult[] = [];
    const maxArticles = 10; // Limit to prevent overwhelming
    
    let count = 0;
    for (const articleUrl of articleUrls) {
      if (count >= maxArticles) break;
      
      const article = await crawlSingleArticle(articleUrl, minWordCount);
      if (article) {
        articles.push(article);
      }
      
      count++;
      // Add delay to be respectful
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return articles;

  } catch (error) {
    console.error(`Error crawling news site ${siteUrl}:`, error);
    return [];
  }
}

function extractTitle($: cheerio.CheerioAPI): string {
  // Try multiple selectors for title
  const titleSelectors = [
    'h1',
    '.article-title',
    '.headline',
    '.title',
    '[data-testid="headline"]',
    'title'
  ];

  for (const selector of titleSelectors) {
    const title = $(selector).first().text().trim();
    if (title && title.length > 10) {
      return title;
    }
  }
  
  return '';
}

function extractContent($: cheerio.CheerioAPI): string {
  // Try multiple selectors for content
  const contentSelectors = [
    '.article-content',
    '.article-body',
    '.content',
    '.text',
    '[data-testid="article-content"]',
    '.entry-content',
    'main article',
    '.post-content'
  ];

  for (const selector of contentSelectors) {
    const content = $(selector).text().trim();
    if (content && content.length > 500) {
      return content;
    }
  }

  // Fallback: try to get all p tags
  const paragraphs = $('p').map((_, el) => $(el).text().trim()).get();
  const content = paragraphs.join(' ').trim();
  
  if (content && content.length > 500) {
    return content;
  }

  return '';
}

function extractAuthor($: cheerio.CheerioAPI): string | undefined {
  const authorSelectors = [
    '.author',
    '.byline',
    '[data-testid="author"]',
    '.article-author',
    '.writer'
  ];

  for (const selector of authorSelectors) {
    const author = $(selector).first().text().trim();
    if (author && author.length > 2 && author.length < 100) {
      return author;
    }
  }

  return undefined;
}

function extractPublishedDate($: cheerio.CheerioAPI): Date | undefined {
  const dateSelectors = [
    '[datetime]',
    '.date',
    '.publish-date',
    '[data-testid="date"]',
    '.article-date'
  ];

  for (const selector of dateSelectors) {
    const dateStr = $(selector).first().attr('datetime') || $(selector).first().text().trim();
    if (dateStr) {
      const date = new Date(dateStr);
      if (!isNaN(date.getTime())) {
        return date;
      }
    }
  }

  return undefined;
}

function extractSource(url: string): string {
  try {
    const parsedUrl = new URL(url);
    let hostname = parsedUrl.hostname;
    
    // Remove 'www.' prefix if present
    if (hostname.startsWith('www.')) {
      hostname = hostname.substring(4);
    }
    
    return hostname;
  } catch {
    return 'Unknown';
  }
}

async function saveArticle(article: CrawlResult): Promise<boolean> {
  try {
    // Check if article already exists
    const existing = await prisma.newsArticle.findUnique({
      where: { url: article.url }
    });

    if (existing) {
      console.log(`Article already exists: ${article.url}`);
      return false;
    }

    await prisma.newsArticle.create({
      data: {
        title: article.title,
        url: article.url,
        content: article.content,
        excerpt: article.excerpt,
        author: article.author,
        publishedAt: article.publishedAt,
        source: article.source,
        wordCount: article.wordCount,
        language: 'de',
        isActive: true,
        tags: []
      }
    });

    console.log(`Saved article: ${article.title}`);
    return true;

  } catch (error) {
    console.error(`Error saving article ${article.url}:`, error);
    return false;
  }
}
