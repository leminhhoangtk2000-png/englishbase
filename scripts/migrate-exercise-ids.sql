-- Migration Script: Standardize Exercise IDs Across All Tables
-- Date: 2025-01-06
-- Purpose: Convert all exercise IDs to consistent slugified format
--
-- Format: level-category-name (e.g., a1-horen-einkaufen-teil-1-a1)
-- All slashes → hyphens, spaces → hyphens, special chars → hyphens

-- ============================================================================
-- EXERCISE_COMPLETIONS TABLE
-- ============================================================================

-- Remove duplicate/malformed record
DELETE FROM exercise_completions 
WHERE "exerciseId" = 'a1-horen-einkaufen-20teil-201-20-20a1';

-- Update URL-encoded IDs to slugified format
UPDATE exercise_completions 
SET "exerciseId" = 'a1-horen-einkaufen-teil-1-a1'
WHERE "exerciseId" = 'a1/Horen/Einkaufen%20teil%201%20-%20A1';

UPDATE exercise_completions 
SET "exerciseId" = 'a1-horen-einkaufen-teil-2-a1'
WHERE "exerciseId" = 'a1/Horen/Einkaufen%20teil%202%20-%20A1';

UPDATE exercise_completions 
SET "exerciseId" = 'a1-horen-familie-und-freunde-teil-1-a1'
WHERE "exerciseId" IN (
  'a1/Horen/Familie und Freunde Teil 1 - A1',
  'a1/Horen/Familie%20und%20Freunde%20Teil%201%20-%20A1'
);

UPDATE exercise_completions 
SET "exerciseId" = 'a1-horen-familie-und-freunde-teil-2-a1'
WHERE "exerciseId" = 'a1/Horen/Familie%20und%20Freunde%20Teil%202%20-%20A1';

UPDATE exercise_completions 
SET "exerciseId" = 'a1-horen-im-restaurant-teil-1-a1'
WHERE "exerciseId" = 'a1/Horen/Im%20Restaurant%20teil%201%20-%20A1';

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check completions format
SELECT 'exercise_completions' as table_name, "exerciseId", COUNT(*) as count
FROM exercise_completions
GROUP BY "exerciseId"
ORDER BY "exerciseId";

-- Check ratings format
SELECT 'exercise_ratings' as table_name, "exerciseId", COUNT(*) as count
FROM exercise_ratings
GROUP BY "exerciseId"
ORDER BY "exerciseId";

-- Check views format
SELECT 'exercise_views' as table_name, "exerciseId", COUNT(*) as count
FROM exercise_views
GROUP BY "exerciseId"
ORDER BY "exerciseId";

-- Check comments format
SELECT 'exercise_comments' as table_name, "exerciseId", COUNT(*) as count
FROM exercise_comments
GROUP BY "exerciseId"
ORDER BY "exerciseId";

-- ============================================================================
-- SUMMARY
-- ============================================================================

SELECT 
  'exercise_ratings' as table_name, 
  COUNT(*) as total_records,
  COUNT(DISTINCT "exerciseId") as unique_exercises
FROM exercise_ratings
UNION ALL
SELECT 
  'exercise_completions', 
  COUNT(*),
  COUNT(DISTINCT "exerciseId")
FROM exercise_completions
UNION ALL
SELECT 
  'exercise_views', 
  COUNT(*),
  COUNT(DISTINCT "exerciseId")
FROM exercise_views
UNION ALL
SELECT 
  'exercise_comments', 
  COUNT(*),
  COUNT(DISTINCT "exerciseId")
FROM exercise_comments;
