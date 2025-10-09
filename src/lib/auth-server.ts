import { cookies } from 'next/headers'
import { verifyToken } from './auth'
import { prisma } from './prisma'
import { AuthUser } from './auth'
import bcrypt from 'bcryptjs'

export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return null
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return null
    }

    console.log('🔍 getCurrentUser - Decoded JWT:', decoded);

    // Handle both 'id' and 'userId' for backward compatibility
    const userId = decoded.userId || decoded.id;
    if (!userId) {
      console.log('❌ getCurrentUser - No user ID in token');
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
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
        skillLevel: true,
      }
    })

    if (!user) {
      return null
    }

    return {
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
  } catch (error) {
    return null
  }
}

export async function createUser(userData: {
  email: string
  password?: string
  name: string
  role?: 'USER' | 'USER_PREMIUM' | 'ADMIN'
  googleId?: string
  provider?: string
}) {
  // Hash password only if provided
  const hashedPassword = userData.password ? await bcrypt.hash(userData.password, 12) : ''
  
  // Create user in database
  const user = await prisma.user.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: userData.role || 'USER',
      username: userData.email.split('@')[0], // Default username from email
      googleId: userData.googleId,
      provider: userData.provider || 'local',
    }
  })

  return user
}

export async function verifyPassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hashedPassword)
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email }
  })
}
