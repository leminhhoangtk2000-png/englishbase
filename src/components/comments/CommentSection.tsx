'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Reply, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface CommentUser {
  id: string;
  name: string | null;
  username: string | null;
  avatar: string | null;
}

interface Comment {
  id: string;
  userId: string;
  commentableType: string;
  commentableId: string;
  content: string;
  parentId: string | null;
  isApproved: boolean;
  isEdited: boolean;
  editedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  user: CommentUser;
  replyCount?: number;
  replies?: Comment[];
}

interface CommentSectionProps {
  commentableType: 'article' | 'exercise' | 'vocabulary' | 'news' | 'post';
  commentableId: string;
  className?: string;
}

export function CommentSection({ 
  commentableType, 
  commentableId,
  className = ''
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());

  // Fetch comments
  useEffect(() => {
    fetchComments();
  }, [commentableType, commentableId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/comments?type=${commentableType}&id=${encodeURIComponent(commentableId)}`);
      const data = await res.json();
      
      if (data.comments) {
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setLoading(false);
    }
  };

  // Submit comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim() || submitting) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentableType,
          commentableId,
          content: newComment.trim(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setNewComment('');
        // Show success message
        alert(data.message || 'Comment submitted! It will appear after approval.');
        // Optionally refresh comments
        // fetchComments();
      } else {
        alert(data.error || 'Failed to submit comment');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment');
    } finally {
      setSubmitting(false);
    }
  };

  // Submit reply
  const handleReplySubmit = async (parentId: string) => {
    if (!replyContent.trim() || submitting) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          commentableType,
          commentableId,
          content: replyContent.trim(),
          parentId,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setReplyContent('');
        setReplyTo(null);
        alert(data.message || 'Reply submitted! It will appear after approval.');
      } else {
        alert(data.error || 'Failed to submit reply');
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      alert('Failed to submit reply');
    } finally {
      setSubmitting(false);
    }
  };

  // Load replies for a comment
  const loadReplies = async (commentId: string) => {
    try {
      const res = await fetch(`/api/comments/${commentId}/replies`);
      const data = await res.json();
      
      if (data.replies) {
        // Update comment with replies
        setComments(prev => prev.map(c => 
          c.id === commentId ? { ...c, replies: data.replies } : c
        ));
        
        // Add to expanded set
        setExpandedReplies(prev => new Set(prev).add(commentId));
      }
    } catch (error) {
      console.error('Error loading replies:', error);
    }
  };

  const toggleReplies = (commentId: string) => {
    if (expandedReplies.has(commentId)) {
      setExpandedReplies(prev => {
        const next = new Set(prev);
        next.delete(commentId);
        return next;
      });
    } else {
      loadReplies(commentId);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Đang tải bình luận...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Bình luận ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận của bạn..."
            rows={3}
            className="resize-none"
            disabled={submitting}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!newComment.trim() || submitting}>
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Gửi bình luận
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Comments list */}
        {comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="space-y-3">
                {/* Comment */}
                <div className="flex gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={comment.user.avatar || undefined} />
                    <AvatarFallback>
                      {(comment.user.name || comment.user.username || 'U').charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm">
                        {comment.user.name || comment.user.username || 'Anonymous'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDistanceToNow(new Date(comment.createdAt), { 
                          addSuffix: true,
                          locale: vi 
                        })}
                      </span>
                      {comment.isEdited && (
                        <span className="text-xs text-muted-foreground italic">
                          (đã chỉnh sửa)
                        </span>
                      )}
                    </div>
                    
                    <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                    
                    <div className="flex items-center gap-4 pt-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-2 text-xs"
                        onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                      >
                        <Reply className="w-3 h-3 mr-1" />
                        Trả lời
                      </Button>
                      
                      {(comment.replyCount || 0) > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2 text-xs"
                          onClick={() => toggleReplies(comment.id)}
                        >
                          {expandedReplies.has(comment.id) ? 'Ẩn' : 'Xem'} {comment.replyCount} câu trả lời
                        </Button>
                      )}
                    </div>

                    {/* Reply form */}
                    {replyTo === comment.id && (
                      <div className="mt-3 space-y-2">
                        <Textarea
                          value={replyContent}
                          onChange={(e) => setReplyContent(e.target.value)}
                          placeholder="Viết câu trả lời..."
                          rows={2}
                          className="resize-none text-sm"
                          disabled={submitting}
                        />
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setReplyTo(null);
                              setReplyContent('');
                            }}
                            disabled={submitting}
                          >
                            Hủy
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleReplySubmit(comment.id)}
                            disabled={!replyContent.trim() || submitting}
                          >
                            {submitting ? (
                              <>
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                Đang gửi...
                              </>
                            ) : (
                              <>
                                <Send className="w-3 h-3 mr-1" />
                                Gửi
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* Replies */}
                    {expandedReplies.has(comment.id) && comment.replies && comment.replies.length > 0 && (
                      <div className="mt-4 pl-4 border-l-2 border-muted space-y-3">
                        {comment.replies.map((reply) => (
                          <div key={reply.id} className="flex gap-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={reply.user.avatar || undefined} />
                              <AvatarFallback>
                                {(reply.user.name || reply.user.username || 'U').charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-semibold text-sm">
                                  {reply.user.name || reply.user.username || 'Anonymous'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDistanceToNow(new Date(reply.createdAt), { 
                                    addSuffix: true,
                                    locale: vi 
                                  })}
                                </span>
                              </div>
                              <p className="text-sm whitespace-pre-wrap">{reply.content}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
