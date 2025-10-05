import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  console.log('=== TEST ROUTE START ===');
  
  try {
    console.log('Testing Prisma connection...');
    
    const exerciseId = 'a1/einkaufen-teil-1';
    console.log('Looking for exerciseId:', exerciseId);
    
    const ratings = await prisma.exercise_ratings.findMany({
      where: { exerciseId }
    });
    
    console.log('Found ratings:', ratings);
    
    return NextResponse.json({
      success: true,
      exerciseId,
      ratings,
      count: ratings.length
    });
    
  } catch (error: any) {
    console.error('=== ERROR ===', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack
    }, { status: 500 });
  }
}
