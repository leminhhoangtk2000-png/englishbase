import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'

const contentDirectory = path.join(process.cwd(), 'content')

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
      const orderA = a.meta.order || 999
      const orderB = b.meta.order || 999
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
  
  const result = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(processedMarkdown)
  
  return result.toString()
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
        order: item.meta.order || 999,
      })),
    })),
  }
}
