'use client'

import { useEffect } from 'react'

export function AdmonitionCleaner() {
  useEffect(() => {
    // Function to hide raw admonition syntax
    const hideRawAdmonitions = () => {
      // Find all paragraphs in prose sections
      const paragraphs = document.querySelectorAll('.prose p')
      
      paragraphs.forEach((p) => {
        const text = p.textContent?.trim() || ''
        
        // Hide paragraphs that contain admonition syntax
        if (
          // Opening admonition tags
          text === ':::' || 
          text.startsWith(':::note') || 
          text.startsWith(':::tip') || 
          text.startsWith(':::warning') || 
          text.startsWith(':::info') || 
          text.startsWith(':::caution') || 
          text.startsWith(':::danger') ||
          // Closing admonition tags
          text === ':::' ||
          text.match(/^:::\s*$/) ||
          // Any standalone ::: (opening or closing)
          text.match(/^:::\w*(\[.*\])?\s*$/)
        ) {
          // Add class to hide via CSS
          p.classList.add('hidden-admonition')
          
          // Also hide directly for immediate effect
          ;(p as HTMLElement).style.display = 'none'
        }
      })

      // Also check for any remaining text nodes that contain only :::
      const allElements = document.querySelectorAll('.prose *')
      allElements.forEach((el) => {
        const text = el.textContent?.trim()
        if (text === ':::' && el.children.length === 0) {
          ;(el as HTMLElement).style.display = 'none'
        }
      })
    }

    // Run immediately
    hideRawAdmonitions()

    // Run multiple times to catch all cases
    const timer1 = setTimeout(hideRawAdmonitions, 100)
    const timer2 = setTimeout(hideRawAdmonitions, 500)
    const timer3 = setTimeout(hideRawAdmonitions, 1000)

    // Also run when content changes (for dynamic content)
    const observer = new MutationObserver((mutations) => {
      let shouldUpdate = false
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldUpdate = true
        }
      })
      if (shouldUpdate) {
        setTimeout(hideRawAdmonitions, 50)
      }
    })

    observer.observe(document.body, {
      childList: true,
      subtree: true
    })

    // Cleanup
    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
      clearTimeout(timer3)
      observer.disconnect()
    }
  }, [])

  return null // This component doesn't render anything
}
