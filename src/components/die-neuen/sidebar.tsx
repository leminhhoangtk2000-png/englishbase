'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewsArticle } from './types';
import { useTheme } from '@/hooks/use-theme';
import { getUITheme } from '@/config/themes';

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
  const { theme } = useTheme();
  const currentTheme = getUITheme(theme);
  
  const displayedCount = Math.min(currentPage * articlesPerPage, filteredArticles.length);

  const categoryCounts = articles.reduce((acc, article) => {
    acc[article.category] = (acc[article.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const featuredCount = articles.filter(article => article.featured).length;

  // Use semantic theme colors like blog
  const getThemeStyles = () => {
    return {
      card: "bg-card border border-border rounded-lg p-6",
      title: "text-lg font-semibold text-foreground mb-4",
      label: "text-sm text-muted-foreground",
      value: "text-2xl font-bold text-foreground",
      badge: "bg-secondary text-secondary-foreground",
      categoryItem: "flex justify-between items-center py-2 border-b border-border last:border-b-0",
      categoryName: "text-foreground",
      categoryCount: "text-muted-foreground"
    };
  };  const styles = getThemeStyles();

  return (
    <aside className="w-full lg:w-80 space-y-6">
      {/* Statistics */}
      <Card className={styles.card}>
        <CardContent className="p-6">
          <h3 className={`text-lg font-medium mb-4 ${styles.title}`}>
            Statistiken
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className={styles.label}>Gesamt</span>
              <Badge variant="outline" className={styles.badge}>{articles.length}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className={styles.label}>Angezeigt</span>
              <Badge variant="outline" className={styles.badge}>{displayedCount}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className={styles.label}>Featured</span>
              <Badge variant="outline" className={styles.badge}>{featuredCount}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className={styles.card}>
        <CardContent className="p-6">
          <h3 className={`text-lg font-medium mb-4 ${styles.title}`}>
            Kategorien
          </h3>
          <div className="space-y-2">
            {Object.entries(categoryCounts)
              .sort(([,a], [,b]) => b - a)
              .map(([category, count]) => (
                <div key={category} className="flex justify-between items-center">
                  <span className={`${styles.label} capitalize`}>{category}</span>
                  <Badge variant="outline" className={styles.badge}>{count}</Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </aside>
  );
}
