// Browser-compatible cookie functions
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined;
  
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
}

function setCookie(name: string, value: string, options: any = {}): void {
  if (typeof document === 'undefined') return;
  
  let cookieString = `${name}=${value}`;
  
  if (options.maxAge) {
    cookieString += `; max-age=${options.maxAge}`;
  }
  if (options.path) {
    cookieString += `; path=${options.path}`;
  }
  if (options.sameSite) {
    cookieString += `; samesite=${options.sameSite}`;
  }
  
  document.cookie = cookieString;
}

interface ExerciseStats {
  views: number;
  likes: number;
}

interface CacheData {
  data: Record<string, ExerciseStats>;
  timestamp: number;
  lastUpdated: string;
  version: number;
  dataChecksum?: string; // For detecting changes
}

interface IncrementalUpdateResponse {
  hasChanges: boolean;
  updatedItems?: Record<string, ExerciseStats>;
  deletedItems?: string[];
  newChecksum?: string;
  timestamp?: number;
}

interface CacheResponse {
  [key: string]: ExerciseStats | any;
  _cache?: {
    fromCache: boolean;
    timestamp: number;
    lastUpdated: string;
    nextUpdate: string;
  };
}

class ExerciseStatsCache {
  private static instance: ExerciseStatsCache;
  private readonly CACHE_DURATION = 2 * 60 * 60 * 1000; // 2 tiếng
  private readonly CACHE_COOKIE_NAME = 'exercise-stats-cache';
  private readonly VERSION_COOKIE_NAME = 'exercise-stats-version';
  
  private memoryCache: Map<string, CacheData> = new Map();
  private pendingRequests: Map<string, Promise<CacheResponse>> = new Map();

  public static getInstance(): ExerciseStatsCache {
    if (!ExerciseStatsCache.instance) {
      ExerciseStatsCache.instance = new ExerciseStatsCache();
    }
    return ExerciseStatsCache.instance;
  }

  /**
   * Lấy cache key từ exercise IDs
   */
  private getCacheKey(exerciseIds: string[]): string {
    return exerciseIds.sort().join(',');
  }

  /**
   * Kiểm tra cache còn valid không
   */
  private isCacheValid(timestamp: number): boolean {
    return Date.now() - timestamp < this.CACHE_DURATION;
  }

  /**
   * Lấy cache từ cookie
   */
  private getCacheFromCookie(): CacheData | null {
    try {
      const cachedData = getCookie(this.CACHE_COOKIE_NAME);
      if (cachedData && typeof cachedData === 'string') {
        return JSON.parse(decodeURIComponent(cachedData));
      }
    } catch (error) {
      console.warn('Failed to parse cache from cookie:', error);
    }
    return null;
  }

  /**
   * Lưu cache vào cookie
   */
  private saveCacheToContainer(cacheData: CacheData): void {
    try {
      // Save to memory cache
      this.memoryCache.set('global', cacheData);
      
      // Save to cookie
      setCookie(this.CACHE_COOKIE_NAME, encodeURIComponent(JSON.stringify(cacheData)), {
        maxAge: this.CACHE_DURATION / 1000,
        path: '/',
        sameSite: 'lax'
      });

      setCookie(this.VERSION_COOKIE_NAME, cacheData.version.toString(), {
        maxAge: this.CACHE_DURATION / 1000,
        path: '/',
        sameSite: 'lax'
      });

      console.log('✅ Cache saved to cookie and memory');
    } catch (error) {
      console.warn('Failed to save cache:', error);
    }
  }

  /**
   * Lấy cache hiệu quả từ memory hoặc cookie
   */
  private getValidCache(): CacheData | null {
    // Try memory cache first (fastest)
    const memoryCache = this.memoryCache.get('global');
    if (memoryCache && this.isCacheValid(memoryCache.timestamp)) {
      return memoryCache;
    }

    // Try cookie cache
    const cookieCache = this.getCacheFromCookie();
    if (cookieCache && this.isCacheValid(cookieCache.timestamp)) {
      // Update memory cache
      this.memoryCache.set('global', cookieCache);
      return cookieCache;
    }

    return null;
  }

  /**
   * Fetch exercise stats với intelligent caching + incremental updates
   */
  public async getExerciseStats(exerciseIds: string[], forceCheck: boolean = false): Promise<Record<string, ExerciseStats>> {
    if (!exerciseIds || exerciseIds.length === 0) {
      return {};
    }

    const cacheKey = this.getCacheKey(exerciseIds);
    
    // Check if there's already a pending request for these IDs
    if (this.pendingRequests.has(cacheKey)) {
      console.log('🔄 Reusing pending request');
      const response = await this.pendingRequests.get(cacheKey)!;
      const { _cache, ...stats } = response;
      return stats as Record<string, ExerciseStats>;
    }

    // Check valid cache
    const validCache = this.getValidCache();
    
    // If we have valid cache and not forcing check, return cached data
    if (validCache && !forceCheck) {
      console.log('⚡ Using cached data (valid for', 
        Math.round((this.CACHE_DURATION - (Date.now() - validCache.timestamp)) / 1000 / 60), 
        'more minutes)');
      
      const result: Record<string, ExerciseStats> = {};
      exerciseIds.forEach(id => {
        result[id] = validCache.data[id] || { views: 0, likes: 0 };
      });
      return result;
    }

    // If we have cache but want to check for updates (incremental update)
    if (validCache && forceCheck) {
      console.log('🔍 Checking for incremental updates...');
      
      const incrementalPromise = this.checkAndUpdateIncremental(exerciseIds, validCache);
      this.pendingRequests.set(cacheKey, incrementalPromise);

      try {
        const result = await incrementalPromise;
        return result;
      } finally {
        this.pendingRequests.delete(cacheKey);
      }
    }

    // No valid cache, fetch from API
    console.log('🌐 Fetching fresh data from API...');
    
    const fetchPromise = this.fetchFromAPI(exerciseIds);
    this.pendingRequests.set(cacheKey, fetchPromise);

    try {
      const response = await fetchPromise;
      const { _cache, ...stats } = response;
      
      // Save to cache if it's fresh data
      if (_cache && !_cache.fromCache) {
        const newCacheData: CacheData = {
          data: stats as Record<string, ExerciseStats>,
          timestamp: _cache.timestamp,
          lastUpdated: _cache.lastUpdated,
          version: Date.now(),
          dataChecksum: this.calculateChecksum(stats as Record<string, ExerciseStats>)
        };
        this.saveCacheToContainer(newCacheData);
      }

      return stats as Record<string, ExerciseStats>;
      
    } finally {
      this.pendingRequests.delete(cacheKey);
    }
  }

  /**
   * Public method to check for incremental updates
   */
  public async checkForIncrementalUpdates(exerciseIds: string[]): Promise<{ hasChanges: boolean; data: Record<string, ExerciseStats> }> {
    const cacheData = this.getCacheFromCookie();
    
    if (!cacheData) {
      // No cache, do full fetch
      const freshData = await this.getExerciseStats(exerciseIds);
      return { hasChanges: true, data: freshData };
    }

    try {
      const currentChecksum = this.calculateChecksum(cacheData.data);
      const response = await this.fetchIncrementalUpdate(exerciseIds, currentChecksum);
      
      if (response.hasChanges) {
        // Merge with existing data and update cache
        const mergedData = { ...cacheData.data };
        
        // Add updated items
        if (response.updatedItems) {
          Object.assign(mergedData, response.updatedItems);
        }
        
        // Remove deleted items
        if (response.deletedItems) {
          response.deletedItems.forEach(id => {
            delete mergedData[id];
          });
        }
        
        this.saveCacheToContainer({
          data: mergedData,
          timestamp: Date.now(),
          lastUpdated: new Date().toISOString(),
          version: cacheData.version,
          dataChecksum: response.newChecksum || this.calculateChecksum(mergedData)
        });
        return { hasChanges: true, data: mergedData };
      } else {
        // No changes, extend cache lifetime
        this.saveCacheToContainer({
          ...cacheData,
          timestamp: Date.now()
        });
        return { hasChanges: false, data: cacheData.data };
      }
    } catch (error) {
      console.error('❌ Incremental update failed, using cached data:', error);
      return { hasChanges: false, data: cacheData.data };
    }
  }

  /**
   * Check for incremental updates and merge with existing cache
   */
  private async checkAndUpdateIncremental(exerciseIds: string[], currentCache: CacheData): Promise<Record<string, ExerciseStats>> {
    try {
      // Call incremental update API
      const incrementalUpdate = await this.fetchIncrementalUpdate(exerciseIds, currentCache.dataChecksum || '');
      
      if (!incrementalUpdate.hasChanges) {
        console.log('✅ No changes detected, using cached data');
        
        // Update timestamp to extend cache life
        const updatedCache: CacheData = {
          ...currentCache,
          timestamp: Date.now()
        };
        this.saveCacheToContainer(updatedCache);
        
        const result: Record<string, ExerciseStats> = {};
        exerciseIds.forEach(id => {
          result[id] = currentCache.data[id] || { views: 0, likes: 0 };
        });
        return result;
      }

      console.log('🔄 Changes detected, applying incremental update');
      
      // Apply incremental changes
      const updatedData = { ...currentCache.data };
      
      // Apply updates
      if (incrementalUpdate.updatedItems) {
        Object.assign(updatedData, incrementalUpdate.updatedItems);
        console.log(`📝 Updated ${Object.keys(incrementalUpdate.updatedItems).length} items`);
      }
      
        // Remove deleted items
        if (incrementalUpdate.deletedItems) {
          incrementalUpdate.deletedItems.forEach((id: string) => {
            delete updatedData[id];
          });
          console.log(`🗑️ Removed ${incrementalUpdate.deletedItems.length} items`);
        }      // Save updated cache
      const newCacheData: CacheData = {
        data: updatedData,
        timestamp: incrementalUpdate.timestamp || Date.now(),
        lastUpdated: new Date().toISOString(),
        version: Date.now(),
        dataChecksum: incrementalUpdate.newChecksum || this.calculateChecksum(updatedData)
      };
      
      this.saveCacheToContainer(newCacheData);
      
      // Return requested data
      const result: Record<string, ExerciseStats> = {};
      exerciseIds.forEach(id => {
        result[id] = updatedData[id] || { views: 0, likes: 0 };
      });
      
      return result;
      
    } catch (error) {
      console.warn('⚠️ Incremental update failed, falling back to cached data:', error);
      
      // Fallback to cached data
      const result: Record<string, ExerciseStats> = {};
      exerciseIds.forEach(id => {
        result[id] = currentCache.data[id] || { views: 0, likes: 0 };
      });
      return result;
    }
  }

  /**
   * Fetch từ API
   */
  private async fetchFromAPI(exerciseIds: string[]): Promise<CacheResponse> {
    const response = await fetch('/api/exercises/cache-stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ exerciseIds })
    });

    if (!response.ok) {
      throw new Error(`API call failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Fetch incremental update từ API
   */
  private async fetchIncrementalUpdate(exerciseIds: string[], currentChecksum: string): Promise<IncrementalUpdateResponse> {
    const response = await fetch('/api/exercises/incremental-update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        exerciseIds,
        currentChecksum,
        lastUpdate: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`Incremental update API failed: ${response.status}`);
    }

    return response.json();
  }

  /**
   * Calculate checksum for data integrity
   */
  private calculateChecksum(data: Record<string, ExerciseStats>): string {
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
   * Clear cache manually
   */
  public clearCache(): void {
    this.memoryCache.clear();
    
    // Clear cookies
    setCookie(this.CACHE_COOKIE_NAME, '', { maxAge: -1, path: '/' });
    setCookie(this.VERSION_COOKIE_NAME, '', { maxAge: -1, path: '/' });
    
    console.log('🗑️ Cache cleared');
  }

  /**
   * Get cache info for debugging
   */
  public getCacheInfo(): any {
    const cache = this.getValidCache();
    if (!cache) {
      return { status: 'no-cache' };
    }

    const remainingTime = this.CACHE_DURATION - (Date.now() - cache.timestamp);
    
    return {
      status: 'cached',
      lastUpdated: cache.lastUpdated,
      remainingMinutes: Math.round(remainingTime / 1000 / 60),
      totalExercises: Object.keys(cache.data).length,
      version: cache.version
    };
  }

  /**
   * Prefetch stats for performance
   */
  public async prefetchStats(exerciseIds: string[]): Promise<void> {
    try {
      await this.getExerciseStats(exerciseIds);
    } catch (error) {
      console.warn('Prefetch failed:', error);
    }
  }
}

// Export singleton instance
export const exerciseStatsCache = ExerciseStatsCache.getInstance();

// Export helper functions
export const getExerciseStats = (exerciseIds: string[]) => 
  exerciseStatsCache.getExerciseStats(exerciseIds);

export const clearExerciseStatsCache = () => 
  exerciseStatsCache.clearCache();

export const getExerciseStatsCacheInfo = () => 
  exerciseStatsCache.getCacheInfo();

export const prefetchExerciseStats = (exerciseIds: string[]) => 
  exerciseStatsCache.prefetchStats(exerciseIds);

export const checkAndUpdateIncremental = (exerciseIds: string[]) =>
  exerciseStatsCache.checkForIncrementalUpdates(exerciseIds);
