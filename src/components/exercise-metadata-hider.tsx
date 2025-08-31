'use client';

import { useEffect } from 'react';

export function ExerciseMetadataHider() {
  useEffect(() => {
    // Hide any paragraph that contains metadata
    const hideMetadata = () => {
      // Target all paragraphs in the exercise content
      const selectors = [
        '.exercise-content p',
        '.prose p',
        'article p',
        '[data-mdx-content] p'
      ];
      
      selectors.forEach(selector => {
        const paragraphs = document.querySelectorAll(selector);
        paragraphs.forEach(p => {
          const text = p.textContent || '';
          // Check if paragraph contains metadata fields
          if (
            text.includes('title:') ||
            text.includes('level:') ||
            text.includes('skill:') ||
            text.includes('difficulty:') ||
            text.includes('duration:') ||
            text.includes('image:') ||
            text.includes('description:') ||
            text.includes('tags:') ||
            text.includes('author:') ||
            text.includes('publish:') ||
            // Also check for the exact pattern from the screenshot
            text.match(/^title:.*level:.*skill:.*difficulty:/) ||
            text.match(/^duration:.*image:.*description:/) ||
            text.match(/^tags:.*author:.*publish:/)
          ) {
            (p as HTMLElement).style.display = 'none !important';
          }
        });
      });
    };

    // Run multiple times to catch dynamically loaded content
    hideMetadata();
    setTimeout(hideMetadata, 50);
    setTimeout(hideMetadata, 100);
    setTimeout(hideMetadata, 200);
    setTimeout(hideMetadata, 500);
    
    // Also run on DOM mutations
    const observer = new MutationObserver(hideMetadata);
    observer.observe(document.body, { 
      childList: true, 
      subtree: true 
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
