import React from "react";
import { MainNav } from "@/components/main-nav";
import { blogNewConfig } from "@/config/blog-new";
import { type Doc, type NavItem } from "@/types";

interface BlogLayoutProps {
  children: React.ReactNode;
}

export default async function BlogLayout({ children }: BlogLayoutProps) {
  const allDocs: Doc[] = blogNewConfig.items.flatMap(item => item.items ?? []).map(doc => ({
      title: doc.title,
      href: doc.href ?? '',
      content: doc.description ?? '',
  }));

  return (
    <div className="flex min-h-screen flex-col">
      <MainNav docs={allDocs} />
      <main className="flex-1">{children}</main>
    </div>
  );
}
