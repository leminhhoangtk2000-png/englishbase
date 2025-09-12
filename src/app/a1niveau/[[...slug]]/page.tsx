import { notFound } from "next/navigation";
import { getMarkdownBySlug, markdownToHtml, getNiveauContent, extractTableOfContents } from "@/lib/markdown";
import { DocsTOC } from "@/components/docs-toc-client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface DocPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;

  // If no slug, show main niveau page
  if (!slug || slug.length === 0) {
    const niveauContent = getNiveauContent('a1niveau');
    
    return (
      <main className="relative py-6 lg:py-8">
        <div className="mx-auto w-full min-w-0">
          <div className="space-y-2 mb-8">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight font-headline">A1 Niveau</h1>
            <p className="text-lg text-muted-foreground">
              Học tiếng Đức từ cơ bản - Niveau A1 theo khung tham chiếu châu Âu
            </p>
          </div>
          
          <div className="grid gap-8">
            {niveauContent.sections.map((section) => (
              <div key={section.slug} className="space-y-4">
                <h2 className="text-2xl font-semibold font-headline capitalize">
                  {section.title}
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {section.items.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/a1niveau/${section.slug}/${item.slug}`}
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
                          {item.tags.map((tag) => (
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
            ))}
          </div>
        </div>
      </main>
    );
  }

  // If we have slug, try to get markdown content
  const slugPath = slug.join('/');
  
  // Handle different slug lengths
  if (slug.length === 1) {
    // Show section overview (e.g., /a1niveau/vokabular)
    const [section] = slug;
    const niveauContent = getNiveauContent('a1niveau');
    const currentSection = niveauContent.sections.find(s => s.slug === section);
    
    if (!currentSection) {
      notFound();
    }
    
    return (
      <main className="relative py-6 lg:py-8">
        <div className="mx-auto w-full min-w-0">
          <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
            <Link href="/a1niveau" className="hover:text-foreground">A1 Niveau</Link>
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
            {currentSection.items.map((item) => (
              <Link
                key={item.slug}
                href={`/a1niveau/${section}/${item.slug}`}
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
                    {item.tags.map((tag) => (
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
    // Could be folder overview (e.g., /a1niveau/vokabular/01-start-auf-deutsch) or direct article
    const [section, folderSlug] = slug;
    const niveauContent = getNiveauContent('a1niveau');
    const currentSection = niveauContent.sections.find((s: any) => s.slug === section);
    
    if (!currentSection) {
      notFound();
    }
    
    // First try to get direct markdown content (for sections like grammatik)
    const directMarkdownContent = getMarkdownBySlug('a1niveau', section, folderSlug);
    
    if (directMarkdownContent) {
      // Direct article found, render it
      const htmlContent = await markdownToHtml(directMarkdownContent.content);
      const toc = extractTableOfContents(directMarkdownContent.content);
      const breadcrumbItems = [section];

      return (
        <main className="relative py-6 lg:grid lg:grid-cols-[1fr_220px] lg:gap-24 lg:py-8">
          <div className="mx-auto w-full min-w-0">
            <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
              <Link href="/a1niveau" className="hover:text-foreground">A1 Niveau</Link>
              {breadcrumbItems.map((item, index) => (
                <React.Fragment key={item}>
                  <span className="font-medium text-foreground">/</span>
                  {index === breadcrumbItems.length - 1 ? (
                    <div className="font-medium text-foreground capitalize">{item}</div>
                  ) : (
                    <Link href={`/a1niveau/${breadcrumbItems.slice(0, index + 1).join('/')}`} className="hover:text-foreground capitalize">
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
                  {directMarkdownContent.meta.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            <Separator className="my-4" />
            <div className="prose max-w-none">
              <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
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
    
    // If no direct markdown found, try to find folder/item structure (for sections like vokabular)
    const currentItem = currentSection.items.find((item: any) => {
      // Extract slug from href (e.g., "/a1niveau/vokabular/05-station-1" -> "05-station-1")
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
              <Link href="/a1niveau" className="hover:text-foreground">A1 Niveau</Link>
              <span className="font-medium text-foreground">/</span>
              <Link href={`/a1niveau/${section}`} className="hover:text-foreground capitalize">{currentSection.title}</Link>
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
    const markdownContent = getMarkdownBySlug('a1niveau', section, folderSlug);
    if (!markdownContent) {
      notFound();
    }

    const htmlContent = await markdownToHtml(markdownContent.content);
    const toc = extractTableOfContents(markdownContent.content);
    const breadcrumbItems = [section];

    return (
      <main className="relative py-6 lg:grid lg:grid-cols-[1fr_220px] lg:gap-24 lg:py-8">
        <div className="mx-auto w-full min-w-0">
          <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
            <Link href="/a1niveau" className="hover:text-foreground">A1 Niveau</Link>
            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={item}>
                <span className="font-medium text-foreground">/</span>
                {index === breadcrumbItems.length - 1 ? (
                  <div className="font-medium text-foreground capitalize">{item}</div>
                ) : (
                  <Link href={`/a1niveau/${breadcrumbItems.slice(0, index + 1).join('/')}`} className="hover:text-foreground capitalize">
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
          <div className="mdx">
            <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
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

  // Get specific markdown content for nested cases
  let markdownContent;
  let breadcrumbItems: string[] = [];
  
  if (slug.length === 3) {
    // Nested content (e.g., /a1niveau/vokabular/01-start-auf-deutsch/01-start)
    const [section, folderSlug, fileSlug] = slug;
    
    // First try to get content from folder/file
    markdownContent = getMarkdownBySlug('a1niveau', section, `${folderSlug}/${fileSlug}`);
    
    // If not found, try to get folder index
    if (!markdownContent) {
      markdownContent = getMarkdownBySlug('a1niveau', section, `${folderSlug}/index`);
    }
    
    breadcrumbItems = [section, folderSlug];
  } else if (slug.length === 4) {
    // Deep nested content (e.g., /a1niveau/vokabular/01-start-auf-deutsch/01-start)
    const [section, folderSlug, , fileSlug] = slug;
    markdownContent = getMarkdownBySlug('a1niveau', section, `${folderSlug}/${fileSlug}`);
    breadcrumbItems = [section, folderSlug];
  }
  
  if (!markdownContent) {
    notFound();
  }

  const htmlContent = await markdownToHtml(markdownContent.content);
  const toc = extractTableOfContents(markdownContent.content);

  return (
    <main className="relative py-6 lg:grid lg:grid-cols-[1fr_220px] lg:gap-24 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <Link href="/a1niveau" className="hover:text-foreground">A1 Niveau</Link>
          {breadcrumbItems.map((item, index) => (
            <React.Fragment key={item}>
              <span className="font-medium text-foreground">/</span>
              {index === breadcrumbItems.length - 1 ? (
                <div className="font-medium text-foreground capitalize">{item}</div>
              ) : (
                <Link href={`/a1niveau/${breadcrumbItems.slice(0, index + 1).join('/')}`} className="hover:text-foreground capitalize">
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
              {markdownContent.meta.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
        <Separator className="my-4 md:my-6" />
        <div 
          className="prose prose-stone dark:prose-invert max-w-none prose-p:leading-7 prose-h2:font-headline prose-h2:tracking-tight prose-h2:font-semibold prose-h2:text-2xl prose-a:text-primary hover:prose-a:underline prose-a:no-underline prose-li:my-1 prose-ul:list-disc prose-ol:list-decimal"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
      <div className="hidden text-sm lg:block">
        <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] overflow-y-auto py-12 pl-4">
          <DocsTOC />
        </div>
      </div>
    </main>
  );
}
