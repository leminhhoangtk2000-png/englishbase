'use client';

import { Button } from '@/components/ui/button';
import { useContentTheme } from '@/hooks/use-content-theme';
import { cn } from '@/lib/utils';
import { ButtonProps } from '@/components/ui/button';

interface ThemedButtonProps extends ButtonProps {
  themeVariant?: 'primary' | 'outline' | 'ghost';
}

export function ThemedButton({ 
  className, 
  themeVariant = 'primary',
  ...props 
}: ThemedButtonProps) {
  const { theme } = useContentTheme();
  
  const getThemeClasses = () => {
    switch (themeVariant) {
      case 'primary':
        return theme.css.button;
      case 'outline':
        return theme.css.buttonOutline;
      case 'ghost':
        return 'hover:text-current';
      default:
        return '';
    }
  };
  
  return (
    <Button
      className={cn(getThemeClasses(), className)}
      {...props}
    />
  );
}
