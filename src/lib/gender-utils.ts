/**
 * Utility functions for handling German noun genders
 */

import { getCommonNounGender } from './common-nouns';

export type GermanGender = 'der' | 'die' | 'das' | null;

/**
 * Extract gender from German word string (e.g., "der Hund" -> "der")
 */
export function extractGender(germanWord: string): GermanGender {
  if (!germanWord) return null;
  
  const trimmed = germanWord.trim().toLowerCase();
  
  if (trimmed.startsWith('der ')) return 'der';
  if (trimmed.startsWith('die ')) return 'die';
  if (trimmed.startsWith('das ')) return 'das';
  
  return null;
}

/**
 * Extract noun without article (e.g., "der Hund" -> "Hund")
 */
export function extractNounWithoutArticle(germanWord: string): string {
  if (!germanWord) return germanWord;
  
  const trimmed = germanWord.trim();
  
  // Check if it starts with an article
  if (/^(der|die|das)\s+/i.test(trimmed)) {
    return trimmed.replace(/^(der|die|das)\s+/i, '');
  }
  
  return trimmed;
}

/**
 * Add gender to a German noun if it's missing
 */
export function addGenderToNoun(germanWord: string, suggestedGender?: GermanGender): string {
  if (!germanWord) return germanWord;
  
  const trimmed = germanWord.trim();
  
  // If already has article, return as is
  if (/^(der|die|das)\s+/i.test(trimmed)) {
    return trimmed;
  }
  
  // If suggested gender provided, use it
  if (suggestedGender) {
    return `${suggestedGender} ${trimmed}`;
  }
  
  // First try to lookup in common nouns
  const nounWithoutArticle = extractNounWithoutArticle(trimmed);
  const commonGender = getCommonNounGender(nounWithoutArticle);
  if (commonGender) {
    return `${commonGender} ${trimmed}`;
  }
  
  // Try to guess gender based on word endings (basic rules)
  const word = trimmed.toLowerCase();
  
  // Common feminine endings
  if (word.endsWith('ung') || word.endsWith('heit') || word.endsWith('keit') || 
      word.endsWith('schaft') || word.endsWith('ion') || word.endsWith('ie')) {
    return `die ${trimmed}`;
  }
  
  // Common masculine endings
  if (word.endsWith('er') || word.endsWith('en') || word.endsWith('ig') || 
      word.endsWith('ich') || word.endsWith('ling')) {
    return `der ${trimmed}`;
  }
  
  // Common neuter endings
  if (word.endsWith('chen') || word.endsWith('lein') || word.endsWith('ment') ||
      word.endsWith('um') || word.endsWith('tum')) {
    return `das ${trimmed}`;
  }
  
  // Default to der for unknown nouns (most common)
  return `der ${trimmed}`;
}

/**
 * Check if a word type is a noun
 */
export function isNoun(wordType: string): boolean {
  const normalizedType = wordType.toLowerCase().trim();
  return ['nomen', 'noun', 'substantiv'].includes(normalizedType);
}

/**
 * Format gender display (e.g., "der" -> "m", "die" -> "f", "das" -> "n")
 */
export function formatGenderDisplay(gender: GermanGender): string {
  switch (gender) {
    case 'der': return 'm';
    case 'die': return 'f';
    case 'das': return 'n';
    default: return '';
  }
}

/**
 * Get gender color for UI display
 */
export function getGenderColor(gender: GermanGender): string {
  switch (gender) {
    case 'der': return 'text-blue-600 bg-blue-50';
    case 'die': return 'text-red-600 bg-red-50';
    case 'das': return 'text-green-600 bg-green-50';
    default: return 'text-gray-600 bg-gray-50';
  }
}
