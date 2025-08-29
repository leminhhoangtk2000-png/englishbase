'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

interface VocabularyEntry {
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
  level: {
    id: string
    name: string
    displayName: string
  }
  topic: {
    id: string
    name: string
    displayName: string
    slug: string
  }
}

interface VocabularyData {
  data: VocabularyEntry[]
  level: {
    id: string
    name: string
    displayName: string
    description?: string | null
  }
  topic: {
    id: string
    name: string
    displayName: string
    description?: string | null
    slug: string
  }
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export default function VocabularyTopicPage() {
  const params = useParams()
  const [vocabularyData, setVocabularyData] = useState<VocabularyData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (params.level && params.topic) {
      fetchVocabularyData()
    }
  }, [params.level, params.topic, searchTerm])

  const fetchVocabularyData = async () => {
    try {
      const queryParams = new URLSearchParams()
      if (searchTerm) {
        queryParams.set('search', searchTerm)
      }
      
      const response = await fetch(
        `/api/vocabulary/${params.level}/${params.topic}?${queryParams}`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch vocabulary data')
      }
      
      const data = await response.json()
      setVocabularyData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchVocabularyData()
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

  if (!vocabularyData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không tìm thấy dữ liệu.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-500">
          <li>
            <Link href="/vocabulary-new" className="hover:text-blue-600">
              Thư viện từ vựng
            </Link>
          </li>
          <li>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{vocabularyData.level.displayName}</span>
          </li>
          <li>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{vocabularyData.topic.displayName}</span>
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-2">
            {vocabularyData.topic.displayName}
          </h1>
          <p className="text-blue-100 mb-2">
            {vocabularyData.level.displayName} • {vocabularyData.pagination.total} từ vựng
          </p>
          {vocabularyData.topic.description && (
            <p className="text-blue-100">
              {vocabularyData.topic.description}
            </p>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Tìm kiếm từ vựng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tìm kiếm
          </button>
        </form>
      </div>

      {/* Vocabulary List */}
      <div className="grid gap-4">
        {vocabularyData.data.map((entry) => (
          <div key={entry.id} className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* German side */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-xl font-bold text-gray-900">
                    {entry.german}
                  </h3>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {entry.type}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    Mức {entry.difficulty}
                  </span>
                </div>
                
                {entry.phonetic && (
                  <p className="text-gray-600 text-sm mb-2">
                    <span className="font-medium">Phiên âm:</span> {entry.phonetic}
                  </p>
                )}
                
                {entry.plural && (
                  <p className="text-gray-600 text-sm mb-2">
                    <span className="font-medium">Số nhiều:</span> {entry.plural}
                  </p>
                )}

                {entry.exampleGerman && (
                  <div className="mt-3 p-3 bg-gray-50 rounded">
                    <p className="text-sm text-gray-700">
                      <span className="font-medium">Ví dụ:</span> {entry.exampleGerman}
                    </p>
                  </div>
                )}
              </div>

              {/* Vietnamese side */}
              <div>
                <h3 className="text-xl font-bold text-blue-600 mb-2">
                  {entry.vietnamese}
                </h3>

                {entry.exampleVietnamese && (
                  <div className="mt-3 p-3 bg-blue-50 rounded">
                    <p className="text-sm text-blue-700">
                      <span className="font-medium">Nghĩa:</span> {entry.exampleVietnamese}
                    </p>
                  </div>
                )}

                {entry.tags.length > 0 && (
                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1">
                      {entry.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {vocabularyData.data.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            {searchTerm 
              ? `Không tìm thấy từ vựng nào với từ khóa "${searchTerm}"`
              : 'Chưa có từ vựng nào trong chủ đề này.'
            }
          </p>
        </div>
      )}

      {/* Back button */}
      <div className="mt-8">
        <Link
          href="/vocabulary-new"
          className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          ← Quay lại thư viện từ vựng
        </Link>
      </div>
    </div>
  )
}
