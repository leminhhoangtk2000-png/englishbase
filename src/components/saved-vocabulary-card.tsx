"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, BookmarkCheck, Plus } from 'lucide-react';
import { useVocabulary, VocabularyEntry } from '@/hooks/use-vocabulary';
import { VocabularyCard } from '@/components/vocabulary-card';

interface SavedVocabularyCardProps {
  className?: string;
}

// Sample vocabulary data for demo purposes
const sampleVocabulary: VocabularyEntry[] = [
  {
    id: 'sample-1',
    german: 'das Haus',
    vietnamese: 'ngôi nhà',
    phonetic: '[haʊs]',
    plural: 'die Häuser',
    type: 'Substantiv',
    exampleGerman: 'Ich wohne in einem schönen Haus.',
    exampleVietnamese: 'Tôi sống trong một ngôi nhà đẹp.',
    difficulty: 1,
    frequency: 95,
    tags: ['wohnen', 'gebäude'],
    level: {
      id: 'a1',
      name: 'A1',
      displayName: 'Cơ bản A1'
    },
    topic: {
      id: 'wohnen',
      name: 'Wohnen',
      displayName: 'Nhà ở',
      slug: 'wohnen'
    }
  },
  {
    id: 'sample-2',
    german: 'lernen',
    vietnamese: 'học',
    phonetic: '[ˈlɛʁnən]',
    type: 'Verb',
    exampleGerman: 'Ich lerne Deutsch jeden Tag.',
    exampleVietnamese: 'Tôi học tiếng Đức mỗi ngày.',
    difficulty: 1,
    frequency: 98,
    tags: ['bildung', 'alltag'],
    level: {
      id: 'a1',
      name: 'A1',
      displayName: 'Cơ bản A1'
    },
    topic: {
      id: 'bildung',
      name: 'Bildung',
      displayName: 'Giáo dục',
      slug: 'bildung'
    }
  },
  {
    id: 'sample-3',
    german: 'der Computer',
    vietnamese: 'máy tính',
    phonetic: '[kɔmˈpjuːtɐ]',
    plural: 'die Computer',
    type: 'Substantiv',
    exampleGerman: 'Mein Computer ist sehr schnell.',
    exampleVietnamese: 'Máy tính của tôi rất nhanh.',
    difficulty: 2,
    frequency: 85,
    tags: ['technik', 'arbeit'],
    level: {
      id: 'a2',
      name: 'A2',
      displayName: 'Tiền trung cấp A2'
    },
    topic: {
      id: 'technik',
      name: 'Technik',
      displayName: 'Công nghệ',
      slug: 'technik'
    }
  }
];

export function SavedVocabularyCard({ className = '' }: SavedVocabularyCardProps) {
  const { savedVocabulary, clearSaved, addToSaved } = useVocabulary();

  const handleAddSamples = () => {
    sampleVocabulary.forEach(word => {
      addToSaved(word);
    });
  };

  return (
    <Card className={`h-[600px] flex flex-col ${className}`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookmarkCheck className="h-5 w-5" />
            Từ vựng đã lưu
          </CardTitle>
          <div className="flex items-center gap-2">
            {savedVocabulary.length === 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddSamples}
                className="h-8 px-3 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Thêm mẫu
              </Button>
            )}
            {savedVocabulary.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSaved}
                className="h-8 px-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {savedVocabulary.length} từ vựng đã lưu
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        {savedVocabulary.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 px-4">
            <div className="text-center">
              <BookmarkCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium mb-2">Chưa có từ vựng nào được lưu</p>
              <p className="text-xs text-gray-400 mb-4">
                Nhấn vào biểu tượng bookmark để lưu từ vựng hoặc thử từ vựng mẫu
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddSamples}
                className="h-8 px-3 text-xs"
              >
                <Plus className="h-3 w-3 mr-1" />
                Thêm từ vựng mẫu
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto px-4 pb-4 space-y-3">
            {savedVocabulary.map((word: VocabularyEntry, index: number) => (
              <div
                key={`${word.id}-${index}`}
                className="transform transition-transform hover:scale-[1.02]"
              >
                <VocabularyCard 
                  word={word} 
                  compact 
                  showLevel 
                  showTopic
                  className="border-l-4 border-l-yellow-500"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default SavedVocabularyCard;
