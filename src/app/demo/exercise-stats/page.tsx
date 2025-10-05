'use client';

import React from 'react';
import { ExerciseStatsDisplay } from '@/components/exercises/ExerciseStatsDisplay';
import { DetailedExerciseStats } from '@/components/exercises/DetailedExerciseStats';
import { ExerciseViewTracker } from '@/components/exercises/ExerciseViewTracker';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Code } from 'lucide-react';

export default function ExerciseStatsDemo() {
  const exerciseId = "eine-wohnung-in-leipzig-finden";

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Track view for this demo page */}
      <ExerciseViewTracker exerciseId={exerciseId} />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">Exercise Stats System Demo</h1>
        <p className="text-muted-foreground">
          Hệ thống thống kê bài tập với dữ liệu thực từ database
        </p>
      </div>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Stats Display</CardTitle>
          <CardDescription>Component compact để hiển thị ở card list</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <ExerciseStatsDisplay exerciseId={exerciseId} />
          </div>
          <div className="text-sm">
            <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
              {'<ExerciseStatsDisplay exerciseId="' + exerciseId + '" />'}
            </code>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Stats */}
      <div className="grid md:grid-cols-2 gap-6">
        <DetailedExerciseStats 
          exerciseId={exerciseId}
          title="Thống kê chi tiết"
        />

        {/* Code Example */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Cách sử dụng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Compact Stats</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
{`<ExerciseStatsDisplay 
  exerciseId="exercise-slug"
  showLabels={true}
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Detailed Stats</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
{`<DetailedExerciseStats 
  exerciseId="exercise-slug"
  title="Thống kê"
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">3. Track Views</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
{`<ExerciseViewTracker 
  exerciseId="exercise-slug"
  userId={currentUserId}
/>`}
              </pre>
            </div>

            <div>
              <h3 className="font-semibold mb-2">4. Using Hook</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs overflow-x-auto">
{`const { stats, loading, error } = 
  useExerciseStats("exercise-slug");

// stats = {
//   views: 1234,
//   comments: 45,
//   rating: 4.6,
//   totalRatings: 67
// }`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs with different displays */}
      <Card>
        <CardHeader>
          <CardTitle>Different Display Modes</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="compact">
            <TabsList>
              <TabsTrigger value="compact">Compact</TabsTrigger>
              <TabsTrigger value="labels">With Labels</TabsTrigger>
              <TabsTrigger value="detailed">Detailed</TabsTrigger>
            </TabsList>

            <TabsContent value="compact" className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <ExerciseStatsDisplay exerciseId={exerciseId} />
            </TabsContent>

            <TabsContent value="labels" className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
              <ExerciseStatsDisplay exerciseId={exerciseId} showLabels={true} />
            </TabsContent>

            <TabsContent value="detailed">
              <DetailedExerciseStats exerciseId={exerciseId} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints</CardTitle>
          <CardDescription>Test các endpoints trực tiếp</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">GET Exercise Stats</h3>
            <div className="flex gap-2">
              <code className="flex-1 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-sm">
                GET /api/exercise-stats?exerciseId={exerciseId}
              </code>
              <Button 
                onClick={() => window.open(`/api/exercise-stats?exerciseId=${exerciseId}`, '_blank')}
                size="sm"
              >
                Test
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">POST Track View</h3>
            <div className="flex gap-2">
              <code className="flex-1 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-sm">
                POST /api/exercise-views
              </code>
              <Button 
                onClick={async () => {
                  const res = await fetch('/api/exercise-views', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ exerciseId })
                  });
                  const data = await res.json();
                  alert(JSON.stringify(data, null, 2));
                }}
                size="sm"
              >
                Test
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">GET Ratings</h3>
            <div className="flex gap-2">
              <code className="flex-1 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded text-sm">
                GET /api/exercise-ratings?exerciseId={exerciseId}
              </code>
              <Button 
                onClick={() => window.open(`/api/exercise-ratings?exerciseId=${exerciseId}`, '_blank')}
                size="sm"
              >
                Test
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center text-sm text-muted-foreground">
        <p>Trang này đã được track {exerciseId} view</p>
        <p className="mt-2">
          Xem thêm tại: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">EXERCISE_STATS_SYSTEM.md</code>
        </p>
      </div>
    </div>
  );
}
