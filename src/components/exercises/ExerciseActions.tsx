'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Heart, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExerciseActionsProps {
  exerciseId: string;
}

export function ExerciseActions({ exerciseId }: ExerciseActionsProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isCompletionLoading, setIsCompletionLoading] = useState(false);
  const [showCompletionCongrats, setShowCompletionCongrats] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // TODO: Get real userId from auth session
  const userId = 'cmggnm8tn00024618h2imexga'; // Use real user ID from database

  // Check if user already liked and completed this exercise
  useEffect(() => {
    checkLikeStatus();
    checkCompletionStatus();
  }, [exerciseId]);

  const checkCompletionStatus = async () => {
    try {
      const response = await fetch(
        `/api/exercise-completion?exerciseId=${encodeURIComponent(exerciseId)}`
      );
      
      if (response.ok) {
        const data = await response.json();
        setIsCompleted(data.completed || false);
      }
    } catch (error) {
      console.error('Error checking completion status:', error);
    }
  };

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
    console.log('🔍 handleComplete called with exerciseId:', exerciseId);
    setIsCompletionLoading(true);
    
    try {
      const response = await fetch('/api/exercise-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseId,
          timeSpent: 0
        }),
      });

      console.log('📡 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Response data:', data);
        
        setIsCompleted(true);
        setShowCompletionCongrats(true);
        
        // Hide the congratulations after 3 seconds
        setTimeout(() => {
          setShowCompletionCongrats(false);
        }, 3000);
        
        console.log('✅ Exercise marked as completed');
      } else {
        const errorData = await response.text();
        console.error('❌ API Error:', response.status, errorData);
      }
    } catch (error) {
      console.error('❌ Network Error marking exercise as completed:', error);
    } finally {
      setIsCompletionLoading(false);
    }
  };

  // Don't show anything if both are done (permanent hide)
  if (isLiked && isCompleted) {
    return null;
  }

  // Also hide if currently showing congratulations
  if (showCompletionCongrats) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="shadow-lg border-2 border-green-600 bg-green-100 dark:bg-green-900/50 animate-bounce">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-3 text-center">
              <div className="text-4xl">🎉</div>
              <div className="text-lg font-bold text-green-800 dark:text-green-200">
                Chúc mừng!
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                Bạn đã hoàn thành bài học! 🌟
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
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

      {/* ✅ Completion Button - Show completion status with checkmark */}
      {!isCompleted && !showCompletionCongrats && (
        <Card className="shadow-lg border-2 border-green-500 bg-green-50 dark:bg-green-950/30">
          <CardContent className="p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-green-700 dark:text-green-400">
                <CheckCircle2 className="w-5 h-5" />
                <span>Đã xem xong bài học?</span>
              </div>
              <Button
                onClick={handleComplete}
                disabled={isCompletionLoading}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                size="sm"
              >
                {isCompletionLoading ? 'Đang xử lý...' : 'Đánh dấu hoàn thành'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* ✅ Completed Status - Show tick when completed (hidden during congrats) */}
      {isCompleted && !showCompletionCongrats && (
        <Card className="shadow-lg border-2 border-green-600 bg-green-100 dark:bg-green-900/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-green-800 dark:text-green-300">
              <Check className="w-5 h-5 bg-green-600 text-white rounded-full p-1" />
              <span>Đã hoàn thành ✓</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
