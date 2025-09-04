'use client';

import Link from 'next/link';
import Image from 'next/image';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Clock, Eye } from 'lucide-react';
import { NewsArticle } from './types';
import { LikeDisplay } from '@/components/ui/like-display';
import { ThemedBadge } from '@/components/ui/themed-badge';
import { useTheme } from '@/hooks/use-theme';
import { getUITheme } from '@/config/themes';

interface ArticleCardProps {
  article: NewsArticle;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const { theme } = useTheme();
  const currentTheme = getUITheme(theme);
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd.MM.yyyy', { locale: de });
  };

  // Use semantic theme colors like blog
  const getThemeStyles = () => {
    return {
      card: "bg-card border border-border shadow-sm hover:shadow-lg",
      image: "bg-card",
      imagePlaceholder: "bg-muted text-muted-foreground",
      content: "bg-card",
      title: "text-foreground hover:text-primary",
      excerpt: "text-muted-foreground",
      meta: "text-muted-foreground border-border"
    };
  };

  const styles = getThemeStyles();

  return (
    <article className={`${styles.card} transition-all duration-300 rounded-xl overflow-hidden hover:scale-[1.02] transform hover:-translate-y-1`}>
      <Link href={`/die-neuen/${article.id}`} className="block h-full">
        <div className="flex h-full">
          {/* Image */}
          <div className={`w-32 h-32 ${styles.image} flex-shrink-0 relative overflow-hidden`}>
            {article.imageUrl ? (
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-300"
              />
            ) : (
              <div className={`w-full h-full flex items-center justify-center ${styles.imagePlaceholder}`}>
                <span className="text-2xl">📰</span>
              </div>
            )}
            {article.featured && (
              <div className="absolute top-2 left-2">
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs shadow-lg border-0">
                  ⭐ Featured
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className={`flex-1 p-5 flex flex-col justify-between ${styles.content}`}>
            {/* Badges */}
            <div className="flex gap-2 mb-3">
              <ThemedBadge variant="themed" className="text-xs font-medium shadow-sm">
                {article.category}
              </ThemedBadge>
            </div>

            {/* Title */}
            <h3 className={`font-bold ${styles.title} mb-3 line-clamp-2 leading-tight text-base transition-colors`}>
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className={`${styles.excerpt} text-sm mb-4 line-clamp-2 leading-relaxed`}>
              {article.excerpt}
            </p>

            {/* Meta */}
            <div className={`flex items-center gap-4 text-xs ${styles.meta} pt-2 border-t`}>
              <div className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                {formatDate(article.publishedAt)}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-green-400" />
                {article.wordCount} Wörter
              </div>
              <LikeDisplay url={`/die-neuen/${article.id}`} initialLikes={article.id === '1' ? 67 : article.id === '2' ? 53 : article.id === '3' ? 41 : article.id === '4' ? 38 : 32} className="text-xs ml-auto" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
