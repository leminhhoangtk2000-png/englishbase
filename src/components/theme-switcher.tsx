'use client';

import { useTheme } from '@/hooks/use-theme';
import { Button } from '@/components/ui/button';
import { Moon, Sun, Palette } from 'lucide-react';
import { getUITheme } from '@/config/themes';

export function ThemeSwitcher() {
  const { theme, switchTheme } = useTheme();
  const currentTheme = getUITheme(theme);

  return (
    <div className={`fixed bottom-4 right-4 flex gap-1 ${currentTheme.css.background} p-1 rounded-lg shadow-lg ${currentTheme.css.border} border`}>
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchTheme('light')}
        className={`flex items-center gap-1 ${theme === 'light' ? 'bg-blue-600 text-white' : currentTheme.css.textSecondary}`}
      >
        <Sun className="w-4 h-4" />
        Light
      </Button>
      
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchTheme('dark')}
        className={`flex items-center gap-1 ${theme === 'dark' ? 'bg-blue-600 text-white' : currentTheme.css.textSecondary}`}
      >
        <Moon className="w-4 h-4" />
        Dark
      </Button>
      
      <Button
        variant={theme === 'nude' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchTheme('nude')}
        className={`flex items-center gap-1 ${theme === 'nude' ? 'bg-amber-700 text-white' : currentTheme.css.textSecondary}`}
      >
        <Palette className="w-4 h-4" />
        Nude
      </Button>
    </div>
  );
}
