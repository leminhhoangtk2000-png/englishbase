import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/blog',
    '/docs',
    '/vocabulary',
    '/exercises',
    '/api/auth/login',
    '/api/auth/signup',
    '/api/test-overview',
    '/api/test-db',
    '/api/test-db-connection',
    '/api/vocabulary', // Public vocabulary API
    '/api/exercises'   // Public exercises API
  ];
  
  // Check if route is public or starts with public pattern
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || 
    pathname.startsWith(`${route}/`) ||
    pathname.startsWith('/blog/') ||
    pathname.startsWith('/docs/') ||
    pathname.startsWith('/vocabulary/') ||
    pathname.startsWith('/exercises/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/favicon') ||
    pathname.includes('.')
  );
  
  if (isPublicRoute) {
    return NextResponse.next();
  }
  
  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    // Redirect to login if no token
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    // Verify token
    const payload = verifyToken(token);
    
    if (!payload) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    // Check role-based access
    const userRole = payload.role;
    
    // Admin routes - only ADMIN can access
    if (pathname.startsWith('/admin')) {
      if (userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/user', request.url));
      }
    }
    
    // User Premium routes - only USER_PREMIUM and ADMIN can access
    if (pathname.startsWith('/user-premium')) {
      if (userRole !== 'USER_PREMIUM' && userRole !== 'ADMIN') {
        return NextResponse.redirect(new URL('/user', request.url));
      }
    }
    
    // User routes - any authenticated user can access
    if (pathname.startsWith('/user')) {
      // Already authenticated, allow access
    }
    
    // API Routes protection
    if (pathname.startsWith('/api/')) {
      // Admin API routes
      if (pathname.startsWith('/api/users') && userRole !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Forbidden - Admin access required' },
          { status: 403 }
        );
      }
      
      // Profile API - any authenticated user
      if (pathname.startsWith('/api/profile')) {
        // Already authenticated, allow access
      }
    }
    
    return NextResponse.next();
    
  } catch (error) {
    console.error('Middleware error:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
