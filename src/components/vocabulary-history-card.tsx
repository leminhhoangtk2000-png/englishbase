"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Clock } from 'lucide-react';
import { useVocabulary, VocabularyEntry } from '@/hooks/use-vocabulary';
import { VocabularyCard } from '@/components/vocabulary-card';

interface VocabularyHistoryCardProps {
  className?: string;
}

export function VocabularyHistoryCard({ className = '' }: VocabularyHistoryCardProps) {
  const { searchHistory, clearHistory, addToHistory } = useVocabulary();

  const handleSearchAgain = (word: VocabularyEntry) => {
    // Re-add to history to move to top
    addToHistory(word);
  };

  return (
    <Card className={`h-[600px] flex flex-col ${className}`}>
      <CardHeader className="pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Lịch sử tìm kiếm
          </CardTitle>
          {searchHistory.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearHistory}
              className="h-8 px-2"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {searchHistory.length}/20 từ vựng gần đây
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0">
        {searchHistory.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 px-4">
            <div className="text-center">
              <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm">Chưa có lịch sử tìm kiếm</p>
              <p className="text-xs text-gray-400 mt-1">Tìm kiếm từ vựng để xem lịch sử</p>
            </div>
          </div>
        ) : (
          <div className="h-full overflow-y-auto px-4 pb-4 space-y-3">
            {searchHistory.map((word, index) => (
              <div
                key={`${word.id}-${index}`}
                className="cursor-pointer transform transition-transform hover:scale-[1.02]"
                onClick={() => handleSearchAgain(word)}
              >
                <VocabularyCard 
                  word={word} 
                  compact 
                  showLevel 
                  showTopic
                  className="border-l-4 border-l-blue-500"
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default VocabularyHistoryCard;
