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
    console.log('🟣 useExerciseCompletion: useEffect triggered');
    console.log('🟣 exerciseId:', exerciseId);
    
    if (!exerciseId || typeof window === 'undefined') {
      console.log('🔴 useExerciseCompletion: No exerciseId or not in browser');
      setLoading(false);
      return;
    }

    const fetchCompletion = async () => {
      console.log('🟣 Fetching completion for:', exerciseId);
      
      try {
        const url = `/api/exercise-completion?exerciseId=${encodeURIComponent(exerciseId)}`;
        console.log('🟣 Fetch URL:', url);
        
        const response = await fetch(url);
        console.log('🟣 Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('🟣 Completion data:', data);
          setCompletion(data);
        } else {
          console.log('🔴 Response not OK:', response.status);
        }
      } catch (error) {
        console.log('🔴 Error fetching completion:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletion();
    
    // Refetch when tab becomes visible (user comes back from detail page)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        console.log('🟣 Tab became visible, refetching completion...');
        fetchCompletion();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [exerciseId]);

  // Mark as completed
  const markCompleted = useCallback(async (timeSpent?: number, score?: number) => {
    if (!exerciseId) {
      console.log('🔴 markCompleted: No exerciseId');
      return false;
    }

    console.log('🟡 markCompleted: Starting...', { exerciseId, timeSpent, score });
    
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

      console.log('🟡 markCompleted: Response status', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🟢 markCompleted: Success!', data);
        
        setCompletion({
          completed: true,
          completedAt: data.completion.completedAt,
          timeSpent: data.completion.timeSpent,
          score: data.completion.score,
          attempts: data.completion.attempts
        });
        
        // 🔥 Broadcast event để listing page refetch completion status
        window.dispatchEvent(new CustomEvent('exercise-completion-updated', {
          detail: { exerciseId, completed: true }
        }));
        
        return true;
      } else {
        const errorText = await response.text();
        console.log('🔴 markCompleted: Failed', response.status, errorText);
      }
    } catch (error) {
      console.error('🔴 markCompleted: Error', error);
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
        
        // 🔥 Broadcast event để listing page refetch completion status
        window.dispatchEvent(new CustomEvent('exercise-completion-updated', {
          detail: { exerciseId, completed: false }
        }));
        
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
