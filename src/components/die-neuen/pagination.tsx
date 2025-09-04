'use client';

import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '@/hooks/use-theme';
import { getUITheme } from '@/config/themes';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const { theme } = useTheme();
  const currentTheme = getUITheme(theme);
  
  // Use semantic theme colors like blog
  const getThemeStyles = () => {
    return {
      container: "flex justify-center items-center gap-2",
      button: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
      activeButton: "bg-primary text-primary-foreground border-primary",
      disabledButton: "bg-muted text-muted-foreground border-border opacity-50 cursor-not-allowed",
      info: "text-muted-foreground"
    };
  };

  const styles = getThemeStyles();
  
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={styles.container}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center gap-1 ${currentPage === 1 ? styles.disabledButton : styles.button}`}
      >
        <ChevronLeft className="w-4 h-4" />
        Zurück
      </Button>

      <div className="flex items-center gap-1">
        {visiblePages.map((page, index) => {
          if (page === '...') {
            return (
              <span key={`dots-${index}`} className={`px-3 py-2 ${styles.info}`}>
                ...
              </span>
            );
          }

          return (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(page as number)}
              className={`min-w-[40px] h-9 ${currentPage === page ? styles.activeButton : styles.button}`}
            >
              {page}
            </Button>
          );
        })}
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center gap-1 ${currentPage === totalPages ? styles.disabledButton : styles.button}`}
      >
        Weiter
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
