'use client';

import { useTheme } from '@/hooks/use-theme';

export function LoadingSpinner() {
  const { theme } = useTheme();

  // Theme-specific styles using semantic tokens
  const getThemeStyles = () => {
    return {
      background: "min-h-screen bg-background",
      spinner: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary",
      text: "text-muted-foreground"
    };
  };

  const styles = getThemeStyles();

  return (
    <div className={`${styles.background} flex items-center justify-center`}>
      <div className="text-center">
        <div className={`${styles.spinner} mx-auto mb-4`}></div>
        <p className={styles.text}>Laden der Artikel...</p>
      </div>
    </div>
  );
}

export function LoadingGrid() {
  const { theme } = useTheme();

  // Theme-specific styles for grid loading using semantic tokens
  const getGridThemeStyles = () => {
    return {
      container: "space-y-4",
      card: "bg-card border border-border rounded-lg overflow-hidden",
      image: "w-24 h-full bg-muted animate-pulse flex-shrink-0",
      placeholder: "bg-muted animate-pulse rounded"
    };
  };

  const gridStyles = getGridThemeStyles();

  return (
    <div className={gridStyles.container}>
      {[...Array(8)].map((_, i) => (
        <div key={i} className={gridStyles.card}>
          <div className="flex h-32">
            <div className={gridStyles.image} />
            <div className="flex-1 p-4 space-y-3">
              <div className="flex gap-2">
                <div className={`h-4 w-16 ${gridStyles.placeholder}`} />
                <div className={`h-4 w-20 ${gridStyles.placeholder}`} />
              </div>
              <div className={`h-5 w-full ${gridStyles.placeholder}`} />
              <div className={`h-4 w-3/4 ${gridStyles.placeholder}`} />
              <div className={`h-3 w-16 ${gridStyles.placeholder}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
