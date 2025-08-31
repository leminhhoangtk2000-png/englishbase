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

        // Convert user to proper User type
        const userForPermissions = {
            id: user.id,
            email: user.email,
            name: user.name || undefined,
            role: user.role,
            isPremium: user.isPremium
        };

        let result: any = {
            user: {
                id: user.id,
                email: user.email,
                name: user.name || undefined,
                role: user.role,
                isPremium: user.isPremium
            },
            permissions: {
                isAdmin: isAdmin(userForPermissions),
                isPremiumUser: isPremiumUser(userForPermissions),
                canAccessPremiumContent: canAccessPremiumContent(userForPermissions),
                canManageUsers: hasPermission(userForPermissions, 'canManageUsers'),
                canManageContent: hasPermission(userForPermissions, 'canManageContent'),
                canViewAnalytics: hasPermission(userForPermissions, 'canViewAnalytics'),
                canModerateComments: hasPermission(userForPermissions, 'canModerateComments'),
                canCreateExercises: hasPermission(userForPermissions, 'canCreateExercises'),
                canManageVocabulary: hasPermission(userForPermissions, 'canManageVocabulary')
            }
        }

        // If specific permission is requested
        if (permission) {
            result.hasPermission = hasPermission(userForPermissions, permission as any)
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
