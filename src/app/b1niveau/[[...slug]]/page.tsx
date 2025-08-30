import { notFound } from "next/navigation";
import { getMarkdownBySlug, markdownToHtml, getNiveauContent, extractTableOfContents } from "@/lib/markdown";
import { DocsTOC } from "@/components/docs-toc-client";
import React from "react";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, GraduationCap, FileText } from "lucide-react";

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
              Trình độ B1 - Intermediate
              <Badge variant="secondary" className="ml-3">
                B1 Niveau
              </Badge>
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground">
              Học tiếng Đức trình độ trung cấp B1. Nắm vững ngữ pháp phức tạp, mở rộng từ vựng và cải thiện kỹ năng giao tiếp.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            <Card className="group relative overflow-hidden border-2 transition-all hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Ngữ pháp - Grammatik</CardTitle>
                </div>
                <CardDescription>
                  Học các cấu trúc ngữ pháp trung cấp quan trọng
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link
                    href="/b1niveau/grammatik/01-perfekt"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    • Thì hoàn thành - Perfekt
                  </Link>
                  <Link
                    href="/b1niveau/grammatik/02-praeteritum"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    • Quá khứ đơn - Präteritum
                  </Link>
                  <Link
                    href="/b1niveau/grammatik/03-konjunktiv-ii"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    • Câu điều kiện - Konjunktiv II
                  </Link>
                  <Link
                    href="/b1niveau/grammatik/04-passiv"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    • Câu bị động - Passiv
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 transition-all hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Từ vựng - Wortschatz</CardTitle>
                </div>
                <CardDescription>
                  Mở rộng vốn từ vựng cho giao tiếp hàng ngày
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link
                    href="/b1niveau/wortschatz/01-arbeit"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    • Công việc - Arbeit
                  </Link>
                  <Link
                    href="/b1niveau/wortschatz/02-gesundheit"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    • Sức khỏe - Gesundheit
                  </Link>
                  <Link
                    href="/b1niveau/wortschatz/03-bildung"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    • Giáo dục - Bildung
                  </Link>
                  <Link
                    href="/b1niveau/wortschatz/04-verkehr"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    • Đi lại - Verkehr
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="group relative overflow-hidden border-2 transition-all hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">Bài tập - Übungen</CardTitle>
                </div>
                <CardDescription>
                  Luyện tập củng cố kiến thức đã học
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link
                    href="/b1niveau/uebungen/01-grammatik-uebungen"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    • Luyện ngữ pháp B1
                  </Link>
                  <Link
                    href="/b1niveau/uebungen/02-wortschatz-uebungen"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    • Luyện từ vựng B1
                  </Link>
                  <Link
                    href="/b1niveau/uebungen/03-lesen-uebungen"
                    className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    • Luyện đọc B1
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full max-w-[700px] space-y-4">
            <h2 className="text-2xl font-bold">Về trình độ B1</h2>
            <div className="space-y-4 text-muted-foreground">
              <p>
                Trình độ B1 (Intermediate) là mức độ trung cấp trong hệ thống đánh giá CEFR. 
                Ở trình độ này, bạn có thể:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Hiểu những ý chính của văn bản rõ ràng về các chủ đề quen thuộc</li>
                <li>Xử lý hầu hết các tình huống có thể xảy ra khi đi du lịch</li>
                <li>Tạo ra văn bản đơn giản về các chủ đề quen thuộc hoặc quan tâm cá nhân</li>
                <li>Mô tả kinh nghiệm, sự kiện, ước mơ, hy vọng và hoài bão</li>
                <li>Đưa ra lý do và giải thích ngắn gọn cho ý kiến và kế hoạch</li>
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
    const niveauContent = getNiveauContent('b1niveau');
    const currentSection = niveauContent.sections.find(s => s.slug === section);
    
    if (!currentSection) {
      notFound();
    }
    
    return (
      <main className="relative py-6 lg:py-8">
        <div className="mx-auto w-full min-w-0">
          <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
            <Link href="/b1niveau" className="hover:text-foreground">B1 Niveau</Link>
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
            {currentSection.items.map((item) => (
              <Link
                key={item.slug}
                href={`/b1niveau/${section}/${item.slug}`}
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

  // Get specific markdown content
  const markdownContent = getMarkdownBySlug('b1niveau', section, articleSlug);
  
  if (!markdownContent) {
    notFound();
  }

  const htmlContent = await markdownToHtml(markdownContent.content);
  const toc = extractTableOfContents(markdownContent.content);

  return (
    <main className="relative py-6 lg:grid lg:grid-cols-[1fr_220px] lg:gap-24 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <Link href="/b1niveau" className="hover:text-foreground">B1 Niveau</Link>
          <span className="font-medium text-foreground">/</span>
          <Link href={`/b1niveau/${section}`} className="hover:text-foreground capitalize">{section}</Link>
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
