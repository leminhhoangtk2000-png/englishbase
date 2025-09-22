/**
 * MDX Components Provider
 * 
 * Provides all exercise components and MDX utilities
 * for use in MDX files without manual imports
 */

import { MDXComponents } from 'mdx/types'
import { 
  Lueckentext,
  MultipleChoice,
  MatchingExercise,
  WritingExercise,
  GrammarBox,
  VocabularyList,
  AuthorCredit,
  CommentSystem
} from './exercise-registry'

// Standard MDX components with Tailwind styling
const mdxComponents: MDXComponents = {
  // Exercise Components
  Lueckentext,
  MultipleChoice,
  MatchingExercise,
  WritingExercise,
  GrammarBox,
  VocabularyList,
  AuthorCredit,
  CommentSystem,
  
  // HTML elements with Tailwind classes
  h1: (props) => (
    <h1 
      className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100" 
      {...props} 
    />
  ),
  
  h2: (props) => (
    <h2 
      className="text-3xl font-semibold mb-5 mt-8 text-gray-800 dark:text-gray-200" 
      {...props} 
    />
  ),
  
  h3: (props) => (
    <h3 
      className="text-2xl font-semibold mb-4 mt-6 text-gray-800 dark:text-gray-200" 
      {...props} 
    />
  ),
  
  h4: (props) => (
    <h4 
      className="text-xl font-semibold mb-3 mt-5 text-gray-700 dark:text-gray-300" 
      {...props} 
    />
  ),
  
  h5: (props) => (
    <h5 
      className="text-lg font-semibold mb-2 mt-4 text-gray-700 dark:text-gray-300" 
      {...props} 
    />
  ),
  
  h6: (props) => (
    <h6 
      className="text-base font-semibold mb-2 mt-3 text-gray-600 dark:text-gray-400" 
      {...props} 
    />
  ),
  
  p: (props) => (
    <p 
      className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300" 
      {...props} 
    />
  ),
  
  ul: (props) => (
    <ul 
      className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" 
      {...props} 
    />
  ),
  
  ol: (props) => (
    <ol 
      className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" 
      {...props} 
    />
  ),
  
  li: (props) => (
    <li 
      className="mb-1" 
      {...props} 
    />
  ),
  
  blockquote: (props) => (
    <blockquote 
      className="border-l-4 border-blue-500 pl-4 py-2 mb-4 italic bg-blue-50 dark:bg-blue-900/20 text-gray-700 dark:text-gray-300" 
      {...props} 
    />
  ),
  
  code: (props) => (
    <code 
      className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono text-gray-800 dark:text-gray-200" 
      {...props} 
    />
  ),
  
  pre: (props) => (
    <pre 
      className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto mb-4 text-sm" 
      {...props} 
    />
  ),
  
  table: (props) => (
    <div className="overflow-x-auto mb-4">
      <table 
        className="min-w-full table-auto border-collapse border border-gray-300 dark:border-gray-600" 
        {...props} 
      />
    </div>
  ),
  
  thead: (props) => (
    <thead 
      className="bg-gray-50 dark:bg-gray-700" 
      {...props} 
    />
  ),
  
  tbody: (props) => (
    <tbody 
      className="bg-white dark:bg-gray-800" 
      {...props} 
    />
  ),
  
  tr: (props) => (
    <tr 
      className="border-b border-gray-200 dark:border-gray-600" 
      {...props} 
    />
  ),
  
  th: (props) => (
    <th 
      className="px-4 py-2 text-left font-semibold text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600" 
      {...props} 
    />
  ),
  
  td: (props) => (
    <td 
      className="px-4 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600" 
      {...props} 
    />
  ),
  
  a: (props) => (
    <a 
      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline transition-colors" 
      {...props} 
    />
  ),
  
  strong: (props) => (
    <strong 
      className="font-semibold text-gray-900 dark:text-gray-100" 
      {...props} 
    />
  ),
  
  em: (props) => (
    <em 
      className="italic text-gray-800 dark:text-gray-200" 
      {...props} 
    />
  ),
  
  hr: (props) => (
    <div className="my-12 flex justify-center">
      <div className="w-32 h-1 bg-gray-400 dark:bg-gray-500 rounded-full shadow-sm"></div>
    </div>
  ),
  
  img: (props) => (
    <img 
      className="max-w-full h-auto rounded-lg shadow-md mb-4" 
      {...props} 
    />
  ),
}

export default mdxComponents

// Export individual component groups for selective usage
export const exerciseComponents = {
  Lueckentext,
  MultipleChoice,
  MatchingExercise,
  WritingExercise,
  GrammarBox,
  VocabularyList,
  AuthorCredit,
  CommentSystem,
}

export const htmlComponents = {
  h1: mdxComponents.h1,
  h2: mdxComponents.h2,
  h3: mdxComponents.h3,
  h4: mdxComponents.h4,
  h5: mdxComponents.h5,
  h6: mdxComponents.h6,
  p: mdxComponents.p,
  ul: mdxComponents.ul,
  ol: mdxComponents.ol,
  li: mdxComponents.li,
  blockquote: mdxComponents.blockquote,
  code: mdxComponents.code,
  pre: mdxComponents.pre,
  table: mdxComponents.table,
  thead: mdxComponents.thead,
  tbody: mdxComponents.tbody,
  tr: mdxComponents.tr,
  th: mdxComponents.th,
  td: mdxComponents.td,
  a: mdxComponents.a,
  strong: mdxComponents.strong,
  em: mdxComponents.em,
  hr: mdxComponents.hr,
  img: mdxComponents.img,
}
