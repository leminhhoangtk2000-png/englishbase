import { useState, useEffect, useCallback, useRef } from 'react';
import { getExerciseStats, clearExerciseStatsCache, getExerciseStatsCacheInfo } from '@/lib/exercise-stats-cache';

interface ExerciseStats {
  views: number;
  likes: number;
}

interface UseCachedExerciseStatsReturn {
  stats: Record<string, ExerciseStats>;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  checkForUpdates: () => Promise<void>; // New method for incremental updates
  clearCache: () => void;
  cacheInfo: any;
}

/**
 * Hook thông minh để fetch exercise stats với cache system
 * - Tự động cache data trong 2 tiếng
 * - Chỉ fetch từ database khi cần thiết
 * - Support refresh và clear cache thủ công
 */
export function useCachedExerciseStats(exerciseIds: string[]): UseCachedExerciseStatsReturn {
  const [stats, setStats] = useState<Record<string, ExerciseStats>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cacheInfo, setCacheInfo] = useState<any>({});
  
  // Ref để track exercise IDs và prevent unnecessary calls
  const exerciseIdsRef = useRef<string>('');
  const mountedRef = useRef(true);

  /**
   * Fetch stats với cache intelligence
   */
  const fetchStats = useCallback(async (forceRefresh = false) => {
    if (!exerciseIds || exerciseIds.length === 0) {
      setStats({});
      return;
    }

    const currentIdsString = exerciseIds.sort().join(',');
    
    // Skip nếu đang load cùng exerciseIds
    if (loading && exerciseIdsRef.current === currentIdsString && !forceRefresh) {
      return;
    }

    setLoading(true);
    setError(null);
    exerciseIdsRef.current = currentIdsString;

    try {
      // Clear cache nếu force refresh
      if (forceRefresh) {
        clearExerciseStatsCache();
      }

      console.log('🔄 Fetching stats for', exerciseIds.length, 'exercises');
      const result = await getExerciseStats(exerciseIds);
      
      if (mountedRef.current) {
        setStats(result);
        setCacheInfo(getExerciseStatsCacheInfo());
        console.log('✅ Stats loaded successfully');
      }
    } catch (err) {
      console.error('❌ Error fetching exercise stats:', err);
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        // Set default values on error
        const defaultStats: Record<string, ExerciseStats> = {};
        exerciseIds.forEach(id => {
          defaultStats[id] = { views: 0, likes: 0 };
        });
        setStats(defaultStats);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [exerciseIds, loading]);

  /**
   * Refresh data (force fetch từ database)
   */
  const refresh = useCallback(async () => {
    await fetchStats(true);
  }, [fetchStats]);

  /**
   * Clear cache thủ công
   */
  const clearCache = useCallback(() => {
    clearExerciseStatsCache();
    setCacheInfo(getExerciseStatsCacheInfo());
  }, []);

  /**
   * Check for incremental updates without full reload
   */
  const checkForUpdates = useCallback(async () => {
    if (!exerciseIds || exerciseIds.length === 0) {
      return;
    }

    setError(null);

    try {
      console.log('🔍 Checking for incremental updates...');
      
      // Import the incremental update function from cache manager
      const { checkAndUpdateIncremental } = await import('@/lib/exercise-stats-cache');
      
      const result = await checkAndUpdateIncremental(exerciseIds);
      
      if (mountedRef.current) {
        if (result.hasChanges) {
          console.log('✨ Found updates, refreshing stats...');
          setStats(result.data);
          setCacheInfo(getExerciseStatsCacheInfo());
        } else {
          console.log('✅ No updates needed, data is current');
        }
      }
    } catch (err) {
      console.error('❌ Error checking for updates:', err);
      if (mountedRef.current) {
        setError(err instanceof Error ? err.message : 'Failed to check for updates');
      }
    }
  }, [exerciseIds]);

  // Effect để fetch data khi exerciseIds thay đổi
  useEffect(() => {
    const currentIdsString = exerciseIds.sort().join(',');
    
    // Chỉ fetch nếu exerciseIds thực sự thay đổi
    if (exerciseIdsRef.current !== currentIdsString) {
      fetchStats();
    }
  }, [exerciseIds, fetchStats]);

  // Effect để update cache info
  useEffect(() => {
    setCacheInfo(getExerciseStatsCacheInfo());
  }, [stats]);

  // Cleanup khi unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return {
    stats,
    loading,
    error,
    refresh,
    checkForUpdates,
    clearCache,
    cacheInfo
  };
}

/**
 * Hook simplified chỉ trả về stats (cho backward compatibility)
 */
export function useExerciseStats(exerciseIds: string[]): Record<string, ExerciseStats> {
  const { stats } = useCachedExerciseStats(exerciseIds);
  return stats;
}

/**
 * Hook để prefetch stats (để optimize performance)
 */
export function usePrefetchExerciseStats() {
  const prefetch = useCallback(async (exerciseIds: string[]) => {
    try {
      await getExerciseStats(exerciseIds);
    } catch (error) {
      console.warn('Prefetch failed:', error);
    }
  }, []);

  return prefetch;
}
