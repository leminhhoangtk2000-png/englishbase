'use client';

import { useEffect } from 'react';
import { trackExerciseView } from '@/hooks/use-exercise-stats';

interface ExerciseViewTrackerProps {
  exerciseId: string;
  userId?: string;
}

export function ExerciseViewTracker({ exerciseId, userId }: ExerciseViewTrackerProps) {
  useEffect(() => {
    if (exerciseId) {
      // Track view after a short delay to ensure it's a real visit
      const timer = setTimeout(() => {
        trackExerciseView(exerciseId, userId);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [exerciseId, userId]);

  return null; // This component doesn't render anything
}
