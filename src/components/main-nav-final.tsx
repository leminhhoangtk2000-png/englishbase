"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { SearchCommand } from "@/components/search-command";
import { Button } from "@/components/ui/button";
import { Menu, ChevronDown } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserAvatarDropdown } from "@/components/user-avatar-dropdown";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";
import { type Doc } from "@/types";
import { Separator } from "./ui/separator";
import { useState } from "react";

interface MainNavProps {
    docs?: Doc[];
}

const niveauMenus = [
    {
        label: "A Niveau",
        items: [
            { href: "/a1niveau", label: "A1 Niveau", description: "Cấp độ cơ bản cho người mới bắt đầu" },
            { href: "/a2niveau", label: "A2 Niveau", description: "Cấp độ sơ cấp, mở rộng kiến thức cơ bản" },
        ]
    },
    {
        label: "B Niveau", 
        items: [
            { href: "/b1niveau", label: "B1 Niveau", description: "Cấp độ trung cấp, giao tiếp thành thạo" },
            { href: "/b2niveau", label: "B2 Niveau", description: "Cấp độ trung cấp cao, sử dụng linh hoạt" },
        ]
    }
];

const otherNavLinks = [
    { href: "/exercises", label: "Bài tập" },
    { href: "/vocabulary", label: "Từ vựng" },
    { href: "/blog-new", label: "Blog" },
    { href: "/user", label: "User" },
    { href: "/user-premium", label: "User Premium" },
    { href: "/kiem-tra", label: "Kiểm tra" },
    { href: "/payment", label: "Thanh toán" },
    { href: "/admin", label: "Admin" },
];

export function MainNav({ docs = [] }: MainNavProps) {
    const pathname = usePathname();
    const { user, loading } = useAuth();
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 hidden md:flex">
                    <Logo />
                    <nav className="flex items-center gap-6 text-sm ml-6">
                        {/* Dropdown menus for A and B Niveau */}
                        {niveauMenus.map((menu) => (
                            <div 
                                key={menu.label}
                                className="relative group"
                                onMouseEnter={() => setOpenDropdown(menu.label)}
                                onMouseLeave={() => setOpenDropdown(null)}
                            >
                                <button
                                    className={cn(
                                        "h-9 px-3 font-medium transition-colors hover:text-foreground/80 flex items-center gap-1 bg-transparent border-none cursor-pointer",
                                        menu.items.some(item => pathname.startsWith(item.href)) ? "text-foreground" : "text-foreground/60"
                                    )}
                                >
                                    {menu.label}
                                    <ChevronDown className="h-3 w-3" />
                                </button>
                                
                                {/* Dropdown Content */}
                                <div className={cn(
                                    "absolute top-full left-0 mt-1 w-[300px] bg-popover border rounded-md shadow-lg p-1 z-50 transition-all duration-200",
                                    openDropdown === menu.label ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
                                )}>
                                    {menu.items.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex flex-col items-start gap-1 p-3 rounded-sm hover:bg-accent transition-colors",
                                                pathname.startsWith(item.href) ? "bg-accent text-accent-foreground" : ""
                                            )}
                                            onClick={() => setOpenDropdown(null)}
                                        >
                                            <div className="font-medium text-sm">{item.label}</div>
                                            <div className="text-xs text-muted-foreground">{item.description}</div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        ))}
                        
                        {/* Other navigation links */}
                        {otherNavLinks.map(({ href, label }) => (
                            <Link
                                key={href}
                                href={href}
                                className={cn(
                                    "font-medium transition-colors hover:text-foreground/80",
                                    pathname.startsWith(href) ? "text-foreground" : "text-foreground/60"
                                )}
                            >
                                {label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="md:hidden">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle Menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="pr-0">
                            <Logo />
                            {/* Mobile nav could be improved here if needed */}
                        </SheetContent>
                    </Sheet>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <SearchCommand docs={docs} />
                    </div>
                    <nav className="flex items-center gap-2">
                        <ThemeToggle />
                        <Separator orientation="vertical" className="h-6 hidden sm:block" />
                        <div className="hidden sm:flex items-center gap-2">
                            {!loading && (
                                user ? (
                                    <UserAvatarDropdown />
                                ) : (
                                    <>
                                        <Button variant="ghost" asChild>
                                            <Link href="/login">Đăng nhập</Link>
                                        </Button>
                                        <Button asChild>
                                            <Link href="/signup">Đăng ký</Link>
                                        </Button>
                                    </>
                                )
                            )}
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
}
