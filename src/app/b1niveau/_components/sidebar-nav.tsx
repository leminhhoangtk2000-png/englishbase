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
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('b1niveau-sidebar-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setOpenSections(new Set(parsed));
      } catch (e) {
        const newOpenSections = new Set<number>();
        items.forEach((item, index) => {
          if (item.items && item.items.some(subItem => pathname === subItem.href)) {
            newOpenSections.add(index);
          }
        });
        setOpenSections(newOpenSections);
      }
    } else {
      const newOpenSections = new Set<number>();
      items.forEach((item, index) => {
        if (item.items && item.items.some(subItem => pathname === subItem.href)) {
          newOpenSections.add(index);
        }
      });
      setOpenSections(newOpenSections);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('b1niveau-sidebar-state', JSON.stringify(Array.from(openSections)));
    }
  }, [openSections, isInitialized]);

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
  const [openSubSections, setOpenSubSections] = useState<Set<number>>(new Set());
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('b1niveau-sidebar-subsections');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setOpenSubSections(new Set(parsed));
      } catch (e) {
        const newOpenSubSections = new Set<number>();
        items.forEach((item, index) => {
          if (item.items && item.items.some(subItem => pathname === subItem.href)) {
            newOpenSubSections.add(index);
          }
        });
        setOpenSubSections(newOpenSubSections);
      }
    } else {
      const newOpenSubSections = new Set<number>();
      items.forEach((item, index) => {
        if (item.items && item.items.some(subItem => pathname === subItem.href)) {
          newOpenSubSections.add(index);
        }
      });
      setOpenSubSections(newOpenSubSections);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem('b1niveau-sidebar-subsections', JSON.stringify(Array.from(openSubSections)));
    }
  }, [openSubSections, isInitialized]);

  const toggleSubSection = (index: number) => {
    setOpenSubSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm py-1">
      {items.map((item, index) =>
        item.items && item.items.length > 0 ? (
          // If item has sub-items, render as collapsible
          <Collapsible 
            key={index} 
            className="w-full"
            open={openSubSections.has(index)}
            onOpenChange={() => toggleSubSection(index)}
          >
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm hover:bg-secondary/50 [&[data-state=open]>svg]:rotate-90">
              {item.title}
              <ChevronRight className="h-3 w-3 shrink-0 transition-transform duration-200" />
            </CollapsibleTrigger>
            <CollapsibleContent className="pl-4">
              <div className="grid grid-flow-row auto-rows-max text-sm py-1">
                {item.items.map((subItem, subIndex) => (
                  subItem.href && !subItem.disabled ? (
                    <Link
                      key={subIndex}
                      href={subItem.href}
                      className={cn(
                        "flex w-full items-center rounded-md p-2 text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                        {
                          "bg-secondary/80 font-medium text-foreground": pathname === subItem.href,
                        }
                      )}
                      target={subItem.external ? "_blank" : ""}
                      rel={subItem.external ? "noreferrer" : ""}
                    >
                      {subItem.title}
                    </Link>
                  ) : (
                    <span
                      key={subIndex}
                      className="flex w-full cursor-not-allowed items-center rounded-md p-2 text-muted-foreground opacity-60"
                    >
                      {subItem.title}
                    </span>
                  )
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ) : (
          // If no sub-items, render as regular link
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
        )
      )}
    </div>
  ) : null;
}
