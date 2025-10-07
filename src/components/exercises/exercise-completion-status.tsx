'use client';

import { useState, useEffect } from 'react';
import { Check, Clock, Target, Trophy } from 'lucide-react';
import { ExerciseCompletionButton } from './exercise-completion-button';

interface ExerciseCompletionStatusProps {
  exerciseId: string;
  className?: string;
}

interface CompletionData {
  completed: boolean;
  completedAt: string | null;
  timeSpent: number | null;
  attempts: number;
}

export function ExerciseCompletionStatus({ exerciseId, className = '' }: ExerciseCompletionStatusProps) {
  const [completionData, setCompletionData] = useState<CompletionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompletionData = async () => {
      try {
        const response = await fetch(`/api/exercise-completion?exerciseId=${encodeURIComponent(exerciseId)}`);
        if (response.ok) {
          const data = await response.json();
          setCompletionData(data);
        }
      } catch (error) {
        console.error('Error fetching completion data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCompletionData();
  }, [exerciseId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className={`p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 ${className}`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 border rounded-lg transition-all duration-200 ${
      completionData?.completed 
        ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' 
        : 'border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800'
    } ${className}`}>
      
      {/* Header với icon status */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {completionData?.completed ? (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <Check className="w-5 h-5 p-1 bg-green-100 dark:bg-green-900 rounded-full" />
              <span className="font-medium text-sm">Đã hoàn thành</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-500">
              <Target className="w-5 h-5 p-1 bg-gray-100 dark:bg-gray-800 rounded-full" />
              <span className="font-medium text-sm">Chưa hoàn thành</span>
            </div>
          )}
        </div>
        
        <ExerciseCompletionButton exerciseId={exerciseId} />
      </div>

      {/* Stats nếu đã hoàn thành */}
      {completionData?.completed && (
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          {completionData.completedAt && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Hoàn thành lúc: {formatDate(completionData.completedAt)}</span>
            </div>
          )}
          
          {completionData.attempts > 1 && (
            <div className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>Số lần làm: {completionData.attempts}</span>
            </div>
          )}
          
          {completionData.timeSpent && (
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Thời gian: {formatTime(completionData.timeSpent)}</span>
            </div>
          )}
        </div>
      )}

      {/* Encouragement message nếu chưa hoàn thành */}
      {!completionData?.completed && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Hãy đọc hết bài tập và đánh dấu hoàn thành khi xong nhé! 📚
        </p>
      )}
    </div>
  );
}
