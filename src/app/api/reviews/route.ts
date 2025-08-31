import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-server';

export async function POST(request: NextRequest) {
  try {
    // Kiểm tra authentication
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { rating, comment } = await request.json();

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      );
    }

    // Validate comment
    if (!comment || comment.trim().length < 10) {
      return NextResponse.json(
        { error: 'Comment must be at least 10 characters' },
        { status: 400 }
      );
    }

    // Check if user already has a review
    const existingReview = await prisma.review.findFirst({
      where: { userId: currentUser.id }
    });

    const now = new Date();

    if (existingReview) {
      // Check cooldown period (365 days)
      if (existingReview.nextAllowedDate && existingReview.nextAllowedDate > now) {
        const remainingDays = Math.ceil((existingReview.nextAllowedDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return NextResponse.json(
          { 
            error: 'Cooldown period active',
            message: `Bạn chỉ được gửi feedback mới sau ${remainingDays} ngày nữa.`,
            nextAllowedDate: existingReview.nextAllowedDate
          },
          { status: 429 }
        );
      }

      // Update existing review and set new cooldown
      const nextAllowedDate = new Date();
      nextAllowedDate.setFullYear(nextAllowedDate.getFullYear() + 1); // 365 days

      const updatedReview = await prisma.review.update({
        where: { id: existingReview.id },
        data: {
          rating,
          comment: comment.trim(),
          nextAllowedDate,
          updatedAt: now,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            }
          }
        }
      });

      return NextResponse.json({
        message: 'Review updated successfully',
        review: updatedReview
      });
    } else {
      // Create new review with cooldown
      const nextAllowedDate = new Date();
      nextAllowedDate.setFullYear(nextAllowedDate.getFullYear() + 1); // 365 days

      const newReview = await prisma.review.create({
        data: {
          userId: currentUser.id,
          rating,
          comment: comment.trim(),
          nextAllowedDate,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            }
          }
        }
      });

      return NextResponse.json({
        message: 'Review created successfully',
        review: newReview
      });
    }

  } catch (error) {
    console.error('Error creating/updating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '6');
    const currentUserId = searchParams.get('userId');

    // Get user's own review if userId provided
    if (currentUserId) {
      const userReview = await prisma.review.findFirst({
        where: { userId: currentUserId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              username: true,
              avatar: true,
            }
          }
        }
      });

      return NextResponse.json({ review: userReview });
    }

    // Get public reviews for display
    const reviews = await prisma.review.findMany({
      where: { isPublic: true },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    return NextResponse.json({ reviews });

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
