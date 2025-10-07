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

interface DocPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;

  // If no slug, show main niveau page
  if (!slug || slug.length === 0) {
    const niveauContent = getNiveauContent('b2niveau');
    
    return (
      <main className="relative py-6 lg:py-8">
        <div className="mx-auto w-full min-w-0">
          <div className="flex max-w-[980px] flex-col items-start gap-2 mb-8">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl">
              Trình độ B2 - Upper Intermediate
              <Badge variant="secondary" className="ml-3">
                B2 Niveau
              </Badge>
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              Học tiếng Đức trình độ trung cấp cao B2. Nắm vững ngữ pháp phức tạp, từ vựng chuyên ngành và giao tiếp tự tin.
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
                    const href = hasSubItems ? `/b2niveau/${section.slug}/${itemSlug}` : (item.href || '#');
                    
                    return (
                      <Link
                        key={item.slug || item.href || item.title}
                        href={href}
                        className="group block p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium group-hover:text-primary">
                            {item.title}
                          </h3>
                          {hasSubItems && (
                            <Badge variant="outline" className="text-xs">
                              {item.items.length} bài
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                        {hasSubItems && (
                          <div className="mt-3 text-xs text-muted-foreground">
                            📁 Folder - {item.items.length} lessons inside
                          </div>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {item.tags.map((tag: any) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="w-full max-w-[700px] space-y-4 mt-12">
            <h2 className="text-2xl font-bold">Về trình độ B2</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Trình độ B2 (Upper Intermediate) là mức độ trung cấp cao trong hệ thống đánh giá CEFR. 
                Ở trình độ này, bạn có thể:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Hiểu nội dung chính của văn bản phức tạp về các chủ đề cụ thể và trừu tượng</li>
                <li>Tương tác lưu loát và tự nhiên với người bản ngữ mà không gây khó khăn cho cả hai bên</li>
                <li>Viết văn bản chi tiết, rõ ràng về nhiều chủ đề khác nhau</li>
                <li>Giải thích quan điểm về vấn đề thời sự, nêu rõ ưu nhược điểm của các lựa chọn khác nhau</li>
                <li>Hiểu các chương trình truyền hình và phim ảnh sử dụng ngôn ngữ chuẩn</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Handle different slug lengths
  if (slug.length === 1) {
    // Show section overview (e.g., /b2niveau/übungen)
    const [section] = slug;
    const decodedSection = decodeURIComponent(section);
    const niveauContent = getNiveauContent('b2niveau');
    const currentSection = niveauContent.sections.find((s: any) => s.slug === decodedSection);
    
    if (!currentSection) {
      notFound();
    }
    
    return (
      <main className="relative py-6 lg:py-8">
        <div className="mx-auto w-full min-w-0">
          <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
            <Link href="/b2niveau" className="hover:text-foreground">B2 Niveau</Link>
            <span className="font-medium text-foreground">/</span>
            <div className="font-medium text-foreground capitalize">{currentSection.title}</div>
          </div>
          <div className="space-y-2 mb-8">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight font-headline capitalize">
              {currentSection.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {currentSection.itemCount} chủ đề
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {currentSection.items.map((item: any) => (
              <Link
                key={item.slug}
                href={`/b2niveau/${section}/${item.slug}`}
                className="group block p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium group-hover:text-primary">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </p>
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {item.tags.map((tag: any) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (slug.length === 2) {
    // Could be folder overview (e.g., /b2niveau/übungen/adjektive) or direct article
    const [section, folderSlug] = slug;
    const decodedSection = decodeURIComponent(section);
    const decodedFolderSlug = decodeURIComponent(folderSlug);
    const niveauContent = getNiveauContent('b2niveau');
    const currentSection = niveauContent.sections.find((s: any) => s.slug === decodedSection);
    
    if (!currentSection) {
      notFound();
    }
    
    // First try to get direct markdown content (for sections like grammatik)
    const directMarkdownContent = getMarkdownBySlug('b2niveau', decodedSection, decodedFolderSlug);
    
    if (directMarkdownContent) {
      // Check if content has MDX components (like ExerciseTable, FormingQuestions, MatchingQuiz, Lueckentext, Satzbildung)
      const hasExerciseTable = directMarkdownContent.content.includes('<ExerciseTable');
      const hasFormingQuestions = directMarkdownContent.content.includes('<FormingQuestions');
      const hasMatchingQuiz = directMarkdownContent.content.includes('<MatchingQuiz');
      const hasLueckentext = directMarkdownContent.content.includes('<Lueckentext');
      const hasSatzbildung = directMarkdownContent.content.includes('<Satzbildung');
      const hasMultipleChoiceQuiz = directMarkdownContent.content.includes('<MultipleChoiceQuiz');
      const hasInteractiveComponents = hasExerciseTable || hasFormingQuestions || hasMatchingQuiz || hasLueckentext || hasSatzbildung || hasMultipleChoiceQuiz;
      const isMDX = directMarkdownContent.filePath && directMarkdownContent.filePath.endsWith('.mdx');
      
      console.log('[B2 Server] MDX Detection (slug.length=2):', { 
        filePath: directMarkdownContent.filePath, 
        isMDX, 
        contentLength: directMarkdownContent.content.length, 
        hasExerciseTable,
        hasFormingQuestions,
        hasMatchingQuiz,
        hasLueckentext,
        hasSatzbildung,
        hasMultipleChoiceQuiz,
        hasInteractiveComponents
      });
      
      // Direct article found, render it
      const htmlContent = await markdownToHtml(directMarkdownContent.content);
      const toc = extractTableOfContents(directMarkdownContent.content);
      const breadcrumbItems = [section];

      return (
        <main className="relative py-6 lg:grid lg:grid-cols-[1fr_220px] lg:gap-24 lg:py-8">
          <div className="mx-auto w-full min-w-0">
            <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
              <Link href="/b2niveau" className="hover:text-foreground">B2 Niveau</Link>
              {breadcrumbItems.map((item: any, index: number) => (
                <React.Fragment key={item}>
                  <span className="font-medium text-foreground">/</span>
                  {index === breadcrumbItems.length - 1 ? (
                    <div className="font-medium text-foreground capitalize">{item}</div>
                  ) : (
                    <Link href={`/b2niveau/${breadcrumbItems.slice(0, index + 1).join('/')}`} className="hover:text-foreground capitalize">
                      {item}
                    </Link>
                  )}
                </React.Fragment>
              ))}
              <span className="font-medium text-foreground">/</span>
              <div className="font-medium text-foreground">{directMarkdownContent.meta?.title || 'Untitled'}</div>
            </div>
            <div className="space-y-2">
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight font-headline">
                {directMarkdownContent.meta?.title || 'Untitled'}
              </h1>
              {directMarkdownContent.meta?.description && (
                <p className="text-lg text-muted-foreground">{directMarkdownContent.meta.description}</p>
              )}
              {directMarkdownContent.meta?.tags && directMarkdownContent.meta.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {directMarkdownContent.meta.tags.map((tag: any) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <Separator className="my-4" />
            <div className="prose max-w-none">
              {(isMDX && hasInteractiveComponents) ? (
                <MDXComponentsRenderer content={directMarkdownContent.content} />
              ) : (
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              )}
            </div>

            {/* Universal Comments Section */}
            <div className="mt-12">
              <UniversalComments 
                contentId={`b2niveau-${section}-${folderSlug}`}
              />
            </div>
          </div>
          <div className="hidden text-sm lg:block">
            <div className="sticky top-16 -mt-10 pt-10">
              <DocsTOC toc={toc} />
            </div>
          </div>
        </main>
      );
    }
    
    // If no direct markdown found, try to find folder/item structure (for sections like übungen)
    const currentItem = currentSection.items.find((item: any) => {
      // Extract slug from href (e.g., "/b2niveau/übungen/adjektive" -> "adjektive")
      if (!item.href) return false;
      const itemSlug = item.href.split('/').pop();
      return itemSlug === folderSlug;
    });
    
    if (!currentItem) {
      notFound();
    }
    
    // If this item has sub-items, show them
    if (currentItem.items && currentItem.items.length > 0) {
      return (
        <main className="relative py-6 lg:py-8">
          <div className="mx-auto w-full min-w-0">
            <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
              <Link href="/b2niveau" className="hover:text-foreground">B2 Niveau</Link>
              <span className="font-medium text-foreground">/</span>
              <Link href={`/b2niveau/${section}`} className="hover:text-foreground capitalize">{currentSection.title}</Link>
              <span className="font-medium text-foreground">/</span>
              <div className="font-medium text-foreground">{currentItem.title}</div>
            </div>
            <div className="space-y-2 mb-8">
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight font-headline">
                {currentItem.title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {currentItem.description}
              </p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {currentItem.items.map((subItem: any) => (
                <Link
                  key={subItem.href}
                  href={subItem.href}
                  className="group block p-4 border rounded-lg hover:shadow-md transition-shadow"
                >
                  <h3 className="font-medium group-hover:text-primary">
                    {subItem.title}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </main>
      );
    }
    
    // Otherwise, try to get markdown content for direct article
    const markdownContent = getMarkdownBySlug('b2niveau', decodedSection, decodedFolderSlug);
    if (!markdownContent) {
      notFound();
    }

    // Check if this is an MDX file and process components
    const isMDX = markdownContent.filePath && markdownContent.filePath.endsWith('.mdx');
    const hasInteractiveComponents = markdownContent.content.includes('ExerciseTable') || 
                                    markdownContent.content.includes('Satzbildung') || 
                                    markdownContent.content.includes('MatchingQuiz');
    console.log('[B2 Server] MDX Detection (slug.length=2):', { 
      filePath: markdownContent.filePath, 
      isMDX, 
      contentLength: markdownContent.content.length,
      hasInteractiveComponents
    });

    const toc = extractTableOfContents(markdownContent.content);
    const breadcrumbItems = [decodedSection];

    let contentElement;

    if (isMDX && hasInteractiveComponents) {
      // For MDX files with interactive components, pass raw content to client-side renderer
      contentElement = (
        <MDXComponentsRenderer content={markdownContent.content} />
      );
    } else if (isMDX) {
      // MDX file without interactive components - still use renderer for proper formatting
      contentElement = (
        <MDXComponentsRenderer content={markdownContent.content} />
      );
    } else {
      // Regular markdown processing
      const htmlContent = await markdownToHtml(markdownContent.content);
      contentElement = (
        <div 
          className="prose prose-stone dark:prose-invert max-w-none prose-p:leading-7"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      );
    }

    return (
      <main className="relative py-6 lg:grid lg:grid-cols-[1fr_220px] lg:gap-24 lg:py-8">
        <div className="mx-auto w-full min-w-0">
          <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
            <Link href="/b2niveau" className="hover:text-foreground">B2 Niveau</Link>
            {breadcrumbItems.map((item: any, index: number) => (
              <React.Fragment key={item}>
                <span className="font-medium text-foreground">/</span>
                {index === breadcrumbItems.length - 1 ? (
                  <div className="font-medium text-foreground capitalize">{item}</div>
                ) : (
                  <Link href={`/b2niveau/${breadcrumbItems.slice(0, index + 1).join('/')}`} className="hover:text-foreground capitalize">
                    {item}
                  </Link>
                )}
              </React.Fragment>
            ))}
          </div>
          <div className="space-y-2">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight font-headline">
              {markdownContent.meta?.title || 'Untitled'}
            </h1>
            {markdownContent.meta?.description && (
              <p className="text-xl text-muted-foreground">
                {markdownContent.meta.description}
              </p>
            )}
          </div>
          <Separator className="my-4" />
          <div className="prose max-w-none">
            {contentElement}
          </div>

          {/* Universal Comments Section */}
          <div className="mt-12">
            <UniversalComments 
              contentId={`b2niveau-${decodedSection}-${decodedFolderSlug}`}
            />
          </div>
        </div>
        <div className="hidden text-sm lg:block">
          <div className="sticky top-16 -mt-10 pt-10">
            <DocsTOC toc={toc} />
          </div>
        </div>
      </main>
    );
  }

  // Note: NextJS automatically handles dedicated page components over catch-all routes
  // No need to manually redirect - the direct page components will be used automatically

  // Get specific markdown content for nested cases
  let markdownContent;
  let breadcrumbItems: string[] = [];
  
  if (slug.length === 3) {
    // Nested content (e.g., /b2niveau/übungen/adjektive/teil1)
    const [section, folderSlug, fileSlug] = slug;
    const decodedSection = decodeURIComponent(section);
    const decodedFolderSlug = decodeURIComponent(folderSlug);
    const decodedFileSlug = decodeURIComponent(fileSlug);
    
    // First try to get content from folder/file
    markdownContent = getMarkdownBySlug('b2niveau', decodedSection, `${decodedFolderSlug}/${decodedFileSlug}`);
    
    // If not found, try to get folder index
    if (!markdownContent) {
      markdownContent = getMarkdownBySlug('b2niveau', decodedSection, `${decodedFolderSlug}/index`);
    }
    
    breadcrumbItems = [decodedSection, decodedFolderSlug];
  } else if (slug.length === 4) {
    // Deep nested content (e.g., /b2niveau/übungen/adjektive/teil1/subtopic)
    const [section, folderSlug, , fileSlug] = slug;
    const decodedSection = decodeURIComponent(section);
    const decodedFolderSlug = decodeURIComponent(folderSlug);
    const decodedFileSlug = decodeURIComponent(fileSlug);
    markdownContent = getMarkdownBySlug('b2niveau', decodedSection, `${decodedFolderSlug}/${decodedFileSlug}`);
    breadcrumbItems = [decodedSection, decodedFolderSlug];
  }
  
  if (!markdownContent) {
    notFound();
  }

  // Check if this is an MDX file and process components (matching B1 pattern)
  const isMDX = markdownContent.filePath && markdownContent.filePath.endsWith('.mdx');
  const hasExerciseTable = markdownContent.content.includes('<ExerciseTable');
  const hasFormingQuestions = markdownContent.content.includes('<FormingQuestions');
  const hasMatchingQuiz = markdownContent.content.includes('<MatchingQuiz');
  const hasLueckentext = markdownContent.content.includes('<Lueckentext');
  const hasSatzbildung = markdownContent.content.includes('<Satzbildung');
  const hasMultipleChoiceQuiz = markdownContent.content.includes('<MultipleChoiceQuiz');
  const hasInteractiveComponents = hasExerciseTable || hasFormingQuestions || hasMatchingQuiz || hasLueckentext || hasSatzbildung || hasMultipleChoiceQuiz;

  console.log('[B2 Server] MDX Detection:', { 
    filePath: markdownContent.filePath, 
    isMDX, 
    contentLength: markdownContent.content.length,
    hasExerciseTable,
    hasFormingQuestions,
    hasMatchingQuiz,
    hasLueckentext,
    hasSatzbildung,
    hasMultipleChoiceQuiz,
    hasInteractiveComponents
  });
  const toc = extractTableOfContents(markdownContent.content);

  let contentElement;

  if (isMDX && hasInteractiveComponents) {
    // For MDX files with interactive components, use MDXComponentsRenderer
    contentElement = (
      <MDXComponentsRenderer content={markdownContent.content} />
    );
  } else {
    // Regular markdown processing
    const htmlContent = await markdownToHtml(markdownContent.content);
    contentElement = (
      <div 
        className="prose prose-stone dark:prose-invert max-w-none prose-p:leading-7 prose-h2:font-headline prose-h2:tracking-tight prose-h2:font-semibold prose-h2:text-2xl prose-a:text-primary hover:prose-a:underline prose-a:no-underline prose-li:my-1 prose-ul:list-disc prose-ol:list-decimal prose-h1:text-foreground prose-h2:text-foreground prose-h3:text-foreground prose-h4:text-foreground prose-h5:text-foreground prose-h6:text-foreground prose-h1:no-underline prose-h2:no-underline prose-h3:no-underline prose-h4:no-underline prose-h5:no-underline prose-h6:no-underline"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    );
  }

  return (
    <main className="relative py-6 lg:grid lg:grid-cols-[1fr_220px] lg:gap-24 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <Link href="/b2niveau" className="hover:text-foreground">B2 Niveau</Link>
          {breadcrumbItems.map((item: any, index: number) => (
            <React.Fragment key={item}>
              <span className="font-medium text-foreground">/</span>
              {index === breadcrumbItems.length - 1 ? (
                <div className="font-medium text-foreground capitalize">{item}</div>
              ) : (
                <Link href={`/b2niveau/${breadcrumbItems.slice(0, index + 1).join('/')}`} className="hover:text-foreground capitalize">
                  {item}
                </Link>
              )}
            </React.Fragment>
          ))}
          <span className="font-medium text-foreground">/</span>
          <div className="font-medium text-foreground">{markdownContent.meta?.title || 'Untitled'}</div>
        </div>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight font-headline">
            {markdownContent.meta?.title || 'Untitled'}
          </h1>
          {markdownContent.meta?.description && (
            <p className="text-lg text-muted-foreground">{markdownContent.meta.description}</p>
          )}
          {markdownContent.meta?.tags && markdownContent.meta.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {markdownContent.meta.tags.map((tag: any) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <Separator className="my-4 md:my-6" />
        <div className="prose prose-stone dark:prose-invert max-w-none prose-p:leading-7 prose-h2:font-headline prose-h2:tracking-tight prose-h2:font-semibold prose-h2:text-2xl prose-a:text-primary hover:prose-a:underline prose-a:no-underline prose-li:my-1 prose-ul:list-disc prose-ol:list-decimal prose-h1:text-foreground prose-h2:text-foreground prose-h3:text-foreground prose-h4:text-foreground prose-h5:text-foreground prose-h6:text-foreground prose-h1:no-underline prose-h2:no-underline prose-h3:no-underline prose-h4:no-underline prose-h5:no-underline prose-h6:no-underline">
          {contentElement}
        </div>

        {/* Universal Comments Section */}
        <div className="mt-12">
          <UniversalComments 
            contentId={`b2niveau-${slug.join('-')}`}
          />
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
