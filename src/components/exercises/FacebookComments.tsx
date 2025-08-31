"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Send, Heart, Reply, Share } from 'lucide-react';

interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

interface FacebookCommentsProps {
  url?: string;
  initialComments?: Comment[];
}

export default function FacebookComments({ url, initialComments = [] }: FacebookCommentsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      const comment: Comment = {
        id: Date.now().toString(),
        author: 'Bạn',
        content: newComment,
        timestamp: new Date().toLocaleDateString('vi-VN'),
        likes: 0,
        replies: []
      };
      setComments([comment, ...comments]);
      setNewComment('');
    }
  };

  const handleSubmitReply = (parentId: string) => {
    if (replyContent.trim()) {
      const reply: Comment = {
        id: Date.now().toString(),
        author: 'Bạn',
        content: replyContent,
        timestamp: new Date().toLocaleDateString('vi-VN'),
        likes: 0
      };

      setComments(comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply]
          };
        }
        return comment;
      }));
      
      setReplyContent('');
      setReplyTo(null);
    }
  };

  const handleLike = (commentId: string, isReply = false, parentId?: string) => {
    if (isReply && parentId) {
      setComments(comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: comment.replies?.map(reply => 
              reply.id === commentId 
                ? { ...reply, likes: reply.likes + 1 }
                : reply
            )
          };
        }
        return comment;
      }));
    } else {
      setComments(comments.map(comment => 
        comment.id === commentId 
          ? { ...comment, likes: comment.likes + 1 }
          : comment
      ));
    }
  };

  const CommentItem = ({ comment, isReply = false, parentId }: { 
    comment: Comment, 
    isReply?: boolean, 
    parentId?: string 
  }) => (
    <div className={`${isReply ? 'ml-6 border-l-2 border-gray-200 pl-4' : ''}`}>
      <div className="flex gap-3 mb-3">
        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-medium">
            {comment.author.charAt(0).toUpperCase()}
          </span>
        </div>
        
        <div className="flex-1">
          <div className="bg-gray-100 rounded-lg p-3">
            <div className="font-medium text-sm text-gray-800 mb-1">
              {comment.author}
            </div>
            <p className="text-gray-700 text-sm">
              {comment.content}
            </p>
          </div>
          
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
            <button 
              onClick={() => handleLike(comment.id, isReply, parentId)}
              className="flex items-center gap-1 hover:text-red-500 transition-colors"
            >
              <Heart className="w-3 h-3" />
              <span>{comment.likes > 0 ? comment.likes : 'Thích'}</span>
            </button>
            
            {!isReply && (
              <button 
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                className="flex items-center gap-1 hover:text-blue-500 transition-colors"
              >
                <Reply className="w-3 h-3" />
                <span>Trả lời</span>
              </button>
            )}
            
            <span>{comment.timestamp}</span>
          </div>
          
          {/* Form trả lời */}
          {replyTo === comment.id && (
            <div className="mt-3 flex gap-2">
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Viết trả lời..."
                className="text-sm min-h-16"
              />
              <div className="flex flex-col gap-1">
                <Button
                  onClick={() => handleSubmitReply(comment.id)}
                  size="sm"
                  disabled={!replyContent.trim()}
                >
                  <Send className="w-3 h-3" />
                </Button>
                <Button
                  onClick={() => setReplyTo(null)}
                  variant="outline"
                  size="sm"
                >
                  Hủy
                </Button>
              </div>
            </div>
          )}
          
          {/* Hiển thị replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {comment.replies.map((reply) => (
                <CommentItem 
                  key={reply.id} 
                  comment={reply} 
                  isReply={true} 
                  parentId={comment.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Card className="my-6 border border-gray-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-800 text-lg">
          <MessageCircle className="w-5 h-5" />
          Hỏi đáp & Thảo luận
        </CardTitle>
        {url && (
          <p className="text-sm text-gray-500">
            Thảo luận về bài học: {url}
          </p>
        )}
      </CardHeader>
      
      <CardContent>
        {/* Form bình luận mới */}
        <div className="mb-6">
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-sm font-medium">B</span>
            </div>
            <div className="flex-1 space-y-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Viết bình luận của bạn..."
                className="min-h-20"
              />
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Send className="w-4 h-4 mr-2" />
                Đăng bình luận
              </Button>
            </div>
          </div>
        </div>

        {/* Danh sách bình luận */}
        <div className="space-y-4">
          {comments.length > 0 ? (
            comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
