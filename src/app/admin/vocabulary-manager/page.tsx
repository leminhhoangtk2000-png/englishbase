'use client'

import { useState, useEffect } from 'react'

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
  tags: string[]
  level: {
    name: string
    displayName: string
  }
  topic: {
    name: string
    displayName: string
    slug: string
  }
}

export default function VocabularyManagerPage() {
  const [levels, setLevels] = useState<VocabularyLevel[]>([])
  const [selectedLevel, setSelectedLevel] = useState<string>('')
  const [selectedTopic, setSelectedTopic] = useState<string>('')
  const [vocabularyEntries, setVocabularyEntries] = useState<VocabularyEntry[]>([])
  const [loading, setLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newEntry, setNewEntry] = useState({
    german: '',
    vietnamese: '',
    phonetic: '',
    plural: '',
    type: 'NOMEN',
    exampleGerman: '',
    exampleVietnamese: '',
    difficulty: 1,
    tags: ''
  })

  useEffect(() => {
    fetchLevels()
  }, [])

  useEffect(() => {
    if (selectedLevel && selectedTopic) {
      fetchVocabularyEntries()
    }
  }, [selectedLevel, selectedTopic])

  const fetchLevels = async () => {
    try {
      const response = await fetch('/api/vocabulary/levels')
      const data = await response.json()
      setLevels(data.data)
    } catch (error) {
      console.error('Error fetching levels:', error)
    }
  }

  const fetchVocabularyEntries = async () => {
    if (!selectedLevel || !selectedTopic) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/vocabulary/${selectedLevel}/${selectedTopic}?limit=100`)
      const data = await response.json()
      setVocabularyEntries(data.data)
    } catch (error) {
      console.error('Error fetching vocabulary entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const levelObj = levels.find(l => l.name === selectedLevel)
    const topicObj = levelObj?.topics.find(t => t.slug === selectedTopic)
    
    if (!levelObj || !topicObj) {
      alert('Please select level and topic first')
      return
    }

    try {
      const response = await fetch('/api/vocabulary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newEntry,
          levelId: levelObj.id,
          topicId: topicObj.id,
          tags: newEntry.tags ? newEntry.tags.split(',').map(tag => tag.trim()) : []
        }),
      })

      if (response.ok) {
        alert('Vocabulary entry added successfully!')
        setNewEntry({
          german: '',
          vietnamese: '',
          phonetic: '',
          plural: '',
          type: 'NOMEN',
          exampleGerman: '',
          exampleVietnamese: '',
          difficulty: 1,
          tags: ''
        })
        setShowAddForm(false)
        fetchVocabularyEntries()
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error adding vocabulary entry:', error)
      alert('Failed to add vocabulary entry')
    }
  }

  const selectedLevelObj = levels.find(l => l.name === selectedLevel)
  const availableTopics = selectedLevelObj?.topics || []

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Quản lý thư viện từ vựng
      </h1>

      {/* Level and Topic Selection */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Chọn cấp độ và chủ đề</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cấp độ
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => {
                setSelectedLevel(e.target.value)
                setSelectedTopic('')
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Chọn cấp độ</option>
              {levels.map((level) => (
                <option key={level.id} value={level.name}>
                  {level.displayName} ({level._count.vocabularyEntries} từ)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chủ đề
            </label>
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              disabled={!selectedLevel}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Chọn chủ đề</option>
              {availableTopics.map((topic) => (
                <option key={topic.id} value={topic.slug}>
                  {topic.displayName} ({topic._count.vocabularyEntries} từ)
                </option>
              ))}
            </select>
          </div>
        </div>

        {selectedLevel && selectedTopic && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            {showAddForm ? 'Hủy' : 'Thêm từ vựng mới'}
          </button>
        )}
      </div>

      {/* Add New Entry Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Thêm từ vựng mới</h2>
          
          <form onSubmit={handleAddEntry} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Từ tiếng Đức *
                </label>
                <input
                  type="text"
                  value={newEntry.german}
                  onChange={(e) => setNewEntry({...newEntry, german: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nghĩa tiếng Việt *
                </label>
                <input
                  type="text"
                  value={newEntry.vietnamese}
                  onChange={(e) => setNewEntry({...newEntry, vietnamese: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phiên âm
                </label>
                <input
                  type="text"
                  value={newEntry.phonetic}
                  onChange={(e) => setNewEntry({...newEntry, phonetic: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số nhiều
                </label>
                <input
                  type="text"
                  value={newEntry.plural}
                  onChange={(e) => setNewEntry({...newEntry, plural: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Loại từ
                </label>
                <select
                  value={newEntry.type}
                  onChange={(e) => setNewEntry({...newEntry, type: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                >
                  <option value="NOMEN">Danh từ</option>
                  <option value="VERB">Động từ</option>
                  <option value="ADJEKTIV">Tính từ</option>
                  <option value="ADVERB">Trạng từ</option>
                  <option value="PRONOUN">Đại từ</option>
                  <option value="PREPOSITION">Giới từ</option>
                  <option value="CONJUNCTION">Liên từ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Độ khó (1-5)
                </label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newEntry.difficulty}
                  onChange={(e) => setNewEntry({...newEntry, difficulty: parseInt(e.target.value)})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ví dụ tiếng Đức
              </label>
              <textarea
                value={newEntry.exampleGerman}
                onChange={(e) => setNewEntry({...newEntry, exampleGerman: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ví dụ tiếng Việt
              </label>
              <textarea
                value={newEntry.exampleVietnamese}
                onChange={(e) => setNewEntry({...newEntry, exampleVietnamese: e.target.value})}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tags (cách nhau bằng dấu phẩy)
              </label>
              <input
                type="text"
                value={newEntry.tags}
                onChange={(e) => setNewEntry({...newEntry, tags: e.target.value})}
                placeholder="tag1, tag2, tag3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Thêm từ vựng
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vocabulary Entries List */}
      {selectedLevel && selectedTopic && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">
            Danh sách từ vựng ({vocabularyEntries.length} từ)
          </h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Tiếng Đức</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Tiếng Việt</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Loại từ</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Độ khó</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-900">Phiên âm</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {vocabularyEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 text-sm font-medium text-gray-900">
                        {entry.german}
                        {entry.plural && (
                          <div className="text-xs text-gray-500">
                            Số nhiều: {entry.plural}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-900">{entry.vietnamese}</td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                          {entry.type}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">
                        <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                          {entry.difficulty}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-sm text-gray-500">{entry.phonetic}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {vocabularyEntries.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500">Chưa có từ vựng nào trong chủ đề này.</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
