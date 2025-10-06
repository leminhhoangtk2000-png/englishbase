import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-server';

/**
 * User Profile API
 * 
 * GET - Fetch user profile with stats
 * PATCH - Update user profile
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let targetUserId: string;

    // If no userId provided, get current user
    if (!userId) {
      const currentUser = await getCurrentUser();
      if (!currentUser) {
        return NextResponse.json(
          { error: 'Not authenticated' },
          { status: 401 }
        );
      }
      targetUserId = currentUser.id;
    } else {
      targetUserId = userId;
    }

    // Fetch user with stats
    const user = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatar: true,
        role: true,
        isPremium: true,
        bio: true,
        skillLevel: true,
        createdAt: true,
        website: true,
        facebook: true,
        instagram: true,
        threads: true,
        tiktok: true,
        exercise_completions: {
          select: {
            id: true,
            exerciseId: true,
            completedAt: true,
          },
        },
        vocabulary: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate stats
    const totalExercises = await prisma.exercise_completions.count();
    const completedExercises = user.exercise_completions.length;
    const totalVocabulary = user.vocabulary.length;
    
    // Calculate streak (simplified - count consecutive days with completions)
    const recentCompletions = user.exercise_completions
      .map(c => new Date(c.completedAt).toDateString())
      .filter((date, index, self) => self.indexOf(date) === index)
      .sort()
      .reverse();

    let streak = 0;
    const today = new Date().toDateString();
    
    if (recentCompletions.length > 0) {
      const lastCompletion = recentCompletions[0];
      const daysDiff = Math.floor(
        (new Date(today).getTime() - new Date(lastCompletion).getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysDiff <= 1) {
        streak = 1;
        for (let i = 1; i < recentCompletions.length; i++) {
          const prevDate = new Date(recentCompletions[i - 1]);
          const currDate = new Date(recentCompletions[i]);
          const diff = Math.floor((prevDate.getTime() - currDate.getTime()) / (1000 * 60 * 60 * 24));
          
          if (diff === 1) {
            streak++;
          } else {
            break;
          }
        }
      }
    }

    // Calculate level and XP (10 XP per completion, 1 XP per vocabulary)
    const xp = (completedExercises * 10) + totalVocabulary;
    const level = `Level ${Math.floor(xp / 1000) + 1}`;

    const profile = {
      ...user,
      stats: {
        totalExercises,
        completedExercises,
        totalVocabulary,
        totalReadingTime: completedExercises * 180, // Estimate: 3 min per exercise
        streak,
        level,
        xp,
      },
    };

    // Remove exercise_completions and vocabulary arrays from response
    delete (profile as any).exercise_completions;
    delete (profile as any).vocabulary;

    return NextResponse.json({ profile });

  } catch (error) {
    console.error('🔴 [User Profile API] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

/**
 * PATCH - Update user profile
 */
export async function PATCH(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      username,
      bio,
      skillLevel,
      website,
      facebook,
      instagram,
      threads,
      tiktok,
    } = body;

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        ...(name !== undefined && { name }),
        ...(username !== undefined && { username }),
        ...(bio !== undefined && { bio }),
        ...(skillLevel !== undefined && { skillLevel }),
        ...(website !== undefined && { website }),
        ...(facebook !== undefined && { facebook }),
        ...(instagram !== undefined && { instagram }),
        ...(threads !== undefined && { threads }),
        ...(tiktok !== undefined && { tiktok }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        avatar: true,
        bio: true,
        skillLevel: true,
        website: true,
        facebook: true,
        instagram: true,
        threads: true,
        tiktok: true,
      },
    });

    return NextResponse.json({ user: updatedUser });

  } catch (error) {
    console.error('🔴 [User Profile API] Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
