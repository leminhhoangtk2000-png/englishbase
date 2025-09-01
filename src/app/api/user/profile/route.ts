import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-server';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    console.log('📝 Profile API: Starting update request...');
    const user = await getCurrentUser();
    console.log('📝 Profile API: Current user:', user ? `${user.email} (${user.id})` : 'null');
    
    if (!user) {
      console.log('❌ Profile API: No authenticated user');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { name, username, bio, website, facebook, instagram, tiktok, threads, skillLevel, avatar } = data;

    // Validate username uniqueness if it's being changed
    if (username && username !== user.username) {
      const existingUser = await prisma.user.findUnique({
        where: { username },
      });
      
      if (existingUser && existingUser.id !== user.id) {
        return NextResponse.json({ error: 'Username already taken' }, { status: 400 });
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name || null,
        username: username || null,
        bio: bio || null,
        website: website || null,
        facebook: facebook || null,
        instagram: instagram || null,
        tiktok: tiktok || null,
        threads: threads || null,
        skillLevel: skillLevel || null,
        avatar: avatar || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        role: true,
        isPremium: true,
        avatar: true,
        bio: true,
        website: true,
        facebook: true,
        instagram: true,
        tiktok: true,
        threads: true,
        skillLevel: true,
      },
    });

    return NextResponse.json({ user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
