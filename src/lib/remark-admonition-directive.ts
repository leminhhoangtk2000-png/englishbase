import { visit } from 'unist-util-visit'
import { Node } from 'unist'

export function remarkAdmonitionDirective() {
  return (tree: Node) => {
    visit(tree, (node: any, index: number | undefined, parent: any) => {
      if (!parent || typeof index !== 'number') return

      // Chỉ xử lý directive nodes
      if (!['containerDirective', 'leafDirective', 'textDirective'].includes(node.type)) {
        return
      }

      const { name, children = [] } = node
      const admonitionTypes = ['note', 'tip', 'warning', 'info', 'caution', 'danger']

      if (!admonitionTypes.includes(name)) return

      // Default title
      let title = getDefaultTitle(name)

      // Override nếu có custom title
      if (node.attributes?.title) {
        title = node.attributes.title
      } else if (node.label) {
        title = node.label
      }

      // Luôn giữ nguyên children (ko xoá dòng đầu nữa)
      const contentChildren = Array.isArray(children) ? children : []

      // New node
      const newNode = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['admonition', `admonition-${name}`]
        },
        children: [
          {
            type: 'element',
            tagName: 'div',
            properties: { className: ['admonition-header'] },
            children: [
              {
                type: 'element',
                tagName: 'span',
                properties: { className: ['admonition-icon'] },
                children: [{ type: 'text', value: getAdmonitionIcon(name) }]
              },
              {
                type: 'element',
                tagName: 'span',
                properties: { className: ['admonition-title'] },
                children: [{ type: 'text', value: title }]
              }
            ]
          },
          {
            type: 'element',
            tagName: 'div',
            properties: { className: ['admonition-content'] },
            children: contentChildren
          }
        ]
      }

      // Ghi đè node gốc => xoá triệt để ::: 
      parent.children[index] = newNode
    })
  }
}

function getAdmonitionIcon(type: string): string {
  const icons = {
    note: '💡',
    tip: '✨',
    warning: '⚠️',
    info: 'ℹ️',
    caution: '⚠️',
    danger: '🚨'
  }
  return icons[type as keyof typeof icons] || 'ℹ️'
}

function getDefaultTitle(type: string): string {
  const titles = {
    note: 'Ghi chú',
    tip: 'Mẹo',
    warning: 'Cảnh báo',
    info: 'Thông tin',
    caution: 'Thận trọng',
    danger: 'Nguy hiểm'
  }
  return titles[type as keyof typeof titles] || 'Ghi chú'
}
