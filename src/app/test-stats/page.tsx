'use client';

import { useEffect, useState } from 'react';

export default function TestStatsPage() {
  const [exercises, setExercises] = useState<any[]>([]);
  const [stats, setStats] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // 1. Get all A1 exercises
        const exRes = await fetch('/api/exercises/a1');
        const exData = await exRes.json();
        setExercises(exData);

        // 2. Get stats for each
        const ids = exData.map((ex: any) => ex.href.replace('/exercises/', ''));
        const params = new URLSearchParams();
        ids.forEach((id: string) => params.append('ids', id));

        const statsRes = await fetch(`/api/exercise-stats-batch?${params}`);
        const statsData = await statsRes.json();
        
        console.log('📊 Stats Data:', statsData);
        setStats(statsData.stats || {});
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;

  // Helper to slugify for lookup
  function slugifyExerciseId(id: string): string {
    return id
      .toLowerCase()
      .replace(/\//g, '-')
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Exercise Stats Test Page</h1>
      
      <div className="mb-8 p-4 bg-blue-50 rounded-lg">
        <h2 className="font-semibold mb-2">Debug Info:</h2>
        <p>Total Exercises: {exercises.length}</p>
        <p>Stats Loaded: {Object.keys(stats).length}</p>
      </div>

      <div className="space-y-4">
        {exercises.map((exercise, index) => {
          const rawId = exercise.href.replace('/exercises/', '');
          const slugifiedId = slugifyExerciseId(rawId);
          const exerciseStats = stats[slugifiedId] || {};
          
          return (
            <div key={index} className="border rounded-lg p-4 bg-white">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h3 className="font-semibold text-sm mb-2">{exercise.title}</h3>
                  <div className="text-xs text-gray-600 space-y-1">
                    <p><strong>Raw ID:</strong> {rawId}</p>
                    <p><strong>Slugified:</strong> {slugifiedId}</p>
                  </div>
                </div>
                
                <div className="text-sm">
                  <p className="font-semibold mb-2">Stats from API:</p>
                  <div className="space-y-1 text-gray-700">
                    <p>⭐ Rating: {exerciseStats.rating || 0} ({exerciseStats.totalRatings || 0})</p>
                    <p>👀 Views: {exerciseStats.views || 0}</p>
                    <p>💬 Comments: {exerciseStats.comments || 0}</p>
                    <p>✓ Completions: {exerciseStats.completions || 0}</p>
                  </div>
                </div>
                
                <div className="text-sm">
                  <p className="font-semibold mb-2">Expected:</p>
                  <div className="space-y-1">
                    <p className={exerciseStats.rating === 5 ? 'text-green-600' : 'text-red-600'}>
                      {exerciseStats.rating === 5 ? '✅' : '❌'} Rating should be 5.0 (1)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
