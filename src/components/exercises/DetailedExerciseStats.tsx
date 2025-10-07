'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, MessageCircle, Heart, TrendingUp } from 'lucide-react';
import { useCachedExerciseStats } from '@/hooks/useCachedExerciseStats';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { formatNumber, formatRating, getRatingColor, getTrendingStatus } from '@/lib/exercise-stats-utils';

interface DetailedExerciseStatsProps {
  exerciseId: string;
  title?: string;
  className?: string;
}

export function DetailedExerciseStats({ 
  exerciseId, 
  title = "Thống kê",
  className = '' 
}: DetailedExerciseStatsProps) {
  const { stats: cachedStats, loading } = useCachedExerciseStats([exerciseId]);
  const stats = cachedStats[exerciseId] || { views: 0, likes: 0 };

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    );
  }

  const trendingStatus = getTrendingStatus(stats.views);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center justify-between">
          <span>{title}</span>
          {trendingStatus.isTrending && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {trendingStatus.label}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Views */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lượt xem</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatNumber(stats.views)}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Tổng</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {stats.views.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Likes */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-red-100 dark:bg-red-900">
              <Heart className="w-5 h-5 text-red-600 dark:text-red-400 fill-red-600 dark:fill-red-400" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Lượt thích</p>
              {stats.likes > 0 ? (
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {stats.likes} ❤️
                </p>
              ) : (
                <p className="text-lg text-gray-400">Chưa có</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Tổng</p>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {stats.likes} likes
            </p>
          </div>
        </div>

        {/* Engagement Rate */}
        {stats.views > 0 && stats.likes > 0 && (
          <div className="pt-3 border-t border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-400">Tỷ lệ thích</span>
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                {((stats.likes / stats.views) * 100).toFixed(2)}%
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
