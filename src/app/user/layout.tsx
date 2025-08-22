import React from "react";
import { MainNav } from "@/components/main-nav";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
  return (
    <>
      <MainNav />
      <main>{children}</main>
    </>
  );
}
