'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Search, 
  Loader2, 
  BookOpen, 
  History, 
  X,
  ChevronRight,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useVocabularySearch } from '@/hooks/use-vocabulary-search';
import { VocabularyCard } from './vocabulary-card';
import { VocabularyEntry } from '@/types/vocabulary';

interface VocabularySidebarProps {
  className?: string;
}

export function VocabularySidebar({ className }: VocabularySidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentEntry, setCurrentEntry] = useState<VocabularyEntry | null>(null);
  const [savedWords, setSavedWords] = useState<VocabularyEntry[]>([]);
  const [showSuggestions, setShowSuggestions] = useState<string[]>([]);
  const { searchWord, isLoading, searchHistory, clearHistory } = useVocabularySearch();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (term?: string) => {
    const searchQuery = term || searchTerm;
    if (!searchQuery.trim()) return;

    const result = await searchWord(searchQuery);
    
    if (result.found && result.entry) {
      setCurrentEntry(result.entry);
      setShowSuggestions([]);
    } else {
      setCurrentEntry(null);
      setShowSuggestions(result.suggestions || []);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSaveWord = (entry: VocabularyEntry) => {
    setSavedWords(prev => {
      const exists = prev.find(w => w.id === entry.id);
      if (exists) {
        return prev.filter(w => w.id !== entry.id);
      }
      return [...prev, entry];
    });
  };

  const isWordSaved = (entry: VocabularyEntry) => {
    return savedWords.some(w => w.id === entry.id);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setCurrentEntry(null);
    setShowSuggestions([]);
    inputRef.current?.focus();
  };

  return (
    <Card className="w-full h-auto min-h-[600px] max-h-[80vh] bg-gradient-to-br from-blue-50 via-white to-indigo-50 border-0 shadow-lg overflow-hidden flex flex-col">
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
        <div className="relative">
          <Input
            ref={inputRef}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Nhập từ cần tra cứu..."
            className="pr-20 h-11 border-gray-200 focus:border-blue-400 focus:ring-2 focus:ring-blue-100 rounded-xl bg-white/70 backdrop-blur-sm"
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
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1 p-6 h-auto vocabulary-scroll">
        <div className="space-y-6">
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
                isSaved={isWordSaved(currentEntry)}
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
                  <span className="flex items-center gap-2">
                    <History className="w-4 h-4 text-gray-600" />
                    Lịch sử tìm kiếm
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearHistory}
                    className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 h-auto rounded-md"
                  >
                    Xóa
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  {searchHistory.slice(0, 5).map((term, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSearchTerm(term);
                        handleSearch(term);
                      }}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center justify-between group transition-colors"
                    >
                      <span className="text-sm text-gray-700 font-medium">{term}</span>
                      <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Saved Words */}
          {savedWords.length > 0 && !currentEntry && !isLoading && (
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Từ đã lưu ({savedWords.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-1">
                  {savedWords.slice(0, 5).map((word, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentEntry(word)}
                      className="w-full text-left p-3 rounded-lg hover:bg-gray-50 flex items-center justify-between group transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-semibold text-gray-900 block">{word.word}</span>
                        <p className="text-xs text-gray-600 truncate">
                          {word.definitions.vietnamese}
                        </p>
                      </div>
                      <ChevronRight className="w-3 h-3 text-gray-400 group-hover:text-gray-600 transition-colors ml-2" />
                    </button>
                  ))}
                  {savedWords.length > 5 && (
                    <p className="text-xs text-gray-500 text-center pt-2">
                      và {savedWords.length - 5} từ khác...
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Welcome State */}
          {!currentEntry && !isLoading && !searchTerm && searchHistory.length === 0 && (
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2 text-lg">Tra cứu từ vựng</h4>
                <p className="text-sm text-gray-600 mb-6 leading-relaxed">
                  Nhập từ tiếng Đức để tra cứu nghĩa, ví dụ và cách phát âm.
                </p>
                <div className="space-y-3 text-xs text-gray-500">
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>Tìm kiếm trong cơ sở dữ liệu</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <span>AI hỗ trợ từ mới</span>
                  </div>
                  <div className="flex items-center gap-2 justify-center">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>Lưu từ yêu thích</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
