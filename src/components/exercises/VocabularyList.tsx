"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Volume2, Eye, EyeOff, RotateCcw, BookOpen } from 'lucide-react';

interface VocabularyItem {
  german: string;
  vietnamese: string;
  pronunciation?: string;
  example?: string;
  exampleTranslation?: string;
  category?: string;
  level?: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}

interface VocabularyListProps {
  title?: string;
  words: VocabularyItem[];
  showCategories?: boolean;
}

export default function VocabularyList({ 
  title = "Từ vựng",
  words, 
  showCategories = true 
}: VocabularyListProps) {
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const toggleCard = (index: number) => {
    setFlippedCards(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const resetAllCards = () => {
    setFlippedCards([]);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'de-DE';
      speechSynthesis.speak(utterance);
    }
  };

  const categories = showCategories 
    ? [...new Set(words.map(word => word.category).filter(Boolean))]
    : [];

  const filteredWords = selectedCategory 
    ? words.filter(word => word.category === selectedCategory)
    : words;

  const getLevelColor = (level?: string) => {
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
    <Card className="my-6 border-2 border-teal-100">
      <CardHeader className="bg-teal-50">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-teal-800">
            <BookOpen className="w-5 h-5" />
            {title}
          </div>
          <Button
            onClick={resetAllCards}
            variant="outline"
            size="sm"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Đặt lại
          </Button>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Category Filter */}
        {categories.length > 0 && (
          <div className="mb-6">
            <h4 className="font-medium text-gray-700 mb-3">Lọc theo chủ đề:</h4>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={() => setSelectedCategory(null)}
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
              >
                Tất cả ({words.length})
              </Button>
              {categories.map(category => category && (
                <Button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                >
                  {category} ({words.filter(w => w.category === category).length})
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Vocabulary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map((word, index) => {
            const originalIndex = words.indexOf(word);
            const isFlipped = flippedCards.includes(originalIndex);
            
            return (
              <div
                key={originalIndex}
                className="relative h-40 cursor-pointer"
                onClick={() => toggleCard(originalIndex)}
              >
                <div className={`absolute inset-0 transition-transform duration-500 transform-style-preserve-3d ${
                  isFlipped ? 'rotate-y-180' : ''
                }`}>
                  {/* Front Side (German) */}
                  <Card className="absolute inset-0 backface-hidden border-2 border-teal-200 hover:border-teal-300 transition-colors">
                    <CardContent className="p-4 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          {word.level && (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(word.level)}`}>
                              {word.level}
                            </span>
                          )}
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              speak(word.german);
                            }}
                            variant="ghost"
                            size="sm"
                            className="p-1"
                          >
                            <Volume2 className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <h3 className="text-lg font-bold text-center text-teal-800 mb-2">
                          {word.german}
                        </h3>
                        
                        {word.pronunciation && (
                          <p className="text-sm text-gray-600 text-center italic">
                            /{word.pronunciation}/
                          </p>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <Eye className="w-5 h-5 text-gray-400 mx-auto" />
                        <p className="text-xs text-gray-500 mt-1">Nhấn để xem nghĩa</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Back Side (Vietnamese) */}
                  <Card className="absolute inset-0 backface-hidden rotate-y-180 border-2 border-orange-200 hover:border-orange-300 transition-colors">
                    <CardContent className="p-4 h-full flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          {word.category && (
                            <span className="px-2 py-1 rounded text-xs font-medium bg-orange-100 text-orange-800">
                              {word.category}
                            </span>
                          )}
                          <EyeOff className="w-4 h-4 text-gray-400" />
                        </div>
                        
                        <h3 className="text-lg font-bold text-center text-orange-800 mb-3">
                          {word.vietnamese}
                        </h3>
                        
                        {word.example && (
                          <div className="text-sm">
                            <p className="text-gray-700 font-medium mb-1">
                              {word.example}
                            </p>
                            {word.exampleTranslation && (
                              <p className="text-gray-600 italic">
                                {word.exampleTranslation}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <p className="text-xs text-gray-500">Nhấn để trở lại</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            );
          })}
        </div>

        {filteredWords.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <BookOpen className="w-12 h-12 mx-auto mb-2 text-gray-300" />
            <p>Không có từ vựng nào trong danh mục này.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
