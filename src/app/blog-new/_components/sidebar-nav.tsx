 "use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type NavItem } from "@/types";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronRight } from "lucide-react";

interface SidebarNavProps {
  items: NavItem[];
}

export function SidebarNav({ items }: SidebarNavProps) {
  const pathname = usePathname();

  return items.length ? (
    <div className="w-full">
      {items.map((item, index) => (
        <Collapsible key={index} className="w-full" defaultOpen>
          <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm font-semibold font-headline hover:bg-secondary [&[data-state=open]>svg]:rotate-90">
            {item.title}
            {item.items && (
              <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200" />
            )}
          </CollapsibleTrigger>
          {item.items ? (
            <CollapsibleContent className="pl-4">
              <SidebarNavItems items={item.items} pathname={pathname} />
            </CollapsibleContent>
          ) : null}
        </Collapsible>
      ))}
    </div>
  ) : null;
}

interface SidebarNavItemsProps {
  items: NavItem[];
  pathname: string | null;
}

export function SidebarNavItems({ items, pathname }: SidebarNavItemsProps) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm py-1">
      {items.map((item, index) =>
        item.href && !item.disabled ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "flex w-full items-center rounded-md p-2 text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
              {
                "bg-secondary/80 font-medium text-foreground": pathname === item.href,
              }
            )}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            {item.title}
          </Link>
        ) : (
          <span
            key={index}
            className="flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground opacity-60"
          >
            {item.title}
          </span>
        )
      )}
    </div>
  ) : null;
}
