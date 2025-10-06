'use client';

import React, { useState, useEffect } from 'react';
import { useExerciseCompletion } from '@/hooks/use-exercise-completion';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExerciseActionsProps {
  exerciseId: string;
}

export function ExerciseActions({ exerciseId }: ExerciseActionsProps) {
  const { completion, markCompleted } = useExerciseCompletion(exerciseId);
  const [isShaking, setIsShaking] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // TODO: Get real userId from auth session
  const userId = 'cmf3wfn7m0002bm5kgb1zg7dk';

  // Check if user already liked this exercise
  useEffect(() => {
    checkLikeStatus();
  }, [exerciseId]);

  const checkLikeStatus = async () => {
    try {
      const response = await fetch(
        `/api/exercise-ratings?exerciseId=${encodeURIComponent(exerciseId)}&userId=${userId}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.userLiked || false);
      }
    } catch (error) {
      console.error('Error checking like status:', error);
    }
  };

  const handleLike = async () => {
    setIsLikeLoading(true);
    
    try {
      const response = await fetch('/api/exercise-ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseId,
          userId,
          isLiked: true // Always set to true on first click
        }),
      });

      if (response.ok) {
        setIsLiked(true);
        setShowThanks(true);
        
        // Hide the card after 2 seconds
        setTimeout(() => {
          setShowThanks(false);
        }, 2000);

        console.log('✅ Like recorded successfully');
      }
    } catch (error) {
      console.error('Error liking exercise:', error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleComplete = async () => {
    setIsShaking(true);
    await markCompleted(0);
    setTimeout(() => setIsShaking(false), 500);
  };

  // Don't show completion button if already completed
  const showCompletion = !completion.completed;

  // Don't show anything if both are done
  if (!showCompletion && isLiked) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3">
      {/* ❤️ Like Button - Always on top */}
      {!isLiked && !showThanks && (
        <Card className="shadow-lg border-2 border-pink-500 bg-pink-50 dark:bg-pink-950/30">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-pink-700 dark:text-pink-400">
                <Heart className="w-5 h-5" />
                <span>Bạn thích bài tập này?</span>
              </div>
              <Button
                onClick={handleLike}
                disabled={isLikeLoading}
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                size="sm"
              >
                {isLikeLoading ? 'Đang xử lý...' : '❤️ Tôi yêu bài tập này'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 💖 Thank You Message */}
      {showThanks && (
        <Card className="shadow-lg border-2 border-pink-500 bg-pink-50 dark:bg-pink-950/30 animate-bounce">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-pink-700 dark:text-pink-400">
              <Heart className="w-5 h-5 fill-pink-600" />
              <span>Cảm ơn bạn! ❤️</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ✅ Completion Button - Below Like */}
      {showCompletion && (
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
      )}
    </div>
  );
}
