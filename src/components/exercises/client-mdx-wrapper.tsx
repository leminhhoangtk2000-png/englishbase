'use client';

import dynamic from 'next/dynamic';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

// Dynamic import để tránh SSR issues
const ExerciseMDXRenderer = dynamic(
  () => import('@/components/exercises/exercise-mdx-renderer').then(mod => ({ default: mod.ExerciseMDXRenderer })),
  { 
    ssr: false,
    loading: () => <div className="animate-pulse">Loading exercise...</div>
  }
);

interface ClientMDXWrapperProps {
  source: MDXRemoteSerializeResult;
}

export function ClientMDXWrapper({ source }: ClientMDXWrapperProps) {
  return <ExerciseMDXRenderer source={source} />;
}
