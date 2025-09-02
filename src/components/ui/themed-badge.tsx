'use client';

import { Badge } from '@/components/ui/badge';
import { useContentTheme } from '@/hooks/use-content-theme';
import { cn } from '@/lib/utils';
import { VariantProps } from 'class-variance-authority';

interface ThemedBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'themed';
  children: React.ReactNode;
}

export function ThemedBadge({ 
  className, 
  variant = 'themed',
  children,
  ...props 
}: ThemedBadgeProps) {
  const { theme } = useContentTheme();
  
  const getThemeClasses = () => {
    if (variant === 'themed') {
      return theme.css.badge;
    }
    return '';
  };
  
  return (
    <Badge
      variant={variant === 'themed' ? 'outline' : variant}
      className={cn(variant === 'themed' && getThemeClasses(), className)}
      {...props}
    >
      {children}
    </Badge>
  );
}
