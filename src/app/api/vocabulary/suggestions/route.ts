import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Simple Levenshtein distance function
function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));
  
  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }
  
  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }
  
  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[j][i] = matrix[j - 1][i - 1];
      } else {
        matrix[j][i] = Math.min(
          matrix[j - 1][i] + 1, // deletion
          matrix[j][i - 1] + 1, // insertion
          matrix[j - 1][i - 1] + 1 // substitution
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

// Calculate similarity score (0-1, where 1 is identical)
function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) {
    return 1.0;
  }
  
  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '5')
    
    if (!query || typeof query !== 'string' || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required and must be at least 2 characters' },
        { status: 400 }
      )
    }
    
    const searchTerm = query.trim().toLowerCase()
    
    // Get all vocabulary entries
    const allEntries = await prisma.vocabularyEntry.findMany({
      select: {
        id: true,
        german: true,
        vietnamese: true,
        phonetic: true,
        type: true,
        level: {
          select: {
            name: true,
            displayName: true
          }
        },
        topic: {
          select: {
            name: true,
            displayName: true
          }
        }
      }
    })
    
    // Calculate similarity scores
    const suggestions = allEntries.map(entry => {
      const germanSimilarity = calculateSimilarity(searchTerm, entry.german.toLowerCase())
      const vietnameseSimilarity = calculateSimilarity(searchTerm, entry.vietnamese.toLowerCase())
      
      // Use the higher similarity score
      const maxSimilarity = Math.max(germanSimilarity, vietnameseSimilarity)
      
      return {
        ...entry,
        similarity: maxSimilarity,
        matchType: germanSimilarity > vietnameseSimilarity ? 'german' : 'vietnamese'
      }
    })
    .filter(entry => entry.similarity > 0.4) // Only show suggestions with >40% similarity
    .sort((a, b) => b.similarity - a.similarity) // Sort by similarity descending
    .slice(0, limit)
    
    return NextResponse.json({
      success: true,
      data: suggestions,
      query: searchTerm,
      total: suggestions.length
    })
    
  } catch (error) {
    console.error('Suggestions API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
