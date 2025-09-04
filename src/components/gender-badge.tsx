"use client";

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { GermanGender, formatGenderDisplay, getGenderColor } from '@/lib/gender-utils';

interface GenderBadgeProps {
  gender: GermanGender;
  size?: 'sm' | 'md' | 'lg';
  showFullForm?: boolean;
  className?: string;
}

export function GenderBadge({ 
  gender, 
  size = 'md', 
  showFullForm = false,
  className = '' 
}: GenderBadgeProps) {
  if (!gender) return null;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-xs px-2 py-1',
    lg: 'text-sm px-2.5 py-1.5'
  };

  const display = showFullForm ? gender : formatGenderDisplay(gender);

  return (
    <Badge 
      variant="outline" 
      className={`font-medium ${sizeClasses[size]} ${getGenderColor(gender)} ${className}`}
      title={`Giống từ: ${gender} (${
        gender === 'der' ? 'giống đực' : 
        gender === 'die' ? 'giống cái' : 
        'giống trung tính'
      })`}
    >
      {display}
    </Badge>
  );
}

interface GenderInfoProps {
  gender: GermanGender;
  german: string;
  className?: string;
}

export function GenderInfo({ gender, german, className = '' }: GenderInfoProps) {
  if (!gender) return null;

  const genderNames = {
    der: 'giống đực (masculin)',
    die: 'giống cái (feminin)', 
    das: 'giống trung tính (neutrum)'
  };

  return (
    <div className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>
      <span className="font-medium">{gender}</span> {german.replace(/^(der|die|das)\s+/, '')} 
      <span className="ml-2 text-xs">({genderNames[gender]})</span>
    </div>
  );
}
