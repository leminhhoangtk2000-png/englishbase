'use client';

import { useEffect } from 'react';

export function ExerciseMetadataHider() {
  useEffect(() => {
    // Hide any paragraph that contains metadata
    const hideMetadata = () => {
      const paragraphs = document.querySelectorAll('.exercise-content .prose p');
      paragraphs.forEach(p => {
        const text = p.textContent || '';
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
          text.includes('publish:')
        ) {
          (p as HTMLElement).style.display = 'none';
        }
      });
    };

    // Run immediately and after a short delay
    hideMetadata();
    setTimeout(hideMetadata, 100);
  }, []);

  return null;
}
