import React from "react";
import { MainNav } from "@/components/main-nav";

interface BlogLayoutProps {
  children: React.ReactNode;
}

export default async function BlogLayout({ children }: BlogLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">{children}</main>
      <footer className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Deutsch.vn. All rights reserved.</p>
      </footer>
    </div>
  );
}
