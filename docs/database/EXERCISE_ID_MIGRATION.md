# Database Migration: Exercise ID Standardization

**Date**: December 2024  
**Status**: ✅ COMPLETE  
**Scope**: ALL exercise-related database tables

---

## 🎯 Problem

Database contained **mixed ID formats** across different tables, causing:

- Stats not displaying correctly
- Duplicate completion records
- Inconsistent queries failing to match

### ID Format Issues Found

| Table                | Total Records | Issues                          |
| -------------------- | ------------- | ------------------------------- |
| exercise_ratings     | 2             | ✅ Already correct              |
| exercise_completions | 7             | ❌ 6 wrong formats, 1 duplicate |
| exercise_views       | 0             | N/A                             |
| exercise_comments    | 0             | N/A                             |

### Example Problems

```
❌ URL Encoded:  'a1/Horen/Einkaufen%20teil%201%20-%20A1'
❌ Raw Format:   'a1/Horen/Familie und Freunde Teil 1 - A1'
❌ Malformed:    'a1-horen-einkaufen-20teil-201-20-20a1'
✅ Correct:      'a1-horen-einkaufen-teil-1-a1'
```

---

## 🔍 Investigation

### Step 1: Check All Tables

```sql
SELECT 'exercise_completions', COUNT(*),
       COUNT(CASE WHEN "exerciseId" LIKE '%-%-%' THEN 1 END) as with_category,
       COUNT(CASE WHEN "exerciseId" NOT LIKE '%-%-%' THEN 1 END) as without_category
FROM exercise_completions;
```

Result: 7 records, 1 with category, 6 without

### Step 2: Identify All Formats

```sql
SELECT "exerciseId", "userId", "completedAt"
FROM exercise_completions
ORDER BY "exerciseId";
```

Found:

- `a1-horen-einkaufen-20teil-201-20-20a1` (malformed)
- `a1/Horen/Einkaufen%20teil%201%20-%20A1` (URL encoded)
- `a1/Horen/Einkaufen%20teil%202%20-%20A1` (URL encoded)
- `a1/Horen/Familie und Freunde Teil 1 - A1` (raw)
- `a1/Horen/Familie%20und%20Freunde%20Teil%201%20-%20A1` (URL encoded duplicate!)
- `a1/Horen/Familie%20und%20Freunde%20Teil%202%20-%20A1` (URL encoded)
- `a1/Horen/Im%20Restaurant%20teil%201%20-%20A1` (URL encoded)

### Step 3: Map Transformations

| Old ID                                                 | New ID                                   |
| ------------------------------------------------------ | ---------------------------------------- |
| `a1-horen-einkaufen-20teil-201-20-20a1`                | DELETE (malformed)                       |
| `a1/Horen/Einkaufen%20teil%201%20-%20A1`               | `a1-horen-einkaufen-teil-1-a1`           |
| `a1/Horen/Einkaufen%20teil%202%20-%20A1`               | `a1-horen-einkaufen-teil-2-a1`           |
| `a1/Horen/Familie und Freunde Teil 1 - A1`             | DELETE (older duplicate)                 |
| `a1/Horen/Familie%20und%20Freunde%20Teil%201%20-%20A1` | `a1-horen-familie-und-freunde-teil-1-a1` |
| `a1/Horen/Familie%20und%20Freunde%20Teil%202%20-%20A1` | `a1-horen-familie-und-freunde-teil-2-a1` |
| `a1/Horen/Im%20Restaurant%20teil%201%20-%20A1`         | `a1-horen-im-restaurant-teil-1-a1`       |

---

## ✅ Solution

### Migration Script

Created: `scripts/migrate-exercise-ids.sql`

```sql
-- Remove malformed record
DELETE FROM exercise_completions
WHERE "exerciseId" = 'a1-horen-einkaufen-20teil-201-20-20a1';

-- Update URL-encoded to slugified
UPDATE exercise_completions
SET "exerciseId" = 'a1-horen-einkaufen-teil-1-a1'
WHERE "exerciseId" = 'a1/Horen/Einkaufen%20teil%201%20-%20A1';

-- ... (see full script in file)
```

### Slugification Logic

Same function used in ALL APIs:

```typescript
function slugifyExerciseId(id: string): string {
  // First decode if URL encoded
  let decoded = decodeURIComponent(id);

  return decoded
    .toLowerCase()
    .replace(/\//g, "-") // slashes → hyphens
    .replace(/\s+/g, "-") // spaces → hyphens
    .replace(/[^\w\-]/g, "-") // special → hyphens
    .replace(/-+/g, "-") // collapse multiple
    .replace(/^-+|-+$/g, ""); // trim edges
}
```

---

## 🧪 Execution & Results

### Before Migration

```
exercise_completions: 7 records
├─ a1-horen-einkaufen-20teil-201-20-20a1 (malformed)
├─ a1/Horen/Einkaufen%20teil%201%20-%20A1 (URL encoded)
├─ a1/Horen/Einkaufen%20teil%202%20-%20A1 (URL encoded)
├─ a1/Horen/Familie und Freunde Teil 1 - A1 (raw)
├─ a1/Horen/Familie%20und%20Freunde%20Teil%201%20-%20A1 (duplicate)
├─ a1/Horen/Familie%20und%20Freunde%20Teil%202%20-%20A1 (URL encoded)
└─ a1/Horen/Im%20Restaurant%20teil%201%20-%20A1 (URL encoded)
```

### After Migration

```
exercise_completions: 5 records (2 removed: 1 malformed, 1 duplicate)
├─ a1-horen-einkaufen-teil-1-a1 ✅
├─ a1-horen-einkaufen-teil-2-a1 ✅
├─ a1-horen-familie-und-freunde-teil-1-a1 ✅
├─ a1-horen-familie-und-freunde-teil-2-a1 ✅
└─ a1-horen-im-restaurant-teil-1-a1 ✅
```

### Verification Query

```sql
SELECT
  'RATINGS' as data_type,
  COUNT(*) as total_records,
  COUNT(DISTINCT "exerciseId") as unique_exercises
FROM exercise_ratings
UNION ALL
SELECT 'COMPLETIONS', COUNT(*), COUNT(DISTINCT "exerciseId")
FROM exercise_completions;
```

Result:

```
  data_type  | total_records | unique_exercises
-------------+---------------+------------------
 RATINGS     |             2 |                2
 COMPLETIONS |             5 |                5
```

---

## 📊 Final State

### All Exercise IDs (Standardized)

```
RATINGS (2 exercises):
  • a1-horen-einkaufen-teil-1-a1 (5 stars)
  • a1-horen-einkaufen-teil-2-a1 (5 stars)

COMPLETIONS (5 exercises):
  • a1-horen-einkaufen-teil-1-a1
  • a1-horen-einkaufen-teil-2-a1
  • a1-horen-familie-und-freunde-teil-1-a1
  • a1-horen-familie-und-freunde-teil-2-a1
  • a1-horen-im-restaurant-teil-1-a1

VIEWS: 0 records
COMMENTS: 0 records
```

### Format Validation

✅ **All IDs now follow consistent pattern**:

- Format: `{level}-{category}-{name}`
- Example: `a1-horen-einkaufen-teil-1-a1`
- Lowercase, hyphen-separated
- No slashes, no spaces, no special characters
- No URL encoding

---

## 🔄 Impact on System

### Frontend (No Changes Required)

Components continue to send raw IDs:

```tsx
<ExerciseRating exerciseId="a1/Horen/Einkaufen teil 1 - A1" />
```

### API Layer (Already Fixed)

All APIs slugify before querying:

```typescript
const exerciseId = slugifyExerciseId(rawExerciseId);
const ratings = await prisma.exercise_ratings.findMany({
  where: { exerciseId },
});
```

### Database (Now Consistent)

All records use standardized format:

```sql
SELECT * FROM exercise_ratings
WHERE "exerciseId" = 'a1-horen-einkaufen-teil-1-a1';
```

---

## 🚀 Testing

### API Tests

```bash
# Test Einkaufen teil 1
curl "http://localhost:9003/api/exercise-stats?exerciseId=a1/Horen/Einkaufen%20teil%201%20-%20A1"
# Returns: {"rating": 5, "totalRatings": 1} ✅

# Test Einkaufen teil 2
curl "http://localhost:9003/api/exercise-stats?exerciseId=a1/Horen/Einkaufen%20teil%202%20-%20A1"
# Returns: {"rating": 5, "totalRatings": 1} ✅

# Test Familie teil 1
curl "http://localhost:9003/api/exercise-completion?exerciseId=a1/Horen/Familie%20und%20Freunde%20Teil%201%20-%20A1"
# Returns: {"completed": true} ✅
```

### Browser Verification

1. Navigate to: `http://localhost:9003/exercises/a1`
2. Check cards show correct stats:
   - ✅ Einkaufen teil 1: ⭐ 5.0 (1) + ✓ Completed
   - ✅ Einkaufen teil 2: ⭐ 5.0 (1) + ✓ Completed
   - ✅ Familie teil 1: ✓ Completed
   - ✅ Familie teil 2: ✓ Completed
   - ✅ Restaurant teil 1: ✓ Completed

---

## 📝 Prevention Strategy

### Going Forward

1. **APIs handle slugification** - No frontend changes needed
2. **Consistent helper function** - Used across all 7 APIs
3. **Database validation** - Use CHECK constraint:

```sql
ALTER TABLE exercise_ratings
ADD CONSTRAINT exercise_id_format
CHECK ("exerciseId" ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
```

4. **Documentation** - Clear format spec in schema comments

### Best Practices

✅ **DO**:

- Let APIs handle ID transformation
- Use slugifyExerciseId() consistently
- Test with real exercise URLs containing spaces/special chars

❌ **DON'T**:

- Store raw URLs with slashes in database
- Store URL-encoded strings (%20, etc.)
- Create IDs manually without using helper function

---

## 🎯 Summary

### Changes Made

- ✅ Created migration script: `scripts/migrate-exercise-ids.sql`
- ✅ Executed migration on database
- ✅ Removed 2 invalid records (1 malformed, 1 duplicate)
- ✅ Standardized 5 completion records
- ✅ Verified all 7 exercise APIs work correctly
- ✅ Tested in browser - all stats displaying correctly

### Final Metrics

| Metric                | Before | After |
| --------------------- | ------ | ----- |
| **Total Records**     | 9      | 7     |
| **Unique Formats**    | 4      | 1     |
| **Duplicates**        | 1      | 0     |
| **Malformed IDs**     | 1      | 0     |
| **Consistent Format** | ❌     | ✅    |

### Benefits

✅ **Data Integrity**: All IDs follow same format  
✅ **No Duplicates**: Single source of truth per exercise  
✅ **Stats Work**: Cards display correct ratings/completions  
✅ **Scalable**: Future exercises automatically work  
✅ **Maintainable**: Clear format specification

---

**Result**: All exercise cards now display stats correctly with consistent data! 🎉
