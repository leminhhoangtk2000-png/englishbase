'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Eye, Heart, MessageCircle, Share2, Globe, Brain, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { MainNav } from '@/components/main-nav';

interface NewsArticle {
  id: string;
  title: string;
  url: string;
  content: string;
  excerpt: string;
  source: string;
  publishedAt: string | null;
  wordCount: number;
  isHot: boolean;
  hotScore: number | null;
  aiAnalysis: string | null;
  createdAt: string;
  difficulty?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}

const categories = [
  { id: 'all', name: 'All Stories', icon: '📰' },
  { id: 'politics', name: 'Politics & Policy', icon: '🏛️' },
  { id: 'business', name: 'Business', icon: '📊' },
  { id: 'technology', name: 'Technology', icon: '💻' },
  { id: 'health', name: 'Health', icon: '🏥' },
  { id: 'climate', name: 'Energy & Climate', icon: '🌱' },
];

export default function DieNeuen() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [interestingArticles, setInterestingArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      
      // Fetch interesting articles (AI-selected top 3)
      const interestingResponse = await fetch('/api/admin/news-articles?interesting=true');
      const interesting = await interestingResponse.json();
      setInterestingArticles(interesting);
      
      // Fetch all recent articles  
      const allResponse = await fetch('/api/admin/news-articles?limit=20');
      const all = await allResponse.json();
      setArticles(all);
      
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryFromTitle = (title: string): string => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('politik') || titleLower.includes('bundestag') || titleLower.includes('regierung')) return 'politics';
    if (titleLower.includes('wirtschaft') || titleLower.includes('unternehmen') || titleLower.includes('markt')) return 'business';
    if (titleLower.includes('technologie') || titleLower.includes('digital') || titleLower.includes('ki')) return 'technology';
    if (titleLower.includes('gesundheit') || titleLower.includes('medizin') || titleLower.includes('arzt')) return 'health';
    if (titleLower.includes('klima') || titleLower.includes('umwelt') || titleLower.includes('energie')) return 'climate';
    return 'all';
  };

  const getDisplayArticles = () => {
    // Combine interesting articles with regular articles, avoiding duplicates
    const interestingIds = new Set(interestingArticles.map(a => a.id));
    const regularArticles = articles.filter(a => !interestingIds.has(a.id));
    
    // Create combined list with interesting articles first
    const combined = [...interestingArticles, ...regularArticles];
    
    if (selectedCategory === 'all') {
      return combined.slice(0, 5); // Show top 5 articles
    }
    
    return combined
      .filter(article => getCategoryFromTitle(article.title) === selectedCategory)
      .slice(0, 5);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const displayArticles = getDisplayArticles();
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

const categories = ['Alle', 'Politik', 'Wirtschaft', 'Kultur', 'Sport', 'Wissenschaft', 'Bildung'];
const difficulties = ['Alle', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

export default function DieNeuenPage() {
  const [articles, setArticles] = useState<NewsArticle[]>(mockNews);
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [selectedDifficulty, setSelectedDifficulty] = useState('Alle');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredArticles = articles.filter(article => {
    const matchesCategory = selectedCategory === 'Alle' || article.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'Alle' || article.difficulty === selectedDifficulty;
    const matchesSearch = searchTerm === '' || 
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesDifficulty && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'A1': 'bg-green-100 text-green-800 border-green-200',
      'A2': 'bg-blue-100 text-blue-800 border-blue-200',
      'B1': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'B2': 'bg-orange-100 text-orange-800 border-orange-200',
      'C1': 'bg-red-100 text-red-800 border-red-200',
      'C2': 'bg-purple-100 text-purple-800 border-purple-200'
    };
    return colors[difficulty as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Navigation */}
      <MainNav />
      
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-12">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Globe className="w-8 h-8 text-blue-600" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
                Die Neuen
              </h1>
            </div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Täglich aktuelle Nachrichten auf Deutsch 📰
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
              Verbessern Sie Ihr Deutsch mit aktuellen Nachrichten aus Deutschland und der Welt
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-6 mb-8">
          {/* Search */}
          <div className="flex-1">
            <input
              type="text"
              placeholder="Nachrichten suchen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="text-sm"
              >
                {category}
              </Button>
            ))}
          </div>

          {/* Difficulty Filter */}
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <Button
                key={difficulty}
                variant={selectedDifficulty === difficulty ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDifficulty(difficulty)}
                className="text-sm"
              >
                {difficulty}
              </Button>
            ))}
          </div>
        </div>

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((article) => (
            <Card key={article.id} className="hover:shadow-lg transition-all duration-300 group">
              {/* Article Image */}
              {article.image && (
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className={`text-xs font-medium border ${getDifficultyColor(article.difficulty)}`}>
                      {article.difficulty}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="text-xs">
                      {article.category}
                    </Badge>
                  </div>
                </div>
              )}

              <CardHeader className="pb-3">
                <CardTitle className="text-lg leading-tight hover:text-blue-600 transition-colors">
                  <Link href={`/die-neuen/${article.id}`}>
                    {article.title}
                  </Link>
                </CardTitle>
                {article.subtitle && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                    {article.subtitle}
                  </p>
                )}
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {article.excerpt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {article.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                {/* Article Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{format(new Date(article.publishedAt), 'dd.MM.yyyy', { locale: de })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{article.readTime} Min.</span>
                    </div>
                  </div>
                </div>

                {/* Social Stats */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>{article.views}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Heart className="w-3 h-3" />
                      <span>{article.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-3 h-3" />
                      <span>{article.comments}</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" className="h-6 px-2">
                    <Share2 className="w-3 h-3" />
                  </Button>
                </div>

                {/* Author */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-bold">
                      {article.author.name.charAt(0)}
                    </span>
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {article.author.name}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
              Keine Nachrichten gefunden
            </h3>
            <p className="text-gray-500 dark:text-gray-500">
              Versuchen Sie andere Filter oder Suchbegriffe
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
