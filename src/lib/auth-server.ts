import { cookies } from 'next/headers'
import { verifyToken } from './auth'
import { prisma } from './prisma'
import { AuthUser } from './auth'

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
    }
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}
