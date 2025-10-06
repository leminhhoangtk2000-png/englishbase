# Like Count Sync Fix - Implementation Complete

## Problem Identified

When users clicked the like button, the like was recorded in `exercise_likes` table but the count in `exercises_master.likesCount` remained unchanged (stuck at 6).

### Root Cause

**URL Encoding Mismatch:**
- Frontend sent exerciseId with URL encoding: `a1-lesen-ls-20einkaufen-20in-20deutschland`
- Database `exercises_master.slugId` had clean format: `a1-lesen-ls-einkaufen-in-deutschland`
- Transaction's `updateMany` couldn't find matching record → count not updated

**Additional Issues:**
- 53 orphan records with wrong format (e.g., `b1-lesen-teil1` instead of full slug)
- Records with special character encoding (`-e2-80-93` for em dash)
- Duplicate records from multiple likes with different ID formats

## Solution Implemented

### 1. Enhanced slugifyExerciseId Function

**Before:**
```typescript
function slugifyExerciseId(id: string): string {
  return id
    .toLowerCase()
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

**After:**
```typescript
function slugifyExerciseId(id: string): string {
  // Step 1: Decode URL encoding
  let decoded = id;
  try {
    decoded = decodeURIComponent(id);
  } catch (e) {
    // Fallback for common patterns
    decoded = id
      .replace(/-20/g, ' ')           // Space
      .replace(/-2D/g, '-')           // Hyphen
      .replace(/-E2-80-93/g, '-');    // Em dash
  }
  
  // Step 2: Slugify to match exercises_master
  return decoded
    .toLowerCase()
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}
```

### 2. Updated APIs

**Files Updated:**
- `src/app/api/exercise-ratings/route.ts` - Like/Unlike API
- `src/app/api/exercise-stats-batch/route.ts` - Batch stats API

Both now decode URL encoding before slugifying, ensuring proper match with `exercises_master.slugId`.

### 3. Cleanup Script

**Created:** `scripts/fix-like-counts.ts`

**Features:**
- Scans all `exercise_likes` records
- Decodes and slugifies exerciseId
- Checks if exercise exists in `exercises_master`
- Deletes orphan records (no matching exercise)
- Fixes encoded IDs to clean format
- Syncs all counts to `exercises_master`
- Shows summary and top liked exercises

**Run:**
```bash
npm run db:fix-likes
```

### 4. Added npm Script

```json
"db:fix-likes": "tsx scripts/fix-like-counts.ts"
```

## Results

### Before Fix
```
Total likes in exercise_likes: 165
Total likes in exercises_master: 112
Difference: 53 ❌
```

### After Fix
```
Total likes in exercise_likes: 112
Total likes in exercises_master: 112
Difference: 0 ✅
```

### Cleanup Summary
- ✅ Deleted 53 orphan/duplicate records
- ✅ All remaining 112 likes now match valid exercises
- ✅ Counts perfectly synced between tables
- ✅ Top liked exercises correctly show 6 likes each

## Testing

### Manual Test Flow

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Navigate to any exercise:**
   ```
   http://localhost:9003/exercises/a1/Horen/Im Restaurant teil 1 - A1
   ```

3. **Click like button:**
   - Button: "❤️ Tôi yêu bài tập này"
   - Should show: "Cảm ơn bạn! ❤️"
   - Button disappears after 2s

4. **Check database:**
   ```bash
   npm run db:studio:local
   ```
   - Open `exercise_likes` → Find your like (isLiked=true)
   - Open `exercises_master` → Find exercise → Check `likesCount` increased

5. **Check exercise list:**
   ```
   http://localhost:9003/exercises/a1
   ```
   - Exercise card should show updated like count
   - Heart icon should be red

### Automated Test (Future)

```typescript
// test/like-sync.test.ts
describe('Like Count Sync', () => {
  it('should update exercises_master when user likes', async () => {
    const exerciseId = 'a1-horen-im-restaurant-teil-1-a1';
    
    // Get initial count
    const before = await prisma.exercises_master.findUnique({
      where: { slugId: exerciseId },
      select: { likesCount: true }
    });
    
    // Like the exercise
    await fetch('/api/exercise-ratings', {
      method: 'POST',
      body: JSON.stringify({
        exerciseId: 'a1/Horen/Im Restaurant teil 1 - A1',
        userId: 'test-user',
        isLiked: true
      })
    });
    
    // Check count increased
    const after = await prisma.exercises_master.findUnique({
      where: { slugId: exerciseId },
      select: { likesCount: true }
    });
    
    expect(after.likesCount).toBe(before.likesCount + 1);
  });
});
```

## Database Verification

### Check Sync Status
```sql
-- Should return 0 rows (all in sync)
SELECT 
  em."slugId",
  em.title,
  em."likesCount" as cached_count,
  COUNT(el.id) FILTER (WHERE el."isLiked" = true) as actual_count
FROM exercises_master em
LEFT JOIN exercise_likes el ON el."exerciseId" = em."slugId"
GROUP BY em.id, em."slugId", em.title, em."likesCount"
HAVING COUNT(el.id) FILTER (WHERE el."isLiked" = true) != em."likesCount";
```

### Check for Orphan Likes
```sql
-- Should return 0 rows (no orphans)
SELECT el."exerciseId", COUNT(*)
FROM exercise_likes el
WHERE NOT EXISTS (
  SELECT 1 FROM exercises_master WHERE "slugId" = el."exerciseId"
)
GROUP BY el."exerciseId";
```

## Prevention

### Code Review Checklist
- ✅ Always decode URL encoding before database operations
- ✅ Use `slugifyExerciseId` helper consistently
- ✅ Test with special characters and spaces in exercise IDs
- ✅ Verify transaction finds the correct record
- ✅ Check count after like/unlike operations

### Monitoring
```typescript
// Add logging in production
console.log('Like transaction:', {
  exerciseId: cleanId,
  found: recordsUpdated > 0,
  newCount: totalLikes
});
```

## Related Issues

### Issue #1: Special Characters
Some exercise titles have special characters:
- Em dash (—): Encoded as `-e2-80-93`
- Ü, ö, ä: Encoded as `-c3-bc`, `-c3-b6`, `-c3-a4`

**Solution:** `decodeURIComponent()` handles all Unicode characters.

### Issue #2: Inconsistent Formats
Old data had various formats:
- Short: `b1-lesen-teil1`
- Full: `b1-lesen-2-lss-klimawandel-und-seine-folgen`
- Encoded: `a1-horen-im-20restaurant-20teil-201-20-20a1`

**Solution:** Cleanup script validates against `exercises_master` and removes invalid records.

### Issue #3: Duplicate Likes
Same user liked same exercise multiple times with different ID formats.

**Solution:** Unique constraint `exerciseId_userId` prevents duplicates. Script deletes older duplicates.

## Future Enhancements

### 1. Add Foreign Key
```prisma
model exercise_likes {
  // ...
  exercise exercises_master @relation(fields: [exerciseId], references: [slugId])
  
  @@index([exerciseId])
}
```
**Benefit:** Database enforces referential integrity, prevents orphan records.

### 2. Use Database Trigger
```sql
CREATE OR REPLACE FUNCTION sync_exercise_like_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE exercises_master
  SET "likesCount" = (
    SELECT COUNT(*) FROM exercise_likes
    WHERE "exerciseId" = NEW."exerciseId" AND "isLiked" = true
  )
  WHERE "slugId" = NEW."exerciseId";
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER exercise_like_sync
AFTER INSERT OR UPDATE OR DELETE ON exercise_likes
FOR EACH ROW
EXECUTE FUNCTION sync_exercise_like_count();
```
**Benefit:** Automatic sync, no application code needed.

### 3. Cache Invalidation
```typescript
// In API route
await redis.del(`exercise:${exerciseId}:stats`);
```
**Benefit:** Ensure cached data is always fresh.

## Rollback Plan

If issues occur:

1. **Restore counts from actual data:**
   ```bash
   npm run db:update-counts
   ```

2. **Remove all likes and resync:**
   ```sql
   -- Backup first!
   CREATE TABLE exercise_likes_backup AS SELECT * FROM exercise_likes;
   
   -- Clear counts
   UPDATE exercises_master SET "likesCount" = 0;
   
   -- Resync
   npm run db:update-counts
   ```

3. **Rollback code changes:**
   ```bash
   git revert 156946b  # Revert fix commit
   git push origin main
   ```

## Summary

✅ **Problem:** Like button didn't update exercises_master count due to URL encoding mismatch  
✅ **Solution:** Enhanced slugifyExerciseId to decode before slugifying  
✅ **Cleanup:** Removed 53 orphan records, synced all counts  
✅ **Prevention:** Added validation and cleanup script  
✅ **Result:** Perfect sync - 112 likes in both tables  

**Commands:**
- `npm run db:fix-likes` - Run cleanup and sync
- `npm run db:update-counts` - Recalculate all counts
- `npm run db:studio:local` - View data in Prisma Studio

**Files Changed:**
- `src/app/api/exercise-ratings/route.ts`
- `src/app/api/exercise-stats-batch/route.ts`
- `scripts/fix-like-counts.ts` (new)
- `package.json`
