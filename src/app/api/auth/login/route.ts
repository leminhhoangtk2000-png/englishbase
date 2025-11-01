import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { checkRateLimit, getClientIdentifier, createRateLimitResponse, rateLimits } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting to prevent brute force attacks
    const identifier = getClientIdentifier(request);
    const rateLimitResult = checkRateLimit({
      ...rateLimits.auth,
      identifier,
    });

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true,
        isPremium: true,
        provider: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Check if user has password (not OAuth only)
    if (!user.password) {
      return NextResponse.json(
        { success: false, message: 'Tài khoản này sử dụng đăng nhập bằng Google' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      );
    }

    // Validate JWT_SECRET
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET not configured');
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isPremium: user.isPremium
      }
    });

    // Set cookie with enhanced security
    response.cookies.set('auth-token', token, {
      httpOnly: true, // Prevent XSS access to cookie
      secure: process.env.NODE_ENV === 'production', // Only send over HTTPS in production
      sameSite: 'strict', // Prevent CSRF attacks (changed from 'lax' to 'strict')
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/', // Cookie available for entire site
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}
