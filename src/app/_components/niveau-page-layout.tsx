import { notFound, redirect } from "next/navigation";
import { getMarkdownBySlug, markdownToHtml, getNiveauContent, extractTableOfContents } from "@/lib/markdown";
import { MDXComponentsRenderer } from '@/components/mdx-components-renderer';
import { DocsTOC } from "@/components/docs-toc-client";
import { UniversalComments } from "@/components/UniversalComments";
import React from "react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import fs from "fs";
import path from "path";

interface NiveauPageLayoutProps {
  niveau: 'a1niveau' | 'a2niveau' | 'b1niveau' | 'b2niveau';
  niveauTitle: string;
  niveauDescription: string;
  slug?: string[];
}

export async function NiveauPageLayout({ niveau, niveauTitle, niveauDescription, slug }: NiveauPageLayoutProps) {
  // If no slug, show main niveau page
  if (!slug || slug.length === 0) {
    const niveauContent = getNiveauContent(niveau);
    
    return (
      <main className="relative py-6 lg:py-8">
        <div className="mx-auto w-full min-w-0">
          <div className="space-y-2 mb-8">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight font-headline">{niveauTitle}</h1>
            <p className="text-lg text-muted-foreground">
              {niveauDescription}
            </p>
          </div>
          
          <div className="grid gap-8">
            {niveauContent.sections.map((section: any) => (
              <div key={section.slug} className="space-y-4">
                <h2 className="text-2xl font-semibold font-headline capitalize">
                  {section.title}
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {section.items.map((item: any) => {
                    // Check if this item has sub-items (folder structure)
                    const hasSubItems = item.items && item.items.length > 0;
                    
                    // Extract slug from href if no direct slug
                    const itemSlug = item.slug || (item.href ? item.href.split('/').pop() : '');
                    
                    return (
                      <Link
                        key={item.href}
                        href={item.href || '#'}
                        className="group relative rounded-lg border p-6 hover:border-primary/50 hover:shadow-md transition-all"
                      >
                        <div className="space-y-2">
                          <h3 className="font-semibold group-hover:text-primary transition-colors line-clamp-2">
                            {item.title}
                          </h3>
                          {item.description && (
                            <p className="text-sm text-muted-foreground line-clamp-3">
                              {item.description}
                            </p>
                          )}
                          {hasSubItems && (
                            <Badge variant="secondary" className="mt-2">
                              {item.items.length} bài học
                            </Badge>
                          )}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // Handle content pages (grammatik/*, vokabular/*, etc.)
  const topic = slug[0];
  const lessonSlug = slug.slice(1).join('/') || 'index';

  console.log(`[${niveau.toUpperCase()}] Topic: ${topic}, Lesson: ${lessonSlug}`);

  // Try to get markdown content
  let directMarkdownContent;
  try {
    directMarkdownContent = getMarkdownBySlug(niveau, topic, lessonSlug);
  } catch (error) {
    console.error(`[${niveau.toUpperCase()}] Error loading markdown:`, error);
    notFound();
  }

  if (!directMarkdownContent) {
    console.error(`[${niveau.toUpperCase()}] No content found for: ${topic}/${lessonSlug}`);
    notFound();
  }

  const { content, meta } = directMarkdownContent;
  const title = meta?.title || 'Untitled';
  const description = meta?.description;
  const contentDir = path.join(process.cwd(), 'src', 'content', niveau, topic);
  
  // Extract table of contents
  const toc = extractTableOfContents(content);

  // Check for interactive components to decide rendering strategy
  const hasExerciseTable = directMarkdownContent.content.includes('<ExerciseTable');
  const hasFormingQuestions = directMarkdownContent.content.includes('<FormingQuestions');
  const hasMatchingQuiz = directMarkdownContent.content.includes('<MatchingQuiz');
  const hasMultipleChoiceQuizGroup = directMarkdownContent.content.includes('<MultipleChoiceQuizGroup');
  const hasInteractiveComponents = hasExerciseTable || hasFormingQuestions || 
                                   hasMatchingQuiz || hasMultipleChoiceQuizGroup;

  console.log(`[${niveau.toUpperCase()}] Interactive components detected:`, {
    hasExerciseTable,
    hasFormingQuestions,
    hasMatchingQuiz,
    hasMultipleChoiceQuizGroup,
    hasInteractiveComponents
  });

  // Render with MDX components if interactive components are detected
  if (hasInteractiveComponents) {
    console.log(`[${niveau.toUpperCase()}] Using MDXComponentsRenderer for ${topic}/${lessonSlug || 'index'}`);
    
    return (
      <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
        <div className="mx-auto w-full min-w-0">
          <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
            <Link href={`/${niveau}`} className="hover:text-foreground transition-colors">
              {niveauTitle}
            </Link>
            <span>/</span>
            <span className="capitalize">{topic}</span>
            {lessonSlug && lessonSlug !== 'index' && (
              <>
                <span>/</span>
                <span className="text-foreground">{title}</span>
              </>
            )}
          </div>

          <div className="space-y-2">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight font-headline">
              {title}
            </h1>
            {description && (
              <p className="text-lg text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          <Separator className="my-4 md:my-6" />

          <div className="prose prose-slate dark:prose-invert max-w-none">
            <MDXComponentsRenderer 
              content={directMarkdownContent.content}
            />
          </div>

          {/* Universal Comments Section */}
          <div className="mt-12">
            <UniversalComments 
              contentId={`${niveau}-${topic}-${lessonSlug || 'index'}`}
            />
          </div>
        </div>

        {toc.items && toc.items.length > 0 && (
          <div className="hidden text-sm xl:block">
            <div className="sticky top-16 -mt-10 pt-10">
              <DocsTOC toc={toc} />
            </div>
          </div>
        )}
      </main>
    );
  }

  // Standard markdown rendering for simple pages
  console.log(`[${niveau.toUpperCase()}] Using standard markdown rendering for ${topic}/${lessonSlug || 'index'}`);
  
  const htmlContent = await markdownToHtml(content);

  return (
    <main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <Link href={`/${niveau}`} className="hover:text-foreground transition-colors">
            {niveauTitle}
          </Link>
          <span>/</span>
          <span className="capitalize">{topic}</span>
          {lessonSlug && lessonSlug !== 'index' && (
            <>
              <span>/</span>
              <span className="text-foreground">{title}</span>
            </>
          )}
        </div>

        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight font-headline">
            {title}
          </h1>
          {description && (
            <p className="text-lg text-muted-foreground">
              {description}
            </p>
          )}
        </div>

        <Separator className="my-4 md:my-6" />

        <div 
          className="prose prose-slate dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Universal Comments Section */}
        <div className="mt-12">
          <UniversalComments 
            contentId={`${niveau}-${topic}-${lessonSlug || 'index'}`}
          />
        </div>
      </div>

      {toc.items && toc.items.length > 0 && (
        <div className="hidden text-sm xl:block">
          <div className="sticky top-16 -mt-10 pt-10">
            <DocsTOC toc={toc} />
          </div>
        </div>
      )}
    </main>
  );
}
