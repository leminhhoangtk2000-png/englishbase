"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { SearchCommand } from "@/components/search-command";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { type Doc } from "@/types";
import { Separator } from "./ui/separator";

interface MainNavProps {
    docs?: Doc[];
}

const navLinks = [
    { href: "/docs", label: "Ngữ pháp A1" },
    { href: "/blog", label: "Ngữ pháp A2" },
    { href: "/components", label: "Ngữ pháp B1" },
    { href: "/examples", label: "Ngữ pháp B2" },
    { href: "/exercises", label: "Bài tập" },
    { href: "/vocabulary", label: "Từ vựng" },
    { href: "/blog-new", label: "Blog" },
    { href: "/user", label: "User" },
    { href: "/user-premium", label: "User Premium" },
    { href: "/kiem-tra", label: "Kiểm tra" },
    { href: "/admin", label: "Admin" },
];

export function MainNav({ docs = [] }: MainNavProps) {
    const pathname = usePathname();

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 hidden md:flex">
                    <Logo />
                    <nav className="flex items-center gap-6 text-sm ml-6">
                        {navLinks.map(({ href, label }) => (
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
                            <Button variant="ghost" asChild>
                                <Link href="/login">Đăng nhập</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/signup">Đăng ký</Link>
                            </Button>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    )
}
