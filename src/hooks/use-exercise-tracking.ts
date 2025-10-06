'use client';

import { useEffect, useRef, useState } from 'react';

interface TrackingOptions {
  trackView?: boolean;
  trackReadingTime?: boolean;
  trackScrollDepth?: boolean;
}

interface TrackingData {
  hasTrackedView: boolean;
  readingTime: number;
  scrollDepth: number;
  startTime: number;
}

/**
 * Hook to automatically track exercise views and engagement metrics
 * 
 * Features:
 * - Auto-track view on mount (only once per session)
 * - Track reading time (seconds spent on page)
 * - Track scroll depth (percentage of page scrolled)
 * - Debounced updates to avoid spamming API
 * 
 * Usage:
 * const tracking = useExerciseTracking('exercise-id', {
 *   trackView: true,
 *   trackReadingTime: true,
 *   trackScrollDepth: true
 * });
 */
export function useExerciseTracking(
  exerciseId: string,
  options: TrackingOptions = {
    trackView: true,
    trackReadingTime: true,
    trackScrollDepth: true,
  }
) {
  const [tracking, setTracking] = useState<TrackingData>({
    hasTrackedView: false,
    readingTime: 0,
    scrollDepth: 0,
    startTime: Date.now(),
  });

  const timeIntervalRef = useRef<NodeJS.Timeout>();
  const scrollListenerRef = useRef<(() => void) | null>(null);

  // Track view on mount
  useEffect(() => {
    if (!options.trackView || tracking.hasTrackedView) {
      return;
    }

    const trackView = async () => {
      try {
        console.log('🟦 [Tracking] Recording view for exercise:', exerciseId);
        
        const response = await fetch('/api/exercise-views', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ exerciseId }),
        });

        if (response.ok) {
          console.log('🟢 [Tracking] View recorded successfully');
          setTracking(prev => ({ ...prev, hasTrackedView: true }));
        }
      } catch (error) {
        console.error('🔴 [Tracking] Error tracking view:', error);
      }
    };

    // Delay view tracking by 2 seconds to ensure real engagement
    const timer = setTimeout(trackView, 2000);

    return () => clearTimeout(timer);
  }, [exerciseId, options.trackView, tracking.hasTrackedView]);

  // Track reading time
  useEffect(() => {
    if (!options.trackReadingTime) {
      return;
    }

    // Update reading time every 10 seconds
    timeIntervalRef.current = setInterval(() => {
      setTracking(prev => ({
        ...prev,
        readingTime: Math.floor((Date.now() - prev.startTime) / 1000),
      }));
    }, 10000);

    return () => {
      if (timeIntervalRef.current) {
        clearInterval(timeIntervalRef.current);
      }
    };
  }, [options.trackReadingTime]);

  // Track scroll depth
  useEffect(() => {
    if (!options.trackScrollDepth) {
      return;
    }

    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const scrolled = (scrollTop + windowHeight) / documentHeight;
      const scrollPercent = Math.min(Math.round(scrolled * 100), 100);

      setTracking(prev => ({
        ...prev,
        scrollDepth: Math.max(prev.scrollDepth, scrollPercent),
      }));
    };

    scrollListenerRef.current = handleScroll;
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (scrollListenerRef.current) {
        window.removeEventListener('scroll', scrollListenerRef.current as any);
      }
    };
  }, [options.trackScrollDepth]);

  // Send analytics before unmount
  useEffect(() => {
    return () => {
      const finalReadingTime = Math.floor((Date.now() - tracking.startTime) / 1000);
      
      // Only send if user spent more than 5 seconds
      if (finalReadingTime > 5) {
        console.log('🟦 [Tracking] Sending final analytics:', {
          exerciseId,
          readingTime: finalReadingTime,
          scrollDepth: tracking.scrollDepth,
        });

        // Send analytics (could be to a separate endpoint)
        fetch('/api/exercise-analytics', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            exerciseId,
            readingTime: finalReadingTime,
            scrollDepth: tracking.scrollDepth,
          }),
          keepalive: true, // Ensure request completes even if page unloads
        }).catch(console.error);
      }
    };
  }, [exerciseId, tracking.startTime, tracking.scrollDepth]);

  return tracking;
}
