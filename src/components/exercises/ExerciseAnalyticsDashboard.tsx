'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, MessageCircle, CheckCircle, TrendingUp, Clock, BarChart3 } from 'lucide-react';

interface ExerciseAnalytics {
  exerciseId: string;
  title: string;
  views: number;
  comments: number;
  completions: number;
  avgReadingTime: number;
  avgScrollDepth: number;
  completionRate: number;
}

/**
 * Analytics Dashboard Component
 * 
 * Displays comprehensive analytics for exercises:
 * - Views, comments, completions
 * - Average reading time
 * - Scroll depth
 * - Completion rate
 * - Trending exercises
 */
export function ExerciseAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<ExerciseAnalytics[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/analytics-dashboard');
      
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }

      const data = await response.json();
      setAnalytics(data.analytics || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      console.error('Error fetching analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalViews = analytics.reduce((sum, item) => sum + item.views, 0);
  const totalComments = analytics.reduce((sum, item) => sum + item.comments, 0);
  const totalCompletions = analytics.reduce((sum, item) => sum + item.completions, 0);
  const avgCompletionRate = analytics.length > 0
    ? analytics.reduce((sum, item) => sum + item.completionRate, 0) / analytics.length
    : 0;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map(i => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-24 bg-muted" />
            <CardContent className="h-20 bg-muted/50" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalViews.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across {analytics.length} exercises
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalComments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {analytics.length > 0 ? (totalComments / analytics.length).toFixed(1) : 0} avg per exercise
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completions</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCompletions.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {avgCompletionRate.toFixed(1)}% completion rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.length > 0 
                ? Math.round(analytics.reduce((sum, item) => sum + item.avgReadingTime, 0) / analytics.length)
                : 0}s
            </div>
            <p className="text-xs text-muted-foreground">
              Average reading time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Exercise Performance
          </CardTitle>
          <CardDescription>
            Detailed metrics for each exercise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Exercise</th>
                  <th className="text-right p-2">Views</th>
                  <th className="text-right p-2">Comments</th>
                  <th className="text-right p-2">Completions</th>
                  <th className="text-right p-2">Rate</th>
                  <th className="text-right p-2">Avg Time</th>
                  <th className="text-right p-2">Scroll</th>
                </tr>
              </thead>
              <tbody>
                {analytics.map((item) => (
                  <tr key={item.exerciseId} className="border-b hover:bg-muted/50">
                    <td className="p-2 font-medium">{item.title}</td>
                    <td className="text-right p-2">{item.views}</td>
                    <td className="text-right p-2">{item.comments}</td>
                    <td className="text-right p-2">{item.completions}</td>
                    <td className="text-right p-2">{item.completionRate.toFixed(1)}%</td>
                    <td className="text-right p-2 flex items-center justify-end gap-1">
                      <Clock className="h-3 w-3" />
                      {item.avgReadingTime}s
                    </td>
                    <td className="text-right p-2">{item.avgScrollDepth}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
