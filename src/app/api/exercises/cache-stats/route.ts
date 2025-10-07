import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface ExerciseStats {
  views: number;
  likes: number;
}

interface CacheData {
  data: Record<string, ExerciseStats>;
  timestamp: number;
  lastUpdated: string;
  version: number;
}

const CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 tiếng
const CACHE_COOKIE_NAME = 'exercise-stats-cache';
const VERSION_COOKIE_NAME = 'exercise-stats-version';

// Helper function để tạo cache key
function generateCacheKey(exerciseIds: string[]): string {
  return exerciseIds.sort().join(',');
}

// Helper function để check if cache is valid
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION;
}

// Helper function để get database version
async function getDatabaseVersion(): Promise<number> {
  try {
    // Tính hash của tất cả likesCount và viewsCount
    const result = await prisma.$queryRaw<[{checksum: bigint}]>`
      SELECT SUM("likesCount" + "viewsCount") as checksum 
      FROM "exercises_master"
    `;
    return Number(result[0]?.checksum || 0);
  } catch (error) {
    console.error('Error getting database version:', error);
    return Date.now(); // Fallback to timestamp
  }
}

export async function POST(request: NextRequest) {
  try {
    const { exerciseIds }: { exerciseIds: string[] } = await request.json();

    if (!exerciseIds || exerciseIds.length === 0) {
      return NextResponse.json(
        { error: 'exerciseIds is required' },
        { status: 400 }
      );
    }

    // Get cache from request cookies (client will send them)
    const cookieHeader = request.headers.get('cookie') || '';
    const cacheMatch = cookieHeader.match(/exercise-stats-cache=([^;]*)/);
    const versionMatch = cookieHeader.match(/exercise-stats-version=([^;]*)/);
    
    let parsedCache: CacheData | null = null;
    const cachedVersion = Number(versionMatch?.[1] || 0);
    
    try {
      if (cacheMatch?.[1]) {
        parsedCache = JSON.parse(decodeURIComponent(cacheMatch[1]));
      }
    } catch (error) {
      console.log('Invalid cache data, will refresh');
    }

    // Kiểm tra database version
    const currentDbVersion = await getDatabaseVersion();
    const cacheNeedsUpdate = !parsedCache || 
                            !isCacheValid(parsedCache.timestamp) || 
                            parsedCache.version !== currentDbVersion;

    if (cacheNeedsUpdate) {
      console.log('🔄 Cache expired or data changed, fetching from database...');
      
      // Fetch fresh data từ database
      const exercisesStats = await prisma.exercises_master.findMany({
        where: {
          OR: [
            { slug: { in: exerciseIds } },
            { slugId: { in: exerciseIds.map(id => id.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-')) } }
          ]
        },
        select: {
          slug: true,
          slugId: true,
          likesCount: true,
          viewsCount: true,
        }
      });

      // Transform data
      const statsMap: Record<string, ExerciseStats> = {};
      
      exercisesStats.forEach(exercise => {
        const stats = {
          views: exercise.viewsCount,
          likes: exercise.likesCount,
        };
        
        statsMap[exercise.slug] = stats;
        statsMap[exercise.slugId] = stats;
        
        exerciseIds.forEach(id => {
          if (id === exercise.slug || id === exercise.slugId) {
            statsMap[id] = stats;
          }
        });
      });

      // Provide defaults for missing exercises
      exerciseIds.forEach(id => {
        if (!statsMap[id]) {
          statsMap[id] = { views: 0, likes: 0 };
        }
      });

      // Tạo cache data mới
      const newCacheData: CacheData = {
        data: statsMap,
        timestamp: Date.now(),
        lastUpdated: new Date().toISOString(),
        version: currentDbVersion
      };

      // Lưu vào cookie response
      const response = NextResponse.json({
        ...statsMap,
        _cache: {
          fromCache: false,
          timestamp: newCacheData.timestamp,
          lastUpdated: newCacheData.lastUpdated,
          nextUpdate: new Date(newCacheData.timestamp + CACHE_DURATION).toISOString()
        }
      });

      // Set cookies với cache data
      response.cookies.set(CACHE_COOKIE_NAME, encodeURIComponent(JSON.stringify(newCacheData)), {
        httpOnly: false, // Allow client access
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: CACHE_DURATION / 1000, // Convert to seconds
        path: '/'
      });

      response.cookies.set(VERSION_COOKIE_NAME, currentDbVersion.toString(), {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: CACHE_DURATION / 1000,
        path: '/'
      });

      return response;

    } else {
      console.log('✅ Using cached data');
      
      // Trả về data từ cache
      const cachedStats: Record<string, ExerciseStats> = {};
      exerciseIds.forEach(id => {
        cachedStats[id] = parsedCache!.data[id] || { views: 0, likes: 0 };
      });

      return NextResponse.json({
        ...cachedStats,
        _cache: {
          fromCache: true,
          timestamp: parsedCache!.timestamp,
          lastUpdated: parsedCache!.lastUpdated,
          nextUpdate: new Date(parsedCache!.timestamp + CACHE_DURATION).toISOString()
        }
      });
    }

  } catch (error) {
    console.error('Error in cache-stats API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET method cho compatibility
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const exerciseIds = searchParams.get('ids')?.split(',') || [];

    if (exerciseIds.length === 0) {
      return NextResponse.json(
        { error: 'ids parameter is required' },
        { status: 400 }
      );
    }

    // Tạo fake POST request để reuse logic
    const fakeRequest = new Request(request.url, {
      method: 'POST',
      headers: request.headers,
      body: JSON.stringify({ exerciseIds })
    });

    return POST(fakeRequest as NextRequest);

  } catch (error) {
    console.error('Error in GET cache-stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
