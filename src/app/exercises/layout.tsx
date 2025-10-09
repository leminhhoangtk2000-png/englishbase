import { exercisesConfig } from "@/config/exercises";
import React from "react";
import { type Doc, type NavItem } from "@/types";
import { MainNav } from "@/components/main-nav";

interface DocsLayoutProps {
  children: React.ReactNode;
}

export default async function DocsLayout({ children }: DocsLayoutProps) {
  // Pass nav items to client components
  const navItems: NavItem[] = exercisesConfig.items.map(item => ({
    ...item,
    items: item.items?.map(subItem => subItem),
  }));  const allDocs: Doc[] = exercisesConfig.items.flatMap(item => item.items ?? []).map(doc => ({
      title: doc.title,
      href: doc.href ?? '',
      content: doc.description ?? '',
  }));


  return (
    <div className="flex min-h-screen flex-col">
      <MainNav docs={allDocs} />
      <div className="container flex-1">
        {children}
      </div>
    </div>
  );
}
