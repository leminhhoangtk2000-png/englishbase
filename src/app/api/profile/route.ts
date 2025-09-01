import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-server';

export async function PUT(request: NextRequest) {
  try {
    // Kiểm tra authentication
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { 
      name, 
      bio, 
      url, 
      facebook, 
      instagram, 
      tiktok, 
      threads,
      niveau,
      avatar // Thêm avatar
    } = await request.json();

    // Validate niveau
    const validNiveaux = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    if (niveau && !validNiveaux.includes(niveau)) {
      return NextResponse.json(
        { error: 'Invalid niveau' },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: {
        name,
        bio,
        url,
        facebook,
        instagram,
        tiktok,
        threads,
        ...(niveau && { niveau }),
        ...(avatar && { avatar }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        isPremium: true,
        avatar: true,
      }
    });

    return NextResponse.json({ 
      message: 'Profile updated successfully',
      user: updatedUser 
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Kiểm tra authentication
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: currentUser.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        isPremium: true,
        avatar: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
