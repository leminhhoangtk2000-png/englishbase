'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Volume2, Heart, Clock, BookOpen, Bookmark, Star } from 'lucide-react';
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
      utterance.rate = 0.8;
      utterance.pitch = 1.0;
      speechSynthesis.speak(utterance);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level?.toUpperCase()) {
      case 'A1': return 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white border-0';
      case 'A2': return 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0';
      case 'B1': return 'bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0';
      case 'B2': return 'bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0';
      case 'C1': return 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0';
      case 'C2': return 'bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0';
      default: return 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-0';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'nomen': 
      case 'noun': 
        return 'bg-gradient-to-r from-blue-400 to-blue-500 text-white border-0';
      case 'verb': 
        return 'bg-gradient-to-r from-green-400 to-green-500 text-white border-0';
      case 'adjektiv':
      case 'adjective':
        return 'bg-gradient-to-r from-purple-400 to-purple-500 text-white border-0';
      case 'adverb':
        return 'bg-gradient-to-r from-orange-400 to-orange-500 text-white border-0';
      case 'pronoun':
        return 'bg-gradient-to-r from-pink-400 to-pink-500 text-white border-0';
      case 'preposition':
        return 'bg-gradient-to-r from-indigo-400 to-indigo-500 text-white border-0';
      default: 
        return 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0';
    }
  };

  return (
    <Card className="w-full group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-lg bg-gradient-to-br from-white via-slate-50/50 to-blue-50/30 backdrop-blur-sm">
      <CardHeader className="pb-3 bg-gradient-to-r from-slate-50 to-blue-50/50 rounded-t-lg">
        {/* Header với level và type badges */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Badge 
              className={`${getLevelColor(entry.level || 'A1')} font-bold px-4 py-1.5 text-sm shadow-md`}
            >
              <Star className="w-3 h-3 mr-1" />
              {entry.level || 'A1'}
            </Badge>
            <Badge 
              className={`${getTypeColor(entry.partOfSpeech || entry.type)} px-3 py-1.5 text-sm font-medium shadow-md`}
            >
              {entry.partOfSpeech || entry.type || 'NOMEN'}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSave(entry)}
            className={`transition-all duration-200 hover:scale-110 ${isSaved 
              ? 'text-pink-500 hover:text-pink-600 bg-pink-50 hover:bg-pink-100' 
              : 'text-gray-400 hover:text-pink-500 hover:bg-pink-50'
            }`}
          >
            {isSaved ? <Bookmark className="h-4 w-4 fill-current" /> : <Bookmark className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-1 max-h-[60vh]">
        <CardContent className="pt-4 space-y-5">
          {/* Từ vựng chính */}
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h3 className="font-bold text-3xl bg-gradient-to-r from-gray-800 to-blue-800 bg-clip-text text-transparent break-words">
                {entry.word}
              </h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSpeak(entry.word)}
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 border-blue-200 transition-all duration-200 hover:scale-105 shadow-sm"
              >
                <Volume2 className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Phiên âm */}
            {entry.pronunciation && (
              <div className="bg-gradient-to-r from-gray-50 to-slate-50 px-3 py-2 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-700 font-mono">
                  /{entry.pronunciation}/
                </p>
              </div>
            )}
          </div>

          <Separator className="my-4 bg-gradient-to-r from-transparent via-gray-300 to-transparent" />

          {/* Định nghĩa */}
          <div className="space-y-4">
            {entry.definitions?.vietnamese && (
              <div className="bg-gradient-to-r from-purple-50 to-purple-100/50 border border-purple-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🇻🇳</span>
                  </div>
                  <span className="font-semibold text-purple-900">Tiếng Việt</span>
                </div>
                <p className="text-purple-800 leading-relaxed font-medium">
                  {entry.definitions.vietnamese}
                </p>
              </div>
            )}

            {entry.definitions?.german && (
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50/50 border border-amber-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🇩🇪</span>
                  </div>
                  <span className="font-semibold text-amber-900">Deutsch</span>
                </div>
                <p className="text-amber-800 leading-relaxed font-medium">
                  {entry.definitions.german}
                </p>
              </div>
            )}

            {entry.definitions?.english && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50/50 border border-blue-200 rounded-xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">🇺🇸</span>
                  </div>
                  <span className="font-semibold text-blue-900">English</span>
                </div>
                <p className="text-blue-800 leading-relaxed font-medium">
                  {entry.definitions.english}
                </p>
              </div>
            )}
          </div>

          {/* Ví dụ */}
          {entry.examples && entry.examples.length > 0 && (
            <div className="space-y-3">
              <Separator className="bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
              <div className="flex items-center gap-2 mb-3">
                <BookOpen className="h-5 w-5 text-slate-600" />
                <h4 className="text-lg font-semibold text-slate-700">Ví dụ</h4>
              </div>
              <div className="space-y-3">
                {entry.examples.slice(0, 2).map((example, index) => (
                  <div key={index} className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-4 border border-slate-200 shadow-sm">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="text-slate-700 italic flex-1 break-words leading-relaxed font-medium">
                        "{example.german}"
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSpeak(example.german)}
                        className="text-blue-600 hover:text-blue-700 p-1 flex-shrink-0 hover:scale-105 transition-all"
                      >
                        <Volume2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-purple-600 italic break-words leading-relaxed">
                      "{example.vietnamese}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Synonyms */}
          {entry.synonyms && entry.synonyms.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                <span className="text-green-500">🔄</span>
                Từ đồng nghĩa
              </h5>
              <div className="flex flex-wrap gap-2">
                {entry.synonyms.slice(0, 5).map((synonym, index) => (
                  <Badge key={index} variant="outline" className="text-sm bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors">
                    {synonym}
                  </Badge>
                ))}
                {entry.synonyms.length > 5 && (
                  <Badge variant="outline" className="text-sm bg-green-50 text-green-700 border-green-200">
                    +{entry.synonyms.length - 5}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Antonyms */}
          {entry.antonyms && entry.antonyms.length > 0 && (
            <div className="space-y-3">
              <h5 className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                <span className="text-red-500">↔️</span>
                Từ trái nghĩa
              </h5>
              <div className="flex flex-wrap gap-2">
                {entry.antonyms.slice(0, 3).map((antonym, index) => (
                  <Badge key={index} variant="outline" className="text-sm bg-red-50 text-red-700 border-red-200 hover:bg-red-100 transition-colors">
                    {antonym}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Source & Time */}
          <div className="flex items-center justify-between text-sm text-slate-500 pt-3 border-t border-slate-200 flex-wrap gap-2">
            <span className="flex items-center gap-2">
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span>
                {new Date(entry.createdAt).toLocaleDateString('vi-VN')}
              </span>
            </span>
            <span className="flex items-center gap-1">
              {entry.source === 'ai' ? '🤖 AI' : entry.source === 'database' ? '📚 Database' : '✍️ Manual'}
            </span>
          </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}
