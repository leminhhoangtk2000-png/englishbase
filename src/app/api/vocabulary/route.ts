import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level')
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (level) {
      where.level = level.toUpperCase()
    }
    
    if (category) {
      where.category = category
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
        orderBy: { createdAt: 'desc' }
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
    
    const vocabularyEntry = await prisma.vocabularyEntry.create({
      data: {
        german: body.german,
        vietnamese: body.vietnamese,
        phonetic: body.phonetic,
        plural: body.plural,
        type: body.type || 'OTHER',
        level: body.level || 'A1',
        exampleGerman: body.exampleGerman,
        exampleVietnamese: body.exampleVietnamese,
        category: body.category,
        difficulty: body.difficulty || 1
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
