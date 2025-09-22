/**
 * Simple preprocessor to transform admonition syntax to styled HTML
 * This converts :::note syntax to beautifully styled HTML divs
 */

export function preprocessAdmonitions(content: string): string {
  // Replace admonition blocks with styled HTML
  const admonitionRegex = /:::(\w+)(?:\[([^\]]+)\])?\s*\n([\s\S]*?)\n:::/g
  
  return content.replace(admonitionRegex, (match, type, title, innerContent) => {
    const cleanContent = innerContent.trim()
    
    // Define admonition configs
    const configs = {
      note: { emoji: '💡', defaultTitle: 'Ghi chú', className: 'admonition-note' },
      tip: { emoji: '✅', defaultTitle: 'Mẹo hay', className: 'admonition-tip' },
      warning: { emoji: '⚠️', defaultTitle: 'Cảnh báo', className: 'admonition-warning' },
      info: { emoji: 'ℹ️', defaultTitle: 'Thông tin', className: 'admonition-info' },
      caution: { emoji: '🚨', defaultTitle: 'Lưu ý', className: 'admonition-caution' },
      danger: { emoji: '⚡', defaultTitle: 'Nguy hiểm', className: 'admonition-danger' }
    }
    
    const config = configs[type as keyof typeof configs] || configs.note
    const displayTitle = title || config.defaultTitle
    
    return `
<div class="admonition ${config.className}" style="display: block !important; visibility: visible !important; opacity: 1 !important;">
  <div class="admonition-header" style="display: flex !important; visibility: visible !important;">
    <span class="admonition-icon" style="display: inline-block !important;">${config.emoji}</span>
    <span class="admonition-title" style="display: inline-block !important;">${displayTitle}</span>
  </div>
  <div class="admonition-content" style="display: block !important; visibility: visible !important;">

${cleanContent}

  </div>
</div>
    `.trim()
  })
}

export default preprocessAdmonitions
