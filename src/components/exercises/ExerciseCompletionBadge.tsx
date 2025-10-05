'use client';

import React from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { useExerciseCompletion } from '@/hooks/use-exercise-completion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ExerciseCompletionBadgeProps {
  exerciseId: string;
  variant?: 'badge' | 'button' | 'icon';
  className?: string;
  onCompletionChange?: (completed: boolean) => void;
}

export function ExerciseCompletionBadge({ 
  exerciseId, 
  variant = 'badge',
  className = '',
  onCompletionChange
}: ExerciseCompletionBadgeProps) {
  const { completion, loading, marking, markCompleted, unmarkCompleted } = useExerciseCompletion(exerciseId);

  const handleToggle = async () => {
    if (marking) return;
    
    const success = completion.completed 
      ? await unmarkCompleted() 
      : await markCompleted();
    
    if (success && onCompletionChange) {
      onCompletionChange(!completion.completed);
    }
  };

  if (loading) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
      </div>
    );
  }

  // Badge variant (for cards)
  if (variant === 'badge') {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={handleToggle}
              disabled={marking}
              className={cn(
                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all",
                completion.completed
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700",
                marking && "opacity-50 cursor-not-allowed",
                className
              )}
            >
              {marking ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : completion.completed ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Circle className="w-3.5 h-3.5" />
              )}
              {completion.completed ? 'Hoàn thành' : 'Chưa hoàn thành'}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">
              {completion.completed 
                ? `Hoàn thành lúc ${new Date(completion.completedAt!).toLocaleString('vi-VN')}`
                : 'Đánh dấu là đã hoàn thành'
              }
            </p>
            {completion.attempts && completion.attempts > 1 && (
              <p className="text-xs text-gray-400">Đã làm {completion.attempts} lần</p>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  // Button variant (for exercise pages)
  if (variant === 'button') {
    return (
      <Button
        onClick={handleToggle}
        disabled={marking}
        variant={completion.completed ? "default" : "outline"}
        size="sm"
        className={cn(
          completion.completed && "bg-green-600 hover:bg-green-700 text-white",
          className
        )}
      >
        {marking ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Đang xử lý...
          </>
        ) : completion.completed ? (
          <>
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Đã hoàn thành
          </>
        ) : (
          <>
            <Circle className="w-4 h-4 mr-2" />
            Đánh dấu hoàn thành
          </>
        )}
      </Button>
    );
  }

  // Icon variant (minimal)
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handleToggle}
            disabled={marking}
            className={cn(
              "p-1 rounded-full transition-all",
              completion.completed
                ? "text-green-600 dark:text-green-400"
                : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300",
              marking && "opacity-50 cursor-not-allowed",
              className
            )}
          >
            {marking ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : completion.completed ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <Circle className="w-5 h-5" />
            )}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">
            {completion.completed ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
