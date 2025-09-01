import { NextRequest, NextResponse } from 'next/server'
import { loginUser } from '@/lib/auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và password là bắt buộc' },
        { status: 400 }
      )
    }

    const result = await loginUser(email, password)

    if (!result) {
      return NextResponse.json(
        { error: 'Email hoặc password không đúng' },
        { status: 401 }
      )
    }

    const { user, token } = result

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: false, // Set to false for localhost development
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    console.log('🍪 Login: Cookie set successfully with token:', token.substring(0, 20) + '...')

    return NextResponse.json({
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        username: user.username,
        role: user.role,
        isPremium: user.isPremium,
        avatar: user.avatar,
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Có lỗi xảy ra khi đăng nhập' },
      { status: 500 }
    )
  }
}
