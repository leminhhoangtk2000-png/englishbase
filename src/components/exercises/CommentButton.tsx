"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, ThumbsUp } from 'lucide-react';
import CommentSystem from './CommentSystem';

interface CommentButtonProps {
  exerciseId: string;
  currentUserId?: string;
  currentUserName?: string;
  currentUserAvatar?: string;
  variant?: 'compact' | 'inline' | 'floating';
  className?: string;
}

export default function CommentButton({ 
  exerciseId, 
  currentUserId,
  currentUserName = "Người dùng",
  currentUserAvatar,
  variant = 'compact',
  className = ''
}: CommentButtonProps) {
  const [showComments, setShowComments] = useState(false);
  const [commentCount, setCommentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Load comment count
  useEffect(() => {
    const loadCommentCount = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/comments?exerciseId=${exerciseId}`);
        const data = await response.json();
        
        if (data.success) {
          // Count total including replies
          const totalCount = data.comments.reduce((total: number, comment: any) => {
            return total + 1 + (comment.replies ? comment.replies.length : 0);
          }, 0);
          setCommentCount(totalCount);
        }
      } catch (error) {
        console.error('Error loading comment count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCommentCount();
  }, [exerciseId]);

  const getButtonStyle = () => {
    switch (variant) {
      case 'inline':
        return "bg-transparent hover:bg-gray-100 text-gray-600 hover:text-gray-800 border-0 shadow-none";
      case 'floating':
        return "fixed bottom-4 right-4 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white border-0";
      case 'compact':
      default:
        return "hover:bg-blue-50 border-blue-200 text-gray-700 hover:text-blue-700";
    }
  };

  const getIconSize = () => {
    return variant === 'floating' ? 'h-5 w-5' : 'h-4 w-4';
  };

  if (isLoading) {
    return (
      <Button 
        variant="outline" 
        disabled
        className={`flex items-center gap-2 ${getButtonStyle()} ${className}`}
      >
        <MessageCircle className={getIconSize()} />
        <span>...</span>
      </Button>
    );
  }

  if (showComments) {
    return (
      <div className="w-full">
        {/* Close Button */}
        <Button 
          variant="outline" 
          onClick={() => setShowComments(false)}
          className={`flex items-center gap-2 mb-4 ${getButtonStyle()}`}
        >
          <MessageCircle className="h-4 w-4 text-blue-600" />
          <span className="font-medium">Ẩn bình luận ({commentCount})</span>
        </Button>

        {/* Full Comment System */}
        <CommentSystem 
          exerciseId={exerciseId}
          currentUserId={currentUserId}
          currentUserName={currentUserName}
          currentUserAvatar={currentUserAvatar}
          showCommentsInitially={true}
        />
      </div>
    );
  }

  return (
    <Button 
      variant="outline" 
      onClick={() => setShowComments(true)}
      className={`flex items-center gap-2 transition-all duration-200 hover:shadow-sm ${getButtonStyle()} ${className}`}
    >
      <MessageCircle className={`${getIconSize()} transition-transform duration-200`} />
      <span className={variant === 'floating' ? 'sr-only' : ''}>
        {variant === 'floating' ? '' : `Bình luận (${commentCount})`}
      </span>
      {variant === 'floating' && commentCount > 0 && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {commentCount > 99 ? '99+' : commentCount}
        </div>
      )}
    </Button>
  );
}
