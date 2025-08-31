import React from "react";
import { MainNav } from "@/components/main-nav";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth-server";

interface UserPremiumLayoutProps {
  children: React.ReactNode;
}

export default async function UserPremiumLayout({ children }: UserPremiumLayoutProps) {
  // Kiểm tra authentication
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  // Chỉ cho phép USER_PREMIUM và ADMIN truy cập
  if (user.role !== 'USER_PREMIUM' && user.role !== 'ADMIN') {
    redirect('/user'); // Redirect về user dashboard nếu không phải premium
  }

  return (
    <>
      <MainNav />
      <main>{children}</main>
    </>
  );
}
