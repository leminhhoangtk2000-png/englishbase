/**
 * Common German nouns with their correct gender
 * This helps improve gender detection accuracy
 */

import { GermanGender } from './gender-utils';

export const commonGermanNouns: Record<string, GermanGender> = {
  // Family
  'vater': 'der',
  'mutter': 'die', 
  'kind': 'das',
  'sohn': 'der',
  'tochter': 'die',
  'bruder': 'der',
  'schwester': 'die',
  'eltern': 'die', // plural

  // Animals
  'hund': 'der',
  'katze': 'die',
  'pferd': 'das',
  'vogel': 'der',
  'fisch': 'der',

  // Body parts
  'kopf': 'der',
  'hand': 'die',
  'fuß': 'der',
  'auge': 'das',
  'nase': 'die',
  'mund': 'der',
  'ohr': 'das',

  // Food & drinks
  'brot': 'das',
  'wasser': 'das',
  'milch': 'die',
  'kaffee': 'der',
  'tee': 'der',
  'bier': 'das',
  'wein': 'der',

  // Home & living
  'haus': 'das',
  'wohnung': 'die',
  'zimmer': 'das',
  'küche': 'die',
  'bad': 'das',
  'schlafzimmer': 'das',
  'wohnzimmer': 'das',
  'tisch': 'der',
  'stuhl': 'der',
  'bett': 'das',
  'sofa': 'das',
  'fenster': 'das',
  'tür': 'die',

  // Clothing
  'kleid': 'das',
  'hemd': 'das',
  'hose': 'die',
  'rock': 'der',
  'jacke': 'die',
  'mantel': 'der',
  'schuhe': 'die', // plural
  'socken': 'die', // plural

  // Colors
  'farbe': 'die',

  // Time
  'zeit': 'die',
  'tag': 'der',
  'nacht': 'die',
  'woche': 'die',
  'monat': 'der',
  'jahr': 'das',
  'stunde': 'die',
  'minute': 'die',

  // Work & school
  'arbeit': 'die',
  'beruf': 'der',
  'job': 'der',
  'schule': 'die',
  'universität': 'die',
  'lehrer': 'der',
  'lehrerin': 'die',
  'student': 'der',
  'studentin': 'die',
  'buch': 'das',

  // Transportation
  'auto': 'das',
  'bus': 'der',
  'zug': 'der',
  'flugzeug': 'das',
  'fahrrad': 'das',
  'straße': 'die',

  // Common words
  'mensch': 'der',
  'mann': 'der',
  'frau': 'die',
  'junge': 'der',
  'mädchen': 'das',
  'baby': 'das',
  'geld': 'das',
  'problem': 'das',
  'frage': 'die',
  'antwort': 'die',
  'telefon': 'das',
  'computer': 'der',
  'internet': 'das',
  'email': 'die',
  'musik': 'die',
  'film': 'der',
  'foto': 'das',
  'bild': 'das',
  'geschichte': 'die',
  'sprache': 'die',
  'wort': 'das',
  'satz': 'der',
  'seite': 'die',
  'nummer': 'die',
  'preis': 'der',
  'name': 'der'
};

/**
 * Get gender for a common German noun
 */
export function getCommonNounGender(word: string): GermanGender {
  const normalizedWord = word.toLowerCase().trim();
  return commonGermanNouns[normalizedWord] || null;
}
