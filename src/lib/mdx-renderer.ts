import { serialize } from 'next-mdx-remote/serialize'
import { MDXRemoteSerializeResult } from 'next-mdx-remote'
import remarkDirective from 'remark-directive'
import { remarkAdmonitionDirective } from './remark-admonition-directive'
import remarkGfm from 'remark-gfm'
import remarkMath from 'remark-math'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeKatex from 'rehype-katex'

/**
 * Render MDX content to serialized format for next-mdx-remote
 */
export async function renderMDX(content: string): Promise<MDXRemoteSerializeResult> {
  try {
    const serialized = await serialize(content, {
      mdxOptions: {
        remarkPlugins: [
          remarkDirective,
          remarkAdmonitionDirective,
          remarkGfm,
          remarkMath,
        ],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeAutolinkHeadings,
            {
              behavior: 'wrap',
              properties: {
                className: ['anchor-link'],
                ariaLabel: 'Link to this section',
              },
            },
          ],
          rehypeKatex,
        ],
        development: process.env.NODE_ENV === 'development',
      },
      parseFrontmatter: true,
    })

    return serialized
  } catch (error) {
    console.error('Error rendering MDX:', error)
    throw error
  }
}

/**
 * Check if file is MDX based on extension
 */
export function isMDXFile(filePath: string): boolean {
  return filePath.endsWith('.mdx')
}
