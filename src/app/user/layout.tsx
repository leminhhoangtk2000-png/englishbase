import React from "react";
import { MainNav } from "@/components/main-nav";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";

interface UserLayoutProps {
  children: React.ReactNode;
}

export default async function UserLayout({ children }: UserLayoutProps) {
  // Kiểm tra authentication
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }

  return (
    <>
      <MainNav />
      <main>{children}</main>
    </>
  );
}
