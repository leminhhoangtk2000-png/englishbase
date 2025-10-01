'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, Send, Heart, Reply } from 'lucide-react';

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
  };
  createdAt: string;
  likes: number;
  isLiked: boolean;
  replies?: Comment[];
}

interface ExerciseCommentsProps {
  exerciseId: string;
  url?: string;
}

export function ExerciseComments({ exerciseId, url }: ExerciseCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  // Mock user - in real app this would come from auth context
  const mockUser = {
    id: 'current-user',
    name: 'Khoavo Private',
    avatar: '',
    role: 'ADMIN'
  };

  // Load comments from API
  useEffect(() => {
    const loadComments = async () => {
      try {
        const response = await fetch(`/api/exercise-comments?exerciseId=${exerciseId}`);
        if (response.ok) {
          const data = await response.json();
          setComments(data.comments || []);
        } else {
          // Fallback to mock data if API fails
          const mockComments: Comment[] = [
            {
              id: '1',
              content: 'Bài tập này rất hay! Tôi đã học được nhiều từ vựng mới về gia đình. Cảm ơn tác giả! 😊',
              author: {
                id: 'user1',
                name: 'Nguyễn Văn A',
                avatar: '',
                role: 'USER'
              },
              createdAt: '2025-01-20T17:30:00Z',
              likes: 5,
              isLiked: false,
              replies: [
                {
                  id: '2',
                  content: 'Tôi cũng thấy vậy! Phần điền từ rất thú vị.',
                  author: {
                    id: 'user2',
                    name: 'Trần Thị B',
                    avatar: '',
                    role: 'USER_PREMIUM'
                  },
                  createdAt: '2025-01-20T18:00:00Z',
                  likes: 2,
                  isLiked: true
                }
              ]
            },
            {
              id: '3',
              content: 'Video YouTube không load được ở máy tôi. Có thể fix không ạ?',
              author: {
                id: 'user3',
                name: 'Lê Văn C',
                avatar: '',
                role: 'USER'
              },
              createdAt: '2025-01-20T16:15:00Z',
              likes: 1,
              isLiked: false
            }
          ];
          setComments(mockComments);
        }
      } catch (error) {
        console.error('Error loading comments:', error);
        setComments([]);
      }
    };

    loadComments();
  }, [exerciseId]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/exercise-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseId,
          content: newComment,
          exerciseUrl: url,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComments(prev => [data.comment, ...prev]);
        setNewComment('');
      } else {
        // Fallback to mock behavior if API fails
        const comment: Comment = {
          id: Date.now().toString(),
          content: newComment,
          author: mockUser,
          createdAt: new Date().toISOString(),
          likes: 0,
          isLiked: false
        };

        setComments(prev => [comment, ...prev]);
        setNewComment('');
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId: string) => {
    if (!replyContent.trim()) return;

    try {
      const reply: Comment = {
        id: Date.now().toString(),
        content: replyContent,
        author: mockUser,
        createdAt: new Date().toISOString(),
        likes: 0,
        isLiked: false
      };

      setComments(prev => prev.map(comment => 
        comment.id === parentId 
          ? { ...comment, replies: [...(comment.replies || []), reply] }
          : comment
      ));
      
      setReplyContent('');
      setReplyTo(null);
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'bg-red-100 text-red-800';
      case 'USER_PREMIUM': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'ADMIN': return 'Quản trị viên';
      case 'USER_PREMIUM': return 'Premium';
      default: return 'Thành viên';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <MessageCircle className="w-5 h-5" />
          Bình luận ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="flex gap-3">
            <Avatar className="w-8 h-8 flex-shrink-0">
              <AvatarImage src={mockUser.avatar || ''} />
              <AvatarFallback>{mockUser.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Chia sẻ suy nghĩ của bạn về bài tập này..."
                className="min-h-[100px] resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button 
              type="submit" 
              disabled={!newComment.trim() || isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
            </Button>
          </div>
        </form>

        {/* Comments List */}
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="space-y-3">
              {/* Main Comment */}
              <div className="flex gap-3">
                <Avatar className="w-8 h-8 flex-shrink-0">
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{comment.author.name}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getRoleBadgeColor(comment.author.role)}`}>
                      {getRoleDisplayName(comment.author.role)}
                    </span>
                    <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                  </div>
                  <p className="text-sm leading-relaxed">{comment.content}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <button className="flex items-center gap-1 hover:text-purple-600 transition-colors">
                      <Heart className={`w-3 h-3 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                      {comment.likes}
                    </button>
                    {comment.replies && comment.replies.length > 0 && (
                      <span className="flex items-center gap-1 text-gray-500">
                        <MessageCircle className="w-3 h-3" />
                        {comment.replies.length} trả lời
                      </span>
                    )}
                    <button 
                      onClick={() => setReplyTo(comment.id)}
                      className="flex items-center gap-1 hover:text-purple-600 transition-colors"
                    >
                      <Reply className="w-3 h-3" />
                      Trả lời
                    </button>
                  </div>
                </div>
              </div>

              {/* Reply Form */}
              {replyTo === comment.id && (
                <div className="ml-11 space-y-3">
                  <div className="flex gap-3">
                    <Avatar className="w-6 h-6 flex-shrink-0">
                      <AvatarImage src={mockUser.avatar || ''} />
                      <AvatarFallback className="text-xs">{mockUser.name?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <Textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="Viết trả lời..."
                        className="min-h-[60px] text-sm"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setReplyTo(null)}
                    >
                      Hủy
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => handleReply(comment.id)}
                      disabled={!replyContent.trim()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      Trả lời
                    </Button>
                  </div>
                </div>
              )}

              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="ml-11 space-y-3">
                  {comment.replies.map((reply) => (
                    <div key={reply.id} className="flex gap-3">
                      <Avatar className="w-6 h-6 flex-shrink-0">
                        <AvatarImage src={reply.author.avatar} />
                        <AvatarFallback className="text-xs">{reply.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs">{reply.author.name}</span>
                          <span className={`px-1.5 py-0.5 text-xs rounded-full ${getRoleBadgeColor(reply.author.role)}`}>
                            {getRoleDisplayName(reply.author.role)}
                          </span>
                          <span className="text-xs text-gray-500">{formatDate(reply.createdAt)}</span>
                        </div>
                        <p className="text-xs leading-relaxed">{reply.content}</p>
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <button className="flex items-center gap-1 hover:text-purple-600 transition-colors">
                            <Heart className={`w-3 h-3 ${reply.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                            {reply.likes}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {comments.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default ExerciseComments;
