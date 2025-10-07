'use client';

import { useState, useEffect } from 'react';
import { Check, CheckCircle2, Circle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ExerciseCompletionButtonProps {
  exerciseId: string;
  className?: string;
}

export function ExerciseCompletionButton({ exerciseId, className = '' }: ExerciseCompletionButtonProps) {
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
        } else {
          console.error('Failed to fetch completion status');
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
      if (isCompleted) {
        // For now, we'll just unmark locally since DELETE isn't implemented
        setIsCompleted(false);
        toast.success('Đã bỏ đánh dấu hoàn thành');
      } else {
        // Mark as completed
        const response = await fetch('/api/exercise-completion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            exerciseId,
            timeSpent: null // We could track actual time spent if needed
          }),
        });

        if (response.ok) {
          setIsCompleted(true);
          toast.success('Đã đánh dấu hoàn thành!');
        } else {
          const errorData = await response.json();
          toast.error('Không thể đánh dấu hoàn thành: ' + (errorData.error || 'Lỗi không xác định'));
        }
      }
    } catch (error) {
      console.error('Error toggling completion:', error);
      toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-2 text-gray-500 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm">Đang tải...</span>
      </div>
    );
  }

  return (
    <Button
      onClick={handleToggleCompletion}
      disabled={isSubmitting}
      variant={isCompleted ? "default" : "outline"}
      size="sm"
      className={`
        inline-flex items-center gap-2 transition-all duration-200
        ${isCompleted 
          ? 'bg-green-600 hover:bg-green-700 text-white border-green-600' 
          : 'border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950'
        }
        ${className}
      `}
    >
      {isSubmitting ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : isCompleted ? (
        <CheckCircle2 className="w-4 h-4" />
      ) : (
        <Circle className="w-4 h-4" />
      )}
      
      <span className="text-sm font-medium">
        {isCompleted ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
      </span>
    </Button>
  );
}
