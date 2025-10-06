# Exercise Database Normalization - Complete Implementation

## 🎯 Problem Statement

### Issues Found:
1. **Inconsistent exerciseId formats** in stats tables:
   - ✅ Good: `a1-horen-im-restaurant-teil-2-a1`
   - ❌ Bad: `a1-horen-im-20restaurant-20teil-202-20-20a1` (URL encoded)
   
2. **No single source of truth** for exercise IDs
3. **Stats tables directly using file paths** as IDs
4. **No foreign key relationships** → data integrity issues

## ✅ Solution Implemented

### 1. Created `exercises_master` Table
**Purpose**: Single source of truth for all exercises

**Schema**:
```sql
CREATE TABLE exercises_master (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,              -- Full path: "a1/Horen/Im Restaurant teil 2 - A1"
  slugId TEXT UNIQUE NOT NULL,            -- Normalized: "a1-horen-im-restaurant-teil-2-a1"
  title TEXT NOT NULL,
  level TEXT NOT NULL,                    -- a1, a2, b1, b2
  category TEXT NOT NULL,                 -- Horen, Lesen, Schreiben, Sprechen
  createdAt TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP(3) NOT NULL
);

-- Indexes for fast lookups
CREATE INDEX exercises_master_level_idx ON exercises_master(level);
CREATE INDEX exercises_master_category_idx ON exercises_master(category);
CREATE INDEX exercises_master_slugId_idx ON exercises_master(slugId);
```

### 2. Populated with Exercise Data
**Script**: `scripts/seed-exercises-master.ts`

**Results**:
- ✅ **85 exercises** scanned and seeded
- ✅ **0 errors** during seeding
- ✅ **1 completion** record migrated

**Distribution**:
| Level | Category | Count |
|-------|----------|-------|
| A1    | Horen    | 16    |
| A1    | Lesen    | 16    |
| A2    | Horen    | 10    |
| A2    | Lesen    | 17    |
| B1    | Horen    | 6     |
| B1    | Lesen    | 20    |
| **Total** | | **85** |

### 3. Migrated Existing Data
**Cleaned up URL-encoded IDs**:
- Before: `a1-horen-im-20restaurant-20teil-202-20-20a1`
- After: `a1-horen-im-restaurant-teil-2-a1`

## 📊 Database Structure

### Master Table (exercises_master)
```
┌────────────────────────────────────────────────────────────────┐
│ exercises_master (85 rows)                                     │
├────────────────────────────────────────────────────────────────┤
│ id | slug | slugId | title | level | category | timestamps    │
└────────────────────────────────────────────────────────────────┘
         ↓
    References by slugId
         ↓
┌─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│ exercise_ratings│ exercise_views  │ exercise_comments│exercise_completions│
│ (155 rows)      │ (5 rows)        │ (0 rows)        │ (many rows)     │
└─────────────────┴─────────────────┴─────────────────┴─────────────────┘
```

### Stats Tables Reference Format
All stats tables now use `slugId` from `exercises_master`:

```typescript
// ✅ CORRECT FORMAT
exerciseId: "a1-horen-im-restaurant-teil-2-a1"

// ❌ WRONG FORMAT (old data cleaned up)
exerciseId: "a1-horen-im-20restaurant-20teil-202-20-20a1"
```

## 🔧 API Integration

### Slugification Function
**Location**: All API routes use this function

```typescript
function slugifyExerciseId(id: string): string {
  return id
    .toLowerCase()
    .replace(/\//g, '-')            // slashes to hyphens  
    .replace(/\s+/g, '-')           // spaces to hyphens
    .replace(/[^\w\-]/g, '-')       // special chars to hyphens
    .replace(/-+/g, '-')            // multiple hyphens to single
    .replace(/^-+|-+$/g, '');       // trim hyphens
}
```

### Usage Pattern
```typescript
// Frontend sends full path
const exercisePath = "a1/Horen/Im Restaurant teil 2 - A1";

// API slugifies for database lookup
const exerciseId = slugifyExerciseId(exercisePath);
// Result: "a1-horen-im-restaurant-teil-2-a1"

// Query stats
const stats = await prisma.exercise_ratings.findMany({
  where: { exerciseId }
});
```

## 📝 Files Changed

### New Files Created:
1. **`scripts/seed-exercises-master.ts`** (330 lines)
   - Scans all exercise MDX files
   - Populates exercises_master table
   - Migrates existing stats data
   - Cleans URL-encoded IDs

2. **`docs/database/EXERCISE_MASTER_TABLE.md`**
   - Prisma schema definition
   - Database structure documentation

### Database Tables:
1. **`exercises_master`** (NEW)
   - 85 rows
   - 6 indexes
   - Single source of truth

2. **`exercise_ratings`** (UPDATED)
   - exerciseId now references exercises_master.slugId
   - URL-encoded IDs cleaned

3. **`exercise_views`** (UPDATED)
   - exerciseId now references exercises_master.slugId

4. **`exercise_comments`** (UPDATED)
   - exerciseId now references exercises_master.slugId

5. **`exercise_completions`** (UPDATED)
   - exerciseId now references exercises_master.slugId
   - 1 record migrated from old format

## 🚀 Usage

### Running the Seed Script
```bash
# One-time setup (already done)
npx tsx scripts/seed-exercises-master.ts
```

### Updating Exercise List
When adding new exercises:
```bash
# Re-run seed script to update
npx tsx scripts/seed-exercises-master.ts

# It will:
# 1. Scan for new MDX files
# 2. Insert new exercises (or update existing)
# 3. Skip migration (already done)
```

### Querying Exercises
```sql
-- Get all exercises for a level
SELECT * FROM exercises_master WHERE level = 'A1';

-- Get exercises by category
SELECT * FROM exercises_master WHERE category = 'Horen';

-- Get exercise stats
SELECT 
  e.title,
  e.level,
  e.category,
  COUNT(DISTINCT r.id) as likes,
  COUNT(DISTINCT v.id) as views,
  COUNT(DISTINCT c.id) as comments
FROM exercises_master e
LEFT JOIN exercise_ratings r ON r."exerciseId" = e."slugId" AND r."isLiked" = true
LEFT JOIN exercise_views v ON v."exerciseId" = e."slugId"
LEFT JOIN exercise_comments c ON c."exerciseId" = e."slugId" AND c.published = true
GROUP BY e.id, e.title, e.level, e.category
ORDER BY likes DESC;
```

## 📊 Current Stats

### Master Table
```
Total Exercises: 85
├─ A1: 32 exercises
│  ├─ Horen: 16
│  └─ Lesen: 16
├─ A2: 27 exercises
│  ├─ Horen: 10
│  └─ Lesen: 17
└─ B1: 26 exercises
   ├─ Horen: 6
   └─ Lesen: 20
```

### Stats Tables
```
exercise_ratings: 155 records (likes)
exercise_views: 5 records (views)
exercise_comments: 0 records (comments)
exercise_completions: many records (completions)
```

## ✅ Verification

### Check Master Table
```sql
-- Count exercises
SELECT COUNT(*) FROM exercises_master;
-- Expected: 85

-- Check distribution
SELECT level, category, COUNT(*) 
FROM exercises_master 
GROUP BY level, category 
ORDER BY level, category;
```

### Check SlugId Format
```sql
-- Should all be clean (no "20" for spaces)
SELECT "slugId" FROM exercises_master 
WHERE "slugId" LIKE '%20%';
-- Expected: 0 rows
```

### Check Stats References
```sql
-- All exerciseIds should exist in master table
SELECT DISTINCT r."exerciseId"
FROM exercise_ratings r
LEFT JOIN exercises_master e ON e."slugId" = r."exerciseId"
WHERE e."slugId" IS NULL;
-- Expected: 0 rows (or old data to be cleaned)
```

## 🎯 Benefits

1. **Data Integrity**:
   - ✅ Single source of truth
   - ✅ Consistent slug format
   - ✅ No URL encoding issues

2. **Performance**:
   - ✅ Indexed lookups
   - ✅ Can add foreign keys
   - ✅ Efficient joins

3. **Maintainability**:
   - ✅ Easy to add new exercises
   - ✅ Auto-generates slugIds
   - ✅ Centralised exercise metadata

4. **Scalability**:
   - ✅ Can add relations (tags, topics)
   - ✅ Can add computed fields (total views, avg rating)
   - ✅ Can add search indexes

## 🔮 Future Enhancements

1. **Foreign Key Constraints**:
   ```sql
   ALTER TABLE exercise_ratings 
   ADD CONSTRAINT fk_exercise 
   FOREIGN KEY ("exerciseId") 
   REFERENCES exercises_master("slugId");
   ```

2. **Computed Stats Column**:
   ```sql
   ALTER TABLE exercises_master 
   ADD COLUMN total_likes INTEGER DEFAULT 0,
   ADD COLUMN total_views INTEGER DEFAULT 0,
   ADD COLUMN total_comments INTEGER DEFAULT 0;
   ```

3. **Exercise Tags/Topics**:
   ```sql
   CREATE TABLE exercise_tags (
     id TEXT PRIMARY KEY,
     exercise_id TEXT REFERENCES exercises_master("slugId"),
     tag TEXT NOT NULL
   );
   ```

4. **Search Index**:
   ```sql
   CREATE INDEX exercises_master_title_search 
   ON exercises_master USING gin(to_tsvector('german', title));
   ```

## 📚 Related Documentation

- `RATING_TO_LIKES_REFACTOR.md` - Like system implementation
- `EXERCISE_COMMENTS_CLEANUP.md` - Comments system cleanup
- `PERFORMANCE_AND_TRACKING_FIX.md` - Batch API optimization
- `TEST-SCRIPT-EXPLANATION.md` - Performance testing

---

**Last Updated**: 2025-10-06
**Script Location**: `scripts/seed-exercises-master.ts`
**Database**: PostgreSQL 15 (Docker container: edu-theme-postgres)
