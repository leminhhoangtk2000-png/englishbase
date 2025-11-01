import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy token xác thực' },
        { status: 401 }
      );
    }

    // Verify JWT token
    let decoded: any;
    try {
      const JWT_SECRET = process.env.JWT_SECRET;
      if (!JWT_SECRET) {
        return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
      }
      decoded = jwt.verify(token, JWT_SECRET);
      // Only log in development for debugging
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ JWT: Token verified, user ID:', decoded.id);
      }
    } catch (jwtError) {
      // Don't log sensitive token errors in production
      if (process.env.NODE_ENV === 'development') {
        console.log('❌ JWT: Token verification failed');
      }
      return NextResponse.json(
        { success: false, message: 'Token không hợp lệ' },
        { status: 401 }
      );
    }

    console.log('🔍 getCurrentUser - Decoded JWT:', decoded);

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
        isPremium: true,
        avatar: true,
        bio: true,
        website: true,
        facebook: true,
        instagram: true,
        tiktok: true,
        threads: true,
        skillLevel: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Không tìm thấy người dùng' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('Get current user error:', error);
    return NextResponse.json(
      { success: false, message: 'Lỗi hệ thống' },
      { status: 500 }
    );
  }
}
