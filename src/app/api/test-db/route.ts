import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Test database connection
    const vocabularyCount = await prisma.vocabularyEntry.count()
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      message: 'Database connection successful!',
      stats: {
        vocabularyEntries: vocabularyCount,
        users: userCount
      }
    })
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { error: 'Database connection failed' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: body.email || 'test@example.com',
        name: body.name || 'Test User',
        role: 'USER'
      }
    })
    
    return NextResponse.json({
      message: 'User created successfully!',
      user
    })
  } catch (error) {
    console.error('User creation error:', error)
    return NextResponse.json(
      { error: 'User creation failed' },
      { status: 500 }
    )
  }
}
