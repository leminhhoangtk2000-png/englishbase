import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hasPermission, canAccessPremiumContent, isAdmin, isPremiumUser } from '@/lib/permissions'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const permission = searchParams.get('permission')
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isPremium: true
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    let result: any = {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isPremium: user.isPremium
      },
      permissions: {
        isAdmin: isAdmin(user),
        isPremiumUser: isPremiumUser(user),
        canAccessPremiumContent: canAccessPremiumContent(user),
        canManageUsers: hasPermission(user, 'canManageUsers'),
        canManageContent: hasPermission(user, 'canManageContent'),
        canViewAnalytics: hasPermission(user, 'canViewAnalytics'),
        canModerateComments: hasPermission(user, 'canModerateComments'),
        canCreateExercises: hasPermission(user, 'canCreateExercises'),
        canManageVocabulary: hasPermission(user, 'canManageVocabulary')
      }
    }

    // If specific permission is requested
    if (permission) {
      result.hasPermission = hasPermission(user, permission as any)
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Permission check error:', error)
    return NextResponse.json(
      { error: 'Failed to check permissions' },
      { status: 500 }
    )
  }
}
