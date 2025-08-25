import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const { PrismaClient } = await import('@prisma/client')
    const prisma = new PrismaClient()
    
    await prisma.$connect()
    const userCount = await prisma.user.count()
    await prisma.$disconnect()

    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      userCount: userCount,
      timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('Database connection error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: error.message,
      code: error.code,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
