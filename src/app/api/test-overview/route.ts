import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        // Get all users with their stats
        const users = await prisma.user.findMany({
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                role: true,
                isPremium: true,
                createdAt: true,
                _count: {
                    select: {
                        posts: true,
                        exercises: true,
                        vocabulary: true,
                        progress: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        // Get database stats
        const stats = {
            totalUsers: await prisma.user.count(),
            adminUsers: await prisma.user.count({ where: { role: 'ADMIN' } }),
            premiumUsers: await prisma.user.count({ where: { role: 'USER_PREMIUM' } }),
            regularUsers: await prisma.user.count({ where: { role: 'USER' } }),
            vocabularyEntries: await prisma.vocabularyEntry.count(),
            exercises: await prisma.exercise.count(),
            posts: await prisma.post.count(),
            payments: await prisma.payment.count()
        }

        return NextResponse.json({
            message: 'Database overview retrieved successfully',
            stats,
            users,
            testInstructions: {
                description: 'Test accounts have been created for development',
                accounts: [
                    {
                        role: 'ADMIN',
                        email: 'admin@edu-theme.com',
                        username: 'admin',
                        permissions: 'Full system access, user management, content management'
                    },
                    {
                        role: 'USER_PREMIUM',
                        email: 'premium@edu-theme.com',
                        username: 'premium_user',
                        permissions: 'Premium features, advanced exercises, unlimited vocabulary'
                    },
                    {
                        role: 'USER',
                        email: 'user@edu-theme.com',
                        username: 'regular_user',
                        permissions: 'Basic features, limited content access'
                    }
                ],
                testEndpoints: [
                    'GET /api/test-overview - This endpoint',
                    'GET /api/users - List users with filtering',
                    'GET /api/users/[id] - Get specific user',
                    'PATCH /api/users/[id] - Update user role',
                    'GET /api/permissions?userId=[id] - Check permissions',
                    'GET /api/vocabulary - Vocabulary with filtering',
                    '/admin/users - Admin user management page'
                ]
            }
        })
    } catch (error) {
        console.error('Database overview error:', error)
        return NextResponse.json(
            { error: 'Failed to retrieve database overview' },
            { status: 500 }
        )
    }
}
