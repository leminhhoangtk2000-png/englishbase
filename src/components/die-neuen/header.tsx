'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface DieNeuenHeaderProps {
  showSearch: boolean;
  searchTerm: string;
  selectedCategory: string;
  setShowSearch: (show: boolean) => void;
  setSearchTerm: (term: string) => void;
  setSelectedCategory: (category: string) => void;
}

export default function DieNeuenHeader({
  showSearch,
  searchTerm,
  selectedCategory,
  setShowSearch,
  setSearchTerm,
  setSelectedCategory,
}: DieNeuenHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className="text-3xl font-light text-gray-900">Die Neuen</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
        
        <p className="text-gray-600 mb-8 font-light">
          Aktuelle Nachrichten und Artikel für Deutschlerner
        </p>

        {showSearch && (
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Artikel suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-20 py-2 w-full border-gray-300 focus:border-gray-400 focus:ring-1 focus:ring-gray-400"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                Clear
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
