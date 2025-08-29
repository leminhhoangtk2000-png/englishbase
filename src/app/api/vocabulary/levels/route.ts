import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/vocabulary/levels - Get all vocabulary levels
export async function GET(request: NextRequest) {
    try {
        const levels = await prisma.vocabularyLevel.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' },
            include: {
                topics: {
                    where: { isActive: true },
                    orderBy: { order: 'asc' },
                    select: {
                        id: true,
                        name: true,
                        displayName: true,
                        description: true,
                        slug: true,
                        order: true,
                        _count: {
                            select: {
                                vocabularyEntries: true
                            }
                        }
                    }
                },
                _count: {
                    select: {
                        vocabularyEntries: true
                    }
                }
            }
        })

        return NextResponse.json({
            data: levels,
            total: levels.length
        })
    } catch (error) {
        console.error('Levels fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch vocabulary levels' },
            { status: 500 }
        )
    }
}

// POST /api/vocabulary/levels - Create new vocabulary level (admin only)
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const level = await prisma.vocabularyLevel.create({
            data: {
                name: body.name,
                displayName: body.displayName,
                description: body.description,
                order: body.order,
                isActive: body.isActive ?? true
            }
        })

        return NextResponse.json({
            message: 'Vocabulary level created successfully!',
            data: level
        })
    } catch (error) {
        console.error('Level creation error:', error)
        return NextResponse.json(
            { error: 'Failed to create vocabulary level' },
            { status: 500 }
        )
    }
}
