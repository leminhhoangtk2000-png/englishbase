import type { MDXComponents } from 'mdx/types';
import { MultipleChoiceQuiz } from '@/components/ui/multiple-choice-quiz';
import { Lueckentext } from '@/components/ui/lueckentext';
import { AuthorCredit } from '@/components/ui/author-credit';
import { Comments } from '@/components/ui/comments';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Built-in components with enhanced styling
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mb-8 text-center font-headline bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <div className="mb-8 mt-12">
        <h2 className="text-3xl font-bold mb-6 font-headline text-gray-900 flex items-center gap-3">
          <span className="w-1 h-8 bg-gradient-to-b from-purple-500 to-blue-500 rounded-full"></span>
          {children}
        </h2>
      </div>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mb-4 mt-8 font-headline text-purple-700 flex items-center gap-2">
        <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
        {children}
      </h3>
    ),
    p: ({ children }) => <p className="mb-6 leading-8 text-gray-700">{children}</p>,
    
    // Video wrapper for center alignment
    iframe: ({ src, title, width, height, ...props }) => (
      <div className="my-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="relative aspect-video">
                <iframe
                  src={src}
                  title={title}
                  className="absolute inset-0 w-full h-full rounded-xl shadow-md"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                  {...props}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    ),

    // Horizontal rule styling
    hr: () => (
      <div className="my-12 flex justify-center">
        <div className="w-24 h-1 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"></div>
      </div>
    ),

    // Block quotes for tips
    blockquote: ({ children }) => (
      <div className="my-8 bg-gradient-to-r from-purple-50 to-blue-50 border-l-4 border-purple-400 rounded-r-xl p-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="prose prose-purple text-gray-700">{children}</div>
        </div>
      </div>
    ),
    
    // Custom components
    MultipleChoiceQuiz,
    Lueckentext,
    AuthorCredit,
    Comments,
    
    // Deprecated - kept for backward compatibility
    FacebookComments: Comments,
    
    // Allow other components to pass through
    ...components,
  };
}
