import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from '@/hooks/use-theme'

interface CodeBlockProps {
  children: string
  className?: string
  title?: string
  showLineNumbers?: boolean
  language?: string
  highlightLines?: string
  metastring?: string
}

export function CodeBlock({
  children,
  className,
  title,
  showLineNumbers = false,
  language,
  highlightLines,
  metastring,
}: CodeBlockProps) {
  const { theme } = useTheme()
  
  // Extract language from className (e.g., "language-javascript")
  const extractedLanguage = className?.replace(/language-/, '') || language || 'text'
  
  // Parse metastring for additional options
  const meta = metastring || ''
  const shouldShowLineNumbers = meta.includes('showLineNumbers') || showLineNumbers
  const titleFromMeta = meta.match(/title="([^"]*)"/) || meta.match(/title=([^\s]*)/)?.[1]
  const actualTitle = titleFromMeta || title
  
  // Parse highlight lines from metastring (e.g., {1,3-5})
  const highlightLinesFromMeta = meta.match(/\{([^}]*)\}/)?.[1]
  const linesToHighlight = parseHighlightLines(highlightLinesFromMeta || highlightLines || '')
  
  const isDark = theme === 'dark'
  
  return (
    <div className="code-block-container my-6">
      {actualTitle && (
        <div className="code-block-title bg-gray-100 dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
          {actualTitle}
        </div>
      )}
      <div className="relative">
        <SyntaxHighlighter
          language={extractedLanguage}
          style={isDark ? vscDarkPlus : vs}
          showLineNumbers={shouldShowLineNumbers}
          wrapLines={true}
          lineProps={(lineNumber: number) => ({
            style: {
              backgroundColor: linesToHighlight.includes(lineNumber)
                ? isDark
                  ? 'rgba(255, 255, 255, 0.1)'
                  : 'rgba(0, 0, 0, 0.05)'
                : 'transparent',
            },
          })}
          customStyle={{
            margin: 0,
            borderRadius: actualTitle ? '0 0 0.5rem 0.5rem' : '0.5rem',
            fontSize: '0.875rem',
            lineHeight: '1.6',
          }}
          codeTagProps={{
            style: {
              fontSize: '0.875rem',
              fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
            },
          }}
        >
          {children.trim()}
        </SyntaxHighlighter>
      </div>
    </div>
  )
}

// Parse highlight lines specification like "1,3-5,7"
function parseHighlightLines(lines: string): number[] {
  if (!lines) return []
  
  const result: number[] = []
  const parts = lines.split(',').map(s => s.trim())
  
  for (const part of parts) {
    if (part.includes('-')) {
      const [start, end] = part.split('-').map(Number)
      for (let i = start; i <= end; i++) {
        result.push(i)
      }
    } else {
      result.push(Number(part))
    }
  }
  
  return result
}
