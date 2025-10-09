'use client';

import { useState, useCallback } from 'react';
import { VocabularyEntry, VocabularySearchResult } from '@/types/vocabulary';

// Mock vocabulary database
const mockVocabularyDatabase: VocabularyEntry[] = [
  {
    id: '1',
    word: 'Energiepolitik',
    pronunciation: 'eˈnɛʁɡiːpoliˌtiːk',
    partOfSpeech: 'noun',
    level: 'B2',
    definitions: {
      german: 'die politischen Maßnahmen und Strategien eines Staates zur Energieversorgung',
      vietnamese: 'chính sách năng lượng, các biện pháp và chiến lược chính trị của một quốc gia về cung cấp năng lượng',
      english: 'energy policy, political measures and strategies of a state for energy supply'
    },
    examples: [
      {
        german: 'Die neue Energiepolitik setzt auf erneuerbare Energien.',
        vietnamese: 'Chính sách năng lượng mới tập trung vào năng lượng tái tạo.'
      },
      {
        german: 'Deutschland reformiert seine Energiepolitik.',
        vietnamese: 'Đức đang cải cách chính sách năng lượng của mình.'
      }
    ],
    synonyms: ['Energiestrategie', 'Energieplanung'],
    relatedWords: ['Energie', 'Politik', 'erneuerbar', 'nachhaltig'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    source: 'database'
  },
  // A1 Vocabulary from Start auf Deutsch
  {
    id: '3',
    word: 'der Name',
    pronunciation: 'ˈnaːmə',
    partOfSpeech: 'noun',
    level: 'A1',
    definitions: {
      german: 'Bezeichnung einer Person oder Sache',
      vietnamese: 'Tên',
      english: 'name'
    },
    examples: [
      {
        german: 'Wie ist dein Name?',
        vietnamese: 'Tên của bạn là gì?'
      }
    ],
    synonyms: ['Bezeichnung'],
    relatedWords: ['Vorname', 'Nachname'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    source: 'database'
  },
  {
    id: '4',
    word: 'der Vorname',
    pronunciation: 'ˈfoːɐ̯ˌnaːmə',
    partOfSpeech: 'noun',
    level: 'A1',
    definitions: {
      german: 'der erste Name einer Person',
      vietnamese: 'Tên riêng',
      english: 'first name'
    },
    examples: [
      {
        german: 'Mein Vorname ist Anna.',
        vietnamese: 'Tên riêng của tôi là Anna.'
      }
    ],
    synonyms: ['Rufname'],
    relatedWords: ['Name', 'Nachname'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    source: 'database'
  },
  {
    id: '5',
    word: 'der Nachname',
    pronunciation: 'ˈnaːxˌnaːmə',
    partOfSpeech: 'noun',
    level: 'A1',
    definitions: {
      german: 'Familienname einer Person',
      vietnamese: 'Họ',
      english: 'last name, surname'
    },
    examples: [
      {
        german: 'Mein Nachname ist Müller.',
        vietnamese: 'Họ của tôi là Müller.'
      }
    ],
    synonyms: ['Familienname'],
    relatedWords: ['Name', 'Vorname'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    source: 'database'
  },
  {
    id: '6',
    word: 'die Herkunft',
    pronunciation: 'ˈhɛʁkʊnft',
    partOfSpeech: 'noun',
    level: 'A1',
    definitions: {
      german: 'der Ort oder das Land, aus dem jemand stammt',
      vietnamese: 'Quê quán',
      english: 'origin, background'
    },
    examples: [
      {
        german: 'Meine Herkunft ist Vietnam.',
        vietnamese: 'Quê quán của tôi là Việt Nam.'
      }
    ],
    synonyms: ['Abstammung', 'Ursprung'],
    relatedWords: ['Land', 'Heimat'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    source: 'database'
  },
  {
    id: '7',
    word: 'vorstellen',
    pronunciation: 'ˈfoːɐ̯ˌʃtɛlən',
    partOfSpeech: 'verb',
    level: 'A1',
    definitions: {
      german: 'sich oder jemand anderen bekannt machen',
      vietnamese: 'Giới thiệu bản thân',
      english: 'to introduce'
    },
    examples: [
      {
        german: 'Ich stelle mich vor: Ich heiße Peter.',
        vietnamese: 'Tôi tự giới thiệu: Tôi tên là Peter.'
      }
    ],
    synonyms: ['präsentieren'],
    relatedWords: ['Name', 'kennenlernen'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    source: 'database'
  },
  {
    id: '8',
    word: 'fragen',
    pronunciation: 'ˈfʁaːɡn̩',
    partOfSpeech: 'verb',
    level: 'A1',
    definitions: {
      german: 'eine Frage stellen',
      vietnamese: 'Hỏi',
      english: 'to ask'
    },
    examples: [
      {
        german: 'Darf ich etwas fragen?',
        vietnamese: 'Tôi có thể hỏi điều gì không?'
      }
    ],
    synonyms: ['erfragen'],
    relatedWords: ['Frage', 'antworten'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    source: 'database'
  },
  {
    id: '9',
    word: 'das Deutsch',
    pronunciation: 'dɔɪ̯tʃ',
    partOfSpeech: 'noun',
    level: 'A1',
    definitions: {
      german: 'die deutsche Sprache',
      vietnamese: 'Tiếng Đức',
      english: 'German language'
    },
    examples: [
      {
        german: 'Ich lerne Deutsch.',
        vietnamese: 'Tôi học tiếng Đức.'
      }
    ],
    synonyms: ['deutsche Sprache'],
    relatedWords: ['Sprache', 'lernen'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    source: 'database'
  },
  {
    id: '10',
    word: 'verstehen',
    pronunciation: 'fɛɐ̯ˈʃteːən',
    partOfSpeech: 'verb',
    level: 'A1',
    definitions: {
      german: 'den Sinn erfassen, begreifen',
      vietnamese: 'Hiểu',
      english: 'to understand'
    },
    examples: [
      {
        german: 'Ich verstehe das Wort nicht.',
        vietnamese: 'Tôi không hiểu từ này.'
      }
    ],
    synonyms: ['begreifen', 'erfassen'],
    relatedWords: ['lernen', 'wissen'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    source: 'database'
  },
  {
    id: '11',
    word: 'lernen',
    pronunciation: 'ˈlɛʁnən',
    partOfSpeech: 'verb',
    level: 'A1',
    definitions: {
      german: 'Wissen oder Fähigkeiten erwerben',
      vietnamese: 'Học',
      english: 'to learn'
    },
    examples: [
      {
        german: 'Ich lerne jeden Tag Deutsch.',
        vietnamese: 'Tôi học tiếng Đức mỗi ngày.'
      }
    ],
    synonyms: ['studieren', 'sich aneignen'],
    relatedWords: ['verstehen', 'Schule'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    source: 'database'
  },
  {
    id: '2',
    word: 'nachhaltig',
    pronunciation: 'ˈnaːxhaltɪç',
    partOfSpeech: 'adjective',
    level: 'B1',
    definitions: {
      german: 'so beschaffen, dass es für eine längere Zeit aufrechterhalten werden kann',
      vietnamese: 'bền vững, có thể duy trì trong thời gian dài',
      english: 'sustainable, able to be maintained for a long time'
    },
    examples: [
      {
        german: 'Nachhaltige Entwicklung ist wichtig für die Zukunft.',
        vietnamese: 'Phát triển bền vững là quan trọng cho tương lai.'
      }
    ],
    synonyms: ['dauerhaft', 'beständig'],
    antonyms: ['kurzfristig', 'vergänglich'],
    relatedWords: ['Nachhaltigkeit', 'Umwelt', 'Zukunft'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    source: 'database'
  }
];

export function useVocabularySearch() {
  const [isLoading, setIsLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const searchWord = useCallback(async (word: string): Promise<VocabularySearchResult> => {
    if (!word.trim()) {
      return { found: false, suggestions: [] };
    }

    setIsLoading(true);

    try {
      // First, search in real database via AI search API
      const realSearchResponse = await fetch('/api/vocabulary/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ word: word.trim() }),
      });

      if (realSearchResponse.ok) {
        const realSearchResult = await realSearchResponse.json();
        if (realSearchResult.success && realSearchResult.data) {
          // Add to search history
          setSearchHistory(prev => {
            const newHistory = [word, ...prev.filter(h => h !== word)].slice(0, 10);
            return newHistory;
          });

          return { found: true, entry: realSearchResult.data };
        }
      }

      // Fallback: search in local mock database
      const normalizedWord = word.toLowerCase().trim();
      const found = mockVocabularyDatabase.find(
        entry => entry.word.toLowerCase() === normalizedWord
      );

      if (found) {
        // Add to search history
        setSearchHistory(prev => {
          const newHistory = [word, ...prev.filter(h => h !== word)].slice(0, 10);
          return newHistory;
        });

        return { found: true, entry: found };
      }

      // If not found, try AI Management system
      try {
        // Get active AI provider from AI Management system
        const providersResponse = await fetch('/api/admin/ai-providers');
        const providersData = await providersResponse.json();
        const activeProvider = providersData.providers?.find((p: any) => p.isActive);
        
        if (!activeProvider) {
          throw new Error('No active AI provider available');
        }

        // Call the AI provider test endpoint for vocabulary definition
        const aiResponse = await fetch(`/api/admin/ai-providers/${activeProvider.id}/test`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            testPrompt: `Provide a German-Vietnamese vocabulary definition for the word "${word}". Include:
1. Word: ${word}
2. Part of speech (e.g., Nomen, Verb, Adjektiv)
3. German definition
4. Vietnamese translation
5. German example sentence
6. Vietnamese translation of example
7. IPA pronunciation

Format as JSON with keys: word, partOfSpeech, definition, vietnamese, germanExample, vietnameseExample, pronunciation`
          }),
        });

        if (aiResponse.ok) {
          const aiResult = await aiResponse.json();
          if (aiResult.success && aiResult.result?.response) {
            try {
              // Try to parse AI response as JSON
              let responseText = aiResult.result.response;
              
              // Clean up markdown code blocks if present
              if (responseText.includes('```json')) {
                responseText = responseText.replace(/```json\s*/g, '').replace(/```\s*$/g, '');
              }
              if (responseText.includes('```')) {
                responseText = responseText.replace(/```\s*/g, '');
              }
              
              const parsedResponse = JSON.parse(responseText.trim());
              
              const aiGeneratedEntry: VocabularyEntry = {
                id: Date.now().toString(),
                word: parsedResponse.word || word,
                pronunciation: parsedResponse.pronunciation || `/${word.toLowerCase()}/`,
                partOfSpeech: parsedResponse.partOfSpeech || 'noun',
                level: 'B1',
                definitions: {
                  german: parsedResponse.definition || `Definition für "${word}" (AI-generiert)`,
                  vietnamese: parsedResponse.vietnamese || `Định nghĩa cho từ "${word}" (được tạo bởi AI)`,
                  english: `Definition for "${word}" (AI-generated)`
                },
                examples: [
                  {
                    german: parsedResponse.germanExample || `Beispiel: "${word}" wird oft verwendet.`,
                    vietnamese: parsedResponse.vietnameseExample || `Ví dụ: "${word}" thường được sử dụng.`
                  }
                ],
                synonyms: [],
                antonyms: [],
                relatedWords: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                source: 'ai'
              };

              // Add AI generated entry to local database
              mockVocabularyDatabase.push(aiGeneratedEntry);
              
              // Add to search history
              setSearchHistory(prev => {
                const newHistory = [word, ...prev.filter(h => h !== word)].slice(0, 10);
                return newHistory;
              });

              return { found: true, entry: aiGeneratedEntry };
            } catch (parseError) {
              console.error('Error parsing AI response:', parseError);
              // If parsing fails, use raw response
              const aiGeneratedEntry: VocabularyEntry = {
                id: Date.now().toString(),
                word: word,
                pronunciation: `/${word.toLowerCase()}/`,
                partOfSpeech: 'noun',
                level: 'B1',
                definitions: {
                  german: aiResult.result.response,
                  vietnamese: `Định nghĩa AI: ${aiResult.result.response}`,
                  english: `AI Definition: ${aiResult.result.response}`
                },
                examples: [
                  {
                    german: `Beispiel: "${word}" wird oft verwendet.`,
                    vietnamese: `Ví dụ: "${word}" thường được sử dụng.`
                  }
                ],
                synonyms: [],
                antonyms: [],
                relatedWords: [],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                source: 'ai'
              };

              mockVocabularyDatabase.push(aiGeneratedEntry);
              
              setSearchHistory(prev => {
                const newHistory = [word, ...prev.filter(h => h !== word)].slice(0, 10);
                return newHistory;
              });

              return { found: true, entry: aiGeneratedEntry };
            }
          }
        }
      } catch (aiError) {
        console.error('AI Management system error:', aiError);
      }

      // Fallback: Mock AI response if AI Management system fails
      await new Promise(resolve => setTimeout(resolve, 1000)); // Shorter delay for fallback

      const aiGeneratedEntry: VocabularyEntry = {
        id: Date.now().toString(),
        word: word,
        pronunciation: `/${word.toLowerCase()}/`, 
        partOfSpeech: 'noun',
        level: 'B1',
        definitions: {
          german: `Definition für "${word}" (AI-generiert)`,
          vietnamese: `Định nghĩa cho từ "${word}" (được tạo bởi AI)`,
          english: `Definition for "${word}" (AI-generated)`
        },
        examples: [
          {
            german: `Beispiel: "${word}" wird oft verwendet.`,
            vietnamese: `Ví dụ: "${word}" thường được sử dụng.`
          }
        ],
        synonyms: [],
        antonyms: [],
        relatedWords: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: 'ai'
      };

      // Add fallback entry to database
      mockVocabularyDatabase.push(aiGeneratedEntry);

      // Add to search history
      setSearchHistory(prev => {
        const newHistory = [word, ...prev.filter(h => h !== word)].slice(0, 10);
        return newHistory;
      });

      return { found: true, entry: aiGeneratedEntry };

    } catch (error) {
      console.error('Error searching vocabulary:', error);
      const normalizedSearchWord = word.toLowerCase().trim();
      return { 
        found: false, 
        suggestions: mockVocabularyDatabase
          .filter(entry => entry.word.toLowerCase().includes(normalizedSearchWord))
          .map(entry => entry.word)
          .slice(0, 5)
      };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
  }, []);

  return {
    searchWord,
    isLoading,
    searchHistory,
    clearHistory
  };
}
