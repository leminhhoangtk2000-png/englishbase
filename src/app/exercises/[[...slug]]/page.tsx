import { notFound } from "next/navigation";
import { getDocFromParams } from "@/lib/exercises";
import React from "react";
import { ExercisesLandingPage } from "../_components/exercises-landing-page";
import { ExerciseLevelPage } from "../_components/exercise-level-page";
import { ExerciseMetadataHider } from "@/components/exercise-metadata-hider";
import { serialize } from 'next-mdx-remote/serialize';
import { ExerciseMDXRenderer } from "@/components/exercises/exercise-mdx-renderer";
import { ExercisePageCompletion } from "@/components/exercises/ExercisePageCompletion";
import { ExerciseLikes } from "@/components/exercises/ExerciseLikes";
import { ExerciseViewTracker } from "@/components/exercises/ExerciseViewTracker";
import { ChevronRight, Home } from "lucide-react";

interface DocPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  
  if (!slug || slug.length === 0) {
    return <ExercisesLandingPage />;
  }

  if (slug.length === 1 && ["a1", "a2", "b1", "b2"].includes(slug[0])) {
    return <ExerciseLevelPage level={slug[0]} />;
  }

  const doc = await getDocFromParams(slug);

  if (!doc) {
    notFound();
  }

  if (doc.content) {
    const mdxSource = await serialize(doc.content, {
      parseFrontmatter: true,
      mdxOptions: {
        development: process.env.NODE_ENV === 'development',
      },
    });

    // Generate exerciseId from slug
    const exerciseId = slug.join('/');

    return (
      <main className="w-full py-6 exercise-page bg-gray-50 dark:bg-background min-h-screen">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <a href="/exercises" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1">
                <Home className="w-4 h-4" />
                Bài tập
              </a>
              <ChevronRight className="w-4 h-4" />
              <a 
                href={`/exercises/${slug[0]}`} 
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors capitalize"
              >
                {slug[0].toUpperCase()}
              </a>
              {slug[1] && (
                <>
                  <ChevronRight className="w-4 h-4" />
                  <span className="capitalize text-gray-700 dark:text-gray-300">
                    {slug[1].replace(/-/g, ' ')}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="mb-8 bg-white dark:bg-background rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
                {doc.level}
              </span>
              {doc.tags && doc.tags.length > 0 && (
                <div className="flex gap-2">
                  {doc.tags.map((tag: string, index: number) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {doc.title}
            </h1>
            {doc.description && (
              <p className="text-gray-600 dark:text-gray-400">
                {doc.description}
              </p>
            )}
          </div>

          <article className="bg-white dark:bg-background rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-800">
            <ExerciseMetadataHider />
            <ExerciseMDXRenderer source={mdxSource} />
          </article>

          {/* ❤️ Exercise Likes - Đặt sau content, trước comments */}
          <div className="mt-6">
            <ExerciseLikes 
              exerciseId={exerciseId} 
              variant="full" 
              showButton={true}
            />
          </div>
        </div>

        {/* 👁️ View Tracking - Tự động track khi user xem bài */}
        <ExerciseViewTracker exerciseId={exerciseId} />
        
        {/* Exercise Completion Tracker */}
        <ExercisePageCompletion exerciseId={exerciseId} />
      </main>
    );
  }

  notFound();
}
