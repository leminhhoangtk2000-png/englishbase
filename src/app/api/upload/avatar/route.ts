import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth-server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

/**
 * Validate image file by checking magic bytes (file signature)
 * This prevents file type spoofing attacks
 */
function validateImageMagicBytes(buffer: Buffer): boolean {
  // Check minimum buffer size
  if (buffer.length < 12) {
    return false;
  }

  // JPEG magic bytes: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) {
    return true;
  }

  // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47 &&
      buffer[4] === 0x0D && buffer[5] === 0x0A && buffer[6] === 0x1A && buffer[7] === 0x0A) {
    return true;
  }

  // WebP magic bytes: RIFF ... WEBP
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
    return true;
  }

  return false;
}

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

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Read file buffer for magic byte validation
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Validate magic bytes (file signature) to prevent file type spoofing
    const isValidImage = validateImageMagicBytes(buffer);
    if (!isValidImage) {
      return NextResponse.json(
        { error: 'Invalid image file. File content does not match image format.' },
        { status: 400 }
      );
    }

    // Create unique filename with sanitized extension
    const timestamp = Date.now();
    const mimeToExt: Record<string, string> = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp',
    };
    const extension = mimeToExt[file.type] || 'jpg';
    const filename = `avatar-${currentUser.id}-${timestamp}.${extension}`;

    // Create uploads directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }

    // Save file (buffer already created above for validation)
    const filepath = join(uploadDir, filename);
    await writeFile(filepath, buffer);

    // Generate URL path
    const avatarUrl = `/uploads/avatars/${filename}`;

    // Update user avatar in database
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: { avatar: avatarUrl },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        avatar: true,
      }
    });

    return NextResponse.json({
      message: 'Avatar uploaded successfully',
      avatarUrl,
      user: updatedUser
    });

  } catch (error) {
    console.error('Error uploading avatar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Kiểm tra authentication
    const currentUser = await getCurrentUser();
    
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Remove avatar from database
    const updatedUser = await prisma.user.update({
      where: { id: currentUser.id },
      data: { avatar: null },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        avatar: true,
      }
    });

    return NextResponse.json({
      message: 'Avatar removed successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error removing avatar:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
