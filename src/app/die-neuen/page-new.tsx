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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <MainNav />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Die Neuen
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Daily curated German news articles selected by AI for Vietnamese learners
          </p>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                ${selectedCategory === category.id 
                  ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                  : "bg-white/80 hover:bg-white border-slate-200 text-slate-700"
                }
                rounded-full px-4 py-2 transition-all duration-200 backdrop-blur-sm
              `}
            >
              <span className="mr-2">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading articles...</p>
          </div>
        )}

        {/* Articles Grid */}
        {!loading && (
          <div className="grid gap-6">
            {displayArticles.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600">No articles found for this category.</p>
              </div>
            ) : (
              displayArticles.map((article, index) => (
                <Card 
                  key={article.id} 
                  className={`
                    group hover:shadow-xl transition-all duration-300 border-0 overflow-hidden
                    ${index === 0 
                      ? "bg-gradient-to-br from-blue-50 to-purple-50 border-l-4 border-l-blue-500" 
                      : "bg-white/80 backdrop-blur-sm hover:bg-white"
                    }
                  `}
                >
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      {/* Article Number */}
                      <div className={`
                        flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold
                        ${index === 0 
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg" 
                          : "bg-slate-100 text-slate-600"
                        }
                      `}>
                        {index + 1}
                      </div>

                      {/* Article Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-600">
                              {article.source}
                            </Badge>
                            {article.isHot && (
                              <Badge variant="default" className="bg-gradient-to-r from-orange-400 to-red-400 text-white">
                                <Brain className="h-3 w-3 mr-1" />
                                AI Selected
                              </Badge>
                            )}
                            <span className="text-xs text-slate-500">
                              {formatTimeAgo(article.createdAt)}
                            </span>
                          </div>
                        </div>

                        <h2 className={`
                          font-bold mb-3 leading-tight group-hover:text-blue-600 transition-colors
                          ${index === 0 ? "text-xl" : "text-lg"}
                        `}>
                          {article.title}
                        </h2>

                        <p className="text-slate-600 mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>

                        {/* AI Analysis */}
                        {article.aiAnalysis && (
                          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-3 rounded-lg mb-4 border-l-2 border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <Brain className="h-4 w-4 text-blue-500" />
                              <span className="text-sm font-medium text-blue-700">AI Analysis for Vietnamese Learners</span>
                            </div>
                            <p className="text-sm text-slate-700">{article.aiAnalysis}</p>
                          </div>
                        )}

                        {/* Article Stats */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-slate-500">
                            <span className="flex items-center gap-1">
                              <Globe className="h-4 w-4" />
                              {article.wordCount} words
                            </span>
                            {article.hotScore && (
                              <span className="flex items-center gap-1">
                                <Brain className="h-4 w-4" />
                                Score: {article.hotScore}/10
                              </span>
                            )}
                          </div>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            asChild
                            className="group-hover:bg-blue-50 group-hover:border-blue-200 group-hover:text-blue-600"
                          >
                            <a 
                              href={article.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2"
                            >
                              <ExternalLink className="h-4 w-4" />
                              Read Original
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* Footer Info */}
        <div className="text-center mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-xl border border-slate-200">
          <p className="text-slate-600 mb-2">
            Articles are automatically crawled at 7:00 AM daily and analyzed by AI for Vietnamese German learners
          </p>
          <p className="text-sm text-slate-500">
            Top 3 articles are selected based on language learning value, cultural relevance, and educational potential
          </p>
        </div>
      </div>
    </div>
  );
}
