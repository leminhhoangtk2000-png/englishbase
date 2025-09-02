'use client';

import { useContentTheme } from '@/hooks/use-content-theme';
import { getThemeCSS } from '@/config/themes';

interface ThemedPageWrapperProps {
  children: React.ReactNode;
  className?: string;
}

export function ThemedPageWrapper({ children, className = '' }: ThemedPageWrapperProps) {
  const { themeType } = useContentTheme();
  
  return (
    <div 
      className={`theme-${themeType} ${className}`}
      style={getThemeCSS(themeType)}
    >
      {children}
    </div>
  );
}
