'use client';

import { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';

interface CompletionProgressBadgeProps {
  exerciseId: string;
  className?: string;
}

export function CompletionProgressBadge({ 
  exerciseId,
  className = '' 
}: CompletionProgressBadgeProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch completion status khi component mount
  useEffect(() => {
    const fetchCompletionStatus = async () => {
      try {
        const response = await fetch(`/api/exercise-completion?exerciseId=${encodeURIComponent(exerciseId)}`);
        if (response.ok) {
          const data = await response.json();
          setIsCompleted(data.completed);
        }
      } catch (error) {
        console.error('Error fetching completion status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (exerciseId) {
      fetchCompletionStatus();
    }
  }, [exerciseId]);

  // Xử lý click để đánh dấu hoàn thành
  const handleClick = async () => {
    if (isSubmitting || isCompleted) return; // Không cho click nếu đã hoàn thành

    setIsSubmitting(true);
    
    try {
      // Gọi API để mark as completed
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
        
        // Track view cùng lúc (để đếm view và mark completed)
        await fetch('/api/exercise-views', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            exerciseId,
            action: 'completed' // Đánh dấu là completed view
          }),
        });
        
        console.log('✅ Exercise marked as completed and view tracked');
      } else {
        console.error('Failed to mark exercise as completed');
      }
    } catch (error) {
      console.error('Error marking completion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // CSS classes dựa trên trạng thái
  const badgeClasses = isCompleted 
    ? "rounded-lg text-card-foreground shadow-lg border-2 border-green-500 bg-green-50 dark:bg-green-950/30"
    : "rounded-lg text-card-foreground shadow-lg border-2 border-gray-300 bg-gray-50 dark:bg-gray-800 hover:border-green-400 hover:bg-green-50/50 dark:hover:bg-green-950/20 cursor-pointer transition-all duration-200";

  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg border-2 border-gray-200 bg-gray-50 dark:bg-gray-800 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
        <span className="text-sm text-gray-500">Đang tải...</span>
      </div>
    );
  }

  return (
    <div 
      className={`inline-flex items-center gap-2 px-3 py-2 ${badgeClasses} ${className}`}
      onClick={handleClick}
      role={isCompleted ? "status" : "button"}
      tabIndex={isCompleted ? -1 : 0}
      onKeyDown={(e) => {
        if ((e.key === 'Enter' || e.key === ' ') && !isCompleted && !isSubmitting) {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {isSubmitting ? (
        <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
      ) : isCompleted ? (
        <Check className="w-4 h-4 text-green-600" />
      ) : (
        <div className="w-4 h-4 border-2 border-gray-400 rounded-full" />
      )}
      
      <span className={`text-sm font-medium ${
        isCompleted 
          ? 'text-green-700 dark:text-green-300' 
          : isSubmitting 
            ? 'text-blue-600' 
            : 'text-gray-600 dark:text-gray-400'
      }`}>
        {isSubmitting ? 'Đang lưu...' : isCompleted ? 'Đã xem xong bài học' : 'Đã xem xong bài học?'}
      </span>
    </div>
  );
}
