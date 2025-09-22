import type { MDXComponents } from 'mdx/types';
import { MultipleChoiceQuiz } from '@/components/ui/multiple-choice-quiz';
import { Lueckentext } from '@/components/ui/lueckentext';
import { AuthorCredit } from '@/components/ui/author-credit';
import { Comments } from '@/components/ui/comments';
import { ExerciseMetadataHider } from '@/components/exercise-metadata-hider';
import { AdmonitionCleaner } from '@/components/admonition-cleaner';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Wrapper to add metadata hider to all MDX content
    wrapper: ({ children }) => (
      <div data-mdx-content>
        <ExerciseMetadataHider />
        <AdmonitionCleaner />
        {children}
      </div>
    ),
    // Built-in components with enhanced styling
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold mb-8 text-center font-headline">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <div className="mb-8 mt-12">
        <h2 className="text-3xl font-bold mb-6 font-headline flex items-center gap-3">
          <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
          {children}
        </h2>
      </div>
    ),
    h3: ({ children }) => (
      <h3 className="text-xl font-semibold mb-4 mt-8 font-headline flex items-center gap-2">
        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
        {children}
      </h3>
    ),
    p: ({ children }) => <p className="mb-6 leading-8">{children}</p>,
    
    // Video wrapper for center alignment
    iframe: ({ src, title, width, height, ...props }) => (
      <div className="my-10">
        <div className="p-2">
          <div className="flex justify-center">
            <div className="w-full max-w-4xl">
              <div className="relative aspect-video">
                <iframe
                  src={src}
                  title={title}
                  className="absolute inset-0 w-full h-full rounded-xl"
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

    // Horizontal rule styling - Thicker and more prominent
    hr: () => (
      <div className="my-16 flex justify-center">
        <div className="w-40 h-1.5 bg-gray-500 dark:bg-gray-400 rounded-full shadow-md"></div>
      </div>
    ),

    // Block quotes for tips
    blockquote: ({ children }) => (
      <div className="my-8 border-l-4 border-blue-400 pl-6">
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div className="prose prose-blue opacity-80">{children}</div>
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
