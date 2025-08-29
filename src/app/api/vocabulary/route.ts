import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const levelId = searchParams.get('levelId')
        const levelName = searchParams.get('level')
        const topicId = searchParams.get('topicId')
        const topicSlug = searchParams.get('topic')
        const search = searchParams.get('search')
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const skip = (page - 1) * limit

        // Build where clause
        const where: any = {}

        // Filter by level
        if (levelId) {
            where.levelId = levelId
        } else if (levelName) {
            where.level = {
                name: levelName.toUpperCase()
            }
        }

        // Filter by topic
        if (topicId) {
            where.topicId = topicId
        } else if (topicSlug) {
            where.topic = {
                slug: topicSlug.toLowerCase()
            }
        }

        // Search in german and vietnamese
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
                orderBy: { createdAt: 'desc' },
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

export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate required fields
        if (!body.german || !body.vietnamese || !body.levelId || !body.topicId) {
            return NextResponse.json(
                { error: 'Missing required fields: german, vietnamese, levelId, topicId' },
                { status: 400 }
            )
        }

        const vocabularyEntry = await prisma.vocabularyEntry.create({
            data: {
                german: body.german,
                vietnamese: body.vietnamese,
                phonetic: body.phonetic,
                plural: body.plural,
                type: body.type || 'OTHER',
                levelId: body.levelId,
                topicId: body.topicId,
                exampleGerman: body.exampleGerman,
                exampleVietnamese: body.exampleVietnamese,
                difficulty: body.difficulty || 1,
                tags: body.tags || []
            },
            include: {
                level: {
                    select: {
                        name: true,
                        displayName: true
                    }
                },
                topic: {
                    select: {
                        name: true,
                        displayName: true,
                        slug: true
                    }
                }
            }
        })

        return NextResponse.json({
            message: 'Vocabulary entry created successfully!',
            data: vocabularyEntry
        })
    } catch (error) {
        console.error('Vocabulary creation error:', error)
        return NextResponse.json(
            { error: 'Failed to create vocabulary entry' },
            { status: 500 }
        )
    }
}
