'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ArticleCompletionBadge } from './ArticleCompletionBadge';
import { useArticleCompletion } from '@/hooks/use-article-completion';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle2 } from 'lucide-react';

interface ArticlePageCompletionProps {
  articleId: string;
  /**
   * Minimum time (in seconds) user must spend before showing completion prompt
   * Default: 30 seconds
   */
  minTimeForCompletion?: number;
}

export function ArticlePageCompletion({
  articleId,
  minTimeForCompletion = 30
}: ArticlePageCompletionProps) {
  const { completion, markCompleted } = useArticleCompletion(articleId);
  const [timeSpent, setTimeSpent] = useState(0);
  const [showCompletionPrompt, setShowCompletionPrompt] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Track time spent on page
  useEffect(() => {
    timerRef.current = setInterval(() => {
      const spent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTimeSpent(spent);

      // Show completion prompt after minimum time
      if (spent >= minTimeForCompletion && !completion.completed && !showCompletionPrompt) {
        setShowCompletionPrompt(true);
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [minTimeForCompletion, completion.completed, showCompletionPrompt]);

  // Track scroll to bottom
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      // Consider "bottom" as 90% scrolled
      const scrollPercentage = (scrollTop + windowHeight) / documentHeight;
      
      if (scrollPercentage >= 0.9 && !hasScrolledToBottom) {
        setHasScrolledToBottom(true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hasScrolledToBottom]);

  const handleComplete = async () => {
    await markCompleted(timeSpent);
    setShowCompletionPrompt(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {/* Time tracker */}
      <Card className="shadow-lg border-2">
        <CardContent className="p-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium">{formatTime(timeSpent)}</span>
        </CardContent>
      </Card>

      {/* Completion prompt */}
      {showCompletionPrompt && hasScrolledToBottom && !completion.completed && (
        <Card className="shadow-lg border-2 border-green-500 bg-green-50 dark:bg-green-950/30 animate-bounce">
          <CardContent className="p-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã đọc xong bài viết?</span>
              </div>
              <ArticleCompletionBadge 
                articleId={articleId}
                variant="button"
                className="w-full"
                onCompletionChange={() => setShowCompletionPrompt(false)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main completion button */}
      {!showCompletionPrompt && (
        <ArticleCompletionBadge 
          articleId={articleId}
          variant="button"
        />
      )}
    </div>
  );
}
