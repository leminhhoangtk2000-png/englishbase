'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useExerciseCompletion } from '@/hooks/use-exercise-completion';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, CheckCircle2 } from 'lucide-react';

interface ExercisePageCompletionProps {
  exerciseId: string;
  /**
   * Minimum time (in seconds) user must spend before auto-completion
   * Default: 45 seconds
   */
  minTimeForCompletion?: number;
  /**
   * Auto-mark as completed after minimum time (no click needed)
   * Default: true
   */
  autoMarkOnTime?: boolean;
}

export function ExercisePageCompletion({
  exerciseId,
  minTimeForCompletion = 45,
  autoMarkOnTime = true
}: ExercisePageCompletionProps) {
  const { completion, markCompleted } = useExerciseCompletion(exerciseId);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isAutoCompleting, setIsAutoCompleting] = useState(false);
  const startTimeRef = useRef<number>(Date.now());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasAutoCompletedRef = useRef(false);

  // Track time spent on page
  useEffect(() => {
    // Don't start timer if already completed
    if (completion.completed) {
      return;
    }

    timerRef.current = setInterval(() => {
      const spent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      setTimeSpent(spent);

      // Auto-complete after minTime if enabled
      if (
        autoMarkOnTime && 
        spent >= minTimeForCompletion && 
        !completion.completed && 
        !hasAutoCompletedRef.current
      ) {
        hasAutoCompletedRef.current = true;
        handleAutoComplete();
      }
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [minTimeForCompletion, completion.completed, autoMarkOnTime]);

  const handleAutoComplete = async () => {
    setIsAutoCompleting(true);
    await markCompleted(timeSpent);
    setIsAutoCompleting(false);
  };

  const handleManualComplete = async () => {
    await markCompleted(timeSpent);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // If already completed, show completed badge only
  if (completion.completed) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="shadow-lg border-2 border-green-500">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4" />
              <span>Đã hoàn thành</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {/* Time tracker with countdown to auto-complete */}
      <Card className="shadow-lg border-2">
        <CardContent className="p-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-medium">{formatTime(timeSpent)}</span>
          {autoMarkOnTime && timeSpent < minTimeForCompletion && (
            <span className="text-xs text-gray-500">
              / {formatTime(minTimeForCompletion)}
            </span>
          )}
        </CardContent>
      </Card>

      {/* Auto-completing message */}
      {isAutoCompleting && (
        <Card className="shadow-lg border-2 border-green-500 bg-green-50 dark:bg-green-950/30">
          <CardContent className="p-3">
            <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-4 h-4 animate-pulse" />
              <span>Đang hoàn thành...</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Manual completion prompt (always visible, can click anytime) */}
      {!isAutoCompleting && (
        <Card 
          className="shadow-lg border-2 border-green-500 bg-green-50 dark:bg-green-950/30 cursor-pointer hover:scale-105 transition-transform"
          onClick={handleManualComplete}
        >
          <CardContent className="p-3">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>Đã xem xong bài học?</span>
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleManualComplete();
                }}
                className="w-full px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Đánh dấu hoàn thành
              </button>
              {autoMarkOnTime && timeSpent < minTimeForCompletion && (
                <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                  Hoặc đợi {minTimeForCompletion - timeSpent}s nữa để tự động hoàn thành
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
