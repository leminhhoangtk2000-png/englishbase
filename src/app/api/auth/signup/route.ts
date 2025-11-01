import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { checkRateLimit, getClientIdentifier, createRateLimitResponse, rateLimits } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting to prevent spam registrations
    const identifier = getClientIdentifier(request);
    const rateLimitResult = checkRateLimit({
      ...rateLimits.auth,
      identifier,
    });

    if (!rateLimitResult.success) {
      return createRateLimitResponse(rateLimitResult);
    }

    const { email, password, name } = await request.json();

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { success: false, message: 'Email, mật khẩu và tên là bắt buộc' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() }
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email này đã được sử dụng' },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Validate JWT_SECRET
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      console.error('CRITICAL: JWT_SECRET not configured');
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        name,
        username: email.split('@')[0], // Generate username from email
        role: 'USER',
        isPremium: false,
        provider: 'local',
        isEmailVerified: false
      }
    });

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
      message: 'Đăng ký thành công',
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
    console.error('Signup error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}
