'use client';

import { useTheme } from '@/hooks/use-theme';

export function LoadingSpinner() {
  const { theme } = useTheme();

  // Theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'light':
        return {
          background: "min-h-screen bg-white",
          spinner: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600",
          text: "text-gray-600"
        };
      case 'dark':
        return {
          background: "min-h-screen bg-gray-900", 
          spinner: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400",
          text: "text-gray-300"
        };
      case 'nude':
        return {
          background: "min-h-screen bg-stone-100",
          spinner: "animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600",
          text: "text-stone-600"
        };
      default:
        return {
          background: "min-h-screen bg-white",
          spinner: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600", 
          text: "text-gray-600"
        };
    }
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

  // Theme-specific styles for grid loading
  const getGridThemeStyles = () => {
    switch (theme) {
      case 'light':
        return {
          container: "space-y-4",
          card: "bg-white border border-gray-200 rounded-lg overflow-hidden",
          image: "w-24 h-full bg-gray-100 animate-pulse flex-shrink-0",
          placeholder: "bg-gray-200 animate-pulse rounded"
        };
      case 'dark':
        return {
          container: "space-y-4",
          card: "bg-gray-800 border border-gray-700 rounded-lg overflow-hidden",
          image: "w-24 h-full bg-gray-700 animate-pulse flex-shrink-0", 
          placeholder: "bg-gray-600 animate-pulse rounded"
        };
      case 'nude':
        return {
          container: "space-y-4",
          card: "bg-stone-50 border border-stone-200 rounded-lg overflow-hidden",
          image: "w-24 h-full bg-stone-200 animate-pulse flex-shrink-0",
          placeholder: "bg-stone-300 animate-pulse rounded"
        };
      default:
        return {
          container: "space-y-4",
          card: "bg-white border border-gray-200 rounded-lg overflow-hidden",
          image: "w-24 h-full bg-gray-100 animate-pulse flex-shrink-0",
          placeholder: "bg-gray-200 animate-pulse rounded"
        };
    }
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
