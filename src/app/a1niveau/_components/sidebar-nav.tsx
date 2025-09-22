"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
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
  const [openSections, setOpenSections] = useState<Set<number>>(new Set());

  // Automatically open section that contains current page
  useEffect(() => {
    const newOpenSections = new Set<number>();
    
    items.forEach((item, index) => {
      if (item.items && item.items.some(subItem => pathname === subItem.href)) {
        newOpenSections.add(index);
      }
    });
    
    setOpenSections(newOpenSections);
  }, [pathname, items]);

  const toggleSection = (index: number) => {
    setOpenSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return items.length ? (
    <div className="w-full">
      {items.map((item, index) => (
        <Collapsible 
          key={index} 
          className="w-full" 
          open={openSections.has(index)}
          onOpenChange={() => toggleSection(index)}
        >
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
    <div className="grid grid-flow-row auto-rows-max text-sm py-1 space-y-1">
      {items.map((item, index) => {
        // Check if this item has sub-items (folder) or is a direct file
        const hasSubItems = item.items && item.items.length > 0;
        
        if (hasSubItems) {
          // Render as collapsible folder (for Vokabular with nested structure)
          return (
            <Collapsible key={index} className="w-full">
              <CollapsibleTrigger className={cn(
                "flex w-full items-start justify-between rounded-md px-3 py-2.5 text-sm hover:bg-secondary/50 hover:text-foreground transition-colors [&[data-state=open]>svg]:rotate-90",
                {
                  "bg-secondary/80 font-medium text-foreground": pathname?.startsWith(item.href || ''),
                }
              )}>
                <span className="text-sm font-medium text-left leading-relaxed pr-2 flex-1 break-words">{item.title}</span>
                <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 text-muted-foreground mt-0.5" />
              </CollapsibleTrigger>
              <CollapsibleContent className="pl-4 mt-1">
                <div className="grid grid-flow-row auto-rows-max space-y-0.5">
                  {item.items?.map((subItem, subIndex) => (
                    <Link
                      key={subIndex}
                      href={subItem.href || '#'}
                      className={cn(
                        "flex items-start rounded-md px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary/30 hover:text-foreground transition-colors",
                        {
                          "bg-secondary/60 font-medium text-foreground": pathname === subItem.href,
                        }
                      )}
                    >
                      <span className="leading-relaxed break-words">{subItem.title}</span>
                    </Link>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        } else {
          // Render as direct file link (for Grammatik or single files)
          return item.href && !item.disabled ? (
            <Link
              key={index}
              href={item.href}
              className={cn(
                "flex w-full items-start rounded-md px-3 py-2.5 text-sm text-muted-foreground hover:bg-secondary/50 hover:text-foreground transition-colors",
                {
                  "bg-secondary/80 font-medium text-foreground": pathname === item.href,
                }
              )}
              target={item.external ? "_blank" : ""}
              rel={item.external ? "noreferrer" : ""}
            >
              <span className="font-medium leading-relaxed break-words">{item.title}</span>
            </Link>
          ) : (
            <span
              key={index}
              className="flex w-full cursor-not-allowed items-start rounded-md px-3 py-2.5 text-sm text-muted-foreground opacity-60"
            >
              <span className="leading-relaxed break-words">{item.title}</span>
            </span>
          );
        }
      })}
    </div>
  ) : null;
}
