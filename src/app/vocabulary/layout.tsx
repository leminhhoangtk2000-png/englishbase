import React from "react";
import { MainNav } from "@/components/main-nav";

interface VocabularyLayoutProps {
  children: React.ReactNode;
}

export default function VocabularyLayout({ children }: VocabularyLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
