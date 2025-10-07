'use client';

import { useState } from 'react';
import { useCachedExerciseStats } from '@/hooks/useCachedExerciseStats';

/**
 * Test component for incremental updates functionality
 */
export function TestIncrementalUpdates() {
  // 🔧 Sử dụng exercise IDs thật từ hệ thống thay vì test data
  const [exerciseIds] = useState([
    'a1/Lesen/Berlin – Die Hauptstadt Deutschlands',
    'a1/Lesen/Die Kaffeehaus-Kultur in Europa',
    'a1/Lesen/LS Berühmte Festivals in Europa'
  ]);
  const { stats, loading, error, checkForUpdates, cacheInfo } = useCachedExerciseStats(exerciseIds);
  const [updateStatus, setUpdateStatus] = useState<string>('');

  const handleCheckForUpdates = async () => {
    setUpdateStatus('Checking for updates...');
    try {
      await checkForUpdates();
      setUpdateStatus('✅ Update check completed');
    } catch (err) {
      setUpdateStatus(`❌ Update check failed: ${err}`);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Incremental Updates Test</h2>
      
      <div className="space-y-4">
        <div className="bg-gray-100 p-4 rounded">
          <h3 className="font-semibold mb-2">Cache Info</h3>
          <pre className="text-sm">{JSON.stringify(cacheInfo, null, 2)}</pre>
        </div>
        
        <div className="bg-blue-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Exercise Stats</h3>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-600">Error: {error}</p>
          ) : (
            <pre className="text-sm">{JSON.stringify(stats, null, 2)}</pre>
          )}
        </div>
        
        <div className="space-x-2">
          <button
            onClick={handleCheckForUpdates}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Check for Updates
          </button>
          
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Reload Page
          </button>
        </div>
        
        {updateStatus && (
          <div className="bg-yellow-50 p-3 rounded">
            <p className="text-sm">{updateStatus}</p>
          </div>
        )}
      </div>
      
      <div className="mt-6 text-sm text-gray-600">
        <h4 className="font-semibold">How to test:</h4>
        <ol className="list-decimal list-inside space-y-1 mt-2">
          <li>First load will fetch data from database and cache it</li>
          <li>Click "Check for Updates" to test incremental update logic</li>
          <li>If no changes detected, cache lifetime will be extended</li>
          <li>If changes detected, only new data will be fetched and merged</li>
          <li>Use "Reload Page" to test page reload behavior</li>
        </ol>
      </div>
    </div>
  );
}
