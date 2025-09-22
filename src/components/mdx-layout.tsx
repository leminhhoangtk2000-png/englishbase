"use client"

import React from 'react'
import { MDXRemote } from 'next-mdx-remote/rsc'
import mdxComponents from './mdx-provider'
import { DocsTOC } from './docs-toc-client'
import { type MDXTableOfContentsItem } from '../lib/mdx'
import { preprocessAdmonitions } from '../lib/preprocess-admonitions'

interface MDXLayoutProps {
  source: any // MDX source from next-mdx-remote/rsc
  frontMatter: {
    title: string
    description?: string
    author?: string
    date?: string
    level?: string
    category?: string
    tags?: string[]
  }
  toc?: MDXTableOfContentsItem[]
  showTOC?: boolean
  className?: string
}

export default function MDXLayout({ 
  source, 
  frontMatter, 
  toc = [], 
  showTOC = true,
  className = "" 
}: MDXLayoutProps) {
  return (
    <div className={`container mx-auto px-4 py-8 ${className}`}>
      <div className="flex gap-8">
        {/* Main Content */}
        <div className="flex-1 max-w-4xl">
          <article className="prose prose-lg max-w-none dark:prose-invert">
            {/* Article Header */}
            <header className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">
                {frontMatter.title}
              </h1>
              
              {frontMatter.description && (
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">
                  {frontMatter.description}
                </p>
              )}
              
              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
                {frontMatter.author && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                    {frontMatter.author}
                  </span>
                )}
                
                {frontMatter.date && (
                  <span className="flex items-center gap-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    {frontMatter.date}
                  </span>
                )}
                
                {frontMatter.level && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    frontMatter.level === 'A1' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    frontMatter.level === 'A2' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    frontMatter.level === 'B1' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    frontMatter.level === 'B2' ? 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' :
                    frontMatter.level === 'C1' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                    frontMatter.level === 'C2' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {frontMatter.level}
                  </span>
                )}
                
                {frontMatter.category && (
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                    {frontMatter.category}
                  </span>
                )}
              </div>
              
              {/* Tags */}
              {frontMatter.tags && frontMatter.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {frontMatter.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {/* MDX Content */}
            <div className="mdx-content">
              <MDXRemote 
                {...source} 
                components={mdxComponents}
              />
            </div>
          </article>
        </div>

        {/* Table of Contents Sidebar */}
        {showTOC && toc.length > 0 && (
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-8">
              <DocsTOC 
                toc={{ 
                  items: toc.map(item => ({ 
                    title: item.title, 
                    url: `#${item.id}`,
                    level: item.level 
                  })) 
                }} 
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  )
}

// Utility component for simple MDX rendering without layout
export function SimpleMDXRenderer({ 
  source, 
  className = "" 
}: { 
  source: any
  className?: string 
}) {
  return (
    <div className={`prose prose-lg max-w-none dark:prose-invert ${className}`}>
      <MDXRemote 
        {...source} 
        components={mdxComponents}
      />
    </div>
  )
}
