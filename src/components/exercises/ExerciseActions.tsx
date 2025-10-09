'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle2, Heart, Check, User, LogIn, UserPlus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

import { GoogleAuthButton } from '@/components/auth/GoogleAuthButton'

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
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Get userId from auth session
  useEffect(() => {
    const getUserId = async () => {
      try {
        console.log('🔍 Fetching user ID...');
        const response = await fetch('/api/auth/me');
        console.log('📡 Auth response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('👤 User data received:', data);
          if (data && data.user && data.user.id) {
            setUserId(data.user.id);
            console.log('✅ User ID set:', data.user.id);
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

  const handleComplete = async () => {
    console.log('✅ handleComplete called, userId:', userId);
    
    if (!userId) {
      console.log('❌ No userId, showing login modal');
      setShowLoginModal(true);
      return;
    }
    
    setIsCompletionLoading(true);

    try {
      console.log('📤 Sending completion request for exerciseId:', exerciseId);
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
        // If it's an authentication error, show login modal
        if (response.status === 401 || response.status === 400) {
          setShowLoginModal(true);
        } else {
          // Only log non-auth errors  
          const errorData = await response.text();
          console.error('❌ Completion request failed:', response.status, errorData);
        }
      }
    } catch (error) {
      console.log('🔐 Network issue, showing login modal');
      // On network error, also show login modal as it might be auth related
      setShowLoginModal(true);
    } finally {
      setIsCompletionLoading(false);
    }
  };

  const handleLike = async () => {
    console.log('🎯 handleLike called, userId:', userId);
    
    if (!userId) {
      console.log('❌ No userId, showing login modal');
      setShowLoginModal(true);
      return;
    }
    
    setIsLikeLoading(true);
    try {
      console.log('📤 Sending like request for exerciseId:', exerciseId);
      const response = await fetch('/api/exercise-ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseId,
          isLiked: true
        }),
      });
      
      if (response.ok) {
        setIsLiked(true);
        setShowThanks(true);
        
        // Hide the thanks message after 2 seconds
        setTimeout(() => {
          setShowThanks(false);
        }, 2000);
        
        console.log('✅ Exercise liked successfully');
      } else {
        // If it's an authentication error, show login modal
        if (response.status === 401 || response.status === 400) {
          setShowLoginModal(true);
        } else {
          // Only log non-auth errors
          console.error('❌ Like request failed:', response.status);
        }
      }
    } catch (error) {
      console.log('🔐 Network issue, showing login modal');
      // On network error, also show login modal as it might be auth related
      setShowLoginModal(true);
    } finally {
      setIsLikeLoading(false);
    }
  };

  // Show buttons even if no userId, but with login prompts
  // Don't show anything if both are done (permanent hide) and user is logged in
  if (userId && isLiked && isCompleted) {
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

      {/* 🔐 Login Modal */}
      <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
        <DialogContent className="sm:max-w-md fixed z-[9999]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold text-center">
              <User className="w-6 h-6 text-blue-600" />
              Đăng nhập để trải nghiệm đầy đủ
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 py-4">
            {/* Main message */}
            <div className="text-center space-y-2">
              <div className="text-lg text-gray-700 dark:text-gray-300">
                🌟 Hãy đăng nhập để sử dụng được các tính năng này
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Và có trải nghiệm tốt hơn nhé! 
              </div>
            </div>

            {/* Features list */}
            <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg space-y-2">
              <div className="font-semibold text-blue-800 dark:text-blue-200 mb-3">
                🎯 Các tính năng khi đăng nhập:
              </div>
              <div className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Lưu tiến độ học tập</span>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  <span>Đánh giá và yêu thích bài tập</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>Theo dõi kết quả học tập</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>Tạo hồ sơ học viên cá nhân</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-3">
              <div className="text-center text-sm text-gray-600 dark:text-gray-400 mb-4">
                Chọn cách đăng nhập:
              </div>
              
              <GoogleAuthButton action="login" className="w-full text-lg py-6">
                <LogIn className="w-5 h-5 mr-2" />
                Đăng nhập với Google
              </GoogleAuthButton>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Hoặc
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={() => window.location.href = '/login'}
                variant="outline"
                className="w-full text-lg py-6"
                size="lg"
              >
                <LogIn className="w-5 h-5 mr-2" />
                Đăng nhập thường
              </Button>
              
              <div className="text-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Chưa có tài khoản? 
                </span>
                <Button 
                  onClick={() => window.location.href = '/signup'}
                  variant="link"
                  className="p-0 h-auto text-blue-600 underline"
                >
                  Đăng ký ngay
                </Button>
              </div>
              
              <Button 
                onClick={() => setShowLoginModal(false)}
                variant="ghost"
                className="w-full text-gray-600 hover:bg-gray-100"
              >
                <X className="w-4 h-4 mr-2" />
                Để sau
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
