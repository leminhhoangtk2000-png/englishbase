import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const source = searchParams.get('source');
    const isActive = searchParams.get('isActive');

    const where: any = {};
    
    if (source) {
      where.source = { contains: source, mode: 'insensitive' };
    }
    
    if (isActive !== null) {
      where.isActive = isActive === 'true';
    }

    const articles = await prisma.newsArticle.findMany({
      where,
      orderBy: [
        {
          isHot: 'desc' // Hot articles first
        },
        {
          hotScore: 'desc' // Then by hot score
        },
        {
          createdAt: 'desc' // Finally by creation date
        }
      ],
      take: limit,
      skip: (page - 1) * limit,
    });

    const total = await prisma.newsArticle.count({ where });

    return NextResponse.json(articles);

  } catch (error) {
    console.error('Error fetching news articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch news articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      url,
      content,
      excerpt,
      author,
      publishedAt,
      source,
      wordCount,
      difficulty,
      tags
    } = body;

    // Validate required fields
    if (!title || !url || !content || !source) {
      return NextResponse.json(
        { error: 'Missing required fields: title, url, content, source' },
        { status: 400 }
      );
    }

    // Check if article already exists
    const existingArticle = await prisma.newsArticle.findUnique({
      where: { url }
    });

    if (existingArticle) {
      return NextResponse.json(
        { error: 'Article with this URL already exists' },
        { status: 409 }
      );
    }

    const article = await prisma.newsArticle.create({
      data: {
        title,
        url,
        content,
        excerpt,
        author,
        publishedAt: publishedAt ? new Date(publishedAt) : null,
        source,
        wordCount: wordCount || content.length,
        difficulty,
        tags: tags || [],
        isActive: true
      }
    });

    return NextResponse.json(article, { status: 201 });

  } catch (error) {
    console.error('Error creating news article:', error);
    return NextResponse.json(
      { error: 'Failed to create news article' },
      { status: 500 }
    );
  }
}
