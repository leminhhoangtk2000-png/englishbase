interface PerformanceMetrics {
  timestamp: string;
  route: string;
  method: string;
  duration: number;
  status: number;
  queryCount?: number;
  cacheHit?: boolean;
}

const performanceLog: PerformanceMetrics[] = [];
const MAX_LOG_SIZE = 1000; // Keep last 1000 requests

export function logPerformance(metrics: PerformanceMetrics) {
  performanceLog.push(metrics);
  
  // Keep only latest entries
  if (performanceLog.length > MAX_LOG_SIZE) {
    performanceLog.splice(0, performanceLog.length - MAX_LOG_SIZE);
  }
}

export function getPerformanceLogs() {
  return performanceLog;
}

export function getFilteredLogs(route?: string) {
  if (!route) return performanceLog;
  return performanceLog.filter(log => log.route.includes(route));
}

export type { PerformanceMetrics };
