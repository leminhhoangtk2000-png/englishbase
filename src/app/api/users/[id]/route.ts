import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await request.json()

        const user = await prisma.user.update({
            where: { id },
            data: {
                role: body.role,
                isPremium: body.role === 'USER_PREMIUM' || body.isPremium
            }
        })

        return NextResponse.json({
            message: 'User role updated successfully!',
            data: user
        })
    } catch (error) {
        console.error('User update error:', error)
        return NextResponse.json(
            { error: 'Failed to update user role' },
            { status: 500 }
        )
    }
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const user = await prisma.user.findUnique({
            where: { id },
            include: {
                _count: {
                    select: {
                        posts: true,
                        exercises: true,
                        vocabulary: true,
                        progress: true
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            )
        }

        return NextResponse.json({
            data: user
        })
    } catch (error) {
        console.error('User fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch user' },
            { status: 500 }
        )
    }
}
