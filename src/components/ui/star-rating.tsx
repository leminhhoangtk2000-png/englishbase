'use client';

import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = 'md',
  showLabel = false 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = useState(0);

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const getRatingLabel = (value: number) => {
    const labels = [
      'Rất tệ',
      'Tệ', 
      'Bình thường',
      'Tốt',
      'Xuất sắc'
    ];
    return labels[value - 1] || '';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => {
          const isFilled = (hoverRating || rating) >= star;
          return (
            <button
              key={star}
              type="button"
              onClick={() => handleClick(star)}
              onMouseEnter={() => !readonly && setHoverRating(star)}
              onMouseLeave={() => !readonly && setHoverRating(0)}
              disabled={readonly}
              className={`
                ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
                transition-all duration-150
                ${!readonly && 'focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded'}
              `}
            >
              <Star
                className={`
                  ${sizeClasses[size]}
                  ${isFilled ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                  transition-colors duration-150
                `}
              />
            </button>
          );
        })}
      </div>
      {showLabel && (hoverRating || rating) > 0 && (
        <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[90px]">
          {getRatingLabel(hoverRating || rating)}
        </span>
      )}
    </div>
  );
}
