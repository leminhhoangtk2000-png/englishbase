'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewsArticle } from './types';

interface SidebarProps {
  articles: NewsArticle[];
  filteredArticles: NewsArticle[];
  currentPage: number;
  totalPages: number;
  articlesPerPage: number;
}

export default function Sidebar({ 
  articles, 
  filteredArticles, 
  currentPage, 
  totalPages, 
  articlesPerPage 
}: SidebarProps) {
  const uniqueSources = [...new Set(articles.map(a => a.source))];
  const displayedCount = Math.min(currentPage * articlesPerPage, filteredArticles.length);

  const categoryCounts = articles.reduce((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sourceCounts = articles.reduce((acc, article) => {
    acc[article.source] = (acc[article.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const featuredCount = articles.filter(article => article.featured).length;

  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* Statistics */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4 text-gray-900">
            Statistiken
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Gesamt</span>
              <Badge variant="outline" className="border-gray-300 text-gray-700">{articles.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Angezeigt</span>
              <Badge variant="outline" className="border-gray-300 text-gray-700">{displayedCount}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Featured</span>
              <Badge variant="outline" className="border-gray-300 text-gray-700">{featuredCount}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Quellen</span>
              <Badge variant="outline" className="border-gray-300 text-gray-700">{uniqueSources.length}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4 text-gray-900">
            Kategorien
          </h3>
          <div className="space-y-2">
            {Object.entries(categoryCounts)
              .sort(([,a], [,b]) => b - a)
              .map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className="text-gray-700 capitalize text-sm">{category}</span>
                  <Badge variant="outline" className="border-gray-300 text-gray-600 text-xs">
                    {count}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Sources */}
      <Card className="border-gray-200">
        <CardContent className="p-6">
          <h3 className="text-lg font-medium mb-4 text-gray-900">
            Top Quellen
          </h3>
          <div className="space-y-2">
            {Object.entries(sourceCounts)
              .sort(([,a], [,b]) => b - a)
              .slice(0, 8)
              .map(([source, count]) => (
                <div key={source} className="flex justify-between items-center">
                  <span className="text-gray-700 text-sm truncate">{source}</span>
                  <Badge variant="outline" className="border-gray-300 text-gray-600 text-xs">
                    {count}
                  </Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
