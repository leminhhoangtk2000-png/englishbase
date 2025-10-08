'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, Heart, Reply } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

interface CommentAuthor {
  id: string;
  name: string;
  avatar?: string | null;
  isGuest?: boolean;
}

interface Comment {
  id: string;
  content: string;
  author: CommentAuthor;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  parentId?: string | null;
  replies?: Comment[];
}

interface UniversalCommentsProps {
  /**
   * Unique identifier for the content being commented on
   * Can be a URL path, slug, or any unique string
   */
  contentId: string;
  
  /**
   * Optional title for the comments section
   */
  title?: string;
  
  /**
   * Optional class name for styling
   */
  className?: string;
  
  /**
   * Whether to show the total comment count in the title
   */
  showCount?: boolean;
  
  /**
   * Minimum comment length
   */
  minLength?: number;
}

export function UniversalComments({ 
  contentId, 
  title = "Bình luận", 
  className = "",
  showCount = true,
  minLength = 3
}: UniversalCommentsProps) {
  const { user, loading: authLoading } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState('');

  // Fetch comments on mount
  useEffect(() => {
    fetchComments();
  }, [contentId]);

  // Get current path for return URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/page-comments?contentId=${encodeURIComponent(contentId)}`);
      const data = await response.json();
      
      if (data.success) {
        setComments(data.comments || []);
      } else {
        setError(data.error || 'Failed to load comments');
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Bạn cần đăng nhập để bình luận');
      return;
    }
    
    if (!newComment.trim() || newComment.length < minLength) {
      setError(`Bình luận phải có ít nhất ${minLength} ký tự`);
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      const response = await fetch('/api/page-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId,
          content: newComment.trim(),
        }),
        credentials: 'include', // Important for authentication
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Add new comment to the top of the list
        setComments(prev => [data.comment, ...prev]);
        setNewComment('');
      } else {
        if (response.status === 401) {
          setError('Bạn cần đăng nhập để bình luận');
        } else {
          setError(data.error || 'Failed to post comment');
        }
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!user) {
      setError('Bạn cần đăng nhập để trả lời');
      return;
    }
    
    if (!replyContent.trim()) return;

    try {
      setSubmitting(true);
      setError(null);
      
      const response = await fetch('/api/page-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId,
          content: replyContent.trim(),
          parentId,
        }),
        credentials: 'include', // Important for authentication
      });
      
      const data = await response.json();
      
      if (data.success) {
        if (parentId) {
          // Add reply to the parent comment
          setComments(prev => prev.map(comment => 
            comment.id === parentId 
              ? { ...comment, replies: [...(comment.replies || []), data.comment] }
              : comment
          ));
        } else {
          // This shouldn't happen in reply context, but handle it gracefully
          console.warn('Reply created without parentId');
        }
        setReplyContent('');
        setReplyTo(null);
      } else {
        if (response.status === 401) {
          setError('Bạn cần đăng nhập để trả lời');
        } else {
          setError(data.error || 'Failed to post reply');
        }
      }
    } catch (err) {
      console.error('Error posting reply:', err);
      setError('Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: vi
      });
    } catch {
      return 'vừa xong';
    }
  };

  const getAuthorInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading || authLoading) {
    return (
      <div className={`w-full ${className}`}>
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
            <div>
              <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-24 animate-pulse mb-1"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
            <div className="flex gap-3 animate-pulse">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Simple Header */}
      <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6 border border-gray-200 dark:border-gray-700 mb-6">
        <div className="flex items-center gap-3">
          <MessageCircle className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {title} {showCount && comments.length > 0 && `(${comments.length})`}
            </h2>
            {showCount && comments.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Chưa có bình luận nào
              </p>
            )}
          </div>
        </div>
      </div>
      
      {/* One Single Container for Everything */}
      <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-b border-red-200 dark:border-red-800 p-3">
            <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
          </div>
        )}

        {/* Comment Form */}
        {user ? (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <form onSubmit={handleSubmitComment} className="space-y-3">
              <div className="flex gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  {getAuthorInitials(user.name || 'User')}
                </div>
                <div className="flex-1">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Bình luận với tên <span className="font-medium text-gray-700 dark:text-gray-300">{user.name || 'User'}</span>
                  </div>
                  <Textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Chia sẻ suy nghĩ của bạn về bài tập này..."
                    className="min-h-[80px] resize-none text-sm"
                    required
                    minLength={minLength}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs text-gray-400">
                      {newComment.length < minLength && newComment.length > 0 && 
                        `Cần thêm ${minLength - newComment.length} ký tự`
                      }
                    </span>
                    <Button
                      type="submit"
                      disabled={submitting || !newComment.trim() || newComment.length < minLength}
                      size="sm"
                      className="bg-blue-500 hover:bg-blue-600 text-white"
                    >
                      {submitting ? 'Đang gửi...' : 'Gửi bình luận'}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        ) : (
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 text-center">
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100 mb-2">
              Đăng nhập để bình luận
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Tham gia thảo luận và chia sẻ ý kiến của bạn
            </p>
            <div className="flex gap-2 justify-center">
              <Link href={`/login${currentPath ? `?returnUrl=${encodeURIComponent(currentPath)}` : ''}`}>
                <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                  Đăng nhập
                </Button>
              </Link>
              <Link href={`/signup${currentPath ? `?returnUrl=${encodeURIComponent(currentPath)}` : ''}`}>
                <Button size="sm" variant="outline">
                  Đăng ký
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Comments List - All in one container */}
        <div>
          {comments.length === 0 ? (
            <div className="text-center py-8 p-4">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" />
              <p className="text-gray-500 dark:text-gray-400">
                {user ? 'Hãy là người đầu tiên bình luận!' : 'Đăng nhập để bắt đầu thảo luận!'}
              </p>
            </div>
          ) : (
            comments.map((comment, index) => (
              <div key={comment.id} className={`p-4 ${index !== comments.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}>
                {/* Comment Content */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                    {getAuthorInitials(comment.author.name)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-medium text-gray-900 dark:text-gray-100 text-sm">
                        {comment.author.name}
                      </span>
                      {comment.author.isGuest && (
                        <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">
                          Khách
                        </span>
                      )}
                      <span className="text-xs text-gray-400">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-3">
                      {comment.content}
                    </p>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <button 
                        className="flex items-center gap-1 hover:text-red-500 transition-colors"
                        disabled
                      >
                        <Heart className="w-3 h-3" />
                        <span>{comment.likes}</span>
                      </button>
                      {user && (
                        <button
                          onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                          className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                        >
                          <Reply className="w-3 h-3" />
                          <span>{replyTo === comment.id ? 'Hủy' : 'Trả lời'}</span>
                        </button>
                      )}
                    </div>

                    {/* Reply Form */}
                    {replyTo === comment.id && user && (
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <div className="flex gap-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                            {getAuthorInitials(user.name || 'User')}
                          </div>
                          <div className="flex-1 space-y-2">
                            <Textarea
                              value={replyContent}
                              onChange={(e) => setReplyContent(e.target.value)}
                              placeholder="Viết trả lời..."
                              className="text-sm min-h-[60px] resize-none"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleSubmitReply(comment.id)}
                                disabled={submitting || !replyContent.trim()}
                                className="bg-blue-500 hover:bg-blue-600 text-white text-xs"
                              >
                                {submitting ? 'Đang gửi...' : 'Gửi'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setReplyTo(null);
                                  setReplyContent('');
                                }}
                                className="text-xs"
                              >
                                Hủy
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-2">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-medium flex-shrink-0">
                              {getAuthorInitials(reply.author.name)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="bg-gray-50 dark:bg-gray-700 rounded p-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-xs text-gray-900 dark:text-gray-100">
                                    {reply.author.name}
                                  </span>
                                  {reply.author.isGuest && (
                                    <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded">
                                      Khách
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-400">
                                    {formatDate(reply.createdAt)}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {reply.content}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                                <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                                  <Heart className="w-3 h-3" />
                                  <span>{reply.likes}</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default UniversalComments;
