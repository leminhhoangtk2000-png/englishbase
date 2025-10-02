'use client';

import { useEffect } from 'react';

interface DebugParserProps {
  content: string;
}

export function DebugParser({ content }: DebugParserProps) {
  useEffect(() => {
    console.log('[DebugParser] Content length:', content.length);
    console.log('[DebugParser] Has FormingQuestions:', content.includes('<FormingQuestions'));
    
    const formingQuestionsRegex = /<FormingQuestions\s+([\s\S]*?)(?:\s*\/>|>\s*<\/FormingQuestions>)/g;
    const matches = Array.from(content.matchAll(formingQuestionsRegex));
    console.log('[DebugParser] Number of matches:', matches.length);
    
    matches.forEach((match, index) => {
      console.log(`[DebugParser] Match ${index}:`, match[0].substring(0, 200));
      console.log(`[DebugParser] Props ${index}:`, match[1].substring(0, 200));
    });
  }, [content]);

  return <div>Debug parser active - check console</div>;
}
