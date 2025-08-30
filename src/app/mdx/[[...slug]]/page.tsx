import { NextRequest } from 'next/server'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getMDXFile, getMDXTableOfContents } from '@/lib/mdx'
import { DocsTOC } from '@/components/docs-toc-client'

// Import tất cả exercise components
import { 
  Lueckentext, 
  MultipleChoice, 
  MatchingExercise, 
  WritingExercise, 
  AuthorCredit, 
  FacebookComments 
} from '@/components/exercises'

// MDX components mapping
const components = {
  Lueckentext,
  MultipleChoice,
  MatchingExercise,
  WritingExercise,
  AuthorCredit,
  FacebookComments,
  // Các components HTML cơ bản
  h1: (props: any) => <h1 className="text-3xl font-bold mb-6" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-semibold mb-4 mt-8" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-semibold mb-3 mt-6" {...props} />,
  h4: (props: any) => <h4 className="text-lg font-semibold mb-2 mt-4" {...props} />,
  p: (props: any) => <p className="mb-4 leading-relaxed" {...props} />,
  ul: (props: any) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
  ol: (props: any) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
  li: (props: any) => <li className="mb-1" {...props} />,
  code: (props: any) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props} />,
  pre: (props: any) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-blue-500 pl-4 italic mb-4" {...props} />,
}

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
}

export default async function MDXPage({ params }: PageProps) {
  const resolvedParams = await params
  const slug = resolvedParams.slug?.join('/') || 'demo/exercise-components'
  
  try {
    const mdxFile = await getMDXFile(slug)
    const toc = await getMDXTableOfContents(slug)
    
    if (!mdxFile) {
      notFound()
    }

    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Main content */}
          <div className="flex-1 max-w-4xl">
            <div className="prose prose-lg max-w-none">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4">{mdxFile.meta.title}</h1>
                {mdxFile.meta.description && (
                  <p className="text-xl text-gray-600 mb-4">{mdxFile.meta.description}</p>
                )}
                {mdxFile.meta.author && (
                  <p className="text-sm text-gray-500">Tác giả: {mdxFile.meta.author}</p>
                )}
                {mdxFile.meta.date && (
                  <p className="text-sm text-gray-500">Ngày: {mdxFile.meta.date}</p>
                )}
              </div>

              {/* MDX Content */}
              <MDXRemote 
                source={mdxFile.content} 
                components={components}
              />
            </div>
          </div>

          {/* Table of Contents Sidebar */}
          {toc.length > 0 && (
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-8">
                <DocsTOC toc={{ items: toc.map(item => ({ title: item.title, url: `#${item.id}`, level: item.level })) }} />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error loading MDX file:', error)
    notFound()
  }
}

export async function generateStaticParams() {
  // Static params cho demo page
  return [
    { slug: ['demo', 'exercise-components'] }
  ]
}
