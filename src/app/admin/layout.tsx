import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./_components/sidebar-nav";
import React from "react";
import { MainNav } from "@/components/main-nav";

const sidebarNavItems = [
  {
    title: "Người dùng",
    href: "/admin",
  },
  {
    title: "Webhooks",
    href: "/admin/webhooks",
  },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <MainNav />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Bảng điều khiển</h2>
            <p className="text-muted-foreground">
            Quản lý người dùng, cài đặt và các thông tin khác.
            </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
            </aside>
            <div className="flex-1">{children}</div>
        </div>
      </div>
    </div>
  );
}
