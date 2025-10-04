/**
 * Clean All Exercise Comments via API
 * 
 * This script creates an API endpoint to delete all comments.
 * Can be called from browser or curl.
 */

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function DELETE(request: NextRequest) {
  try {
    // Security check - only allow in development or with admin auth
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isDevelopment) {
      return NextResponse.json(
        { error: 'This endpoint is only available in development mode' },
        { status: 403 }
      );
    }

    console.log('🗑️  Starting to clean all exercise comments...');

    // Step 1: Delete all comment likes first (foreign key constraint)
    const deletedLikes = await prisma.exercise_comment_likes.deleteMany({});
    console.log(`✅ Deleted ${deletedLikes.count} comment likes`);

    // Step 2: Delete all comments (including replies)
    const deletedComments = await prisma.exercise_comments.deleteMany({});
    console.log(`✅ Deleted ${deletedComments.count} comments`);

    // Step 3: Verify deletion
    const remainingComments = await prisma.exercise_comments.count();
    const remainingLikes = await prisma.exercise_comment_likes.count();

    const result = {
      success: true,
      deleted: {
        likes: deletedLikes.count,
        comments: deletedComments.count,
      },
      remaining: {
        likes: remainingLikes,
        comments: remainingComments,
      },
      message: 'All exercise comments cleaned successfully!',
    };

    console.log('🎉 SUCCESS! All exercise comments cleaned!');
    console.log('Summary:', result);

    return NextResponse.json(result);

  } catch (error) {
    console.error('❌ Error cleaning comments:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to clean comments',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
