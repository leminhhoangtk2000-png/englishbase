'use client'

import React from 'react'

interface ExampleItem {
  german: string
  vietnamese: string
  highlight?: string // Từ cần highlight
}

interface GermanExampleListProps {
  title?: string
  examples: ExampleItem[]
  className?: string
}

export function GermanExampleList({ title, examples, className = '' }: GermanExampleListProps) {
  const highlightText = (text: string, highlight?: string) => {
    if (!highlight) return text
    
    const parts = text.split(new RegExp(`(${highlight})`, 'gi'))
    return parts.map((part, index) => 
      part.toLowerCase() === highlight.toLowerCase() ? (
        <span key={index} className="bg-yellow-200 dark:bg-yellow-700 px-1 py-0.5 rounded font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  return (
    <div className={`my-6 ${className}`}>
      {title && (
        <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          {title}
        </h4>
      )}
      
      <ul className="space-y-4">
        {examples.map((example, index) => (
          <li key={index} className="border-l-4 border-blue-400 dark:border-blue-500 bg-gray-50 dark:bg-gray-800 p-4 rounded-r-lg">
            <div className="space-y-2">
              {/* German sentence */}
              <div className="text-gray-900 dark:text-gray-100 font-medium">
                {highlightText(example.german, example.highlight)}
              </div>
              
              {/* Vietnamese translation */}
              <div className="text-gray-600 dark:text-gray-400 italic text-sm pl-4 border-l-2 border-gray-300 dark:border-gray-600">
                {example.vietnamese}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

// Export để sử dụng trong MDX
export default GermanExampleList
