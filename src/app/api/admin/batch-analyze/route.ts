import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { limit = 10, providerId } = await request.json();

    // Get unanalyzed articles from today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const articles = await prisma.newsArticle.findMany({
      where: {
        analyzedAt: null,
        createdAt: {
          gte: today
        },
        isActive: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    if (articles.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No articles to analyze',
        analyzed: 0
      });
    }

    // Get AI provider
    let provider;
    if (providerId) {
      provider = await prisma.aIProvider.findUnique({
        where: { id: providerId }
      });
    } else {
      provider = await prisma.aIProvider.findFirst({
        where: { isActive: true }
      });
    }

    if (!provider) {
      return NextResponse.json({ error: 'No active AI provider found' }, { status: 404 });
    }

    const results = [];
    let analyzed = 0;
    let errors = 0;

    for (const article of articles) {
      try {
        // Analyze each article
        const response = await fetch(`${request.url.replace('/batch-analyze', '/analyze-article')}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            articleId: article.id,
            providerId: provider.id
          }),
        });

        const result = await response.json();
        
        if (result.success) {
          analyzed++;
          results.push({
            id: article.id,
            title: article.title,
            isHot: result.article.isHot,
            hotScore: result.article.hotScore,
            analysis: result.analysis.reasoning
          });
        } else {
          errors++;
          console.error(`Failed to analyze article ${article.id}:`, result.error);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));

      } catch (error) {
        console.error(`Error analyzing article ${article.id}:`, error);
        errors++;
      }
    }

    return NextResponse.json({
      success: true,
      analyzed,
      errors,
      total: articles.length,
      results,
      provider: provider.displayName
    });

  } catch (error) {
    console.error('Error in batch analysis:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
