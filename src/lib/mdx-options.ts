// MDX configuration with remark and rehype plugins
import remarkDirective from 'remark-directive'
import { remarkAdmonitionDirective } from './remark-admonition-directive'

export const mdxOptions = {
  remarkPlugins: [
    remarkDirective,
    remarkAdmonitionDirective
  ],
  rehypePlugins: []
}

export default mdxOptions
