import React from 'react';

/**
 * Format text with bold markdown syntax **text** to React elements
 * @param text - Text containing **bold** markers
 * @returns Array of React elements with formatted text
 */
export function formatBoldText(text: string): (string | React.ReactElement)[] {
  if (!text) return [text];
  
  const parts = text.split(/(\*\*[^*]+\*\*)/);
  
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      // Remove ** markers and make bold
      const boldText = part.slice(2, -2);
      return React.createElement(
        'strong',
        { 
          key: index, 
          className: 'font-semibold text-gray-900 dark:text-gray-100' 
        },
        boldText
      );
    }
    return part;
  });
}

/**
 * Format text with bold syntax for display in vocabulary cards
 */
export function formatVocabularyExample(text: string): (string | React.ReactElement)[] {
  return formatBoldText(text);
}
