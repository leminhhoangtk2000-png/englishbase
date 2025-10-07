import { NextRequest, NextResponse } from 'next/server';
import { getPerformanceLogs, getFilteredLogs } from '@/lib/performance-logger';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '50');
  const route = searchParams.get('route');

  let filteredLogs = route ? getFilteredLogs(route) : getPerformanceLogs();

  const recentLogs = filteredLogs.slice(-limit);

  // Calculate summary stats
  const totalRequests = recentLogs.length;
  const avgDuration = totalRequests > 0 
    ? recentLogs.reduce((sum, log) => sum + log.duration, 0) / totalRequests 
    : 0;
  
  const slowRequests = recentLogs.filter(log => log.duration > 1000); // > 1s
  const errorRequests = recentLogs.filter(log => log.status >= 400);

  const summary = {
    totalRequests,
    avgDuration: Math.round(avgDuration),
    slowRequests: slowRequests.length,
    errorRequests: errorRequests.length,
    slowRequestPercent: totalRequests > 0 ? Math.round((slowRequests.length / totalRequests) * 100) : 0,
    errorPercent: totalRequests > 0 ? Math.round((errorRequests.length / totalRequests) * 100) : 0,
  };

  return NextResponse.json({
    summary,
    logs: recentLogs,
    timestamp: new Date().toISOString(),
  });
}
