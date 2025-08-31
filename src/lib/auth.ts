import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'
import { User } from '@prisma/client'

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'

export interface AuthUser {
  id: string
  email: string
  name: string | null
  username: string | null
  role: string
  isPremium: boolean
  avatar: string | null
  bio: string | null
  url: string | null
  facebook: string | null
  instagram: string | null
  tiktok: string | null
  threads: string | null
  niveau: string | null
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

export function generateToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export async function loginUser(email: string, password: string): Promise<{ user: AuthUser; token: string } | null> {
  try {
    // Try database first
    try {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() }
      })

      if (user) {
        const isValidPassword = await verifyPassword(password, user.password)
        if (!isValidPassword) {
          return null
        }

        const authUser: AuthUser = {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username,
          role: user.role,
          isPremium: user.isPremium,
          avatar: user.avatar,
          bio: user.bio,
          url: user.url,
          facebook: user.facebook,
          instagram: user.instagram,
          tiktok: user.tiktok,
          threads: user.threads,
          niveau: user.niveau,
        }

        const token = generateToken(authUser)
        return { user: authUser, token }
      }
    } catch (dbError) {
      console.log('Database not available, using temp users for development')
      
      // Fallback to temp users for development
      const { findTempUserByEmail } = await import('./temp-users')
      const tempUser = findTempUserByEmail(email)
      
      if (tempUser) {
        const isValidPassword = await verifyPassword(password, tempUser.password)
        if (!isValidPassword) {
          return null
        }

        const authUser: AuthUser = {
          id: tempUser.id,
          email: tempUser.email,
          name: tempUser.name,
          username: tempUser.username,
          role: tempUser.role,
          isPremium: tempUser.isPremium,
          avatar: tempUser.avatar,
          bio: null,
          url: null,
          facebook: null,
          instagram: null,
          tiktok: null,
          threads: null,
          niveau: null,
        }

        const token = generateToken(authUser)
        return { user: authUser, token }
      }
    }

    return null
  } catch (error) {
    console.error('Error logging in user:', error)
    return null
  }
}

export function getDashboardPath(role: string): string {
  switch (role) {
    case 'ADMIN':
      return '/admin'
    case 'USER_PREMIUM':
      return '/user-premium'
    case 'USER':
      return '/user'
    default:
      return '/user'
  }
}
