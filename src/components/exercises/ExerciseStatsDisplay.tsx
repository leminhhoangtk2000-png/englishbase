'use client';

import React from 'react';
import { Eye, MessageCircle, Star } from 'lucide-react';
import { useExerciseStats } from '@/hooks/use-exercise-stats';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber } from '@/lib/exercise-stats-utils';

interface ExerciseStatsDisplayProps {
  exerciseId: string;
  className?: string;
  showLabels?: boolean;
}

export function ExerciseStatsDisplay({ 
  exerciseId, 
  className = '',
  showLabels = false 
}: ExerciseStatsDisplayProps) {
  const { stats, loading, error } = useExerciseStats(exerciseId);

  if (loading) {
    return (
      <div className={`flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 ${className}`}>
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-16" />
      </div>
    );
  }

  if (error) {
    return null; // Silently fail, don't break the UI
  }

  return (
    <div className={`flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 ${className}`}>
      <span className="flex items-center gap-1.5" title={`${stats.views.toLocaleString()} lượt xem`}>
        <Eye className="w-4 h-4" />
        <span>{formatNumber(stats.views)}</span>
        {showLabels && <span className="hidden sm:inline">views</span>}
      </span>
      
      <span className="flex items-center gap-1.5" title={`${stats.comments} bình luận`}>
        <MessageCircle className="w-4 h-4" />
        <span>{stats.comments}</span>
        {showLabels && <span className="hidden sm:inline">comments</span>}
      </span>
      
      {stats.totalRatings > 0 && (
        <span 
          className="flex items-center gap-1.5" 
          title={`${stats.rating.toFixed(1)} sao (${stats.totalRatings} đánh giá)`}
        >
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="font-medium">{stats.rating.toFixed(1)}</span>
          <span className="text-xs text-gray-500 dark:text-gray-500">({stats.totalRatings})</span>
        </span>
      )}
    </div>
  );
}
