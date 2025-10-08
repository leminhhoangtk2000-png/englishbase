'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface Comment {
  id: string
  content: string
  createdAt: string
  user: {
    name: string
    email: string
  }
  replies?: Comment[]
}

interface UniversalCommentsProps {
  pageId: string
}

export function UniversalComments({ pageId }: UniversalCommentsProps) {
  const { user, loading } = useAuth()
  const pathname = usePathname()
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingComments, setLoadingComments] = useState(true)

  // Get current path for return URL
  const currentPath = pathname + (typeof window !== 'undefined' ? window.location.search : '')

  useEffect(() => {
    fetchComments()
  }, [pageId])

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/page-comments?pageId=${encodeURIComponent(pageId)}`)
      if (response.ok) {
        const data = await response.json()
        setComments(data.comments || [])
      }
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoadingComments(false)
    }
  }

  const submitComment = async (content: string, parentId?: string) => {
    if (!user || !content.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/page-comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pageId,
          content: content.trim(),
          parentId: parentId || null,
        }),
      })

      if (response.ok) {
        await fetchComments()
        setNewComment('')
        setReplyTo(null)
        setReplyContent('')
      } else {
        console.error('Failed to submit comment')
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newComment.trim()) {
      submitComment(newComment)
    }
  }

  const handleReplySubmit = (e: React.FormEvent, parentId: string) => {
    e.preventDefault()
    if (replyContent.trim()) {
      submitComment(replyContent, parentId)
    }
  }

  const renderComment = (comment: Comment, depth = 0) => (
    <div key={comment.id} className={`${depth > 0 ? 'ml-6 border-l-2 border-gray-100 pl-4' : ''} mb-4`}>
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {comment.user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-sm">{comment.user.name}</div>
            <div className="text-xs text-gray-500">
              {new Date(comment.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
        
        <div className="text-gray-800 mb-3">{comment.content}</div>
        
        {user && (
          <button
            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {replyTo === comment.id ? 'Hủy' : 'Trả lời'}
          </button>
        )}

        {replyTo === comment.id && (
          <form onSubmit={(e) => handleReplySubmit(e, comment.id)} className="mt-3">
            <textarea
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Viết trả lời..."
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
              required
            />
            <div className="flex gap-2 mt-2">
              <button
                type="submit"
                disabled={isSubmitting || !replyContent.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Đang gửi...' : 'Gửi trả lời'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setReplyTo(null)
                  setReplyContent('')
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Hủy
              </button>
            </div>
          </form>
        )}
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3">
          {comment.replies.map(reply => renderComment(reply, depth + 1))}
        </div>
      )}
    </div>
  )

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold">Bình luận</h3>

      {user ? (
        <form onSubmit={handleCommentSubmit} className="space-y-4">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Chia sẻ suy nghĩ của bạn..."
            className="w-full p-4 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={4}
            required
          />
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Đang gửi...' : 'Gửi bình luận'}
          </button>
        </form>
      ) : (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800 mb-3">Vui lòng đăng nhập để bình luận</p>
          <div className="flex gap-3">
            <Link 
              href={`/login?returnUrl=${encodeURIComponent(currentPath)}`}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Đăng nhập
            </Link>
            <Link 
              href={`/signup?returnUrl=${encodeURIComponent(currentPath)}`}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {loadingComments ? (
          <div className="animate-pulse space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-1/4 mb-1"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/6"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          comments.map(comment => renderComment(comment))
        ) : (
          <p className="text-gray-500 text-center py-8">
            Chưa có bình luận nào. {user ? 'Hãy là người đầu tiên bình luận!' : 'Đăng nhập để bình luận đầu tiên!'}
          </p>
        )}
      </div>
    </div>
  )
}
