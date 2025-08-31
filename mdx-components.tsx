import type { MDXComponents } from 'mdx/types';
import { MultipleChoiceQuiz } from '@/components/ui/multiple-choice-quiz';
import { Lueckentext } from '@/components/ui/lueckentext';
import { AuthorCredit } from '@/components/ui/author-credit';
import { FacebookComments } from '@/components/ui/facebook-comments';

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    // Built-in components
    h1: ({ children }) => <h1 className="text-3xl font-bold mb-6 font-headline">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-semibold mb-4 mt-8 font-headline">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold mb-3 mt-6 font-headline">{children}</h3>,
    p: ({ children }) => <p className="mb-4 leading-7">{children}</p>,
    
    // Custom components
    MultipleChoiceQuiz,
    Lueckentext,
    AuthorCredit,
    FacebookComments,
    
    // Allow other components to pass through
    ...components,
  };
}
