import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const exerciseId = searchParams.get('exerciseId')

    if (!exerciseId) {
      return NextResponse.json(
        { error: 'Exercise ID is required' },
        { status: 400 }
      )
    }

    // Get comments for the exercise
    const comments = await prisma.comment.findMany({
      where: {
        postId: exerciseId, // Using postId field for exerciseId
        parentId: null // Only top-level comments
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                username: true,
                avatar: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Transform the data to match our CommentSystem interface
    const transformedComments = comments.map(comment => ({
      id: comment.id,
      content: comment.content,
      authorId: comment.author.id,
      authorName: comment.author.name || comment.author.username || 'Unknown User',
      authorAvatar: comment.author.avatar,
      createdAt: comment.createdAt,
      likes: 0, // TODO: Add likes system
      isLiked: false, // TODO: Check if current user liked
      replies: comment.replies.map(reply => ({
        id: reply.id,
        content: reply.content,
        authorId: reply.author.id,
        authorName: reply.author.name || reply.author.username || 'Unknown User',
        authorAvatar: reply.author.avatar,
        createdAt: reply.createdAt,
        likes: 0,
        isLiked: false,
        replies: [],
        parentId: reply.parentId
      })),
      parentId: comment.parentId
    }))

    return NextResponse.json({
      success: true,
      comments: transformedComments
    })

  } catch (error) {
    console.error('Error fetching comments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { exerciseId, content, authorId, parentId } = body

    if (!exerciseId || !content || !authorId) {
      return NextResponse.json(
        { error: 'Exercise ID, content, and author ID are required' },
        { status: 400 }
      )
    }

    // For now, we'll use a mock user since we don't have auth system yet
    // In the future, this would be replaced with actual user from session
    let author
    try {
      author = await prisma.user.findUnique({
        where: { id: authorId }
      })
    } catch (error) {
      author = null
    }

    // If user doesn't exist, create a test user for demo
    if (!author) {
      author = await prisma.user.upsert({
        where: { email: 'demo@edu-theme.com' },
        update: {},
        create: {
          email: 'demo@edu-theme.com',
          name: 'Demo User',
          username: 'demo_user',
          password: 'hashed_password', // In real app, this would be properly hashed
          role: 'USER'
        }
      })
    }

    // Create the comment
    const comment = await prisma.comment.create({
      data: {
        content,
        authorId: author.id,
        postId: exerciseId, // Using postId field for exerciseId
        parentId: parentId || null,
        published: true
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true
          }
        }
      }
    })

    // Transform the response
    const transformedComment = {
      id: comment.id,
      content: comment.content,
      authorId: comment.author.id,
      authorName: comment.author.name || comment.author.username || 'Unknown User',
      authorAvatar: comment.author.avatar,
      createdAt: comment.createdAt,
      likes: 0,
      isLiked: false,
      replies: [],
      parentId: comment.parentId
    }

    return NextResponse.json({
      success: true,
      comment: transformedComment
    })

  } catch (error) {
    console.error('Error creating comment:', error)
    return NextResponse.json(
      { error: 'Failed to create comment' },
      { status: 500 }
    )
  }
}
