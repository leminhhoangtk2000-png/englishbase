"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { GermanGender } from '@/lib/gender-utils';

export interface VocabularyEntry {
  id: string;
  german: string;
  vietnamese: string;
  phonetic?: string;
  plural?: string;
  type: string;
  gender?: GermanGender;
  exampleGerman?: string;
  exampleVietnamese?: string;
  difficulty: number;
  frequency: number;
  tags: string[];
  level: {
    id: string;
    name: string;
    displayName: string;
  };
  topic: {
    id: string;
    name: string;
    displayName: string;
    slug: string;
  };
}

interface VocabularyContextType {
  searchHistory: VocabularyEntry[];
  savedVocabulary: VocabularyEntry[];
  addToHistory: (word: VocabularyEntry) => void;
  addToSaved: (word: VocabularyEntry) => void;
  removeFromSaved: (wordId: string) => void;
  isWordSaved: (wordId: string) => boolean;
  clearHistory: () => void;
  clearSaved: () => void;
}

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

const MAX_HISTORY_SIZE = 20;

export function VocabularyProvider({ children }: { children: React.ReactNode }) {
  const [searchHistory, setSearchHistory] = useState<VocabularyEntry[]>([]);
  const [savedVocabulary, setSavedVocabulary] = useState<VocabularyEntry[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('vocabulary-search-history');
    const savedWords = localStorage.getItem('vocabulary-saved-words');
    
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Error loading search history:', error);
      }
    }
    
    if (savedWords) {
      try {
        setSavedVocabulary(JSON.parse(savedWords));
      } catch (error) {
        console.error('Error loading saved vocabulary:', error);
      }
    }
  }, []);

  // Save search history to localStorage
  useEffect(() => {
    console.log('Saving search history to localStorage:', searchHistory); // Debug log
    localStorage.setItem('vocabulary-search-history', JSON.stringify(searchHistory));
  }, [searchHistory]);

  // Save vocabulary to localStorage
  useEffect(() => {
    localStorage.setItem('vocabulary-saved-words', JSON.stringify(savedVocabulary));
  }, [savedVocabulary]);

  const addToHistory = (word: VocabularyEntry) => {
    console.log('addToHistory called with:', word); // Debug log
    setSearchHistory(prev => {
      // Remove if already exists
      const filtered = prev.filter(w => w.id !== word.id);
      // Add to beginning
      const newHistory = [word, ...filtered];
      // Keep only last MAX_HISTORY_SIZE items
      const result = newHistory.slice(0, MAX_HISTORY_SIZE);
      console.log('New search history:', result); // Debug log
      return result;
    });
  };

  const addToSaved = (word: VocabularyEntry) => {
    setSavedVocabulary(prev => {
      // Don't add if already exists
      if (prev.some(w => w.id === word.id)) {
        return prev;
      }
      // Add to beginning
      return [word, ...prev];
    });
  };

  const removeFromSaved = (wordId: string) => {
    setSavedVocabulary(prev => prev.filter(w => w.id !== wordId));
  };

  const isWordSaved = (wordId: string): boolean => {
    return savedVocabulary.some(w => w.id === wordId);
  };

  const clearHistory = () => {
    setSearchHistory([]);
  };

  const clearSaved = () => {
    setSavedVocabulary([]);
  };

  return (
    <VocabularyContext.Provider value={{
      searchHistory,
      savedVocabulary,
      addToHistory,
      addToSaved,
      removeFromSaved,
      isWordSaved,
      clearHistory,
      clearSaved,
    }}>
      {children}
    </VocabularyContext.Provider>
  );
}

export function useVocabulary() {
  const context = useContext(VocabularyContext);
  if (context === undefined) {
    throw new Error('useVocabulary must be used within a VocabularyProvider');
  }
  return context;
}
