'use client';

import { useState, useEffect } from 'react';
import { UIThemeType } from '@/config/themes';

export function useTheme() {
  const [theme, setTheme] = useState<UIThemeType>('nude'); // Default to nude theme

  useEffect(() => {
    // Check for saved theme preference or detect from system
    const savedTheme = localStorage.getItem('ui-theme') as UIThemeType;
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    
    if (savedTheme && ['light', 'dark', 'nude'].includes(savedTheme)) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      setTheme(systemTheme);
      document.documentElement.setAttribute('data-theme', systemTheme);
    }
  }, []);

  const switchTheme = (newTheme: UIThemeType) => {
    setTheme(newTheme);
    localStorage.setItem('ui-theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return { theme, switchTheme };
}
