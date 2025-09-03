'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  BookOpen, 
  X, 
  Loader2, 
  AlertCircle, 
  History, 
  Sparkles,
  Trash2 
} from 'lucide-react';
import { VocabularyCard } from './vocabulary-card';
import { useVocabularySearch } from '@/hooks/use-vocabulary-search';
import { useVocabulary } from '@/hooks/use-vocabulary';
import { VocabularyEntry } from '@/types/vocabulary';

interface VocabularySidebarProps {
  className?: string;
}

// Quick suggestions for common words
const quickSuggestions = [
  'Energie', 'Politik', 'Umwelt', 'Wirtschaft', 'Bildung', 
  'Gesundheit', 'Technologie', 'Kultur', 'Sport', 'Wetter'
];

export function VocabularySidebar({ className = '' }: VocabularySidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentEntry, setCurrentEntry] = useState<VocabularyEntry | null>(null);
  const [showSuggestions, setShowSuggestions] = useState<string[]>(quickSuggestions.slice(0, 5));
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { searchWord, isLoading, searchHistory, clearHistory } = useVocabularySearch();
  const { addToSaved, removeFromSaved, isWordSaved } = useVocabulary();

  useEffect(() => {
    // Focus input when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleSearch = async (word?: string) => {
    const searchWordTerm = word || searchTerm;
    if (!searchWordTerm.trim()) return;

    try {
      const result = await searchWord(searchWordTerm);
      if (result.found && result.entry) {
        setCurrentEntry(result.entry);
        setShowSuggestions([]);
      } else {
        setCurrentEntry(null);
        setShowSuggestions(result.suggestions || []);
      }
    } catch (error) {
      console.error('Search error:', error);
      setCurrentEntry(null);
      setShowSuggestions([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentEntry(null);
    setShowSuggestions(quickSuggestions.slice(0, 5));
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleSaveWord = (entry: VocabularyEntry) => {
    if (isWordSaved(entry.id)) {
      removeFromSaved(entry.id);
    } else {
      addToSaved(entry);
    }
  };

  const isWordSavedCheck = (entry: VocabularyEntry) => {
    return isWordSaved(entry.id);
  };

  return (
    <Card className="w-full h-auto min-h-[500px] max-h-[80vh] bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-0 shadow-lg overflow-hidden flex flex-col">
      {/* Header */}
      <CardHeader className="pb-4 border-b border-blue-100 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-sm">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-lg font-bold text-gray-900">Từ điển</CardTitle>
            <p className="text-sm text-gray-600 mt-1">Tra cứu từ vựng tiếng Đức</p>
          </div>
        </div>

        {/* Search Input */}
        <div className="relative mt-4">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Nhập từ tiếng Đức..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            className="pr-20 pl-4 h-12 border-2 border-blue-100 rounded-xl focus:border-blue-300 focus:ring-blue-200 text-base bg-white/80 backdrop-blur-sm"
            disabled={isLoading}
          />
          <div className="absolute right-1 top-1 flex gap-1">
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="h-9 w-9 p-0 text-gray-400 hover:text-gray-600 hover:bg-white/50 rounded-lg"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
            <Button
              onClick={() => handleSearch()}
              disabled={isLoading || !searchTerm.trim()}
              size="sm"
              className="h-9 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0 rounded-lg shadow-sm"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Quick suggestions */}
        {showSuggestions.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-600 mb-2 font-medium">Có thể bạn muốn tìm:</p>
            <div className="flex flex-wrap gap-2">
              {showSuggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 hover:border-blue-200 text-xs px-3 py-1 rounded-full transition-colors"
                  onClick={() => {
                    setSearchTerm(suggestion);
                    handleSearch(suggestion);
                  }}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardHeader>

      {/* Content Area - với scroll và responsive height */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-6 space-y-6">
            {/* Loading State */}
            {isLoading && (
              <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
                <CardContent className="p-6 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                      <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                      <Sparkles className="w-4 h-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Đang tìm kiếm...</p>
                      <p className="text-sm text-gray-600">AI đang phân tích từ vựng</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Search Result */}
            {currentEntry && !isLoading && (
              <div className="animate-fadeIn">
                <VocabularyCard
                  entry={currentEntry}
                  onSave={handleSaveWord}
                  isSaved={isWordSavedCheck(currentEntry)}
                />
              </div>
            )}

            {/* No Result */}
            {!currentEntry && !isLoading && searchTerm && showSuggestions.length === 0 && (
              <Card className="border-0 shadow-sm bg-gradient-to-br from-gray-50 to-slate-50">
                <CardContent className="p-6 text-center">
                  <AlertCircle className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                  <p className="font-semibold text-gray-900 mb-1">Không tìm thấy từ</p>
                  <p className="text-sm text-gray-600">
                    Thử lại với từ khác hoặc kiểm tra chính tả
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Search History */}
            {searchHistory.length > 0 && !currentEntry && !isLoading && (
              <Card className="border-0 shadow-sm bg-white">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <History className="w-4 h-4 text-gray-600" />
                      <span className="text-gray-700">Lịch sử tìm kiếm</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearHistory}
                      className="h-7 w-7 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.slice(0, 8).map((word, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="cursor-pointer hover:bg-blue-100 hover:text-blue-700 text-xs px-3 py-1 rounded-full transition-colors"
                        onClick={() => {
                          setSearchTerm(word);
                          handleSearch(word);
                        }}
                      >
                        {word}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>
      </div>
    </Card>
  );
}
