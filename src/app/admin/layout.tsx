import React from "react";
import { MainNav } from "@/components/main-nav";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main>{children}</main>
    </div>
  );
}
