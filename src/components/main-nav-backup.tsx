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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

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

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 hidden md:flex">
                    <Logo />
                    <nav className="flex items-center gap-6 text-sm ml-6">
                        <NavigationMenu>
                            <NavigationMenuList>
                                {niveauMenus.map((menu) => (
                                    <NavigationMenuItem key={menu.label}>
                                        <NavigationMenuTrigger className="h-9 px-3">
                                            {menu.label}
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent>
                                            <div className="grid w-[400px] gap-3 p-4">
                                                {menu.items.map((item) => (
                                                    <NavigationMenuLink key={item.href} asChild>
                                                        <Link
                                                            href={item.href}
                                                            className={cn(
                                                                "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                                                                pathname.startsWith(item.href) ? "bg-accent text-accent-foreground" : ""
                                                            )}
                                                        >
                                                            <div className="text-sm font-medium leading-none">
                                                                {item.label}
                                                            </div>
                                                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                                                {item.description}
                                                            </p>
                                                        </Link>
                                                    </NavigationMenuLink>
                                                ))}
                                            </div>
                                        </NavigationMenuContent>
                                    </NavigationMenuItem>
                                ))}
                            </NavigationMenuList>
                        </NavigationMenu>
                        
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
    )
}
