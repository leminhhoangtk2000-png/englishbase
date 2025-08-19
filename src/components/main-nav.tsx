"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/logo";
import { SearchCommand } from "@/components/search-command";
import { Button } from "@/components/ui/button";
import { Menu, Github } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { type Doc } from "@/types";

interface MainNavProps {
    docs?: Doc[];
}

const navLinks = [
    { href: "/docs", label: "A1 Niveau" },
    { href: "/blog", label: "A2 Niveau" },
    { href: "/components", label: "B1 Niveau" },
    { href: "/examples", label: "B2 Niveau" },
    { href: "/exercises", label: "Bài tập" },
    { href: "/blog-new", label: "Blog" },
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
                    <nav className="flex items-center">
                        <ThemeToggle />
                        <Button variant="ghost" size="icon" asChild>
                            <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                        </Button>
                    </nav>
                </div>
            </div>
        </header>
    )
}
