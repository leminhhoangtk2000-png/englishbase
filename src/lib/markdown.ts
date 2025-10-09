import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkHtml from 'remark-html'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import remarkDirective from 'remark-directive'
import { unified } from 'unified'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'
import rehypeStringify from 'rehype-stringify'
// import { preprocessAdmonitions } from './preprocess-admonitions'
import { remarkAdmonitionDirective } from './remark-admonition-directive'

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
  filePath?: string
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
 * Get a specific markdown file by niveau, section, and slug (supporting nested paths)
 */
export function getMarkdownBySlug(
  niveau: string,
  section: string,
  slug: string
): MarkdownContent | null {
  try {
    // Decode URL-encoded slug first
    const decodedSlug = decodeURIComponent(slug)
    
    console.log('[getMarkdownBySlug] Debug:', {
      niveau,
      section,
      slug,
      decodedSlug,
      contentDirectory
    });
    
    // Check if slug already has extension
    const slugWithExtension = decodedSlug.endsWith('.md') || decodedSlug.endsWith('.mdx') ? decodedSlug : `${decodedSlug}.md`
    const altSlugWithExtension = decodedSlug.endsWith('.md') ? decodedSlug.replace('.md', '.mdx') : `${decodedSlug}.mdx`
    
    // Support nested paths like "01-start-auf-deutsch/01-start" or "01-start-auf-deutsch/index"
    const filePath = path.join(contentDirectory, niveau, section, slugWithExtension)
    const altFilePath = path.join(contentDirectory, niveau, section, altSlugWithExtension)
    
    // Also check for folder-based content with index files
    const folderIndexPath = path.join(contentDirectory, niveau, section, decodedSlug, 'index.md')
    const folderIndexAltPath = path.join(contentDirectory, niveau, section, decodedSlug, 'index.mdx')
    
    console.log('[getMarkdownBySlug] Trying paths:', {
      filePath,
      altFilePath,
      folderIndexPath,
      folderIndexAltPath,
      'filePath exists': fs.existsSync(filePath),
      'altFilePath exists': fs.existsSync(altFilePath),
      'folderIndexPath exists': fs.existsSync(folderIndexPath),
      'folderIndexAltPath exists': fs.existsSync(folderIndexAltPath)
    });
    
    let actualPath = filePath
    
    // Priority: direct file > alt extension > folder index > folder index alt
    if (fs.existsSync(filePath)) {
      actualPath = filePath
    } else if (fs.existsSync(altFilePath)) {
      actualPath = altFilePath
    } else if (fs.existsSync(folderIndexPath)) {
      actualPath = folderIndexPath
    } else if (fs.existsSync(folderIndexAltPath)) {
      actualPath = folderIndexAltPath
    } else {
      return null
    }
    
    const fileContents = fs.readFileSync(actualPath, 'utf8')
    const { data, content } = matter(fileContents)
    
    return {
      meta: {
        ...data,
        slug: decodedSlug.split('/').pop()?.replace(/\.(md|mdx)$/, '') || decodedSlug, // Use the last part as slug, remove extension
      } as MarkdownMeta,
      content,
      filePath: actualPath,
    }
  } catch (error) {
    console.error('Error reading markdown file:', error)
    return null
  }
}

/**
 * Process markdown content to HTML with all enhanced features
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  // Process admonitions using remark plugin instead of preprocessing
  // const withAdmonitions = preprocessAdmonitions(markdown)
  
  // Process custom syntaxes
  const processedMarkdown = processAdvancedFeatures(markdown)
  
  const result = await unified()
    .use(remarkParse)
    .use(remarkDirective) // Add directive support
    .use(remarkAdmonitionDirective) // Transform admonition directives
    .use(remarkGfm) // GitHub Flavored Markdown
    .use(remarkMath) // Math equations support
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSlug) // Add IDs to headings
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: {
        className: ['anchor-link'],
        ariaLabel: 'Link to this section',
      },
    })
    .use(rehypeKatex) // Render math equations
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(processedMarkdown)

  return result.toString()
}

/**
 * Process advanced markdown features before main processing
 */
function processAdvancedFeatures(markdown: string): string {
  let processed = markdown
  
  // Process admonitions with enhanced syntax
  processed = processAdvancedAdmonitions(processed)
  
  // Process code blocks with metadata
  processed = processAdvancedCodeBlocks(processed)
  
  // Process tabs syntax
  processed = processTabsSyntax(processed)
  
  // Process details/summary elements
  processed = processDetailsSummary(processed)
  
  return processed
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
 * Process custom admonitions syntax :::type into HTML with enhanced features
 * Following Docusaurus standard: https://docusaurus.io/docs/markdown-features/admonitions
 */
function processAdvancedAdmonitions(markdown: string): string {
  // Handle :::type[Custom Title] format (Docusaurus standard)
  let processed = markdown.replace(/:::(\w+)\[([^\]]+)\]\s*\n([\s\S]*?)\s*:::/gm, (match, type, title, content) => {
    const safeType = type.toLowerCase()
    const processedContent = content.trim()
    
    return `<div class="admonition admonition-${safeType}" data-admonition-type="${safeType}">
<div class="admonition-title">
<span class="admonition-icon">${getAdmonitionIcon(safeType)}</span>
${title.trim()}
</div>
<div class="admonition-content">

${processedContent}

</div>
</div>`
  })
  
  // Handle :::type format (without custom title, use default) - More flexible with whitespace
  processed = processed.replace(/:::(\w+)\s*\n([\s\S]*?)\s*:::/gm, (match, type, content) => {
    const safeType = type.toLowerCase()
    const displayTitle = getDefaultTitle(safeType)
    const processedContent = content.trim()
    
    return `<div class="admonition admonition-${safeType}" data-admonition-type="${safeType}">
<div class="admonition-title">
<span class="admonition-icon">${getAdmonitionIcon(safeType)}</span>
${displayTitle}
</div>
<div class="admonition-content">

${processedContent}

</div>
</div>`
  })
  
  return processed
}

/**
 * Process enhanced code block syntax with titles and line numbers
 */
function processAdvancedCodeBlocks(markdown: string): string {
  // Enhanced code block regex with optional metadata
  const codeBlockRegex = /```(\w+)(?:\s+([^\n]*))?\n([\s\S]*?)```/g
  
  return markdown.replace(codeBlockRegex, (match, language, metadata, code) => {
    const metaString = metadata || ''
    const titleMatch = metaString.match(/title="([^"]*)"/) || metaString.match(/title=([^\s]*)/)
    const title = titleMatch ? titleMatch[1] : null
    const showLineNumbers = metaString.includes('showLineNumbers')
    const highlightLines = metaString.match(/\{([^}]*)\}/)?.[1] || ''
    
    let result = ''
    
    if (title) {
      result += `<div class="code-block-title">${title}</div>\n`
    }
    
    result += `<pre class="language-${language}${showLineNumbers ? ' line-numbers' : ''}"${highlightLines ? ` data-highlight="${highlightLines}"` : ''}><code class="language-${language}">${escapeHtml(code.trim())}</code></pre>`
    
    return result
  })
}

/**
 * Process tabs syntax for multi-language code blocks
 */
function processTabsSyntax(markdown: string): string {
  // Simple tab syntax for now - can be enhanced later
  return markdown
}

/**
 * Process details/summary syntax
 */
function processDetailsSummary(markdown: string): string {
  // Enhanced details elements are already supported in HTML
  return markdown
}

/**
 * Escape HTML characters
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  }
  
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char])
}

/**
 * Get default title for admonition type (Docusaurus standard)
 */
function getDefaultTitle(type: string): string {
  const titles: Record<string, string> = {
    note: 'Ghi chú',
    tip: 'Mẹo',
    info: 'Thông tin', 
    important: 'Quan trọng',
    warning: 'Cảnh báo',
    caution: 'Thận trọng',
    danger: 'Nguy hiểm'
  }
  return titles[type] || type.charAt(0).toUpperCase() + type.slice(1)
}

/**
 * Get emoji icon for admonition type (Docusaurus standard)
 */
function getAdmonitionIcon(type: string): string {
  const icons: Record<string, string> = {
    note: 'ℹ️',
    tip: '💡',
    info: 'ℹ️',
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
  // For a1niveau, use the static config instead of dynamic file scanning
  if (niveau === 'a1niveau') {
    // Import the config directly
    try {
      const configPath = path.join(process.cwd(), 'src', 'config', 'a1niveau.ts')
      if (fs.existsSync(configPath)) {
        // Use the static config
        const { docsConfig } = require('@/config/a1niveau')
        return {
          niveau,
          sections: docsConfig.items.map((section: any) => ({
            name: section.title.toLowerCase(),
            title: section.title,
            slug: section.href.split('/').pop(),
            itemCount: section.items.length,
            items: section.items.map((item: any) => ({
              title: item.title,
              description: item.description,
              slug: item.href ? item.href.split('/').pop() : '',
              href: item.href,
              tags: [],
              order: 0,
              items: item.items || [], // Preserve sub-items for folder structure
            })),
          })),
        }
      }
    } catch (error) {
      console.warn('Could not load a1niveau config, falling back to file scanning')
    }
  }
  
  // For a2niveau, use the static config instead of dynamic file scanning
  if (niveau === 'a2niveau') {
    try {
      const configPath = path.join(process.cwd(), 'src', 'config', 'a2niveau.ts')
      if (fs.existsSync(configPath)) {
        // Use the static config
        const { docsConfig } = require('@/config/a2niveau')
        return {
          niveau,
          sections: docsConfig.items.map((section: any) => ({
            name: section.title.toLowerCase(),
            title: section.title,
            slug: section.href.split('/').pop(),
            itemCount: section.items.length,
            items: section.items.map((item: any) => ({
              title: item.title,
              description: item.description,
              slug: item.href ? item.href.split('/').pop() : '',
              href: item.href,
              tags: [],
              order: 0,
              items: item.items || [], // Preserve sub-items for folder structure
            })),
          })),
        }
      }
    } catch (error) {
      console.warn('Could not load a2niveau config, falling back to file scanning')
    }
  }
  
  // For b1niveau, use the static config instead of dynamic file scanning
  if (niveau === 'b1niveau') {
    try {
      const configPath = path.join(process.cwd(), 'src', 'config', 'b1niveau.ts')
      if (fs.existsSync(configPath)) {
        // Use the static config
        const { docsConfig } = require('@/config/b1niveau')
        return {
          niveau,
          sections: docsConfig.items.map((section: any) => ({
            name: section.title.toLowerCase(),
            title: section.title,
            slug: section.href.split('/').pop(),
            itemCount: section.items.length,
            items: section.items.map((item: any) => ({
              title: item.title,
              description: item.description,
              slug: item.href ? item.href.split('/').pop() : '',
              href: item.href,
              tags: [],
              order: 0,
              items: item.items || [], // Preserve sub-items for folder structure
            })),
          })),
        }
      }
    } catch (error) {
      console.warn('Could not load b1niveau config, falling back to file scanning')
    }
  }
  
  // Fallback to dynamic file scanning for other niveaux
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
