import Link from "next/link";
import { getDocsNavigation, getAllDocs, getTableOfContentsForSlug, type TOC } from "@/lib/docs";
import { Logo } from "@/components/logo";
import { SearchCommand } from "@/components/search-command";
import { Button } from "@/components/ui/button";
import { Menu, Github } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarNav } from "./_components/sidebar-nav";
import { DocsTOC } from "./_components/docs-toc";
import React from "react";
import { notFound } from "next/navigation";

interface DocsLayoutProps {
  children: React.ReactNode;
  params: {
    slug: string[];
  };
}

export default async function DocsLayout({ children, params }: DocsLayoutProps) {
  const navItems = getDocsNavigation();
  const allDocs = getAllDocs();
  
  const slug = params.slug || ["introduction"];
  const toc = await getTableOfContentsForSlug(slug);

  if (!toc) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="mr-4 hidden md:flex">
            <Logo />
            <nav className="flex items-center gap-6 text-sm ml-6">
              <Link
                href="/docs"
                className="font-medium text-foreground/60 transition-colors hover:text-foreground/80"
              >
                Docs
              </Link>
              <Link
                href="#"
                className="font-medium text-foreground/60 transition-colors hover:text-foreground/80"
              >
                Blog
              </Link>
              <Link
                href="#"
                className="font-medium text-foreground/60 transition-colors hover:text-foreground/80"
              >
                Templates
              </Link>
            </nav>
          </div>
          <div className="md:hidden">
             <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="pr-0">
                    <Logo />
                    <ScrollArea className="my-4 h-[calc(100vh-8rem)] pb-10 pl-6">
                        <SidebarNav items={navItems} />
                    </ScrollArea>
                </SheetContent>
            </Sheet>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <div className="w-full flex-1 md:w-auto md:flex-none">
              <SearchCommand docs={allDocs} />
            </div>
            <nav className="flex items-center">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                        <Github className="h-5 w-5" />
                        <span className="sr-only">GitHub</span>
                    </Link>
                </Button>
            </nav>
          </div>
        </div>
      </header>
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)_200px] lg:gap-10">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
            <ScrollArea className="h-full py-6 pr-6 lg:py-8">
              <SidebarNav items={navItems} />
            </ScrollArea>
        </aside>
        
        {children}

        <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 lg:sticky lg:block">
          <ScrollArea className="h-full py-6 pr-6 lg:py-8">
            <DocsTOC toc={toc} />
          </ScrollArea>
        </aside>
      </div>
    </div>
  );
}
