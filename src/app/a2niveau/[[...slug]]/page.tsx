import { notFound } from "next/navigation";
import { getMarkdownBySlug, markdownToHtml, getNiveauContent, extractTableOfContents } from "@/lib/markdown";
import { DocsTOC } from "../_components/docs-toc";
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
  const { slug: rawSlug } = await params;
  
  // Decode URL components to handle German characters like Ü in Übungen
  const slug = rawSlug ? rawSlug.map(segment => decodeURIComponent(segment)) : rawSlug;

  // If no slug, show main niveau page
  if (!slug || slug.length === 0) {
    const niveauContent = getNiveauContent('a2niveau');
    
    return (
      <main className="relative py-6 lg:py-8">
        <div className="mx-auto w-full min-w-0">
          <div className="space-y-2 mb-8">
            <h1 className="scroll-m-20 text-4xl font-bold tracking-tight font-headline">A2 Niveau</h1>
            <p className="text-lg text-muted-foreground">
              Tiếng Đức cơ bản nâng cao - Niveau A2 theo khung tham chiếu châu Âu
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
                    const href = hasSubItems ? `/a2niveau/${section.slug}/${itemSlug}` : (item.href || '#');
                    
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
        </div>
      </main>
    );
  }

  // If we have slug, handle different cases
  const [section, ...rest] = slug;
  
  if (!section) {
    notFound();
  }

  // Case 1: Only section (e.g., /a2niveau/vokabular)
  if (rest.length === 0) {
    const niveauContent = getNiveauContent('a2niveau');
    const currentSection = niveauContent.sections.find((s: any) => s.slug === section);
    
    if (!currentSection) {
      notFound();
    }
    
    return (
      <main className="relative py-6 lg:py-8">
        <div className="mx-auto w-full min-w-0">
          <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
            <Link href="/a2niveau" className="hover:text-foreground">A2 Niveau</Link>
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
                href={`/a2niveau/${section}/${item.slug}`}
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

  // Case 2: Section with subsection - handle different levels
  const articleSlug = rest.join('/');
  
  // Try to find markdown content - handle folder structure
  let markdownContent;
  
  // Handle 3-level paths (e.g., /a2niveau/vokabular/1-willkommen-a2/01-grundwortschatz)
  if (rest.length === 2 && section === 'vokabular') {
    const [folderSlug, fileSlug] = rest;
    const folderMapping: { [key: string]: string } = {
      '1-willkommen-a2': '1. Willkommen A2',
      '2-leben-und-lernen': '2. Leben und Lernen', 
      '3-familiengeschichten': '3. Familiengeschichten',
      '4-unterwegs': '4. Unterwegs',
      '5-station-1-a2': '5. Station 1-A2',
      '6-freizeit-und-hobby': '6. Freizeit und Hobby',
      '7-medien-im-alltag': '7. Medien im Alltag',
      '8-ausgehen-leute-treffen': '8. Ausgehen Leute treffen',
      '9-station-2-a2': '9. Station 2-A2',
      '10-vom-land-in-die-stadt': '10. Vom Land in die Stadt',
      '11-kultur-erleben': '11. Kultur erleben',
    };
    
    // File mapping for actual file names in the folders
    const fileMapping: { [key: string]: { [key: string]: string } } = {
      '1-willkommen-a2': {
        '01-grundwortschatz': '1. Uhrzeiten.md',
        '02-begrussung': '2. Die Brücke von A1 zu A2.md',
        '03-fit-a2': '3. Fit fur A2.md',
        'verb-adj-adv': 'Verb-Adj-Adv 1-A2.md'
      },
      '2-leben-und-lernen': {
        '01-alltag': '1. Leben und lernen in Europa.md',
        '02-lernen': '2. Die neue Arbeismigration.md'
      },
      '3-familiengeschichten': {
        '01-familienmitglieder': '1. Familie Saalfeld.md',
        '02-beziehungen': '2. Meine Verwandten.md'
      },
      '4-unterwegs': {
        '01-verkehrsmittel': '1. Unterwegs.md'
      },
      '5-station-1-a2': {
        '01-review': '1. Berufsbilder 1-A2.md'
      },
      '6-freizeit-und-hobby': {
        '01-activities': '1. Hobbys.md'
      },
      '7-medien-im-alltag': {
        '01-medien': '1. Medien im Alltag.md'
      },
      '8-ausgehen-leute-treffen': {
        '01-ausgehen': '1. Ausgehen - nicht nur am Wochenende.md'
      },
      '9-station-2-a2': {
        '01-review-advanced': '1. Berufbilder 2-A2.md'
      },
      '10-vom-land-in-die-stadt': {
        '01-stadt-land': '1. Stadtleben oder Landluft.md'
      },
      '11-kultur-erleben': {
        '01-kultur': '1. Kulturhauptstädte Europas.md'
      }
    };
    
    const folderName = folderMapping[folderSlug];
    if (folderName) {
      // Check if we have specific file mapping
      if (fileMapping[folderSlug] && fileMapping[folderSlug][fileSlug]) {
        const fileName = fileMapping[folderSlug][fileSlug];
        console.log(`[DEBUG] Trying to load file: ${fileName} from folder: ${folderName}`);
        markdownContent = getMarkdownBySlug('a2niveau', `vokabular/${folderName}`, fileName);
      } else {
        // Try direct file mapping
        console.log(`[DEBUG] Trying direct file mapping: ${fileSlug}`);
        markdownContent = getMarkdownBySlug('a2niveau', `vokabular/${folderName}`, fileSlug);
      }
    }
  }
  
  // Only try other options if we haven't found content yet
  if (!markdownContent) {
    // Try direct file first
    markdownContent = getMarkdownBySlug('a2niveau', section, articleSlug);
    
    // If not found, try with folder mapping for Vokabular section
    if (!markdownContent && section === 'vokabular') {
      // Map URL slug to actual folder name
      const folderMapping: { [key: string]: string } = {
        '1-willkommen-a2': '1. Willkommen A2',
        '2-leben-und-lernen': '2. Leben und Lernen', 
        '3-familiengeschichten': '3. Familiengeschichten',
        '4-unterwegs': '4. Unterwegs',
        '5-station-1-a2': '5. Station 1-A2',
        '6-freizeit-und-hobby': '6. Freizeit und Hobby',
        '7-medien-im-alltag': '7. Medien im Alltag',
        '8-ausgehen-leute-treffen': '8. Ausgehen Leute treffen',
        '9-station-2-a2': '9. Station 2-A2',
        '10-vom-land-in-die-stadt': '10. Vom Land in die Stadt',
        '11-kultur-erleben': '11. Kultur erleben',
      };
      
      const folderName = folderMapping[articleSlug];
      if (folderName) {
        markdownContent = getMarkdownBySlug('a2niveau', `vokabular/${folderName}`, 'index');
      }
    }
    
    // If still not found, try with folder mapping for Vokabular Thema section  
    if (!markdownContent && section === 'vokabular-thema') {
      const folderMapping: { [key: string]: string } = {
        '100-adj-pho-bien-a2': '100 adj pho bien A2',
        '100-adv-pho-bien-a2': '100 adv pho bien A2',
        '100-verb-pho-bien-a2': '100 verb pho bien A2',
        '1-monaten': '1. Monaten',
      };
      
      const folderName = folderMapping[articleSlug];
      if (folderName) {
        // Try to get index.md from the folder
        markdownContent = getMarkdownBySlug('a2niveau', `Vokabular Thema/${folderName}`, 'index');
        
        // If index.md doesn't exist, try the .md file directly
        if (!markdownContent && articleSlug === '1-monaten') {
          markdownContent = getMarkdownBySlug('a2niveau', 'Vokabular Thema', '1. Monaten');
        }
      }
    }
  }
  
  if (!markdownContent) {
    notFound();
  }

  const htmlContent = await markdownToHtml(markdownContent.content);
  const toc = extractTableOfContents(markdownContent.content);

  // Create breadcrumb items dynamically
  const breadcrumbItems = [section];
  if (rest.length > 0) {
    breadcrumbItems.push(...rest);
  }

  return (
    <main className="relative py-6 lg:grid lg:grid-cols-[1fr_220px] lg:gap-24 lg:py-8">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <Link href="/a2niveau" className="hover:text-foreground">A2 Niveau</Link>
          {breadcrumbItems.map((item: any, index: number) => (
            <React.Fragment key={item}>
              <span className="font-medium text-foreground">/</span>
              {index === breadcrumbItems.length - 1 ? (
                <div className="font-medium text-foreground capitalize">{item}</div>
              ) : (
                <Link href={`/a2niveau/${breadcrumbItems.slice(0, index + 1).join('/')}`} className="hover:text-foreground capitalize">
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
        <div 
          className="prose prose-stone dark:prose-invert max-w-none prose-p:leading-7 prose-h2:font-headline prose-h2:tracking-tight prose-h2:font-semibold prose-h2:text-2xl prose-a:text-primary hover:prose-a:underline prose-a:no-underline prose-li:my-1 prose-h1:text-foreground prose-h2:text-foreground prose-h3:text-foreground prose-h4:text-foreground prose-h5:text-foreground prose-h6:text-foreground prose-h1:no-underline prose-h2:no-underline prose-h3:no-underline prose-h4:no-underline prose-h5:no-underline prose-h6:no-underline"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
      <div className="hidden text-sm lg:block">
        <div className="sticky top-16 -mt-10 h-[calc(100vh-3.5rem)] overflow-y-auto py-12 pl-4">
          <DocsTOC toc={toc} />
        </div>
      </div>
    </main>
  );
}
