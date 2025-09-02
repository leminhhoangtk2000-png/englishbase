'use client';

import { useState, useEffect } from 'react';

interface UseLikeProps {
  url: string;
  initialLikes?: number;
}

export function useLike({ url, initialLikes = 0 }: UseLikeProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load like state from localStorage on mount
  useEffect(() => {
    const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}');
    const articleLikes = JSON.parse(localStorage.getItem('articleLikes') || '{}');
    
    setIsLiked(likedArticles[url] || false);
    setLikes(articleLikes[url] || initialLikes);
  }, [url, initialLikes]);

  const toggleLike = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    
    try {
      const newIsLiked = !isLiked;
      const newLikes = newIsLiked ? likes + 1 : Math.max(0, likes - 1);
      
      // Update local state immediately
      setIsLiked(newIsLiked);
      setLikes(newLikes);
      
      // Update localStorage
      const likedArticles = JSON.parse(localStorage.getItem('likedArticles') || '{}');
      const articleLikes = JSON.parse(localStorage.getItem('articleLikes') || '{}');
      
      likedArticles[url] = newIsLiked;
      articleLikes[url] = newLikes;
      
      localStorage.setItem('likedArticles', JSON.stringify(likedArticles));
      localStorage.setItem('articleLikes', JSON.stringify(articleLikes));
      
      // TODO: In a real app, you would also send this to your backend API
      // await fetch('/api/articles/like', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ url, isLiked: newIsLiked })
      // });
      
    } catch (error) {
      console.error('Error toggling like:', error);
      // Revert on error
      setIsLiked(!isLiked);
      setLikes(isLiked ? likes + 1 : Math.max(0, likes - 1));
    } finally {
      setIsLoading(false);
    }
  };

  return {
    likes,
    isLiked,
    isLoading,
    toggleLike
  };
}
