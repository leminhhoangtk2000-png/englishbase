'use client';

import React from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { MultipleChoiceQuiz } from '@/components/ui/multiple-choice-quiz';
import { Lueckentext } from '@/components/ui/lueckentext';
import { TrueFalseQuiz } from '@/components/exercises/true-false-quiz';
import { AuthorCredit } from '@/components/ui/author-credit';
import Satzbildung from '@/components/exercises/satzbildung';
import { MatchingQuiz } from '@/components/exercises/matching-quiz';
import { ExerciseTable } from '@/components/exercises/exercise-table';

const components = {
  MultipleChoiceQuiz,
  Lueckentext,
  TrueFalseQuiz,
  AuthorCredit,
  Satzbildung,
  MatchingQuiz,
  ExerciseTable,
  // Add custom HTML elements styling
  h1: (props: any) => (
    <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-gray-100" {...props} />
  ),
  h2: (props: any) => (
    <h2 className="text-2xl font-bold mb-4 mt-8 text-gray-900 dark:text-gray-100" {...props} />
  ),
  h3: (props: any) => (
    <h3 className="text-xl font-semibold mb-3 mt-6 text-gray-800 dark:text-gray-200" {...props} />
  ),
  p: (props: any) => (
    <p className="mb-4 text-gray-700 dark:text-gray-300 leading-relaxed" {...props} />
  ),
  ul: (props: any) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
  ),
  ol: (props: any) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 dark:text-gray-300" {...props} />
  ),
  li: (props: any) => (
    <li className="ml-4" {...props} />
  ),
  iframe: (props: any) => (
    <div className="aspect-video w-full mb-6 rounded-lg overflow-hidden shadow-lg">
      <iframe className="w-full h-full" {...props} />
    </div>
  ),
  hr: (props: any) => (
    <hr className="my-8 border-gray-200 dark:border-gray-700" {...props} />
  ),
  img: (props: any) => (
    <img className="rounded-lg shadow-md mb-6 w-full" {...props} />
  ),
  strong: (props: any) => (
    <strong className="font-semibold text-gray-900 dark:text-gray-100" {...props} />
  ),
  em: (props: any) => (
    <em className="italic text-gray-800 dark:text-gray-200" {...props} />
  ),
};

interface ExerciseMDXRendererProps {
  source: MDXRemoteSerializeResult;
}

export function ExerciseMDXRenderer({ source }: ExerciseMDXRendererProps) {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <MDXRemote {...source} components={components} />
    </div>
  );
}
