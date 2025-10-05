// Utility functions for exercise statistics

/**
 * Format number with K/M suffix
 * @example formatNumber(1234) => "1.2K"
 * @example formatNumber(1234567) => "1.2M"
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

/**
 * Format rating with star emoji
 * @example formatRating(4.6, 67) => "4.6 ⭐ (67)"
 */
export function formatRating(rating: number, count: number): string {
  if (count === 0) return 'Chưa có đánh giá';
  return `${rating.toFixed(1)} ⭐ (${count})`;
}

/**
 * Get rating color class based on value
 * @example getRatingColor(4.5) => "text-green-600"
 */
export function getRatingColor(rating: number): string {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 4.0) return 'text-blue-600';
  if (rating >= 3.5) return 'text-yellow-600';
  if (rating >= 3.0) return 'text-orange-600';
  return 'text-red-600';
}

/**
 * Get rating badge variant based on value
 */
export function getRatingBadgeVariant(rating: number): 'default' | 'secondary' | 'destructive' | 'outline' {
  if (rating >= 4.5) return 'default';
  if (rating >= 4.0) return 'secondary';
  if (rating >= 3.0) return 'outline';
  return 'destructive';
}

/**
 * Calculate percentage increase
 * @example calculateGrowth(100, 150) => 50
 */
export function calculateGrowth(oldValue: number, newValue: number): number {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
}

/**
 * Format time ago
 * @example formatTimeAgo(new Date(Date.now() - 3600000)) => "1 giờ trước"
 */
export function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffMs = now.getTime() - past.getTime();
  
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffDays > 0) return `${diffDays} ngày trước`;
  if (diffHours > 0) return `${diffHours} giờ trước`;
  if (diffMins > 0) return `${diffMins} phút trước`;
  return 'Vừa xong';
}

/**
 * Get trending status based on views growth
 */
export function getTrendingStatus(views: number, threshold = 1000): {
  isTrending: boolean;
  label: string;
} {
  if (views >= threshold * 5) {
    return { isTrending: true, label: '🔥 Rất hot' };
  }
  if (views >= threshold * 2) {
    return { isTrending: true, label: '📈 Đang hot' };
  }
  if (views >= threshold) {
    return { isTrending: true, label: '✨ Phổ biến' };
  }
  return { isTrending: false, label: '' };
}
