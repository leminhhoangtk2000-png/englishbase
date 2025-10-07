'use client';

import React from 'react';
import { Eye, MessageCircle, Heart } from 'lucide-react';
import { useExerciseStats } from '@/hooks/use-exercise-stats';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber } from '@/lib/exercise-stats-utils';

interface ExerciseStatsDisplayProps {
  exerciseId: string;
  className?: string;
  showLabels?: boolean;
  preloadedStats?: {
    views: number;
    likes: number;
  };
}

export function ExerciseStatsDisplay({ 
  exerciseId, 
  className = '',
  showLabels = false,
  preloadedStats
}: ExerciseStatsDisplayProps) {
  // 🚀 Nếu có preloadedStats từ batch API, dùng luôn không cần fetch
  const shouldFetch = !preloadedStats;
  const { stats: fetchedStats, loading, error } = useExerciseStats(
    shouldFetch ? exerciseId : null
  );
  
  const stats = preloadedStats || fetchedStats;

  if (shouldFetch && loading) {
    return (
      <div className={`flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 ${className}`}>
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    );
  }

  if (shouldFetch && error) {
    return null; // Silently fail, don't break the UI
  }

  if (!stats) {
    return null;
  }

  return (
    <div className={`flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 ${className}`}>
      <span className="flex items-center gap-1.5" title={`${stats.views.toLocaleString()} lượt xem`}>
        <Eye className="w-4 h-4" />
        <span>{formatNumber(stats.views)}</span>
        {showLabels && <span className="hidden sm:inline">views</span>}
      </span>

      <span className="flex items-center gap-1.5" title={`${stats.likes} lượt thích`}>
        <Heart className="w-4 h-4" />
        <span>{stats.likes}</span>
        {showLabels && <span className="hidden sm:inline">likes</span>}
      </span>
    </div>
  );
}
