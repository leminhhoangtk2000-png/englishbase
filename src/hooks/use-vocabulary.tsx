"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { GermanGender } from '@/lib/gender-utils';
import { useAuth } from '@/lib/auth-context';

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
  addToSaved: (word: VocabularyEntry) => Promise<void>;
  removeFromSaved: (wordId: string) => Promise<void>;
  isWordSaved: (wordId: string) => boolean;
  clearHistory: () => void;
  clearSaved: () => void;
  syncWithDatabase: () => Promise<void>;
  isSyncing: boolean;
}

const VocabularyContext = createContext<VocabularyContextType | undefined>(undefined);

const MAX_HISTORY_SIZE = 20;

export function VocabularyProvider({ children }: { children: React.ReactNode }) {
  const [searchHistory, setSearchHistory] = useState<VocabularyEntry[]>([]);
  const [savedVocabulary, setSavedVocabulary] = useState<VocabularyEntry[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const { user } = useAuth();

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

  // Sync with database when user logs in
  useEffect(() => {
    if (user) {
      syncWithDatabase();
    }
  }, [user]);

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

  const addToSaved = async (word: VocabularyEntry) => {
    // Optimistic update - add to local state immediately
    setSavedVocabulary(prev => {
      // Don't add if already exists
      if (prev.some(w => w.id === word.id)) {
        return prev;
      }
      // Add to beginning
      return [word, ...prev];
    });

    // If user is logged in, save to database
    if (user) {
      try {
        const response = await fetch('/api/user/vocabulary', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            vocabularyId: word.id,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to save to database');
        }

        console.log('✅ Vocabulary saved to database');
      } catch (error) {
        console.error('Error saving to database:', error);
        // Keep local state even if database save fails
        // Will retry on next sync
      }
    } else {
      console.log('📝 Vocabulary saved to localStorage only (not logged in)');
    }
  };

  const removeFromSaved = async (wordId: string) => {
    // Optimistic update - remove from local state immediately
    setSavedVocabulary(prev => prev.filter(w => w.id !== wordId));

    // If user is logged in, remove from database
    if (user) {
      try {
        const response = await fetch(`/api/user/vocabulary?vocabularyId=${wordId}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to remove from database');
        }

        console.log('✅ Vocabulary removed from database');
      } catch (error) {
        console.error('Error removing from database:', error);
        // Keep local state even if database delete fails
      }
    }
  };

  // Sync saved vocabulary with database
  const syncWithDatabase = async () => {
    if (!user) return;

    setIsSyncing(true);
    try {
      // Fetch saved vocabulary from database
      const response = await fetch('/api/user/vocabulary?limit=1000');
      
      if (!response.ok) {
        throw new Error('Failed to fetch from database');
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        // Merge database data with localStorage
        const dbVocabulary = result.data.map((item: any) => ({
          id: item.id,
          german: item.german,
          vietnamese: item.vietnamese,
          phonetic: item.phonetic,
          plural: item.plural,
          type: item.type,
          exampleGerman: item.exampleGerman,
          exampleVietnamese: item.exampleVietnamese,
          difficulty: item.difficulty,
          frequency: 0,
          tags: item.tags || [],
          level: item.level,
          topic: item.topic,
        }));

        // Get localStorage vocabulary
        const localStorageWords = localStorage.getItem('vocabulary-saved-words');
        let localVocabulary: VocabularyEntry[] = [];
        
        if (localStorageWords) {
          try {
            localVocabulary = JSON.parse(localStorageWords);
          } catch (error) {
            console.error('Error parsing localStorage:', error);
          }
        }

        // Merge: prioritize database, add unique local items
        const merged = [...dbVocabulary];
        const dbIds = new Set(dbVocabulary.map((v: VocabularyEntry) => v.id));
        
        // Add local items that are not in database
        for (const localWord of localVocabulary) {
          if (!dbIds.has(localWord.id)) {
            merged.push(localWord);
            // Save to database in background
            fetch('/api/user/vocabulary', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ vocabularyId: localWord.id }),
            }).catch(err => console.error('Error syncing local word:', err));
          }
        }

        setSavedVocabulary(merged);
        console.log(`✅ Synced ${merged.length} vocabulary items from database`);
      }
    } catch (error) {
      console.error('Error syncing with database:', error);
    } finally {
      setIsSyncing(false);
    }
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
      syncWithDatabase,
      isSyncing,
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
