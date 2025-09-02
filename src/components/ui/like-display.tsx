'use client';

import { Heart } from 'lucide-react';
import { useLike } from '@/hooks/use-like';
import { cn } from '@/lib/utils';

interface LikeDisplayProps {
  url: string;
  initialLikes?: number;
  className?: string;
  showIcon?: boolean;
}

export function LikeDisplay({ 
  url, 
  initialLikes = 0,
  className,
  showIcon = true
}: LikeDisplayProps) {
  const { likes } = useLike({ url, initialLikes });

  return (
    <span className={cn("flex items-center gap-1 text-sm text-gray-500", className)}>
      {showIcon && <Heart className="w-3 h-3" />}
      {likes}
    </span>
  );
}
