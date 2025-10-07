'use client';

import React from 'react';
import { Eye, MessageCircle, Heart } from 'lucide-react';
import { useCachedExerciseStats } from '@/hooks/useCachedExerciseStats';
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
  // 🚀 Sử dụng cache system mới thay vì useExerciseStats cũ
  const { stats: cachedStats, loading, checkForUpdates } = useCachedExerciseStats([exerciseId]);
  
  // Ưu tiên preloadedStats, nếu không có thì dùng cached stats
  const stats = preloadedStats || cachedStats[exerciseId] || { views: 0, likes: 0 };

  if (loading && !preloadedStats) {
    return (
      <div className={`flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 ${className}`}>
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    );
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
