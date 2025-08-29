import { prisma } from '@/lib/prisma'

export interface VocabularyLevel {
  id: string
  name: string
  displayName: string
  description?: string | null
  order: number
  isActive: boolean
  topics?: VocabularyTopic[]
  _count?: {
    vocabularyEntries: number
  }
}

export interface VocabularyTopic {
  id: string
  name: string
  displayName: string
  description?: string | null
  slug: string
  order: number
  isActive: boolean
  levelId: string
  level?: VocabularyLevel
  _count?: {
    vocabularyEntries: number
  }
}

export interface VocabularyEntry {
  id: string
  german: string
  vietnamese: string
  phonetic?: string
  plural?: string
  type: string
  exampleGerman?: string
  exampleVietnamese?: string
  difficulty: number
  frequency: number
  tags: string[]
  levelId: string
  topicId: string
  level?: VocabularyLevel
  topic?: VocabularyTopic
  createdAt: Date
  updatedAt: Date
}

/**
 * Get all vocabulary levels with their topics
 */
export async function getVocabularyLevels(): Promise<VocabularyLevel[]> {
  return await prisma.vocabularyLevel.findMany({
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
          isActive: true,
          levelId: true,
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
}

/**
 * Get vocabulary topics by level
 */
export async function getVocabularyTopics(levelName: string): Promise<VocabularyTopic[]> {
  return await prisma.vocabularyTopic.findMany({
    where: {
      isActive: true,
      level: {
        name: levelName.toUpperCase()
      }
    },
    orderBy: { order: 'asc' },
    include: {
      level: {
        select: {
          id: true,
          name: true,
          displayName: true,
          description: true,
          order: true,
          isActive: true
        }
      },
      _count: {
        select: {
          vocabularyEntries: true
        }
      }
    }
  })
}

/**
 * Get vocabulary entries by level and topic
 */
export async function getVocabularyByLevelAndTopic(
  levelName: string,
  topicSlug: string,
  options: {
    search?: string
    page?: number
    limit?: number
  } = {}
) {
  const { search, page = 1, limit = 20 } = options
  const skip = (page - 1) * limit

  // Find level and topic
  const level = await prisma.vocabularyLevel.findUnique({
    where: { name: levelName.toUpperCase() }
  })

  if (!level) {
    throw new Error(`Level ${levelName} not found`)
  }

  const topic = await prisma.vocabularyTopic.findFirst({
    where: {
      levelId: level.id,
      slug: topicSlug.toLowerCase()
    }
  })

  if (!topic) {
    throw new Error(`Topic ${topicSlug} not found for level ${levelName}`)
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

  return {
    vocabularyEntries,
    level,
    topic,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * Search vocabulary across all levels and topics
 */
export async function searchVocabulary(
  searchTerm: string,
  options: {
    levelName?: string
    topicSlug?: string
    page?: number
    limit?: number
  } = {}
) {
  const { levelName, topicSlug, page = 1, limit = 20 } = options
  const skip = (page - 1) * limit

  // Build where clause
  const where: any = {
    OR: [
      { german: { contains: searchTerm, mode: 'insensitive' } },
      { vietnamese: { contains: searchTerm, mode: 'insensitive' } }
    ]
  }

  if (levelName) {
    where.level = {
      name: levelName.toUpperCase()
    }
  }

  if (topicSlug) {
    where.topic = {
      slug: topicSlug.toLowerCase()
    }
  }

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

  return {
    vocabularyEntries,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  }
}

/**
 * Get vocabulary statistics
 */
export async function getVocabularyStats() {
  const [
    totalEntries,
    levelStats,
    typeStats
  ] = await Promise.all([
    prisma.vocabularyEntry.count(),
    prisma.vocabularyLevel.findMany({
      select: {
        name: true,
        displayName: true,
        _count: {
          select: {
            vocabularyEntries: true
          }
        }
      },
      orderBy: { order: 'asc' }
    }),
    prisma.vocabularyEntry.groupBy({
      by: ['type'],
      _count: {
        _all: true
      }
    })
  ])

  return {
    total: totalEntries,
    byLevel: levelStats,
    byType: typeStats
  }
}
