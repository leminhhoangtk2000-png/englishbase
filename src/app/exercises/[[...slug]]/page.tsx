import { notFound } from "next/navigation";
import { getDocFromParams } from "@/lib/exercises";
import { DocsTOC } from "../_components/docs-toc";
import React from "react";
import { Separator } from "@/components/ui/separator";
import { ExercisesLandingPage } from "../_components/exercises-landing-page";
import { ExerciseLevelPage } from "../_components/exercise-level-page";
import { ExerciseMetadataHider } from "@/components/exercise-metadata-hider";
import { serialize } from 'next-mdx-remote/serialize';
import { ExerciseMDXRenderer } from "@/components/exercises/exercise-mdx-renderer";
import { ChevronRight, Home } from "lucide-react";

interface DocPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;
  
  // If there's no slug, it's the exercises's main page.
  if (!slug || slug.length === 0) {
    return <ExercisesLandingPage />;
  }

  // Handle specific level pages like /exercises/a1
  if (slug.length === 1 && ["a1", "a2", "b1", "b2"].includes(slug[0])) {
    return <ExerciseLevelPage level={slug[0]} />;
  }

  const doc = await getDocFromParams(slug);

  if (!doc) {
    notFound();
  }

  // Check if this is an MDX exercise from content folder
  if (doc.content) {
    // Serialize MDX content
    const mdxSource = await serialize(doc.content, {
      parseFrontmatter: true,
      mdxOptions: {
        development: process.env.NODE_ENV === 'development',
      },
    });

    // Render as independent exercise page without sidebar
    return (
      <main className="w-full py-6 exercise-page bg-gray-50 dark:bg-background min-h-screen">
        <div className="container mx-auto max-w-5xl px-4">
          {/* Breadcrumb */}
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

          {/* Header */}
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

          {/* Content */}
          <article className="bg-white dark:bg-background rounded-lg p-8 shadow-sm border border-gray-200 dark:border-gray-800">
            <ExerciseMetadataHider />
            <ExerciseMDXRenderer source={mdxSource} />
          </article>
        </div>
      </main>
    );
  }

  // Fallback to old component-based rendering
  if (!doc.component) {
    notFound();
  }

  const ContentComponent = doc.component;
  
  // Check if this is an MDX exercise (independent page without sidebar)
  const isExercise = slug.length >= 2 && ["a1", "a2", "b1", "b2"].includes(slug[0]);

  if (isExercise) {
    // Render as independent exercise page without sidebar
    return (
      <main className="w-full py-6 exercise-page">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-6">
            <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
              <a href="/exercises" className="hover:text-foreground transition-colors">Bài tập</a>
              <span className="font-medium text-foreground">/</span>
              <a href={`/exercises/${slug[0]}`} className="hover:text-foreground transition-colors capitalize">
                {slug[0].toUpperCase()}
              </a>
              <span className="font-medium text-foreground">/</span>
              <div className="font-medium text-foreground">{doc.title}</div>
            </div>
          </div>
          
          <article className="prose prose-lg prose-stone dark:prose-invert max-w-none prose-p:leading-7 prose-h2:font-headline prose-h2:tracking-tight prose-h2:font-semibold prose-h2:text-2xl prose-h3:font-headline prose-h3:tracking-tight prose-h3:font-semibold prose-h3:text-xl prose-a:text-primary hover:prose-a:underline prose-a:no-underline prose-li:my-1 exercise-content">
            <ExerciseMetadataHider />
            <ContentComponent />
          </article>
        </div>
      </main>
    );
  }

  // Regular docs layout with sidebar
  const toc = {
    items: [
      { title: "Overview", url: "#overview" },
      { title: "Key Features", url: "#key-features" },
    ],
  };

  return (
    <main className="relative py-6 lg:grid lg:grid-cols-[1fr_220px] lg:gap-12 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap">Bài tập</div>
          <span className="font-medium text-foreground">/</span>
          <div className="font-medium text-foreground">{doc.title}</div>
        </div>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight font-headline">{doc.title}</h1>
          {doc.description && (
            <p className="text-lg text-muted-foreground">{doc.description}</p>
          )}
        </div>
        <Separator className="my-4 md:my-6" />
        <div className="prose prose-stone dark:prose-invert max-w-none prose-p:leading-7 prose-h2:font-headline prose-h2:tracking-tight prose-h2:font-semibold prose-h2:text-2xl prose-a:text-primary hover:prose-a:underline prose-a:no-underline prose-li:my-1">
          <ContentComponent />
        </div>
      </div>
      <div className="hidden text-sm lg:block">
        <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] overflow-y-auto py-12 pl-4">
          <DocsTOC toc={toc} />
        </div>
      </div>
    </main>
  );
}
