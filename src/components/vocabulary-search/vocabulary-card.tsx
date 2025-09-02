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
    <Card className="w-full group hover:shadow-md transition-shadow overflow-visible">
      <CardContent className="p-4 space-y-3 overflow-visible">
        {/* Header với từ vựng và các nút */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg break-words">
              {entry.word}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleSpeak(entry.word)}
              className="text-blue-600 hover:text-blue-700 p-1 flex-shrink-0"
            >
              <Volume2 className="w-4 h-4" />
            </Button>
          </div>
          <Button
            onClick={() => onSave(entry)}
            variant="ghost"
            size="sm"
            className={`p-1 flex-shrink-0 ${
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
          <div className="w-full">
            <p className="text-gray-600 italic text-sm break-all">
              /{entry.pronunciation}/
            </p>
          </div>
        )}

        {/* Nghĩa tiếng Việt */}
        <div className="w-full">
          <p className="text-purple-700 font-medium text-base leading-relaxed break-words">
            {entry.definitions.vietnamese}
          </p>
        </div>

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
          <div className="w-full p-3 bg-blue-50 rounded-lg border border-blue-200 overflow-hidden">
            <p className="text-xs text-blue-700 mb-1 font-semibold">🇩🇪 Tiếng Đức</p>
            <p className="text-gray-900 text-sm leading-relaxed break-words whitespace-pre-wrap">
              {entry.definitions.german}
            </p>
          </div>
        )}

        {/* Định nghĩa tiếng Việt */}
        {entry.definitions.vietnamese && (
          <div className="w-full p-3 bg-green-50 rounded-lg border border-green-200 overflow-hidden">
            <p className="text-xs text-green-700 mb-1 font-semibold">🇻🇳 Tiếng Việt</p>
            <p className="text-gray-900 text-sm leading-relaxed break-words whitespace-pre-wrap">
              {entry.definitions.vietnamese}
            </p>
          </div>
        )}

        {/* Định nghĩa tiếng Anh */}
        {entry.definitions.english && (
          <div className="w-full p-3 bg-purple-50 rounded-lg border border-purple-200 overflow-hidden">
            <p className="text-xs text-purple-700 mb-1 font-semibold">🇺🇸 English</p>
            <p className="text-gray-900 text-sm leading-relaxed break-words whitespace-pre-wrap">
              {entry.definitions.english}
            </p>
          </div>
        )}

        {/* Ví dụ */}
        {entry.examples && entry.examples.length > 0 && (
          <div className="w-full">
            <Separator />
            <div className="space-y-3 mt-3">
              <h4 className="text-sm font-semibold text-gray-700">📝 Ví dụ</h4>
              {entry.examples.slice(0, 2).map((example, index) => (
                <div key={index} className="space-y-2 p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-gray-700 italic flex-1 break-words leading-relaxed">
                      "{example.german}"
                    </p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSpeak(example.german)}
                      className="text-blue-600 hover:text-blue-700 p-1 flex-shrink-0"
                    >
                      <Volume2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="text-sm text-purple-600 italic break-words leading-relaxed">
                    "{example.vietnamese}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Synonyms */}
        {entry.synonyms && entry.synonyms.length > 0 && (
          <div className="w-full">
            <p className="text-xs text-gray-600 mb-2 font-semibold">🔄 Từ đồng nghĩa:</p>
            <div className="flex flex-wrap gap-2">
              {entry.synonyms.slice(0, 5).map((synonym, index) => (
                <Badge key={index} variant="outline" className="text-xs break-words">
                  {synonym}
                </Badge>
              ))}
              {entry.synonyms.length > 5 && (
                <Badge variant="outline" className="text-xs">
                  +{entry.synonyms.length - 5}
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Antonyms */}
        {entry.antonyms && entry.antonyms.length > 0 && (
          <div className="w-full">
            <p className="text-xs text-gray-600 mb-2 font-semibold">↔️ Từ trái nghĩa:</p>
            <div className="flex flex-wrap gap-2">
              {entry.antonyms.slice(0, 3).map((antonym, index) => (
                <Badge key={index} variant="outline" className="text-xs break-words bg-red-50 text-red-700 border-red-200">
                  {antonym}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Source & Time */}
        <div className="w-full flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100 flex-wrap gap-2">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span className="break-words">
              {new Date(entry.createdAt).toLocaleDateString('vi-VN')}
            </span>
          </span>
          <span className="break-words">
            {entry.source === 'ai' ? '🤖 AI' : entry.source === 'database' ? '📚 Database' : '✍️ Manual'}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
