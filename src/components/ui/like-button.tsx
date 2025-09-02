'use client';

import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLike } from '@/hooks/use-like';
import { useContentTheme } from '@/hooks/use-content-theme';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  url: string;
  initialLikes?: number;
  variant?: 'default' | 'compact';
  className?: string;
}

export function LikeButton({ 
  url, 
  initialLikes = 0, 
  variant = 'default',
  className 
}: LikeButtonProps) {
  const { likes, isLiked, isLoading, toggleLike } = useLike({ url, initialLikes });
  const { theme } = useContentTheme();

  if (variant === 'compact') {
    return (
      <Button
        onClick={toggleLike}
        disabled={isLoading}
        variant="ghost"
        size="sm"
        className={cn("text-gray-600 hover:text-red-500 transition-colors", className)}
      >
        <Heart 
          className={cn(
            "w-4 h-4 mr-2 transition-colors",
            isLiked ? "fill-red-500 text-red-500" : ""
          )} 
        />
        {likes}
      </Button>
    );
  }

  return (
    <Button
      onClick={toggleLike}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className={cn(
        "gap-2 transition-all duration-200",
        isLiked 
          ? `border-red-200 bg-red-50 text-red-600 hover:bg-red-100` 
          : `border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600`,
        className
      )}
    >
      <Heart 
        className={cn(
          "w-4 h-4 transition-all duration-200",
          isLiked ? "fill-red-500 text-red-500 scale-110" : ""
        )} 
      />
      <span className="font-medium">
        {isLiked ? 'Gefällt mir' : 'Gefällt mir'} ({likes})
      </span>
    </Button>
  );
}
