import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'
    const level = searchParams.get('level')
    const topic = searchParams.get('topic')

    // Build where clause
    const where: any = {}
    
    if (level) {
      where.level = {
        name: level.toUpperCase()
      }
    }
    
    if (topic) {
      where.topic = {
        slug: topic.toLowerCase()
      }
    }

    // Get vocabulary entries
    const vocabularyEntries = await prisma.vocabularyEntry.findMany({
      where,
      include: {
        level: true,
        topic: true
      },
      orderBy: [
        { level: { order: 'asc' } },
        { topic: { order: 'asc' } },
        { german: 'asc' }
      ]
    })

    // Format data
    const formattedData = vocabularyEntries.map(entry => ({
      id: entry.id,
      german: entry.german,
      vietnamese: entry.vietnamese,
      phonetic: entry.phonetic,
      plural: entry.plural,
      type: entry.type,
      exampleGerman: entry.exampleGerman,
      exampleVietnamese: entry.exampleVietnamese,
      difficulty: entry.difficulty,
      tags: entry.tags,
      level: entry.level.name,
      topic: entry.topic.name,
      topicSlug: entry.topic.slug,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt
    }))

    // Return as CSV if requested
    if (format === 'csv') {
      const csvHeaders = [
        'id', 'german', 'vietnamese', 'phonetic', 'plural', 'type',
        'exampleGerman', 'exampleVietnamese', 'difficulty', 'tags',
        'level', 'topic', 'topicSlug', 'createdAt', 'updatedAt'
      ]
      
      const csvRows = formattedData.map(entry => 
        csvHeaders.map(header => {
          const value = entry[header as keyof typeof entry]
          if (Array.isArray(value)) {
            return `"${value.join(';')}"`
          }
          return `"${value}"`
        }).join(',')
      )
      
      const csvContent = [csvHeaders.join(','), ...csvRows].join('\n')
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="vocabulary-export.csv"'
        }
      })
    }

    // Return statistics
    const stats = {
      total: formattedData.length,
      byLevel: {} as Record<string, number>,
      byTopic: {} as Record<string, number>,
      byType: {} as Record<string, number>
    }

    formattedData.forEach(entry => {
      stats.byLevel[entry.level] = (stats.byLevel[entry.level] || 0) + 1
      stats.byTopic[entry.topic] = (stats.byTopic[entry.topic] || 0) + 1
      stats.byType[entry.type] = (stats.byType[entry.type] || 0) + 1
    })

    return NextResponse.json({
      success: true,
      data: formattedData,
      stats,
      message: `Retrieved ${formattedData.length} vocabulary entries`
    })

  } catch (error) {
    console.error('Export vocabulary error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to export vocabulary data'
    }, { status: 500 })
  }
}
