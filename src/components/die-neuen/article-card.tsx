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

interface ArticleCardProps {
  article: NewsArticle;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'dd.MM.yyyy', { locale: de });
  };

  return (
    <article className="bg-white border border-gray-200 hover:border-gray-300 transition-colors">
      <Link href={`/die-neuen/${article.id}`} className="block">
        <div className="flex">
          {/* Image */}
          <div className="w-24 h-24 bg-gray-100 flex-shrink-0 relative">
            {article.imageUrl ? (
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                📰
              </div>
            )}
            {article.featured && (
              <div className="absolute top-1 left-1">
                <Badge className="bg-gray-900 text-white text-xs">
                  Featured
                </Badge>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            {/* Badges */}
            <div className="flex gap-2 mb-2">
              <ThemedBadge variant="themed" className="text-xs">
                {article.category}
              </ThemedBadge>
              <Badge variant="outline" className="text-xs border-gray-200 text-gray-500">
                {article.source}
              </Badge>
            </div>

            {/* Title */}
            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 leading-snug">
              {article.title}
            </h3>

            {/* Excerpt */}
            <p className="text-gray-600 text-sm mb-3 line-clamp-2 leading-relaxed">
              {article.excerpt}
            </p>

            {/* Meta */}
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatDate(article.publishedAt)}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="w-3 h-3" />
                {article.wordCount} Wörter
              </div>
              <LikeDisplay url={`/die-neuen/${article.id}`} initialLikes={article.id === '1' ? 67 : article.id === '2' ? 53 : article.id === '3' ? 41 : article.id === '4' ? 38 : 32} className="text-xs" />
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}
