'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MessageCircle, Send, Heart, Reply, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

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
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Load saved author name from localStorage
  useEffect(() => {
    const savedName = localStorage.getItem('commentAuthorName');
    if (savedName) {
      setAuthorName(savedName);
    }
  }, []);

  // Fetch comments on mount
  useEffect(() => {
    fetchComments();
  }, [contentId]);

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
    
    if (!newComment.trim() || newComment.length < minLength) {
      setError(`Bình luận phải có ít nhất ${minLength} ký tự`);
      return;
    }
    
    if (!authorName.trim() || authorName.length < 2) {
      setError('Tên phải có ít nhất 2 ký tự');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);
      
      // Save author name to localStorage
      localStorage.setItem('commentAuthorName', authorName.trim());
      
      const response = await fetch('/api/page-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contentId,
          content: newComment.trim(),
          authorName: authorName.trim(),
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Add new comment to the top of the list
        setComments(prev => [data.comment, ...prev]);
        setNewComment('');
        // Keep author name for next comment
      } else {
        setError(data.error || 'Failed to post comment');
      }
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Failed to post comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim() || !authorName.trim()) return;

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
          authorName: authorName.trim(),
          parentId,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Add reply to the parent comment
        setComments(prev => prev.map(comment => 
          comment.id === parentId 
            ? { ...comment, replies: [...(comment.replies || []), data.comment] }
            : comment
        ));
        setReplyContent('');
        setReplyTo(null);
      } else {
        setError(data.error || 'Failed to post reply');
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

  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-pulse space-y-4 w-full">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          {title} {showCount && `(${comments.length})`}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
            <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
          </div>
        )}

        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 space-y-3">
              <Input
                type="text"
                placeholder="Tên của bạn..."
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="text-sm"
                required
                minLength={2}
              />
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                className="min-h-[80px] resize-none"
                required
                minLength={minLength}
              />
              <Button
                type="submit"
                disabled={submitting || !newComment.trim() || !authorName.trim()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <Send className="w-4 h-4 mr-2" />
                {submitting ? 'Đang đăng...' : 'Đăng bình luận'}
              </Button>
            </div>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
            </div>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0">
                {/* Main Comment */}
                <div className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gray-500 text-white text-xs">
                      {getAuthorInitials(comment.author.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{comment.author.name}</span>
                        {comment.author.isGuest && (
                          <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                            Khách
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 leading-relaxed">
                        {comment.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>{formatDate(comment.createdAt)}</span>
                      <button 
                        className="flex items-center gap-1 hover:text-red-500 transition-colors"
                        disabled
                      >
                        <Heart className="w-3 h-3" />
                        {comment.likes}
                      </button>
                      <button
                        onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                        className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                      >
                        <Reply className="w-3 h-3" />
                        Trả lời
                      </button>
                    </div>

                    {/* Reply Form */}
                    {replyTo === comment.id && (
                      <div className="mt-3 ml-2">
                        <div className="flex gap-2">
                          <Textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Viết trả lời..."
                            className="text-sm min-h-[60px] resize-none"
                            rows={2}
                          />
                          <div className="flex flex-col gap-1">
                            <Button
                              size="sm"
                              onClick={() => handleSubmitReply(comment.id)}
                              disabled={submitting || !replyContent.trim()}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Gửi
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setReplyTo(null);
                                setReplyContent('');
                              }}
                            >
                              Hủy
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="mt-3 ml-6 space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-2">
                            <Avatar className="w-6 h-6">
                              <AvatarFallback className="bg-gray-400 text-white text-xs">
                                {getAuthorInitials(reply.author.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-2">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="font-medium text-xs">{reply.author.name}</span>
                                  {reply.author.isGuest && (
                                    <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-600 px-1 py-0.5 rounded">
                                      Khách
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                                  {reply.content}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                                <span>{formatDate(reply.createdAt)}</span>
                                <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                                  <Heart className="w-3 h-3" />
                                  {reply.likes}
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
      </CardContent>
    </Card>
  );
}

export default UniversalComments;
