import React from "react";
import { MainNav } from "@/components/main-nav";

interface KiemTraLayoutProps {
  children: React.ReactNode;
}

export default function KiemTraLayout({ children }: KiemTraLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <main className="flex-1">{children}</main>
    </div>
  );
}
