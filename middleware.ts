import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from '@/lib/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Force middleware logging to stderr to ensure visibility
  process.stderr.write(`🛡️  MIDDLEWARE: Checking route: ${pathname}\n`);
  
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
    process.stderr.write(`✅ MIDDLEWARE: Public route, allowing access: ${pathname}\n`);
    return NextResponse.next();
  }
  
  process.stderr.write(`🔒 MIDDLEWARE: Protected route, checking authentication: ${pathname}\n`);
  
  // Get token from cookie
  const token = request.cookies.get('auth-token')?.value;
  
  if (!token) {
    console.log('❌ Middleware: No token found, redirecting to login');
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  try {
    // Verify token
    const payload = verifyToken(token);
    
    if (!payload) {
      console.log('❌ Middleware: Invalid token, redirecting to login');
      return NextResponse.redirect(new URL('/login', request.url));
    }
    
    console.log('👤 Middleware: User authenticated:', payload.email, 'Role:', payload.role);
    
    // Check role-based access
    const userRole = payload.role;
    
    // Admin routes - only ADMIN can access
    if (pathname.startsWith('/admin')) {
      console.log('🔑 Middleware: Admin route detected, checking admin permission');
      if (userRole !== 'ADMIN') {
        console.log('🚫 Middleware: Access denied - user role:', userRole, 'required: ADMIN');
        return NextResponse.redirect(new URL('/user', request.url));
      }
      console.log('✅ Middleware: Admin access granted');
    }
    
    // User Premium routes - only USER_PREMIUM and ADMIN can access
    if (pathname.startsWith('/user-premium')) {
      console.log('🔑 Middleware: Premium route detected, checking premium permission');
      if (userRole !== 'USER_PREMIUM' && userRole !== 'ADMIN') {
        console.log('🚫 Middleware: Access denied - user role:', userRole, 'required: USER_PREMIUM or ADMIN');
        return NextResponse.redirect(new URL('/user', request.url));
      }
      console.log('✅ Middleware: Premium access granted');
    }
    
    // User routes - any authenticated user can access
    if (pathname.startsWith('/user')) {
      console.log('✅ Middleware: User route access granted');
    }
    
    // API Routes protection
    if (pathname.startsWith('/api/')) {
      // Admin API routes
      if (pathname.startsWith('/api/admin') && userRole !== 'ADMIN') {
        console.log('🚫 Middleware: API Admin access denied');
        return NextResponse.json(
          { error: 'Forbidden - Admin access required' },
          { status: 403 }
        );
      }
      
      // Users API routes - admin only
      if (pathname.startsWith('/api/users') && userRole !== 'ADMIN') {
        console.log('🚫 Middleware: API Users access denied');
        return NextResponse.json(
          { error: 'Forbidden - Admin access required' },
          { status: 403 }
        );
      }
    }
    
    console.log('✅ Middleware: Access granted for route:', pathname);
    return NextResponse.next();
    
  } catch (error) {
    console.error('❌ Middleware error:', error);
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
