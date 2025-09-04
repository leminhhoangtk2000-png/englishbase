'use client';

import { useState, useEffect } from 'react';
import { MainNav } from '@/components/main-nav';
import { useTheme } from '@/hooks/use-theme';

export default function DieNeuen() {
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  // Theme-specific styles
  const getThemeStyles = () => {
    switch (theme) {
      case 'light':
        return {
          background: "bg-blue-50",
          spinner: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600",
          text: "text-blue-600"
        };
      case 'dark':
        return {
          background: "bg-slate-900",
          spinner: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400", 
          text: "text-blue-400"
        };
      case 'nude':
        return {
          background: "bg-amber-50",
          spinner: "animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600",
          text: "text-amber-600"
        };
      default:
        return {
          background: "bg-blue-50",
          spinner: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600",
          text: "text-blue-600"
        };
    }
  };

  const styles = getThemeStyles();

  if (loading) {
    return (
      <div className={`min-h-screen ${styles.background} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`${styles.spinner} mx-auto mb-4`}></div>
          <p className={styles.text}>Laden der Artikel...</p>
        </div>
      </div>
    );
  }

  // Page theme styles
  const getPageThemeStyles = () => {
    switch (theme) {
      case 'light':
        return {
          background: "bg-blue-50",
          header: "bg-white border-blue-200",
          title: "text-blue-900",
          description: "text-blue-600",
          card: "bg-white",
          cardTitle: "text-blue-800",
          cardText: "text-blue-600"
        };
      case 'dark':
        return {
          background: "bg-slate-900",
          header: "bg-slate-800 border-slate-700",
          title: "text-blue-300",
          description: "text-blue-400",
          card: "bg-slate-800",
          cardTitle: "text-blue-300",
          cardText: "text-blue-400"
        };
      case 'nude':
        return {
          background: "bg-amber-50",
          header: "bg-amber-100 border-amber-200",
          title: "text-amber-900",
          description: "text-amber-700",
          card: "bg-amber-100",
          cardTitle: "text-amber-800",
          cardText: "text-amber-700"
        };
      default:
        return {
          background: "bg-blue-50",
          header: "bg-white border-blue-200",
          title: "text-blue-900",
          description: "text-blue-600",
          card: "bg-white",
          cardTitle: "text-blue-800",
          cardText: "text-blue-600"
        };
    }
  };

  const pageStyles = getPageThemeStyles();

  return (
    <div className={`min-h-screen ${pageStyles.background}`}>
      <MainNav />
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className={`${pageStyles.header} border-b py-12 px-4 mb-8 rounded-lg`}>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className={`text-3xl font-light ${pageStyles.title} mb-4`}>Die Neuen</h1>
            <p className={`${pageStyles.description} font-light`}>
              Aktuelle Nachrichten und Artikel für Deutschlerner
            </p>
          </div>
        </header>
        
        <div className={`text-center ${pageStyles.card} rounded-lg p-12 shadow-sm`}>
          <h2 className={`text-2xl font-medium ${pageStyles.cardTitle} mb-4`}>Coming Soon</h2>
          <p className={pageStyles.cardText}>News articles will be available here soon.</p>
        </div>
      </div>
    </div>
  );
}
