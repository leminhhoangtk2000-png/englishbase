"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { SpeechButton } from '@/components/speech-button';
import { SaveButton } from '@/components/save-button';
import { VocabularyEntry } from '@/hooks/use-vocabulary';
import { GenderBadge } from '@/components/gender-badge';

interface VocabularyCardProps {
  word: VocabularyEntry;
  showLevel?: boolean;
  showTopic?: boolean;
  compact?: boolean;
  className?: string;
}

export function VocabularyCard({ 
  word, 
  showLevel = false, 
  showTopic = false,
  compact = false,
  className = ''
}: VocabularyCardProps) {
  return (
    <Card className={`group hover:shadow-md transition-shadow ${className}`}>
      <CardContent className={`p-4 ${compact ? 'space-y-2' : 'space-y-3'}`}>
        {/* Header với từ vựng và các nút */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className={`font-semibold text-gray-900 dark:text-white ${compact ? 'text-lg' : 'text-xl'}`}>
              {word.german}
            </h3>
            {/* Gender badge for nouns */}
            {word.gender && <GenderBadge gender={word.gender} size={compact ? 'sm' : 'md'} />}
            <SpeechButton text={word.german} size="sm" />
          </div>
          <SaveButton word={word} size="sm" />
        </div>

        {/* Phiên âm */}
        {word.phonetic && (
          <p className={`text-gray-600 dark:text-gray-400 italic ${compact ? 'text-sm' : 'text-base'}`}>
            /{word.phonetic}/
          </p>
        )}

        {/* Plural form cho danh từ */}
        {word.plural && word.plural !== '-' && (
          <p className={`text-gray-600 dark:text-gray-400 ${compact ? 'text-sm' : 'text-base'}`}>
            <span className="font-medium">Số nhiều:</span> {word.plural}
          </p>
        )}

        {/* Nghĩa tiếng Việt */}
        <p className={`text-purple-700 font-medium ${compact ? 'text-base' : 'text-lg'}`}>
          {word.vietnamese}
        </p>

        {/* Loại từ */}
        {word.type && (
          <Badge variant="secondary" className="text-xs">
            {word.type}
          </Badge>
        )}

        {/* Level và Topic badges nếu được yêu cầu */}
        {(showLevel || showTopic) && (
          <div className="flex gap-2 flex-wrap">
            {showLevel && word.level && (
              <Badge variant="outline" className="text-xs">
                {word.level.displayName}
              </Badge>
            )}
            {showTopic && word.topic && (
              <Badge variant="outline" className="text-xs">
                {word.topic.displayName}
              </Badge>
            )}
          </div>
        )}

        {/* Ví dụ */}
        {!compact && word.exampleGerman && word.exampleVietnamese && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700 dark:text-gray-300 italic">
                  "{word.exampleGerman}"
                </p>
                <SpeechButton text={word.exampleGerman} size="sm" />
              </div>
              <p className="text-sm text-purple-600 italic">
                "{word.exampleVietnamese}"
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default VocabularyCard;
