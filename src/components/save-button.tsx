"use client";

import React from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useVocabulary, VocabularyEntry } from '@/hooks/use-vocabulary';
import { useToast } from '@/hooks/use-toast';

interface SaveButtonProps {
  word: VocabularyEntry;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'ghost' | 'outline';
  className?: string;
}

export function SaveButton({ 
  word, 
  size = 'sm', 
  variant = 'ghost',
  className = ''
}: SaveButtonProps) {
  const { addToSaved, removeFromSaved, isWordSaved } = useVocabulary();
  const { toast } = useToast();
  const isSaved = isWordSaved(word.id);

  const handleToggleSave = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click events
    
    if (isSaved) {
      removeFromSaved(word.id);
      toast({
        title: "Đã xóa khỏi danh sách",
        description: `"${word.german}" đã được xóa khỏi từ vựng đã lưu.`,
        variant: "default",
      });
    } else {
      addToSaved(word);
      toast({
        title: "Đã lưu từ vựng",
        description: `"${word.german}" đã được thêm vào danh sách từ vựng đã lưu.`,
        variant: "default",
      });
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8';
      case 'md': return 'h-10 w-10';
      case 'lg': return 'h-12 w-12';
      default: return 'h-8 w-8';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-4 w-4';
      case 'md': return 'h-5 w-5';
      case 'lg': return 'h-6 w-6';
      default: return 'h-4 w-4';
    }
  };

  return (
    <Button
      variant={variant}
      size="icon"
      className={`${getButtonSize()} ${className} transition-colors ${
        isSaved 
          ? 'text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50' 
          : 'hover:bg-gray-100 hover:text-gray-700'
      }`}
      onClick={handleToggleSave}
      title={isSaved ? "Xóa khỏi danh sách đã lưu" : "Lưu từ vựng"}
    >
      {isSaved ? (
        <BookmarkCheck className={`${getIconSize()} fill-current`} />
      ) : (
        <Bookmark className={getIconSize()} />
      )}
      <span className="sr-only">
        {isSaved ? "Xóa khỏi danh sách đã lưu" : "Lưu từ vựng"}
      </span>
    </Button>
  );
}

export default SaveButton;
