'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Activity, AlertTriangle, CheckCircle, Database, Zap } from 'lucide-react';

interface PerformanceMetrics {
  summary: {
    totalRequests: number;
    avgDuration: number;
    slowRequests: number;
    errorRequests: number;
    slowRequestPercent: number;
    errorPercent: number;
  };
  logs: Array<{
    timestamp: string;
    route: string;
    method: string;
    duration: number;
    status: number;
    queryCount?: number;
    cacheHit?: boolean;
  }>;
}

export default function PerformanceDashboard() {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/performance?limit=100');
        if (response.ok) {
          const data = await response.json();
          setMetrics(data);
        }
      } catch (error) {
        console.error('Error fetching performance metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000); // Update every 10s

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Performance Dashboard</h1>
        <p className="text-muted-foreground">No performance data available.</p>
      </div>
    );
  }

  const { summary, logs } = metrics;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">🚀 Performance Dashboard</h1>
        <Badge variant="outline" className="text-sm">
          Live Data
        </Badge>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.totalRequests}</div>
            <p className="text-xs text-muted-foreground">
              Last 100 requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.avgDuration}ms</div>
            <p className="text-xs text-muted-foreground">
              Average duration
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Slow Requests</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {summary.slowRequests}
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.slowRequestPercent}% {'>'} 1s
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              summary.errorPercent > 5 ? 'text-red-600' : 'text-green-600'
            }`}>
              {summary.errorPercent}%
            </div>
            <p className="text-xs text-muted-foreground">
              {summary.errorRequests} errors
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Optimization Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance Optimization Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">✅ Batch API implemented for exercise stats</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">✅ Database cached counts (exercises_master)</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm">✅ Reduced N+1 queries with batch loading</span>
          </div>
          <div className="flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-500" />
            <span className="text-sm">🔄 Using Prisma ORM with optimized queries</span>
          </div>
        </CardContent>
      </Card>

      {/* Recent Requests Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {logs.slice(-20).reverse().map((log, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 border rounded-sm text-sm"
              >
                <div className="flex items-center gap-3">
                  <Badge
                    variant={log.status >= 400 ? 'destructive' : 
                            log.duration > 1000 ? 'secondary' : 'default'}
                    className="text-xs"
                  >
                    {log.status}
                  </Badge>
                  <span className="font-mono text-xs">{log.method}</span>
                  <span className="text-muted-foreground">{log.route}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs ${
                    log.duration > 1000 ? 'text-orange-600' :
                    log.duration > 500 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {log.duration}ms
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
