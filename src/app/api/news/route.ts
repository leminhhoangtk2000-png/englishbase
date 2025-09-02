import { NextRequest, NextResponse } from 'next/server';

// Mock data for news articles
const mockNews = [
  {
    id: '1',
    title: 'Deutschland führt neue Klimaschutzgesetze ein',
    subtitle: 'Bundestag beschließt strengere Regeln für Unternehmen',
    content: 'Der Deutsche Bundestag hat heute neue Gesetze zum Klimaschutz verabschiedet...',
    excerpt: 'Deutschland verschärft seine Klimaschutzgesetze. Unternehmen müssen künftig strengere Auflagen erfüllen.',
    category: 'Politik',
    tags: ['Klimaschutz', 'Umwelt', 'Politik', 'Deutschland'],
    publishedAt: new Date().toISOString(),
    readTime: 3,
    views: 1240,
    likes: 89,
    comments: 15,
    difficulty: 'B1',
    image: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?w=800&h=400&fit=crop',
    author: {
      name: 'Deutsche Welle',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=dw'
    }
  },
  {
    id: '2',
    title: 'Neue Studie: Deutsche lernen mehr Fremdsprachen',
    subtitle: 'Besonders Englisch und Spanisch sind beliebt',
    content: 'Eine aktuelle Studie zeigt, dass Deutsche immer mehr Fremdsprachen lernen...',
    excerpt: 'Immer mehr Deutsche lernen Fremdsprachen. Englisch bleibt die beliebteste Sprache.',
    category: 'Bildung',
    tags: ['Bildung', 'Sprachen', 'Studie'],
    publishedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    readTime: 2,
    views: 892,
    likes: 67,
    comments: 8,
    difficulty: 'A2',
    image: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=800&h=400&fit=crop',
    author: {
      name: 'Bildungsredaktion',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bildung'
    }
  },
  {
    id: '3',
    title: 'Berlin: Neues Museum für moderne Kunst eröffnet',
    subtitle: 'Kostenloser Eintritt in der ersten Woche',
    content: 'In Berlin wurde ein neues Museum für moderne Kunst eröffnet...',
    excerpt: 'Berlin bekommt ein neues Kunstmuseum. Die Eröffnungswoche ist kostenfrei.',
    category: 'Kultur',
    tags: ['Kultur', 'Berlin', 'Kunst', 'Museum'],
    publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    readTime: 4,
    views: 567,
    likes: 45,
    comments: 12,
    difficulty: 'B2',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=400&fit=crop',
    author: {
      name: 'Kulturredaktion',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=kultur'
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit');
    
    let filteredNews = [...mockNews];

    // Filter by category
    if (category && category !== 'Alle') {
      filteredNews = filteredNews.filter(article => article.category === category);
    }

    // Filter by difficulty
    if (difficulty && difficulty !== 'Alle') {
      filteredNews = filteredNews.filter(article => article.difficulty === difficulty);
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filteredNews = filteredNews.filter(article => 
        article.title.toLowerCase().includes(searchLower) ||
        article.excerpt.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Apply limit
    if (limit) {
      const limitNum = parseInt(limit);
      filteredNews = filteredNews.slice(0, limitNum);
    }

    return NextResponse.json({
      success: true,
      articles: filteredNews,
      total: filteredNews.length
    });

  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Trong tương lai có thể thêm API để tạo bài viết mới
    // Hiện tại chỉ return mock response
    const body = await request.json();
    
    return NextResponse.json({
      success: true,
      message: 'Article creation endpoint - to be implemented'
    });

  } catch (error) {
    console.error('Error creating news article:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
