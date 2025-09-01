"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, BookmarkCheck } from 'lucide-react';
import { useVocabulary, VocabularyEntry } from '@/hooks/use-vocabulary';
import { VocabularyCard } from '@/components/vocabulary-card';

interface SavedVocabularyCardProps {
  className?: string;
}

export function SavedVocabularyCard({ className = '' }: SavedVocabularyCardProps) {
  const { savedVocabulary, clearSaved } = useVocabulary();

  return (
    <Card className={`h-[600px] flex flex-col ${className}`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookmarkCheck className="h-5 w-5" />
            Từ vựng đã lưu
          </CardTitle>
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
        <p className="text-sm text-muted-foreground mt-1">
          {savedVocabulary.length} từ vựng đã lưu
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        {savedVocabulary.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 px-4">
            <div className="text-center">
              <BookmarkCheck className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Chưa có từ vựng nào được lưu</p>
              <p className="text-xs text-gray-400 mt-1">
                Nhấn vào biểu tượng bookmark để lưu từ vựng
              </p>
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
