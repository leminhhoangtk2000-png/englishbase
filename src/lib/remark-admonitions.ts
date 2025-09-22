import { visit } from 'unist-util-visit'
import { Node } from 'unist'

interface AdmonitionNode extends Node {
  type: 'containerDirective'
  name: string
  attributes?: { [key: string]: string }
  children: Node[]
  data?: {
    hName?: string
    hProperties?: { [key: string]: any }
    hChildren?: any[]
  }
}

interface TextNode extends Node {
  type: 'text'
  value: string
}

export function remarkAdmonitions() {
  return (tree: Node) => {
    visit(tree, 'containerDirective', (node: AdmonitionNode, index, parent) => {
      const { name, attributes = {}, children } = node
      
      // Check if this is an admonition type
      const admonitionTypes = ['note', 'tip', 'warning', 'info', 'caution', 'danger']
      if (!admonitionTypes.includes(name)) {
        return
      }

      // Extract title from attributes or first parameter
      let title = attributes.title || ''
      
      // If no title in attributes, check if there's a title in square brackets
      // This is handled by remark-directive automatically
      
      // Transform the node to a JSX element
      const componentName = name.charAt(0).toUpperCase() + name.slice(1)
      
      // Create the replacement node
      const replacementNode = {
        type: 'mdxJsxFlowElement',
        name: componentName,
        attributes: title ? [
          {
            type: 'mdxJsxAttribute',
            name: 'title',
            value: title
          }
        ] : [],
        children: children,
        data: {
          _mdxExplicitJsx: true
        }
      }

      // Replace the node
      if (parent && typeof index === 'number') {
        parent.children[index] = replacementNode
      }
    })
  }
}
