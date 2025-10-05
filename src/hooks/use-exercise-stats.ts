'use client';

import { useState, useEffect } from 'react';

interface ExerciseStats {
  views: number;
  comments: number;
  rating: number;
  totalRatings: number;
}

export function useExerciseStats(exerciseId: string) {
  const [stats, setStats] = useState<ExerciseStats>({
    views: 0,
    comments: 0,
    rating: 0,
    totalRatings: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Skip if no exerciseId or if running on server
    if (!exerciseId || typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/exercise-stats?exerciseId=${encodeURIComponent(exerciseId)}`, {
          cache: 'no-store' // Don't cache to get fresh stats
        });
        
        if (!response.ok) {
          // Don't throw error - just log and use default stats
          console.log(`Exercise stats API returned ${response.status} for ${exerciseId}`);
          setLoading(false);
          return;
        }

        const data = await response.json();
        
        if (data.success && data.stats) {
          setStats(data.stats);
        }
      } catch (err) {
        // Silent fail - just log the error
        console.log('Error fetching exercise stats (using defaults):', err);
        // Don't set error state to avoid UI errors
      } finally {
        setLoading(false);
      }
    };

    // Add small delay to avoid blocking initial render
    const timeoutId = setTimeout(fetchStats, 100);
    
    return () => clearTimeout(timeoutId);
  }, [exerciseId]);

  return { stats, loading, error };
}

export async function trackExerciseView(exerciseId: string, userId?: string) {
  try {
    await fetch('/api/exercise-views', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        exerciseId,
        userId: userId || null
      }),
    });
  } catch (error) {
    console.error('Error tracking view:', error);
  }
}
