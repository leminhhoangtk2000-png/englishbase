import dynamic from 'next/dynamic';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

interface MDXContentProps {
  serializedData: MDXRemoteSerializeResult;
}

// Dynamic import with no SSR to handle hooks properly
export const MDXContent = dynamic(
  () => import('./mdx-content'),
  { 
    ssr: false,
    loading: () => (
      <div className="prose prose-stone dark:prose-invert max-w-none">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        </div>
      </div>
    )
  }
);
