import { notFound } from "next/navigation";
import { getMarkdownBySlug, markdownToHtml, getNiveauContent, extractTableOfContents } from "@/lib/markdown";
import { DocsTOC } from "@/components/docs-toc-client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { docsConfig } from "@/config/b2niveau";

interface DocPageProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function DocPage({ params }: DocPageProps) {
  const { slug } = await params;

    // If no slug, show main niveau page
  if (!slug || slug.length === 0) {
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
            {docsConfig.items.map((section: any) => (
              <div key={section.title} className="space-y-4">
                <h2 className="text-2xl font-semibold font-headline">
                  {section.title}
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {section.items?.map((item: any) => (
                    <Link
                      key={item.href}
                      href={item.href || '#'}
                      className="group block p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <h3 className="font-medium group-hover:text-primary">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {item.description}
                      </p>
                    </Link>
                  ))}
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
                <li>Hiểu những ý chính của văn bản phức tạp về cả chủ đề cụ thể và trừu tượng</li>
                <li>Tương tác một cách trôi chảy và tự nhiên với người bản địa</li>
                <li>Tạo ra văn bản rõ ràng, chi tiết về nhiều chủ đề khác nhau</li>
                <li>Giải thích quan điểm về một vấn đề, nêu ra ưu và nhược điểm của các lựa chọn khác nhau</li>
                <li>Hiểu và thảo luận về các chủ đề chuyên môn trong lĩnh vực của mình</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // If we have slug, try to get markdown content
  const [section, articleSlug] = slug;
  
  if (!section || !articleSlug) {
    // Show section overview
    const niveauContent = getNiveauContent('b2niveau');
    const currentSection = niveauContent.sections.find((s: any) => s.slug === section);
    
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
              {currentSection.itemCount} bài học
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
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

  // Get specific markdown content
  const markdownContent = getMarkdownBySlug('b2niveau', section, articleSlug);
  
  if (!markdownContent) {
    notFound();
  }

  const htmlContent = await markdownToHtml(markdownContent.content);
  const toc = extractTableOfContents(markdownContent.content);

  return (
    <main className="relative py-6 lg:grid lg:grid-cols-[1fr_220px] lg:gap-24 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <Link href="/b2niveau" className="hover:text-foreground">B2 Niveau</Link>
          <span className="font-medium text-foreground">/</span>
          <Link href={`/b2niveau/${section}`} className="hover:text-foreground capitalize">{section}</Link>
          <span className="font-medium text-foreground">/</span>
          <div className="font-medium text-foreground">{markdownContent.meta.title}</div>
        </div>
        <div className="space-y-2">
          <h1 className="scroll-m-20 text-4xl font-bold tracking-tight font-headline">
            {markdownContent.meta.title}
          </h1>
          {markdownContent.meta.description && (
            <p className="text-lg text-muted-foreground">{markdownContent.meta.description}</p>
          )}
          {markdownContent.meta.tags && markdownContent.meta.tags.length > 0 && (
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
        <div 
          className="prose prose-stone dark:prose-invert max-w-none prose-p:leading-7 prose-h2:font-headline prose-h2:tracking-tight prose-h2:font-semibold prose-h2:text-2xl prose-a:text-primary hover:prose-a:underline prose-a:no-underline prose-li:my-1"
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
