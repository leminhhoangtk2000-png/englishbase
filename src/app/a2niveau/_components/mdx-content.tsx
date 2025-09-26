'use client';

import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { ExerciseTable } from '@/components/exercises/exercise-table';
import { ExerciseAuthor, ExerciseHelp } from '@/components/exercises/exercise-author';

interface MDXContentProps {
  serializedData: MDXRemoteSerializeResult;
}

export default function MDXContent({ serializedData }: MDXContentProps) {
  return (
    <div className="prose prose-stone dark:prose-invert max-w-none prose-p:leading-7 prose-h2:font-headline prose-h2:tracking-tight prose-h2:font-semibold prose-h2:text-2xl prose-a:text-primary hover:prose-a:underline prose-a:no-underline prose-li:my-1 prose-h1:text-foreground prose-h2:text-foreground prose-h3:text-foreground prose-h4:text-foreground prose-h5:text-foreground prose-h6:text-foreground prose-h1:no-underline prose-h2:no-underline prose-h3:no-underline prose-h4:no-underline prose-h5:no-underline prose-h6:no-underline">
      <MDXRemote 
        {...serializedData} 
        components={{
          ExerciseTable,
          ExerciseAuthor,
          ExerciseHelp,
        }}
      />
    </div>
  );
}
