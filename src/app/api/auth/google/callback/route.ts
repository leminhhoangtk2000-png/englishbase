import { NextRequest, NextResponse } from 'next/server'
import { OAuth2Client } from 'google-auth-library'
import { prisma } from '@/lib/prisma'
import { generateToken } from '@/lib/auth'
import { cookies } from 'next/headers'
import { AuthUser } from '@/lib/auth'

const client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.NEXTAUTH_URL}/api/auth/google/callback`
)

// Helper function to validate Gmail domain
function isGmailEmail(email: string): boolean {
  return email.toLowerCase().endsWith('@gmail.com')
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state') // Contains action: 'login' or 'signup'
    
    if (!code) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=no_code`)
    }

    // Exchange the code for tokens
    const { tokens } = await client.getToken(code)
    client.setCredentials(tokens)

    // Get user information from Google
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    })

    const payload = ticket.getPayload()
    if (!payload) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=invalid_token`)
    }

    const { sub: googleId, email, name, picture, email_verified } = payload

    // Validate that it's a Gmail address
    if (!email || !isGmailEmail(email)) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=not_gmail`)
    }

    // Check if user already exists
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email },
          { googleId: googleId }
        ]
      }
    })

    if (user) {
      // User exists, update Google ID if not set
      if (!user.googleId && user.email === email) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: googleId,
            provider: 'google',
            emailVerified: email_verified ? new Date() : null,
            isEmailVerified: !!email_verified,
            avatar: picture || user.avatar,
            name: name || user.name,
          }
        })
      }
    } else {
      // Create new user
      if (state === 'signup') {
        user = await prisma.user.create({
          data: {
            email: email,
            name: name || '',
            googleId: googleId,
            provider: 'google',
            emailVerified: email_verified ? new Date() : null,
            isEmailVerified: !!email_verified,
            avatar: picture,
            username: email.split('@')[0], // Use email prefix as username
            role: 'USER',
            password: '', // Empty string for OAuth users
          }
        })
      } else {
        // Login attempt but user doesn't exist
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=user_not_found`)
      }
    }

    // Create AuthUser object
    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      username: user.username,
      role: user.role,
      isPremium: user.isPremium,
      avatar: user.avatar,
      bio: user.bio,
      website: user.website,
      facebook: user.facebook,
      instagram: user.instagram,
      tiktok: user.tiktok,
      threads: user.threads,
      skillLevel: user.skillLevel,
    }

    // Generate JWT token
    const token = generateToken(authUser)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: false, // Set to false for localhost development
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    // Redirect to success page
    const redirectUrl = state === 'signup' 
      ? `${process.env.NEXTAUTH_URL}/welcome?new_user=true`
      : `${process.env.NEXTAUTH_URL}/dashboard`

    return NextResponse.redirect(redirectUrl)

  } catch (error) {
    console.error('Google OAuth callback error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/login?error=oauth_error`)
  }
}
