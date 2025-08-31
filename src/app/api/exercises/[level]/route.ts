import { NextRequest, NextResponse } from 'next/server';
import { getExercisesByLevel } from '@/lib/exercises';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ level: string }> }
) {
  try {
    const { level } = await params;
    
    if (!level || !['a1', 'a2', 'b1', 'b2'].includes(level)) {
      return NextResponse.json({ error: 'Invalid level' }, { status: 400 });
    }

    const exercises = await getExercisesByLevel(level);
    return NextResponse.json(exercises);
  } catch (error) {
    console.error('Error fetching exercises:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
