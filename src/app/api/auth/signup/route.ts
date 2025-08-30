import { NextRequest, NextResponse } from 'next/server'
import { createUser, verifyPassword } from '@/lib/auth-server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password và tên là bắt buộc' },
        { status: 400 }
      )
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email không hợp lệ' },
        { status: 400 }
      )
    }

    // Check password length
    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      )
    }

    try {
      // Create user
      const user = await createUser({
        email: email.toLowerCase().trim(),
        password,
        name: name.trim(),
        role: 'USER' // Default role
      })

      // Create JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      // Set cookie
      const cookieStore = await cookies()
      cookieStore.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 // 7 days
      })

      // Return user data (without password)
      const { password: _, ...userWithoutPassword } = user

      return NextResponse.json({
        success: true,
        message: 'Đăng ký thành công',
        user: userWithoutPassword
      })

    } catch (error: any) {
      // Handle unique constraint errors (email already exists)
      if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
        return NextResponse.json(
          { error: 'Email này đã được sử dụng' },
          { status: 409 }
        )
      }

      console.error('Signup error:', error)
      return NextResponse.json(
        { error: 'Có lỗi xảy ra khi tạo tài khoản' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Signup request error:', error)
    return NextResponse.json(
      { error: 'Dữ liệu không hợp lệ' },
      { status: 400 }
    )
  }
}
