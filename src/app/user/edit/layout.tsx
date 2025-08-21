import { Separator } from "@/components/ui/separator";
import { SidebarNav } from "./_components/sidebar-nav";
import React from "react";

const sidebarNavItems = [
  {
    title: "Hồ sơ công khai",
    href: "/user/edit",
  },
  {
    title: "Giao diện",
    href: "/user/edit/appearance",
  },
  {
    title: "Thông báo",
    href: "/user/edit/notifications",
  },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Cài đặt</h2>
        <p className="text-muted-foreground">
          Quản lý tài khoản và thông tin cá nhân của bạn.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <SidebarNav items={sidebarNavItems} />
        </aside>
        <div className="flex-1 lg:max-w-2xl">{children}</div>
      </div>
    </div>
  );
}
