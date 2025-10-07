import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface IncrementalUpdateRequest {
  exerciseIds: string[];
  currentChecksum: string;
  lastUpdate: string;
}

interface ExerciseStats {
  views: number;
  likes: number;
}

interface IncrementalUpdateResponse {
  hasChanges: boolean;
  updatedItems?: Record<string, ExerciseStats>;
  deletedItems?: string[];
  newChecksum?: string;
  timestamp?: number;
}

/**
 * Calculate simple checksum for data integrity
 */
function calculateChecksum(data: Record<string, ExerciseStats>): string {
  const sortedKeys = Object.keys(data).sort();
  const dataString = sortedKeys.map(key => {
    const stats = data[key];
    return `${key}:${stats.views}:${stats.likes}`;
  }).join('|');
  
  // Simple hash function
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

/**
 * Get current stats for all requested exercises
 */
async function getCurrentStats(exerciseIds: string[]): Promise<Record<string, ExerciseStats>> {
  try {
    // Get current data from database
    const exercises = await prisma.exercises_master.findMany({
      where: {
        OR: [
          { slug: { in: exerciseIds } },
          { slugId: { in: exerciseIds } }
        ]
      },
      select: {
        slug: true,
        slugId: true,
        likesCount: true,
        viewsCount: true
      }
    });

    const result: Record<string, ExerciseStats> = {};
    
    exercises.forEach(exercise => {
      const id = exercise.slug || exercise.slugId;
      if (id && exerciseIds.includes(id)) {
        result[id] = {
          views: exercise.viewsCount || 0,
          likes: exercise.likesCount || 0
        };
      }
    });

    // Fill missing exercises with zero stats
    exerciseIds.forEach(id => {
      if (!result[id]) {
        result[id] = { views: 0, likes: 0 };
      }
    });

    return result;
  } catch (error) {
    console.error('Error fetching current stats:', error);
    // Return empty stats for all exercises on error
    const result: Record<string, ExerciseStats> = {};
    exerciseIds.forEach(id => {
      result[id] = { views: 0, likes: 0 };
    });
    return result;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: IncrementalUpdateRequest = await request.json();
    const { exerciseIds, currentChecksum, lastUpdate } = body;

    console.log(`🔍 Incremental update check for ${exerciseIds.length} exercises`);
    console.log(`📊 Current checksum: ${currentChecksum}`);

    // Validate input
    if (!exerciseIds || !Array.isArray(exerciseIds) || exerciseIds.length === 0) {
      return NextResponse.json({ 
        hasChanges: false,
        error: 'Invalid exercise IDs' 
      }, { status: 400 });
    }

    // Get current stats from database
    const currentStats = await getCurrentStats(exerciseIds);
    const newChecksum = calculateChecksum(currentStats);

    console.log(`📊 New checksum: ${newChecksum}`);

    // Compare checksums
    if (currentChecksum === newChecksum) {
      console.log('✅ No changes detected');
      
      const response: IncrementalUpdateResponse = {
        hasChanges: false,
        timestamp: Date.now()
      };

      return NextResponse.json(response);
    }

    console.log('🔄 Changes detected, returning updated data');

    // Changes detected - return all current data
    // For simplicity, we return all data rather than computing diffs
    // In a more sophisticated system, you could track changes at the database level
    const response: IncrementalUpdateResponse = {
      hasChanges: true,
      updatedItems: currentStats,
      newChecksum,
      timestamp: Date.now()
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Incremental update error:', error);
    
    return NextResponse.json({ 
      hasChanges: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}

// Optional: GET endpoint for testing
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Incremental update endpoint',
    method: 'POST',
    description: 'Check for changes in exercise stats'
  });
}
