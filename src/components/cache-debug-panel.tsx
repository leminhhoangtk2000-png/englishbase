'use client';

import { useState, useEffect } from 'react';
import { getExerciseStatsCacheInfo, clearExerciseStatsCache } from '@/lib/exercise-stats-cache';

interface CacheDebugProps {
  className?: string;
}

export function CacheDebugPanel({ className }: CacheDebugProps) {
  const [cacheInfo, setCacheInfo] = useState<any>({});
  const [showDetails, setShowDetails] = useState(false);

  // Update cache info every 30 seconds
  useEffect(() => {
    const updateCacheInfo = () => {
      setCacheInfo(getExerciseStatsCacheInfo());
    };

    updateCacheInfo();
    const interval = setInterval(updateCacheInfo, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleClearCache = () => {
    clearExerciseStatsCache();
    setCacheInfo(getExerciseStatsCacheInfo());
  };

  const getStatusColor = () => {
    switch (cacheInfo.status) {
      case 'cached': return 'text-green-600';
      case 'no-cache': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (cacheInfo.status) {
      case 'cached': return '✅';
      case 'no-cache': return '⚠️';
      default: return '❓';
    }
  };

  return (
    <div className={`p-4 bg-gray-50 border rounded-lg text-sm ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-800">Cache Status</h3>
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-blue-600 hover:text-blue-800"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
      </div>

      <div className="flex items-center space-x-2 mb-2">
        <span className="text-lg">{getStatusIcon()}</span>
        <span className={`font-medium ${getStatusColor()}`}>
          {cacheInfo.status === 'cached' ? 'Cached' : 'No Cache'}
        </span>
        {cacheInfo.remainingMinutes && (
          <span className="text-gray-600">
            ({cacheInfo.remainingMinutes}m remaining)
          </span>
        )}
      </div>

      {showDetails && (
        <div className="space-y-2 text-xs">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <span className="font-medium">Status:</span> {cacheInfo.status}
            </div>
            <div>
              <span className="font-medium">Total Exercises:</span> {cacheInfo.totalExercises || 0}
            </div>
            <div>
              <span className="font-medium">Last Updated:</span> 
              {cacheInfo.lastUpdated ? new Date(cacheInfo.lastUpdated).toLocaleTimeString() : 'Never'}
            </div>
            <div>
              <span className="font-medium">Version:</span> {cacheInfo.version || 'N/A'}
            </div>
          </div>

          <div className="flex space-x-2 mt-3">
            <button
              onClick={handleClearCache}
              className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600"
            >
              Clear Cache
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600"
            >
              Reload Page
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Hook để sử dụng cache info trong components khác
export function useCacheDebug() {
  const [cacheInfo, setCacheInfo] = useState<any>({});

  useEffect(() => {
    const updateCacheInfo = () => {
      setCacheInfo(getExerciseStatsCacheInfo());
    };

    updateCacheInfo();
    const interval = setInterval(updateCacheInfo, 10000); // Update every 10s

    return () => clearInterval(interval);
  }, []);

  return cacheInfo;
}
