import { blogConfig } from "@/config/a2niveau";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarNav } from "./_components/sidebar-nav";
import React from "react";
import { type Doc, type NavItem } from "@/types";
import { MainNav } from "@/components/main-nav";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default async function DocsLayout({ children }: DocsLayoutProps) {
  // Omit the 'component' property before passing to client components
  const navItems: NavItem[] = blogConfig.items.map(item => ({
    ...item,
    items: item.items?.map(({ component, ...subItem }) => subItem),
  }));

  const allDocs: Doc[] = [
    ...blogConfig.items.flatMap(item => item.items ?? [])
  ].map(doc => ({
      title: doc.title,
      href: doc.href ?? '',
      content: doc.description ?? '',
  }));


  return (
    <div className="flex min-h-screen flex-col">
      <MainNav docs={allDocs} />
      <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-12">
        <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
            <ScrollArea className="h-full py-6 pr-6 lg:py-8">
              <SidebarNav items={navItems} />
            </ScrollArea>
        </aside>
        
        {children}
      </div>
    </div>
  );
}
