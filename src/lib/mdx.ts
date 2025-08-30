import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

export interface MDXContent {
  slug: string
  title: string
  description?: string
  content: string
  metadata: Record<string, any>
  level?: string
  category?: string
  difficulty?: string
}

export interface MDXTableOfContentsItem {
  id: string
  title: string
  level: number
  children?: MDXTableOfContentsItem[]
}

/**
 * Get all MDX files from a directory
 */
export function getAllMDXFiles(directory: string = ''): MDXContent[] {
  const contentDir = path.join(process.cwd(), 'content', directory)
  
  if (!fs.existsSync(contentDir)) {
    return []
  }
  
  const files = getAllFiles(contentDir, '.mdx')
  
  return files.map(filePath => {
    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data, content } = matter(fileContent)
    
    // Create slug from file path
    const relativePath = path.relative(contentDir, filePath)
    const slug = relativePath.replace(/\.mdx?$/, '').replace(/\\/g, '/')
    
    return {
      slug,
      title: data.title || 'Untitled',
      description: data.description,
      content,
      metadata: data,
      level: data.level,
      category: data.category,
      difficulty: data.difficulty
    }
  })
}

/**
 * Get single MDX file by slug
 */
export function getMDXFile(directory: string, slug: string): MDXContent | null {
  const files = getAllMDXFiles(directory)
  return files.find(file => file.slug === slug) || null
}

/**
 * Get table of contents from MDX content
 */
export function getMDXTableOfContents(content: string): MDXTableOfContentsItem[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm
  const headings: { level: number; title: string; id: string }[] = []
  
  let match
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const title = match[2].trim()
    
    // Clean markdown syntax from title
    const cleanTitle = title
      .replace(/\*\*(.*?)\*\*/g, '$1') // Bold
      .replace(/\*(.*?)\*/g, '$1')     // Italic
      .replace(/`(.*?)`/g, '$1')       // Code
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Links
    
    const id = slugify(cleanTitle)
    
    headings.push({ level, title: cleanTitle, id })
  }
  
  return buildTableOfContentsTree(headings)
}

/**
 * Recursively get all files with specific extension
 */
function getAllFiles(dir: string, extension: string): string[] {
  const files: string[] = []
  
  if (!fs.existsSync(dir)) {
    return files
  }
  
  const items = fs.readdirSync(dir)
  
  for (const item of items) {
    const fullPath = path.join(dir, item)
    const stat = fs.statSync(fullPath)
    
    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath, extension))
    } else if (fullPath.endsWith(extension)) {
      files.push(fullPath)
    }
  }
  
  return files
}

/**
 * Build hierarchical table of contents
 */
function buildTableOfContentsTree(headings: { level: number; title: string; id: string }[]): MDXTableOfContentsItem[] {
  const result: MDXTableOfContentsItem[] = []
  const stack: MDXTableOfContentsItem[] = []
  
  for (const heading of headings) {
    const item: MDXTableOfContentsItem = {
      id: heading.id,
      title: heading.title,
      level: heading.level,
      children: []
    }
    
    // Find the correct parent level
    while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
      stack.pop()
    }
    
    if (stack.length === 0) {
      result.push(item)
    } else {
      const parent = stack[stack.length - 1]
      if (!parent.children) {
        parent.children = []
      }
      parent.children.push(item)
    }
    
    stack.push(item)
  }
  
  return result
}

/**
 * Create URL-friendly slug from text
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Get MDX files by category
 */
export function getMDXFilesByCategory(directory: string, category: string): MDXContent[] {
  const files = getAllMDXFiles(directory)
  return files.filter(file => file.category === category)
}

/**
 * Get MDX files by level
 */
export function getMDXFilesByLevel(directory: string, level: string): MDXContent[] {
  const files = getAllMDXFiles(directory)
  return files.filter(file => file.level === level)
}

/**
 * Search MDX files by title or content
 */
export function searchMDXFiles(directory: string, query: string): MDXContent[] {
  const files = getAllMDXFiles(directory)
  const lowercaseQuery = query.toLowerCase()
  
  return files.filter(file => 
    file.title.toLowerCase().includes(lowercaseQuery) ||
    file.description?.toLowerCase().includes(lowercaseQuery) ||
    file.content.toLowerCase().includes(lowercaseQuery)
  )
}

/**
 * Get related MDX files based on category and level
 */
export function getRelatedMDXFiles(
  directory: string, 
  currentFile: MDXContent, 
  limit: number = 5
): MDXContent[] {
  const allFiles = getAllMDXFiles(directory)
  
  // Filter out current file
  const otherFiles = allFiles.filter(file => file.slug !== currentFile.slug)
  
  // Score files based on similarity
  const scoredFiles = otherFiles.map(file => {
    let score = 0
    
    // Same category gets higher score
    if (file.category === currentFile.category) score += 3
    
    // Same level gets medium score
    if (file.level === currentFile.level) score += 2
    
    // Same tags get small score
    const currentTags = currentFile.metadata.tags || []
    const fileTags = file.metadata.tags || []
    const commonTags = currentTags.filter((tag: string) => fileTags.includes(tag))
    score += commonTags.length * 0.5
    
    return { file, score }
  })
  
  // Sort by score and return top results
  return scoredFiles
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.file)
}
