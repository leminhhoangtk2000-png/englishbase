// MDX configuration with remark and rehype plugins
import remarkAdmonitions from 'remark-admonitions'
import remarkDirective from 'remark-directive'
import rehypeRaw from 'rehype-raw'

export const mdxOptions = {
  remarkPlugins: [
    remarkDirective,
    [remarkAdmonitions, {
      tag: ':::',
      icons: 'emoji',
      infima: true
    }]
  ],
  rehypePlugins: [
    rehypeRaw
  ]
}

export default mdxOptions
