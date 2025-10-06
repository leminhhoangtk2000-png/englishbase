'use client';

import { useQuery } from '@tanstack/react-query';

interface ExerciseStats {
  views: number;
  comments: number;
  rating: number;
  totalRatings: number;
  completions: number;
}

/**
 * Hook to fetch stats for multiple exercises with caching
 * 
 * Features:
 * - Batch fetching (1 API call for all exercises)
 * - 5-minute cache
 * - Auto-refresh on window focus
 * - Loading and error states
 * 
 * Usage:
 * const { data, isLoading, error } = useBatchExerciseStats(['ex1', 'ex2', 'ex3']);
 */
export function useBatchExerciseStats(exerciseIds: string[]) {
  return useQuery({
    queryKey: ['exercise-stats-batch', ...exerciseIds.sort()], // Sort for consistent cache key
    queryFn: async () => {
      if (exerciseIds.length === 0) {
        return {};
      }

      const params = new URLSearchParams();
      exerciseIds.forEach(id => params.append('ids', id));

      const response = await fetch(`/api/exercise-stats-batch?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch batch stats');
      }

      const data = await response.json();
      return data.stats as Record<string, ExerciseStats>;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime in v4)
    refetchOnWindowFocus: true,
    refetchOnMount: false,
    enabled: exerciseIds.length > 0,
  });
}

/**
 * Hook to get stats for a single exercise from batch cache
 * 
 * This extracts data from the batch query, avoiding redundant API calls
 */
export function useSingleExerciseStats(exerciseId: string, allExerciseIds: string[]) {
  const { data, isLoading, error } = useBatchExerciseStats(allExerciseIds);
  
  return {
    stats: data?.[exerciseId] || {
      views: 0,
      comments: 0,
      rating: 0,
      totalRatings: 0,
      completions: 0
    },
    isLoading,
    error
  };
}
