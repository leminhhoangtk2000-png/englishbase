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
  const [userId, setUserId] = useState<string | null>(null);

  // Get userId from auth session
  useEffect(() => {
    const getUserId = async () => {
      try {
        console.log('🔍 Fetching user ID...');
        const response = await fetch('/api/auth/me');
        console.log('📡 Auth response status:', response.status);
        
        if (response.ok) {
          const user = await response.json();
          console.log('👤 User data received:', user);
          if (user && user.id) {
            setUserId(user.id);
            console.log('✅ User ID set:', user.id);
          } else {
            console.log('⚠️ No user ID in response, using fallback');
            setUserId('cmf3wfn7m0002bm5kgb1zg7dk');
          }
        } else {
          console.log('⚠️ Auth failed, using fallback user');
          // Fallback to default user for development
          setUserId('cmf3wfn7m0002bm5kgb1zg7dk');
        }
      } catch (error) {
        console.error('❌ Error getting user:', error);
        console.log('🔄 Using fallback user ID');
        // Fallback to default user for development
        setUserId('cmf3wfn7m0002bm5kgb1zg7dk');
      }
    };
    getUserId();
  }, []);

  // Check if user already liked and completed this exercise
  useEffect(() => {
    if (userId) {
      checkLikeStatus();
      checkCompletionStatus();
    }
  }, [exerciseId, userId]);

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
    if (!userId) return;
    
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
    console.log('🔄 Like button clicked!', { userId, exerciseId, isLiked });
    
    if (!userId) {
      console.error('User ID not available');
      return;
    }
    
    setIsLikeLoading(true);
    
    try {
      if (!isLiked) {
        console.log('📤 Sending like request...');
        // Mark as liked  
        const response = await fetch('/api/exercise-ratings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            exerciseId,
            userId,
            isLiked: true
          }),
        });
        
        if (response.ok) {
          setIsLiked(true);
          setShowThanks(true);
          
          // Hide thanks message after 2 seconds
          setTimeout(() => {
            setShowThanks(false);
          }, 2000);

          console.log('✅ Like recorded successfully');
        } else {
          const errorData = await response.text();
          console.error('❌ Like request failed:', response.status, errorData);
        }
      }
    } catch (error) {
      console.error('Error liking exercise:', error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  const handleComplete = async () => {
    console.log('🔄 Complete button clicked!', { userId, exerciseId, isCompleted });
    
    if (!userId) {
      console.error('User ID not available');
      return;
    }
    
    setIsCompletionLoading(true);
    
    try {
      if (!isCompleted) {
        console.log('📤 Sending completion request...');
        // Mark as completed
        const response = await fetch('/api/exercise-completion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            exerciseId,
            timeSpent: null
          }),
        });
        
        if (response.ok) {
          setIsCompleted(true);
          setShowCompletionCongrats(true);
          
          // Hide the congratulations after 3 seconds
          setTimeout(() => {
            setShowCompletionCongrats(false);
          }, 3000);
          
          console.log('✅ Exercise marked as completed');
        } else {
          const errorData = await response.text();
          console.error('❌ Completion request failed:', response.status, errorData);
        }
      }
    } catch (error) {
      console.error('❌ Network Error marking exercise as completed:', error);
    } finally {
      setIsCompletionLoading(false);
    }
  };

  // Don't show anything if no userId yet (loading)
  if (!userId) {
    return null;
  }

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
