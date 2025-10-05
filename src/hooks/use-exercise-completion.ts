'use client';

import { useState, useEffect, useCallback } from 'react';

interface CompletionData {
  completed: boolean;
  completedAt?: string;
  timeSpent?: number;
  score?: number;
  attempts?: number;
}

export function useExerciseCompletion(exerciseId: string) {
  const [completion, setCompletion] = useState<CompletionData>({
    completed: false
  });
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  // Fetch completion status
  useEffect(() => {
    if (!exerciseId || typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const fetchCompletion = async () => {
      try {
        const response = await fetch(`/api/exercise-completion?exerciseId=${encodeURIComponent(exerciseId)}`);
        
        if (response.ok) {
          const data = await response.json();
          setCompletion(data);
        }
      } catch (error) {
        console.log('Error fetching completion:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletion();
  }, [exerciseId]);

  // Mark as completed
  const markCompleted = useCallback(async (timeSpent?: number, score?: number) => {
    if (!exerciseId) return;

    setMarking(true);
    try {
      const response = await fetch('/api/exercise-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseId,
          timeSpent,
          score
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setCompletion({
          completed: true,
          completedAt: data.completion.completedAt,
          timeSpent: data.completion.timeSpent,
          score: data.completion.score,
          attempts: data.completion.attempts
        });
        return true;
      }
    } catch (error) {
      console.error('Error marking completion:', error);
    } finally {
      setMarking(false);
    }
    return false;
  }, [exerciseId]);

  // Unmark completion
  const unmarkCompleted = useCallback(async () => {
    if (!exerciseId) return;

    setMarking(true);
    try {
      const response = await fetch(`/api/exercise-completion?exerciseId=${encodeURIComponent(exerciseId)}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setCompletion({ completed: false });
        return true;
      }
    } catch (error) {
      console.error('Error unmarking completion:', error);
    } finally {
      setMarking(false);
    }
    return false;
  }, [exerciseId]);

  return {
    completion,
    loading,
    marking,
    markCompleted,
    unmarkCompleted
  };
}
