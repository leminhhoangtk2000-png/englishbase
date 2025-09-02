export interface VocabularyEntry {
  id: string;
  word: string;
  pronunciation?: string;
  partOfSpeech: string; // noun, verb, adjective, etc.
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  definitions: {
    german: string;
    vietnamese: string;
    english?: string;
  };
  examples: {
    german: string;
    vietnamese: string;
  }[];
  synonyms?: string[];
  antonyms?: string[];
  relatedWords?: string[];
  createdAt: string;
  updatedAt: string;
  source: 'database' | 'ai' | 'manual';
}

export interface VocabularySearchResult {
  found: boolean;
  entry?: VocabularyEntry;
  suggestions?: string[];
}
