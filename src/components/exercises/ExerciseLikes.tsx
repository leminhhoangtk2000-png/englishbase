'use client';

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExerciseLikesProps {
  exerciseId: string;
  variant?: 'inline' | 'full';
  showButton?: boolean; // Show like button or just display count
}

interface LikeData {
  totalLikes: number;
  userLiked: boolean;
}

export function ExerciseLikes({ 
  exerciseId, 
  variant = 'inline',
  showButton = false
}: ExerciseLikesProps) {
  const [likeData, setLikeData] = useState<LikeData>({
    totalLikes: 0,
    userLiked: false
  });
  const [isLoading, setIsLoading] = useState(false);

  // TODO: Get real userId from auth session
  const userId = 'cmf3wfn7m0002bm5kgb1zg7dk';

  useEffect(() => {
    fetchLikes();
  }, [exerciseId]);

  const fetchLikes = async () => {
    try {
      const response = await fetch(
        `/api/exercise-ratings?exerciseId=${encodeURIComponent(exerciseId)}&userId=${userId}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch likes');
      }
      
      const data = await response.json();
      setLikeData({
        totalLikes: data.totalLikes || 0,
        userLiked: data.userLiked || false
      });
    } catch (error) {
      console.error('Error fetching likes:', error);
    }
  };

  const handleToggleLike = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/exercise-ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseId,
          userId,
          isLiked: !likeData.userLiked
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to toggle like');
      }

      const data = await response.json();
      
      setLikeData({
        totalLikes: data.totalLikes,
        userLiked: data.userLiked
      });

      console.log('🔥 Like toggled:', data);

      // 🔥 Dispatch event to notify listing page to refetch stats
      window.dispatchEvent(new CustomEvent('exercise-rating-updated', {
        detail: { exerciseId }
      }));

    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Inline variant - just show count (for cards)
  if (variant === 'inline') {
    return (
      <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
        <Heart 
          className={`w-4 h-4 ${likeData.userLiked ? 'fill-red-500 text-red-500' : ''}`}
        />
        <span className="text-sm">{likeData.totalLikes}</span>
      </div>
    );
  }

  // Full variant - show button to like (for detail pages)
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
        Bạn thích bài tập này?
      </h3>
      
      <div className="flex items-center gap-4">
        <Button
          onClick={handleToggleLike}
          disabled={isLoading}
          variant={likeData.userLiked ? "default" : "outline"}
          className={`flex items-center gap-2 ${
            likeData.userLiked 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'hover:bg-red-50 dark:hover:bg-red-900/20'
          }`}
        >
          <Heart 
            className={`w-5 h-5 ${
              likeData.userLiked ? 'fill-white' : ''
            }`}
          />
          <span>
            {isLoading 
              ? 'Đang xử lý...' 
              : likeData.userLiked 
                ? 'Đã thích' 
                : 'Thích'
            }
          </span>
        </Button>

        <div className="text-gray-600 dark:text-gray-400">
          <span className="font-semibold text-gray-900 dark:text-gray-100">
            {likeData.totalLikes}
          </span>
          {' '}lượt thích
        </div>
      </div>
    </div>
  );
}
