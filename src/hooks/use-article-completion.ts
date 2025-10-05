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
    if (!articleId || typeof window === 'undefined') {
      setLoading(false);
      return;
    }

    const fetchCompletion = async () => {
      try {
        const response = await fetch(`/api/article-completion?articleId=${encodeURIComponent(articleId)}`);
        
        if (response.ok) {
          const data = await response.json();
          setCompletion(data);
        }
      } catch (error) {
        console.log('Error fetching article completion:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletion();
  }, [articleId]);

  // Mark as completed
  const markCompleted = useCallback(async (timeSpent?: number) => {
    if (!articleId) return false;

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

      if (response.ok) {
        const data = await response.json();
        setCompletion({
          completed: true,
          completedAt: data.completion.completedAt,
          timeSpent: data.completion.timeSpent,
          attempts: data.completion.attempts
        });
        return true;
      }
    } catch (error) {
      console.error('Error marking article completion:', error);
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
