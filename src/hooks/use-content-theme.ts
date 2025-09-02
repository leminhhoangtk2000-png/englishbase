'use client';

import { usePathname } from 'next/navigation';
import { getTheme, type ThemeType } from '@/config/themes';

export function useContentTheme(): { theme: any; themeType: ThemeType } {
  const pathname = usePathname();
  
  // Determine theme based on current path
  let themeType: ThemeType = 'blog'; // default
  
  if (pathname.startsWith('/die-neuen')) {
    themeType = 'news';
  } else if (pathname.startsWith('/exercises')) {
    themeType = 'exercises';
  } else if (pathname.startsWith('/blog-new')) {
    themeType = 'blog';
  }
  
  const theme = getTheme(themeType);
  
  return { theme, themeType };
}
