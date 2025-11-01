/**
 * CORS (Cross-Origin Resource Sharing) Configuration
 * 
 * This module provides utilities for handling CORS in API routes.
 * CORS is necessary when your frontend and backend are on different domains,
 * or when you want to allow specific external domains to access your API.
 */

export interface CorsOptions {
  /**
   * Allowed origins. Can be:
   * - Array of specific origins: ['https://example.com', 'https://app.example.com']
   * - '*' for all origins (NOT recommended for production)
   * - null to disable CORS
   */
  allowedOrigins: string[] | '*' | null;
  
  /**
   * Allowed HTTP methods
   */
  allowedMethods?: string[];
  
  /**
   * Allowed headers
   */
  allowedHeaders?: string[];
  
  /**
   * Exposed headers (headers that client can access)
   */
  exposedHeaders?: string[];
  
  /**
   * Allow credentials (cookies, authorization headers)
   */
  allowCredentials?: boolean;
  
  /**
   * Max age for preflight cache (in seconds)
   */
  maxAge?: number;
}

/**
 * Default CORS configuration
 */
const defaultCorsOptions: CorsOptions = {
  allowedOrigins: process.env.NODE_ENV === 'production' 
    ? [process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com']
    : ['http://localhost:9003', 'http://localhost:3000'],
  allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-RateLimit-Remaining', 'X-RateLimit-Reset'],
  allowCredentials: true,
  maxAge: 86400, // 24 hours
};

/**
 * Get CORS headers for a request
 * 
 * @param request - The incoming request
 * @param options - CORS options (uses defaults if not provided)
 * @returns Headers object with CORS headers
 */
export function getCorsHeaders(
  request: Request,
  options: Partial<CorsOptions> = {}
): Headers {
  const config = { ...defaultCorsOptions, ...options };
  const headers = new Headers();

  // Get origin from request
  const origin = request.headers.get('origin');

  // Check if origin is allowed
  let allowOrigin = '';
  if (config.allowedOrigins === '*') {
    allowOrigin = '*';
  } else if (config.allowedOrigins && Array.isArray(config.allowedOrigins)) {
    if (origin && config.allowedOrigins.includes(origin)) {
      allowOrigin = origin;
    }
  }

  // Set CORS headers
  if (allowOrigin) {
    headers.set('Access-Control-Allow-Origin', allowOrigin);
  }

  if (config.allowedMethods) {
    headers.set('Access-Control-Allow-Methods', config.allowedMethods.join(', '));
  }

  if (config.allowedHeaders) {
    headers.set('Access-Control-Allow-Headers', config.allowedHeaders.join(', '));
  }

  if (config.exposedHeaders) {
    headers.set('Access-Control-Expose-Headers', config.exposedHeaders.join(', '));
  }

  if (config.allowCredentials) {
    headers.set('Access-Control-Allow-Credentials', 'true');
  }

  if (config.maxAge) {
    headers.set('Access-Control-Max-Age', config.maxAge.toString());
  }

  return headers;
}

/**
 * Handle CORS preflight request (OPTIONS)
 * 
 * @param request - The incoming request
 * @param options - CORS options
 * @returns Response for preflight request
 */
export function handleCorsPreFlight(
  request: Request,
  options: Partial<CorsOptions> = {}
): Response {
  const headers = getCorsHeaders(request, options);
  
  return new Response(null, {
    status: 204,
    headers,
  });
}

/**
 * Add CORS headers to an existing response
 * 
 * @param response - The response to add headers to
 * @param request - The original request
 * @param options - CORS options
 * @returns New response with CORS headers
 */
export function addCorsHeaders(
  response: Response,
  request: Request,
  options: Partial<CorsOptions> = {}
): Response {
  const corsHeaders = getCorsHeaders(request, options);
  const newHeaders = new Headers(response.headers);

  // Add CORS headers
  corsHeaders.forEach((value, key) => {
    newHeaders.set(key, value);
  });

  // Create new response with updated headers
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

/**
 * CORS middleware wrapper for API routes
 * 
 * Usage:
 * ```typescript
 * export async function GET(request: Request) {
 *   return withCors(request, async () => {
 *     // Your API logic here
 *     return Response.json({ data: 'something' });
 *   });
 * }
 * ```
 */
export async function withCors(
  request: Request,
  handler: (request: Request) => Promise<Response>,
  options: Partial<CorsOptions> = {}
): Promise<Response> {
  // Handle preflight request
  if (request.method === 'OPTIONS') {
    return handleCorsPreFlight(request, options);
  }

  // Execute handler and add CORS headers to response
  try {
    const response = await handler(request);
    return addCorsHeaders(response, request, options);
  } catch (error) {
    // Even error responses should have CORS headers
    const errorResponse = new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
    return addCorsHeaders(errorResponse, request, options);
  }
}

/**
 * Predefined CORS configurations for common scenarios
 */
export const corsPresets = {
  /**
   * Allow all origins (development only)
   */
  allowAll: {
    allowedOrigins: '*' as const,
    allowCredentials: false,
  },

  /**
   * Strict CORS (production)
   */
  strict: {
    allowedOrigins: [process.env.NEXT_PUBLIC_APP_URL || 'https://yourdomain.com'],
    allowCredentials: true,
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  },

  /**
   * Public API (read-only)
   */
  publicReadOnly: {
    allowedOrigins: '*' as const,
    allowedMethods: ['GET', 'OPTIONS'],
    allowCredentials: false,
  },

  /**
   * Same-origin only
   */
  sameOrigin: {
    allowedOrigins: null,
  },
};

