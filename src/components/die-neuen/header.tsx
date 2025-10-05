'use client';

import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTheme } from '@/hooks/use-theme';
import { getUITheme } from '@/config/themes';

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
  const { theme } = useTheme();
  const currentTheme = getUITheme(theme);

  // Theme-aware styles using semantic tokens
  const getThemeStyles = () => {
    return {
      header: "bg-card border-b border-border",
      title: "text-foreground",
      description: "text-muted-foreground",
      button: "text-muted-foreground hover:text-foreground hover:bg-accent",
      searchIcon: "text-muted-foreground",
      input: "bg-background border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary",
      clearButton: "text-muted-foreground hover:text-foreground"
    };
  };

  const styles = getThemeStyles();

  return (
    <header className={`${styles.header} py-12 px-4`}>
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <h1 className={`text-3xl font-light ${styles.title}`}>Die Neuen</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className={styles.button}
          >
            <Search className="w-4 h-4" />
          </Button>
        </div>
        
        <p className={`${styles.description} mb-8 font-light`}>
          Aktuelle Nachrichten und Artikel für Deutschlerner
        </p>

        {showSearch && (
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${styles.searchIcon} w-4 h-4`} />
              <Input
                type="text"
                placeholder="Artikel suchen..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 pr-20 py-2 w-full ${styles.input}`}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${styles.clearButton}`}
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
