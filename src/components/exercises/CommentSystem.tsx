"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MessageCircle, MoreHorizontal, Send, Hand, Reply } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  createdAt: Date;
  claps: number;
  isClapped: boolean;
  replies: Comment[];
  parentId?: string;
}

interface CommentSystemProps {
  exerciseId: string;
  currentUserId?: string;
  currentUserName?: string;
  currentUserAvatar?: string;
  showCommentsInitially?: boolean; // Control whether comments are visible by default
}

const CommentItem: React.FC<{
  comment: Comment;
  onReply: (parentId: string, content: string) => void;
  onClap: (commentId: string) => void;
  currentUserId?: string;
  currentUserName?: string;
  currentUserAvatar?: string;
  level?: number;
}> = ({ comment, onReply, onClap, currentUserId, currentUserName, currentUserAvatar, level = 0 }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [repliesVisible, setRepliesVisible] = useState(false);

  const handleReply = () => {
    if (replyContent.trim()) {
      onReply(comment.id, replyContent);
      setReplyContent('');
      setIsReplying(false);
      setRepliesVisible(true);
    }
  };

  const handleClap = () => {
    onClap(comment.id);
  };

  const hasReplies = comment.replies && comment.replies.length > 0;

  const toggleReplies = () => {
    if (hasReplies) {
      setRepliesVisible(!repliesVisible);
    }
  };

  const handleReplyClick = () => {
    setIsReplying(!isReplying);
  };

  return (
    <div className={level > 0 ? "ml-12 border-l-2 border-gray-200 dark:border-gray-700 pl-6" : ""}>
      <div className="flex items-start gap-4 py-6">
        <Avatar className="h-12 w-12">
          <AvatarImage src={comment.authorAvatar} alt={comment.authorName} />
          <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-medium">
            {comment.authorName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <p className="font-semibold text-gray-900 dark:text-gray-100">{comment.authorName}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {formatDistanceToNow(comment.createdAt, { 
                addSuffix: true,
                locale: vi 
              })}
            </p>
            <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4 text-[15px]">{comment.content}</p>
          
          <div className="flex items-center gap-6 text-sm">
            <div 
              className={`flex items-center gap-2 cursor-pointer transition-colors ${
                comment.isClapped 
                  ? 'text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300' 
                  : 'text-gray-600 dark:text-gray-400 hover:text-orange-600 dark:hover:text-orange-400'
              }`}
              onClick={handleClap}
            >
              <Hand className={`w-5 h-5 ${comment.isClapped ? 'fill-current' : ''}`} />
              <span className="font-medium">{comment.claps}</span>
            </div>

            {hasReplies && (
              <div 
                onClick={toggleReplies} 
                className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="font-medium">{comment.replies?.length}</span>
              </div>
            )}
            
            <span 
              onClick={handleReplyClick} 
              className="cursor-pointer text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
            >
              Reply
            </span>
          </div>

      {isReplying && (
        <div className="mt-6 ml-16">
          <div className="flex items-start gap-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUserAvatar} alt={currentUserName} />
              <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-medium">
                {currentUserName?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="font-semibold mb-3 text-gray-900 dark:text-gray-100 text-sm">{currentUserName}</p>
              <Textarea 
                placeholder={`Reply to ${comment.authorName}...`} 
                className="min-h-[80px] resize-none text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder:text-gray-500 dark:placeholder:text-gray-400 text-sm"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className="flex justify-between items-center mt-3">
                <Button 
                  variant="ghost" 
                  onClick={() => setIsReplying(false)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleReply}
                  disabled={!replyContent.trim()}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed text-sm h-9 font-medium"
                >
                  <Send className="h-3 w-3 mr-2" />
                  Reply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasReplies && repliesVisible && (
        <div className="mt-4">
          {comment.replies?.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onReply={onReply}
              onClap={onClap}
              currentUserId={currentUserId}
              currentUserName={currentUserName}
              currentUserAvatar={currentUserAvatar}
              level={level + 1}
            />
          ))}
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default function CommentSystem({ 
  exerciseId, 
  currentUserId,
  currentUserName = "Khoavo Private",
  currentUserAvatar,
  showCommentsInitially = false
}: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showComments, setShowComments] = useState(showCommentsInitially);

  // Calculate total comment count including replies
  const getTotalCommentCount = () => {
    return comments.reduce((total, comment) => {
      return total + 1 + comment.replies.length;
    }, 0);
  };

  // Load comments from API
  useEffect(() => {
    const loadComments = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/comments?exerciseId=${exerciseId}`);
        const data = await response.json();
        
        if (data.success) {
          setComments(data.comments);
        } else {
          console.error('Failed to load comments:', data.error);
          // Fallback to mock data for demo
          setComments([
            {
              id: '1',
              content: 'I used to be a doom-scroller and these apps really helped me to break the habit. Thanks for sharing!',
              authorId: 'user1',
              authorName: 'Carl Cort',
              authorAvatar: '/avatars/carl.jpg',
              createdAt: new Date(Date.now() - 2 * 60 * 1000),
              claps: 2,
              isClapped: false,
              replies: [
                {
                  id: '2',
                  content: "Great list! I'd also add 'Readwise' to the list. It's a great app for saving and revisiting highlights from articles and books.",
                  authorId: 'user2',
                  authorName: 'J.P. Lamborn',
                  authorAvatar: '/avatars/jp.jpg',
                  createdAt: new Date(Date.now() - 1 * 60 * 1000),
                  claps: 1,
                  isClapped: false,
                  replies: [],
                  parentId: '1'
                }
              ],
              parentId: undefined
            }
          ]);
        }
      } catch (error) {
        console.error('Error loading comments:', error);
        // Fallback to mock data for demo
        setComments([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadComments();
  }, [exerciseId]);

  const handleSubmitComment = async () => {
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    
    // For demo purposes, just add to local state
    const comment: Comment = {
      id: Date.now().toString(),
      content: newComment,
      authorId: currentUserId || 'demo-user',
      authorName: currentUserName,
      authorAvatar: currentUserAvatar,
      createdAt: new Date(),
      claps: 0,
      isClapped: false,
      replies: []
    };
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setComments(prev => [comment, ...prev]);
    setNewComment('');
    setIsSubmitting(false);
  };

  const handleReply = async (parentId: string, content: string) => {
    if (!content.trim()) return;

    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          exerciseId,
          content,
          authorId: currentUserId || 'demo-user',
          parentId
        })
      });

      const data = await response.json();

      if (data.success) {
        // Add reply to the correct parent comment
        setComments(prev => prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...comment.replies, data.comment]
            };
          }
          return comment;
        }));
      } else {
        console.error('Failed to submit reply:', data.error);
        // Fallback to client-side only for demo
        const reply: Comment = {
          id: Date.now().toString(),
          content,
          authorId: currentUserId || 'anonymous',
          authorName: currentUserName,
          authorAvatar: currentUserAvatar,
          createdAt: new Date(),
          claps: 0,
          isClapped: false,
          replies: [],
          parentId
        };

        setComments(prev => prev.map(comment => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...comment.replies, reply]
            };
          }
          return comment;
        }));
      }
    } catch (error) {
      console.error('Error submitting reply:', error);
      // Fallback to client-side only for demo
      const reply: Comment = {
        id: Date.now().toString(),
        content,
        authorId: currentUserId || 'anonymous',
        authorName: currentUserName,
        authorAvatar: currentUserAvatar,
        createdAt: new Date(),
        claps: 0,
        isClapped: false,
        replies: [],
        parentId
      };

      setComments(prev => prev.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...comment.replies, reply]
          };
        }
        return comment;
      }));
    }
  };

  const handleClap = async (commentId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));

    setComments(prev => prev.map(comment => {
      if (comment.id === commentId) {
        return {
          ...comment,
          claps: comment.isClapped ? comment.claps - 1 : comment.claps + 1,
          isClapped: !comment.isClapped
        };
      }
      // Handle nested replies
      return {
        ...comment,
        replies: comment.replies.map(reply => {
          if (reply.id === commentId) {
            return {
              ...reply,
              claps: reply.isClapped ? reply.claps - 1 : reply.claps + 1,
              isClapped: !reply.isClapped
            };
          }
          return reply;
        })
      };
    }));
  };

  if (isLoading) {
    return (
      <div className="w-full">
        {/* Comment Toggle Button - Show during loading */}
        <Button 
          variant="outline" 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 mb-4"
          disabled
        >
          <MessageCircle className="h-4 w-4" />
          <span>Đang tải bình luận...</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Only show toggle button if not initially showing comments */}
      {!showCommentsInitially && (
        <Button 
          variant="outline" 
          onClick={() => setShowComments(!showComments)}
          className="flex items-center gap-2 mb-4 hover:bg-blue-50 border-blue-200 transition-all duration-200 hover:shadow-sm"
        >
          <MessageCircle className={`h-4 w-4 transition-transform duration-200 ${showComments ? 'text-blue-600' : 'text-gray-600'}`} />
          <span className="font-medium">Bình luận ({getTotalCommentCount()})</span>
          <span className={`text-xs transition-colors duration-200 ${showComments ? 'text-blue-600' : 'text-gray-500'}`}>
            {showComments ? '- Ẩn bình luận' : '- Hiển thị bình luận'}
          </span>
        </Button>
      )}

      {/* Comments Section - Show when toggled OR when initially set to show */}
      {(showComments || showCommentsInitially) && (
        <div className="animate-in slide-in-from-top-1 duration-300">
          <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Responses ({getTotalCommentCount()})</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* New Comment Input */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={currentUserAvatar} alt={currentUserName} />
                    <AvatarFallback className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm font-medium">
                      {currentUserName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="w-full">
                    <p className="font-semibold mb-3 text-gray-900 dark:text-gray-100">{currentUserName}</p>
                    <Textarea 
                      placeholder="What are your thoughts?"
                      className="min-h-[120px] resize-none text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900 placeholder:text-gray-500 dark:placeholder:text-gray-400"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    {newComment.trim() && (
                      <div className="flex justify-end mt-3">
                        <Button 
                          onClick={handleSubmitComment}
                          disabled={!newComment.trim() || isSubmitting}
                          className="px-6 bg-green-600 hover:bg-green-700 dark:bg-green-600 dark:hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Posting...
                          </div>
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
                            Post response
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Comments List */}
            <div className="space-y-6">
              {comments.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50 text-gray-400 dark:text-gray-500" />
                  <p className="text-lg font-medium mb-2 text-gray-700 dark:text-gray-300">No responses yet</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Be the first to share your thoughts!</p>
                </div>
              ) : (
                comments.map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    onReply={handleReply}
                    onClap={handleClap}
                    currentUserId={currentUserId}
                    currentUserName={currentUserName}
                    currentUserAvatar={currentUserAvatar}
                  />
                ))
              )}
            </div>

            {/* Show More Button */}
            {comments.length > 0 && (
              <div className="text-center">
                <Button variant="outline" className="rounded-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
                  Show more responses
                </Button>
              </div>
            )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
