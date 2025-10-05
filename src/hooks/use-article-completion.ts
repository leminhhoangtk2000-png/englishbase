'use client';

import { useState, useEffect, useCallback } from 'react';

interface ArticleCompletionData {
  completed: boolean;
  completedAt?: string;
  timeSpent?: number;
  attempts?: number;
}

export function useArticleCompletion(articleId: string) {
  const [completion, setCompletion] = useState<ArticleCompletionData>({
    completed: false
  });
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  // Fetch completion status
  useEffect(() => {
    console.log('🟣 useArticleCompletion: useEffect triggered');
    console.log('🟣 articleId:', articleId);
    
    if (!articleId || typeof window === 'undefined') {
      console.log('🔴 useArticleCompletion: No articleId or not in browser');
      setLoading(false);
      return;
    }

    const fetchCompletion = async () => {
      console.log('🟣 Fetching completion for:', articleId);
      
      try {
        const url = `/api/article-completion?articleId=${encodeURIComponent(articleId)}`;
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
        console.log('🔴 Error fetching article completion:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletion();
  }, [articleId]);

  // Mark as completed
  const markCompleted = useCallback(async (timeSpent?: number) => {
    if (!articleId) {
      console.log('🔴 markCompleted: No articleId');
      return false;
    }

    console.log('🟡 markCompleted: Starting...', { articleId, timeSpent });
    
    setMarking(true);
    try {
      const response = await fetch('/api/article-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleId,
          timeSpent
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
          attempts: data.completion.attempts
        });
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
  }, [articleId]);

  // Unmark completion
  const unmarkCompleted = useCallback(async () => {
    if (!articleId) return false;

    setMarking(true);
    try {
      const response = await fetch(`/api/article-completion?articleId=${encodeURIComponent(articleId)}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCompletion({
          completed: false
        });
        return true;
      }
    } catch (error) {
      console.error('Error unmarking article completion:', error);
    } finally {
      setMarking(false);
    }
    return false;
  }, [articleId]);

  return {
    completion,
    loading,
    marking,
    markCompleted,
    unmarkCompleted
  };
}
