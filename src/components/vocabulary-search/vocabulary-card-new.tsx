'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Volume2, Heart, Clock } from 'lucide-react';
import { VocabularyEntry } from '@/types/vocabulary';

interface VocabularyCardProps {
  entry: VocabularyEntry;
  onSave: (entry: VocabularyEntry) => void;
  isSaved: boolean;
}

export function VocabularyCard({ entry, onSave, isSaved }: VocabularyCardProps) {
  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      speechSynthesis.speak(utterance);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'A1': return 'bg-green-100 text-green-800';
      case 'A2': return 'bg-blue-100 text-blue-800';
      case 'B1': return 'bg-yellow-100 text-yellow-800';
      case 'B2': return 'bg-orange-100 text-orange-800';
      case 'C1': return 'bg-red-100 text-red-800';
      case 'C2': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full group hover:shadow-md transition-shadow">
      <CardContent className="p-4 space-y-3">
        {/* Header với từ vựng và các nút */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900 text-xl">
              {entry.word}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSpeak(entry.word)}
              className="text-blue-600 hover:text-blue-700 p-1"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={() => onSave(entry)}
            variant="ghost"
            size="sm"
            className={`p-1 ${
              isSaved 
                ? 'text-blue-600 hover:text-blue-700' 
                : 'text-gray-600 hover:text-blue-600'
            }`}
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>

        {/* Phiên âm */}
        {entry.pronunciation && (
          <p className="text-gray-600 italic text-base">
            /{entry.pronunciation}/
          </p>
        )}

        {/* Nghĩa tiếng Việt */}
        <p className="text-purple-700 font-medium text-lg">
          {entry.definitions.vietnamese}
        </p>

        {/* Loại từ và Level */}
        <div className="flex gap-2 flex-wrap">
          {entry.partOfSpeech && (
            <Badge variant="secondary" className="text-xs">
              {entry.partOfSpeech}
            </Badge>
          )}
          {entry.level && (
            <Badge variant="outline" className={`text-xs ${getLevelColor(entry.level)}`}>
              {entry.level}
            </Badge>
          )}
        </div>

        {/* Định nghĩa tiếng Đức */}
        {entry.definitions.german && (
          <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-xs text-blue-700 mb-1 font-semibold">🇩🇪 Định nghĩa</p>
            <p className="text-gray-900 text-sm">{entry.definitions.german}</p>
          </div>
        )}

        {/* Ví dụ */}
        {entry.examples && entry.examples.length > 0 && (
          <>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-700 italic">
                  "{entry.examples[0].german}"
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSpeak(entry.examples[0].german)}
                  className="text-blue-600 hover:text-blue-700 p-1"
                >
                  <Volume2 className="w-3 h-3" />
                </Button>
              </div>
              <p className="text-sm text-purple-600 italic">
                "{entry.examples[0].vietnamese}"
              </p>
            </div>
          </>
        )}

        {/* Synonyms */}
        {entry.synonyms && entry.synonyms.length > 0 && (
          <div>
            <p className="text-xs text-gray-600 mb-1 font-semibold">Từ đồng nghĩa:</p>
            <div className="flex flex-wrap gap-1">
              {entry.synonyms.slice(0, 3).map((synonym, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {synonym}
                </Badge>
              ))}
              {entry.synonyms.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{entry.synonyms.length - 3}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Source & Time */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {new Date(entry.createdAt).toLocaleDateString('vi-VN')}
          </span>
          <span>
            {entry.source === 'ai' ? '🤖 AI' : entry.source === 'database' ? '📚 Database' : '✍️ Manual'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
