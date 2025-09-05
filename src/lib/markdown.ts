import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeStringify from 'rehype-stringify'

const contentDirectory = path.join(process.cwd(), 'src/content')

export interface MarkdownMeta {
  title: string
  description: string
  date: string
  author?: string
  tags?: string[]
  level: string
  order?: number
  slug: string
}

export interface MarkdownContent {
  meta: MarkdownMeta
  content: string
}

export interface MarkdownSection {
  name: string
  slug: string
  items: MarkdownContent[]
}

/**
 * Get all markdown files from a specific niveau directory
 */
export function getMarkdownFiles(niveau: string): MarkdownSection[] {
  const niveauPath = path.join(contentDirectory, niveau)
  
  if (!fs.existsSync(niveauPath)) {
    return []
  }
  
  const sections: MarkdownSection[] = []
  const sectionDirs = fs.readdirSync(niveauPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
  
  for (const sectionName of sectionDirs) {
    const sectionPath = path.join(niveauPath, sectionName)
    const markdownFiles = fs.readdirSync(sectionPath)
      .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
    
    const items: MarkdownContent[] = []
    
    for (const fileName of markdownFiles) {
      const filePath = path.join(sectionPath, fileName)
      const fileContents = fs.readFileSync(filePath, 'utf8')
      const { data, content } = matter(fileContents)
      
      const slug = fileName.replace(/\.(md|mdx)$/, '')
      
      items.push({
        meta: {
          ...data,
          slug,
        } as MarkdownMeta,
        content,
      })
    }
    
    // Sort by order field if available
    items.sort((a, b) => {
      const orderA = a.meta.order !== undefined ? a.meta.order : 999
      const orderB = b.meta.order !== undefined ? b.meta.order : 999
      return orderA - orderB
    })
    
    sections.push({
      name: sectionName,
      slug: sectionName,
      items,
    })
  }
  
  return sections
}

/**
 * Get a specific markdown file by niveau, section, and slug
 */
export function getMarkdownBySlug(
  niveau: string,
  section: string,
  slug: string
): MarkdownContent | null {
  try {
    const filePath = path.join(contentDirectory, niveau, section, `${slug}.md`)
    const altFilePath = path.join(contentDirectory, niveau, section, `${slug}.mdx`)
    
    let actualPath = filePath
    if (!fs.existsSync(filePath) && fs.existsSync(altFilePath)) {
      actualPath = altFilePath
    } else if (!fs.existsSync(filePath)) {
      return null
    }
    
    const fileContents = fs.readFileSync(actualPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      meta: {
        ...data,
        slug,
      } as MarkdownMeta,
      content,
    }
  } catch (error) {
    console.error('Error reading markdown file:', error)
    return null
  }
}

/**
 * Convert markdown to HTML
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  // Pre-process admonitions
  const processedMarkdown = processAdmonitions(markdown)
  
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'append',
      properties: {
        className: ['anchor'],
        ariaLabel: 'Link to section'
      }
    })
    .use(rehypeStringify)
    .process(processedMarkdown)
  
  return result.toString()
}

/**
 * Add IDs to headings for anchor links
 */
function addHeadingIds(markdown: string): string {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  
  return markdown.replace(headingRegex, (match, hashes, title) => {
    const id = slugify(title.trim())
    return `${hashes} ${title.trim()} {#${id}}`
  })
}

/**
 * Process custom admonitions syntax :::type into HTML
 */
function processAdmonitions(markdown: string): string {
  const admonitionRegex = /:::(\w+)(?:\s+([^\n]*))?\n([\s\S]*?):::/g
  
  return markdown.replace(admonitionRegex, (match, type, title, content) => {
    const safeType = type.toLowerCase()
    const displayTitle = title?.trim() || getDefaultTitle(safeType)
    const processedContent = content.trim()
    
    return `
<div class="admonition admonition-${safeType}">
  <div class="admonition-title">
    <span class="admonition-icon">${getAdmonitionIcon(safeType)}</span>
    ${displayTitle}
  </div>
  <div class="admonition-content">

${processedContent}

  </div>
</div>
`
  })
}

/**
 * Get default title for admonition type
 */
function getDefaultTitle(type: string): string {
  const titles: Record<string, string> = {
    note: 'Ghi chú',
    tip: 'Mẹo',
    important: 'Quan trọng',
    warning: 'Cảnh báo',
    caution: 'Thận trọng',
    danger: 'Nguy hiểm'
  }
  return titles[type] || type.charAt(0).toUpperCase() + type.slice(1)
}

/**
 * Get emoji icon for admonition type
 */
function getAdmonitionIcon(type: string): string {
  const icons: Record<string, string> = {
    note: 'ℹ️',
    tip: '💡',
    important: '❗',
    warning: '⚠️',
    caution: '⚠️',
    danger: '🚨'
  }
  return icons[type] || 'ℹ️'
}

/**
 * Extract table of contents from markdown content
 */
export function extractTableOfContents(markdown: string) {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings: Array<{ level: number; title: string; id: string }> = []
  
  let match
  while ((match = headingRegex.exec(markdown)) !== null) {
    const level = match[1].length
    const rawTitle = match[2].trim()
    
    // Clean markdown syntax from title
    const cleanTitle = cleanMarkdownSyntax(rawTitle)
    const id = slugify(cleanTitle)
    
    headings.push({ level, title: cleanTitle, id })
  }
  
  return buildTOCTree(headings)
}

/**
 * Clean markdown syntax from text
 */
function cleanMarkdownSyntax(text: string): string {
  return text
    // Remove bold/italic syntax
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/__(.+?)__/g, '$1')
    .replace(/_(.+?)_/g, '$1')
    // Remove code syntax
    .replace(/`(.+?)`/g, '$1')
    // Remove links syntax
    .replace(/\[(.+?)\]\(.+?\)/g, '$1')
    // Remove other common markdown
    .replace(/~~(.+?)~~/g, '$1')
    .trim()
}

/**
 * Convert title to slug (matching rehype-slug behavior)
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    // Replace spaces and special chars with hyphens
    .replace(/\s+/g, '-')
    // Remove non-alphanumeric characters except hyphens
    .replace(/[^\w\-]+/g, '')
    // Remove multiple consecutive hyphens
    .replace(/\-\-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Build hierarchical TOC tree
 */
function buildTOCTree(headings: Array<{ level: number; title: string; id: string }>) {
  const items: Array<{ title: string; url: string; items?: any[] }> = []
  const stack: Array<{ level: number; item: any }> = []
  
  for (const heading of headings) {
    const item = {
      title: heading.title,
      url: `#${heading.id}`,
      items: [] as any[]
    }
    
    // Remove items from stack that are at same or higher level
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop()
    }
    
    if (stack.length === 0) {
      // Top level item
      items.push(item)
    } else {
      // Nested item
      const parent = stack[stack.length - 1].item
      if (!parent.items) parent.items = []
      parent.items.push(item)
    }
    
    stack.push({ level: heading.level, item })
  }
  
  return { items }
}

/**
 * Get navigation structure for a niveau
 */
export function getNavigationStructure(niveau: string) {
  const sections = getMarkdownFiles(niveau)
  
  return sections.map(section => ({
    title: section.name.charAt(0).toUpperCase() + section.name.slice(1),
    href: `/${niveau}/${section.slug}`,
    items: section.items.map(item => ({
      title: item.meta.title,
      href: `/${niveau}/${section.slug}/${item.meta.slug}`,
      description: item.meta.description,
    })),
  }))
}

/**
 * Get all available niveaus
 */
export function getAvailableNiveaus(): string[] {
  if (!fs.existsSync(contentDirectory)) {
    return []
  }
  
  return fs.readdirSync(contentDirectory, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => name.includes('niveau'))
    .sort()
}

/**
 * Get all content for a specific niveau (for main pages)
 */
export function getNiveauContent(niveau: string) {
  const sections = getMarkdownFiles(niveau)
  
  return {
    niveau,
    sections: sections.map(section => ({
      name: section.name,
      title: section.name.charAt(0).toUpperCase() + section.name.slice(1),
      slug: section.slug,
      itemCount: section.items.length,
      items: section.items.map(item => ({
        title: item.meta.title,
        description: item.meta.description,
        slug: item.meta.slug,
        tags: item.meta.tags || [],
        order: item.meta.order !== undefined ? item.meta.order : 999,
      })),
    })),
  }
}
