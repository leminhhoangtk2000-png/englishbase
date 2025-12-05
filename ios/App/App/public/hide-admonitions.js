// Immediately hide admonition markers
(function() {
  function hideAdmonitionMarkers() {
    // Find all text nodes and paragraphs
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
      null,
      false
    )
    
    const nodesToHide = []
    
    while (walker.nextNode()) {
      const node = walker.currentNode
      
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim()
        if (text === ':::') {
          // Hide parent element if it only contains :::
          const parent = node.parentElement
          if (parent && parent.textContent?.trim() === ':::') {
            nodesToHide.push(parent)
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const text = node.textContent?.trim()
        if (text === ':::' && node.tagName === 'P') {
          nodesToHide.push(node)
        }
      }
    }
    
    // Hide identified nodes
    nodesToHide.forEach(node => {
      node.style.display = 'none'
      node.style.visibility = 'hidden'
      node.style.height = '0'
      node.style.margin = '0'
      node.style.padding = '0'
    })
  }
  
  // Run immediately if DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideAdmonitionMarkers)
  } else {
    hideAdmonitionMarkers()
  }
  
  // Also run after a delay
  setTimeout(hideAdmonitionMarkers, 100)
  setTimeout(hideAdmonitionMarkers, 500)
  setTimeout(hideAdmonitionMarkers, 1000)
})()
