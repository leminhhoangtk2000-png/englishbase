import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { articleId } = await request.json();

    if (!articleId) {
      return NextResponse.json({ error: 'Article ID is required' }, { status: 400 });
    }

    // Get current article
    const article = await prisma.newsArticle.findUnique({
      where: { id: articleId }
    });

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // Toggle favorite status
    const updatedArticle = await prisma.newsArticle.update({
      where: { id: articleId },
      data: {
        isFavorite: !article.isFavorite,
        favoriteAt: !article.isFavorite ? new Date() : null
      }
    });

    return NextResponse.json({
      success: true,
      article: {
        id: updatedArticle.id,
        title: updatedArticle.title,
        isFavorite: updatedArticle.isFavorite,
        favoriteAt: updatedArticle.favoriteAt
      }
    });

  } catch (error) {
    console.error('Error toggling favorite:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
