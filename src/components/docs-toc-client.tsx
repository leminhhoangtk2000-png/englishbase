"use client"

import * as React from "react"
import { useMemo, useEffect, useState } from "react"
import { useMounted } from "@/hooks/use-mounted"
import { cn } from "@/lib/utils"

interface TOCItem {
  title: string
  url: string
  level?: number
  items?: TOCItem[]
}

interface DocsTOCProps {
  toc?: { items: TOCItem[] }
}

export function DocsTOC({ toc: serverTOC }: DocsTOCProps) {
  const [clientTOC, setClientTOC] = useState<{ items: TOCItem[] } | null>(null)
  const mounted = useMounted()

  useEffect(() => {
    if (!mounted) return

    const extractTOC = () => {
      // Extract TOC only from the main prose content area
      const proseContainer = document.querySelector('.prose')
      if (!proseContainer) {
        console.log('[DocsTOC] No .prose container found, retrying...')
        return false
      }

      const headings = proseContainer.querySelectorAll('h1, h2, h3, h4, h5, h6')
      
      if (headings.length === 0) {
        console.log('[DocsTOC] No headings found yet, retrying...')
        return false
      }

      const tocItems: (TOCItem & { level: number })[] = []

      headings.forEach(heading => {
        // Skip the main title (h1) as it's already shown in the page header
        if (heading.tagName.toLowerCase() === 'h1') return

        if (!heading.id) {
          // Generate ID if not exists
          const text = heading.textContent || ''
          const id = text.toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-äöüß]+/g, '') // Support German characters
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '')
          
          if (id) {
            heading.id = id
          }
        }

        if (heading.id && heading.textContent) {
          const level = parseInt(heading.tagName.charAt(1))
          tocItems.push({
            title: heading.textContent.trim(),
            url: `#${heading.id}`,
            level
          })
        }
      })

      if (tocItems.length > 0) {
        // Build hierarchical structure
        const hierarchicalTOC = buildTOCHierarchy(tocItems)
        setClientTOC({ items: hierarchicalTOC })
        console.log('[DocsTOC] ✅ Extracted', tocItems.length, 'headings')
        return true
      }

      return false
    }

    // Try immediately
    const success = extractTOC()
    
    if (!success) {
      // Retry after delays for MDX content to render
      const timers = [
        setTimeout(() => extractTOC(), 500),
        setTimeout(() => extractTOC(), 1000),
        setTimeout(() => extractTOC(), 2000),
      ]

      // Also watch for DOM changes
      const observer = new MutationObserver(() => {
        const success = extractTOC()
        if (success) {
          observer.disconnect()
        }
      })

      const proseContainer = document.querySelector('.prose')
      if (proseContainer) {
        observer.observe(proseContainer, {
          childList: true,
          subtree: true
        })
      }

      return () => {
        timers.forEach(timer => clearTimeout(timer))
        observer.disconnect()
      }
    }
  }, [mounted])

  const toc = clientTOC || serverTOC
  const itemIds = useMemo(
    () =>
      toc?.items
        ? toc.items
            .flatMap((item) => [item.url, item?.items?.map((item) => item.url)])
            .flat()
            .filter(Boolean)
            .map((id) => id?.split("#")[1])
        : [],
    [toc]
  )
  const activeHeading = useActiveItem(itemIds as string[])

  if (!toc?.items?.length || !mounted) {
    return (
      <div className="space-y-2">
        <p className="font-medium">On This Page</p>
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <p className="font-medium">On This Page</p>
      <Tree tree={toc} activeItem={activeHeading} />
    </div>
  )
}

function useActiveItem(itemIds: string[]) {
  const [activeId, setActiveId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "0% 0% -80% 0%" }
    )

    itemIds?.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      itemIds?.forEach((id) => {
        const element = document.getElementById(id)
        if (element) {
          observer.unobserve(element)
        }
      })
    }
  }, [itemIds])

  return activeId
}

/**
 * Build hierarchical TOC structure
 */
function buildTOCHierarchy(items: (TOCItem & { level: number })[]): TOCItem[] {
  const result: TOCItem[] = []
  const stack: (TOCItem & { level: number })[] = []

  for (const item of items) {
    // Remove items from stack that are at same or higher level
    while (stack.length > 0 && stack[stack.length - 1].level >= item.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      // Top level item
      result.push(item)
    } else {
      // Nested item
      const parent = stack[stack.length - 1]
      if (!parent.items) parent.items = []
      parent.items.push(item)
    }

    stack.push(item)
  }

  return result
}

interface TreeProps {
  tree: DocsTOCProps['toc']
  level?: number
  activeItem?: string | null
}

function Tree({ tree, level = 1, activeItem }: TreeProps) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, url: string) => {
    e.preventDefault()
    const targetId = url.replace('#', '')
    const element = document.getElementById(targetId)
    
    console.log('Clicking TOC item:', { url, targetId, element })
    
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
      // Update URL without triggering page reload
      window.history.pushState(null, '', url)
    } else {
      console.warn('Element not found for ID:', targetId)
      // Try to find all heading elements in prose for debugging
      const proseContainer = document.querySelector('.prose')
      if (proseContainer) {
        const allHeadings = proseContainer.querySelectorAll('h1, h2, h3, h4, h5, h6')
        console.log('Available prose headings:', Array.from(allHeadings).map(h => ({ text: h.textContent, id: h.id })))
      }
    }
  }

  return tree?.items?.length && level < 3 ? (
    <ul className={cn("m-0 list-none text-sm", { "pl-4": level !== 1 })}>
      {tree.items.map((item, index) => {
        return (
          <li key={index} className={cn("mt-0 pt-2")}>
            <a
              href={item.url}
              onClick={(e) => handleClick(e, item.url)}
              className={cn(
                "inline-block no-underline transition-colors hover:text-foreground cursor-pointer",
                item.url === `#${activeItem}`
                  ? "font-medium text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.title}
            </a>
            {item.items?.length ? (
              <Tree
                tree={{ items: item.items }}
                level={level + 1}
                activeItem={activeItem}
              />
            ) : null}
          </li>
        )
      })}
    </ul>
  ) : null
}
