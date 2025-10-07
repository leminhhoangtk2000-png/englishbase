'use client';

import { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface SimpleCompletionButtonProps {
  exerciseId: string;
  className?: string;
  size?: 'sm' | 'default' | 'lg';
  showText?: boolean;
}

export function SimpleCompletionButton({ 
  exerciseId, 
  className = '', 
  size = 'default',
  showText = true 
}: SimpleCompletionButtonProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch completion status on component mount
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

    fetchCompletionStatus();
  }, [exerciseId]);

  const handleToggleCompletion = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    
    try {
      if (!isCompleted) {
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
          toast.success('🎉 Chúc mừng! Bạn đã hoàn thành bài tập!');
        } else {
          const errorData = await response.json();
          toast.error('Không thể đánh dấu hoàn thành: ' + (errorData.error || 'Lỗi không xác định'));
        }
      }
    } catch (error) {
      console.error('Error marking completion:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Button disabled size={size} variant="outline" className={className}>
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
        {showText && 'Đang tải...'}
      </Button>
    );
  }

  if (isCompleted) {
    return (
      <Button 
        disabled 
        size={size} 
        className={`bg-green-600 hover:bg-green-600 text-white ${className}`}
      >
        <CheckCircle2 className="w-4 h-4 mr-2" />
        {showText && 'Đã hoàn thành'}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleToggleCompletion}
      disabled={isSubmitting}
      size={size}
      variant="default"
      className={`bg-blue-600 hover:bg-blue-700 text-white ${className}`}
    >
      {isSubmitting ? (
        <Loader2 className="w-4 h-4 animate-spin mr-2" />
      ) : (
        <Circle className="w-4 h-4 mr-2" />
      )}
      {showText && (isSubmitting ? 'Đang lưu...' : 'Đánh dấu hoàn thành')}
    </Button>
  );
}
