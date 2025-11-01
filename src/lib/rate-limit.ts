/**
 * Simple in-memory rate limiter
 * For production, consider using Redis or a dedicated rate limiting service
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, 5 * 60 * 1000);

export interface RateLimitConfig {
  /**
   * Maximum number of requests allowed in the time window
   */
  max: number;
  
  /**
   * Time window in milliseconds
   */
  windowMs: number;
  
  /**
   * Identifier for the rate limit (e.g., IP address, user ID)
   */
  identifier: string;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check if a request should be rate limited
 * 
 * @param config - Rate limit configuration
 * @returns Rate limit result with success status and remaining requests
 */
export function checkRateLimit(config: RateLimitConfig): RateLimitResult {
  const { max, windowMs, identifier } = config;
  const now = Date.now();
  const key = identifier;

  // Get or create entry
  let entry = store[key];
  
  if (!entry || entry.resetTime < now) {
    // Create new entry or reset expired entry
    entry = {
      count: 0,
      resetTime: now + windowMs,
    };
    store[key] = entry;
  }

  // Increment count
  entry.count++;

  // Check if limit exceeded
  const success = entry.count <= max;
  const remaining = Math.max(0, max - entry.count);

  return {
    success,
    remaining,
    resetTime: entry.resetTime,
  };
}

/**
 * Rate limit configurations for different endpoints
 */
export const rateLimits = {
  // Authentication endpoints - strict limits to prevent brute force
  auth: {
    max: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
  },
  
  // API endpoints - moderate limits
  api: {
    max: 100,
    windowMs: 60 * 1000, // 1 minute
  },
  
  // Public endpoints - generous limits
  public: {
    max: 200,
    windowMs: 60 * 1000, // 1 minute
  },
  
  // Webhook endpoints - very strict
  webhook: {
    max: 10,
    windowMs: 60 * 1000, // 1 minute
  },
};

/**
 * Get client identifier from request (IP address or user ID)
 */
export function getClientIdentifier(
  request: Request,
  userId?: string
): string {
  // Use user ID if available (for authenticated requests)
  if (userId) {
    return `user:${userId}`;
  }

  // Try to get real IP from headers (for proxied requests)
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return `ip:${forwarded.split(',')[0].trim()}`;
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return `ip:${realIp}`;
  }

  // Fallback to a default identifier
  return 'ip:unknown';
}

/**
 * Create rate limit response
 */
export function createRateLimitResponse(result: RateLimitResult) {
  const retryAfter = Math.ceil((result.resetTime - Date.now()) / 1000);
  
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter,
    }),
    {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': retryAfter.toString(),
        'X-RateLimit-Remaining': result.remaining.toString(),
        'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
      },
    }
  );
}

