import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/vocabulary/topics?levelId=xxx - Get topics by level
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const levelId = searchParams.get('levelId')
        const levelName = searchParams.get('level')

        let where: any = { isActive: true }

        if (levelId) {
            where.levelId = levelId
        } else if (levelName) {
            where.level = {
                name: levelName.toUpperCase()
            }
        }

        const topics = await prisma.vocabularyTopic.findMany({
            where,
            orderBy: { order: 'asc' },
            include: {
                level: {
                    select: {
                        id: true,
                        name: true,
                        displayName: true
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
            data: topics,
            total: topics.length
        })
    } catch (error) {
        console.error('Topics fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch vocabulary topics' },
            { status: 500 }
        )
    }
}

// POST /api/vocabulary/topics - Create new topic
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        const topic = await prisma.vocabularyTopic.create({
            data: {
                name: body.name,
                displayName: body.displayName,
                description: body.description,
                levelId: body.levelId,
                slug: body.slug,
                order: body.order,
                isActive: body.isActive ?? true
            },
            include: {
                level: {
                    select: {
                        name: true,
                        displayName: true
                    }
                }
            }
        })

        return NextResponse.json({
            message: 'Vocabulary topic created successfully!',
            data: topic
        })
    } catch (error) {
        console.error('Topic creation error:', error)
        return NextResponse.json(
            { error: 'Failed to create vocabulary topic' },
            { status: 500 }
        )
    }
}
