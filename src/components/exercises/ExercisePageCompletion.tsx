'use client';

import React, { useState } from 'react';
import { useExerciseCompletion } from '@/hooks/use-exercise-completion';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExercisePageCompletionProps {
  exerciseId: string;
}

export function ExercisePageCompletion({
  exerciseId
}: ExercisePageCompletionProps) {
  const { completion, markCompleted } = useExerciseCompletion(exerciseId);
  const [isShaking, setIsShaking] = useState(false);

  const handleComplete = async () => {
    // Trigger shake animation
    setIsShaking(true);
    
    // Mark as completed
    await markCompleted(0);
    
    // Remove shake after animation
    setTimeout(() => {
      setIsShaking(false);
    }, 500);
  };

  // Don't show if already completed
  if (completion.completed) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card 
        className={`
          shadow-lg border-2 border-green-500 bg-green-50 dark:bg-green-950/30
          ${isShaking ? 'animate-shake' : ''}
        `}
      >
        <CardContent className="p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5" />
              <span>Đã xem xong bài học?</span>
            </div>
            <Button
              onClick={handleComplete}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              Đánh dấu hoàn thành
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
