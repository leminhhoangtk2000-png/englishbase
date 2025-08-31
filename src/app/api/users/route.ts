import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getCurrentUser } from '@/lib/auth-server'

export async function GET(request: NextRequest) {
    try {
        // Kiểm tra authentication - chỉ ADMIN mới có thể xem danh sách users
        const currentUser = await getCurrentUser();
        
        if (!currentUser) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
        
        if (currentUser.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Forbidden - Admin access required' },
                { status: 403 }
            );
        }
        const { searchParams } = new URL(request.url)
        const role = searchParams.get('role')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {}

        if (role) {
            where.role = role.toUpperCase()
        }

        // Get users
        const [users, total] = await Promise.all([
            prisma.user.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    email: true,
                    username: true,
                    name: true,
                    avatar: true,
                    role: true,
                    isPremium: true,
                    createdAt: true,
                    updatedAt: true,
                    _count: {
                        select: {
                            posts: true,
                            exercises: true,
                            vocabulary: true
                        }
                    }
                }
            }),
            prisma.user.count({ where })
        ])

        return NextResponse.json({
            data: users,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Users fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const user = await prisma.user.create({
            data: {
                email: body.email,
                username: body.username,
                name: body.name,
                avatar: body.avatar,
                password: body.password || 'defaultpass123', // Add required password field
                role: body.role || 'USER',
                isPremium: body.role === 'USER_PREMIUM' || body.isPremium || false
            }
        })

        return NextResponse.json({
            message: 'User created successfully!',
            data: user
        })
    } catch (error) {
        console.error('User creation error:', error)
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        )
    }
}
