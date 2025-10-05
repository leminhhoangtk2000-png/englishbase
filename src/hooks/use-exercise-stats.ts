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
    if (!exerciseId) return;

    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/exercise-stats?exerciseId=${exerciseId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }

        const data = await response.json();
        
        if (data.success) {
          setStats(data.stats);
        }
      } catch (err) {
        console.error('Error fetching exercise stats:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
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
