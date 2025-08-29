'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface VocabularyLevel {
  id: string
  name: string
  displayName: string
  description?: string | null
  order: number
  isActive: boolean
  topics: VocabularyTopic[]
  _count: {
    vocabularyEntries: number
  }
}

interface VocabularyTopic {
  id: string
  name: string
  displayName: string
  description?: string | null
  slug: string
  order: number
  isActive: boolean
  levelId: string
  _count: {
    vocabularyEntries: number
  }
}

export default function VocabularyNewPage() {
  const [levels, setLevels] = useState<VocabularyLevel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchVocabularyLevels()
  }, [])

  const fetchVocabularyLevels = async () => {
    try {
      const response = await fetch('/api/vocabulary/levels')
      if (!response.ok) {
        throw new Error('Failed to fetch vocabulary levels')
      }
      const data = await response.json()
      setLevels(data.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          Error: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Thư viện từ vựng tiếng Đức
        </h1>
        <p className="text-gray-600">
          Học từ vựng tiếng Đức theo cấu trúc phân cấp từ A1 đến C2
        </p>
      </div>

      <div className="grid gap-6">
        {levels.map((level) => (
          <div key={level.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-bold">{level.displayName}</h2>
                  <p className="text-blue-100 mt-1">{level.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{level._count.vocabularyEntries}</div>
                  <div className="text-blue-100">từ vựng</div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chủ đề</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {level.topics.map((topic) => (
                  <Link 
                    key={topic.id}
                    href={`/vocabulary-new/${level.name}/${topic.slug}`}
                    className="group"
                  >
                    <div className="bg-gray-50 hover:bg-blue-50 rounded-lg p-4 transition-colors border border-gray-200 hover:border-blue-300">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-gray-900 group-hover:text-blue-600">
                            {topic.displayName}
                          </h4>
                          <p className="text-sm text-gray-500 mt-1">
                            {topic.description}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-blue-600">
                            {topic._count.vocabularyEntries}
                          </div>
                          <div className="text-xs text-gray-500">từ</div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {level.topics.length === 0 && (
                <p className="text-gray-500 italic">Chưa có chủ đề nào cho cấp độ này.</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {levels.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Chưa có dữ liệu từ vựng nào.</p>
        </div>
      )}
    </div>
  )
}
