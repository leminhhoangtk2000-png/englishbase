/**
 * Simple preprocessor to transform admonition syntax to styled HTML
 * This converts :::note syntax to beautifully styled HTML divs
 */

export function preprocessAdmonitions(content: string): string {
  // Replace admonition blocks with styled HTML  
  // Updated regex to handle lists and various content types better
  const admonitionRegex = /:::(\w+)(?:\[([^\]]+)\])?\s*\n([\s\S]*?)(?=\n:::|\n$|$)/g
  
  return content.replace(admonitionRegex, (match, type, title, innerContent) => {
    // Clean content while preserving structure for lists and other markdown
    let cleanContent = innerContent.replace(/^\n+/, '') // Remove leading newlines only
    cleanContent = cleanContent.replace(/\n+$/, '') // Remove trailing newlines only
    
    // Ensure list items are properly spaced for markdown parsing
    cleanContent = cleanContent.replace(/^(-|\*|\+|\d+\.)\s/gm, '$1 ')
    
    // Add extra spacing for better list parsing if content starts with list
    if (cleanContent.match(/^(-|\*|\+|\d+\.)\s/)) {
      cleanContent = '\n' + cleanContent
    }
    
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
