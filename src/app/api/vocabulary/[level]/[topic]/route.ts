import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/vocabulary/[level]/[topic] - Get vocabulary by level and topic
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ level: string; topic: string }> }
) {
    try {
        const resolvedParams = await params
        const { searchParams } = new URL(request.url)
        const search = searchParams.get('search')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const skip = (page - 1) * limit

        // Find level and topic
        const level = await prisma.vocabularyLevel.findUnique({
            where: { name: resolvedParams.level.toUpperCase() }
        })

        if (!level) {
            return NextResponse.json(
                { error: 'Level not found' },
                { status: 404 }
            )
        }

        const topic = await prisma.vocabularyTopic.findFirst({
            where: {
                levelId: level.id,
                slug: resolvedParams.topic.toLowerCase()
            }
        })

        if (!topic) {
            return NextResponse.json(
                { error: 'Topic not found' },
                { status: 404 }
            )
        }

        // Build where clause
        const where: any = {
            levelId: level.id,
            topicId: topic.id
        }

        if (search) {
            where.OR = [
                { german: { contains: search, mode: 'insensitive' } },
                { vietnamese: { contains: search, mode: 'insensitive' } }
            ]
        }

        // Get vocabulary entries
        const [vocabularyEntries, total] = await Promise.all([
            prisma.vocabularyEntry.findMany({
                where,
                skip,
                take: limit,
                orderBy: { difficulty: 'asc' },
                include: {
                    level: {
                        select: {
                            id: true,
                            name: true,
                            displayName: true
                        }
                    },
                    topic: {
                        select: {
                            id: true,
                            name: true,
                            displayName: true,
                            slug: true
                        }
                    }
                }
            }),
            prisma.vocabularyEntry.count({ where })
        ])

        return NextResponse.json({
            data: vocabularyEntries,
            level: {
                id: level.id,
                name: level.name,
                displayName: level.displayName,
                description: level.description
            },
            topic: {
                id: topic.id,
                name: topic.name,
                displayName: topic.displayName,
                description: topic.description,
                slug: topic.slug
            },
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        })
    } catch (error) {
        console.error('Vocabulary fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch vocabulary' },
            { status: 500 }
        )
    }
}
