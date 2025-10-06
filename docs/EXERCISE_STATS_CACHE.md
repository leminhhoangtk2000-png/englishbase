# Exercise Statistics Cache System

## Overview

Added cached count columns to `exercises_master` table to improve query performance and simplify data access for exercise cards.

## Database Schema Changes

### New Columns in `exercises_master`

```prisma
model exercises_master {
  id            String   @id @default(cuid())
  slug          String   @unique
  slugId        String   @unique
  title         String
  level         String
  category      String
  
  // 🆕 Cached Statistics
  likesCount    Int      @default(0)    // Count from exercise_likes (isLiked = true)
  viewsCount    Int      @default(0)    // Count from exercise_views
  commentsCount Int      @default(0)    // Count from exercise_comments (published = true)
  
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  // Indexes for performance
  @@index([level])
  @@index([category])
  @@index([slugId])
  @@index([likesCount])      // 🆕 Sort by popularity
  @@index([viewsCount])      // 🆕 Sort by views
}
```

## Why Cache Counts?

### Before (Multiple JOINs Required)
```typescript
// Complex query with multiple LEFT JOINs
const exercises = await prisma.exercises_master.findMany({
  include: {
    _count: {
      select: {
        exercise_likes: { where: { isLiked: true } },
        exercise_views: true,
        exercise_comments: { where: { published: true } }
      }
    }
  }
});
```

### After (Simple Direct Access)
```typescript
// Fast single table query
const exercises = await prisma.exercises_master.findMany({
  select: {
    id: true,
    title: true,
    level: true,
    category: true,
    likesCount: true,     // ✅ Direct access
    viewsCount: true,     // ✅ Direct access
    commentsCount: true   // ✅ Direct access
  },
  orderBy: { likesCount: 'desc' } // ✅ Fast sorting
});
```

## Benefits

1. **Performance**: No JOINs needed for listing exercises
2. **Simplicity**: Direct property access in components
3. **Sorting**: Fast ORDER BY on indexed columns
4. **Caching**: Pre-calculated counts reduce DB load

## Usage

### Update Counts After Changes

```bash
# Manual update
npm run db:update-counts

# Automatic during seed
npm run db:seed
```

### In API Routes

```typescript
// Get all exercises with stats
const exercises = await prisma.exercises_master.findMany({
  select: {
    slugId: true,
    title: true,
    level: true,
    likesCount: true,
    viewsCount: true,
    commentsCount: true
  },
  orderBy: { likesCount: 'desc' },
  take: 20
});
```

### In Components

```tsx
// ExerciseCard.tsx
interface ExerciseCardProps {
  exercise: {
    title: string;
    likesCount: number;
    viewsCount: number;
    commentsCount: number;
  };
}

export function ExerciseCard({ exercise }: ExerciseCardProps) {
  return (
    <div>
      <h3>{exercise.title}</h3>
      <div className="stats">
        <span>❤️ {exercise.likesCount}</span>
        <span>👁️ {exercise.viewsCount}</span>
        <span>💬 {exercise.commentsCount}</span>
      </div>
    </div>
  );
}
```

## Maintaining Counts

### When to Update

Counts should be updated when:
- User likes/unlikes an exercise
- User views an exercise
- Comment is added/published/deleted

### Update Strategies

#### 1. Immediate Update (Recommended for Likes)
```typescript
// In like/unlike API route
await prisma.$transaction([
  // Update like status
  prisma.exercise_likes.upsert({
    where: { userId_exerciseId: { userId, exerciseId } },
    update: { isLiked: true },
    create: { userId, exerciseId, isLiked: true }
  }),
  
  // Increment count
  prisma.exercises_master.update({
    where: { slugId: exerciseId },
    data: { likesCount: { increment: 1 } }
  })
]);
```

#### 2. Batch Update (For Views/Comments)
```typescript
// Run periodically (e.g., every 5 minutes)
import { updateExerciseCounts } from '@/lib/update-counts';

// In cron job or background task
await updateExerciseCounts();
```

#### 3. Full Recalculation
```bash
# When data integrity needs verification
npm run db:update-counts
```

## Current Statistics (as of 2025-10-06)

### Overall
- **Total Exercises**: 85 (A1: 32, A2: 27, B1: 26)
- **Total Likes**: 112
- **Total Views**: 4
- **Total Comments**: 0

### By Level
| Level | Exercises | Total Likes | Avg Likes | Total Views |
|-------|-----------|-------------|-----------|-------------|
| A1    | 32        | 51          | 1.59      | 4           |
| A2    | 27        | 45          | 1.67      | 0           |
| B1    | 26        | 16          | 0.62      | 0           |

### Top Liked Exercises (6 likes each)
1. Kleine Gewohnheiten, große Wirkung (B1/Horen)
2. Eine Wohnung in Leipzig finden (B1/Horen)
3. Wien – Die Hauptstadt von Österreich (A2/Lesen)
4. Berühmte Käsesorten in Europa (A2/Lesen)
5. Bahnreisen in Europa (A2/Lesen)
6. A2 – Mein erstes Mal im Ausland (A2/Horen)
7. A2 – Was ich in meiner Freizeit mache (A2/Horen)
8. Einkaufen in Deutschland (A1/Lesen)
9. Berühmte Festivals in Europa (A1/Lesen)
10. Essen und Trinken in Deutschland (A1/Lesen)

## Scripts

### update-exercise-counts.ts
Standalone script to recalculate and update all exercise counts.

**Features**:
- Counts likes (isLiked = true only)
- Counts views (all)
- Counts comments (published only)
- Shows progress and statistics
- Lists top exercises

**Usage**:
```bash
npm run db:update-counts
```

### seed-exercises-master.ts (Enhanced)
Original seed script now includes automatic count update after seeding.

**Steps**:
1. Scan exercise MDX files
2. Create/update exercises_master records
3. Migrate old data formats
4. **Update all counts** (new!)

**Usage**:
```bash
npm run db:seed
```

## Future Enhancements

### 1. Real-time Count Updates
```typescript
// Increment/decrement in same transaction
await prisma.exercises_master.update({
  where: { slugId },
  data: { 
    likesCount: { increment: isLiked ? 1 : -1 } 
  }
});
```

### 2. Analytics Dashboard
```typescript
// Get trending exercises
const trending = await prisma.exercises_master.findMany({
  where: {
    createdAt: { gte: thirtyDaysAgo }
  },
  orderBy: [
    { likesCount: 'desc' },
    { viewsCount: 'desc' }
  ],
  take: 10
});
```

### 3. Recommendation System
```typescript
// Suggest similar popular exercises
const similar = await prisma.exercises_master.findMany({
  where: {
    level: currentExercise.level,
    category: currentExercise.category,
    id: { not: currentExercise.id }
  },
  orderBy: { likesCount: 'desc' },
  take: 5
});
```

## Migration Notes

### Applied Changes
1. ✅ Added 3 count columns to schema
2. ✅ Pushed schema to database
3. ✅ Created indexes on likesCount and viewsCount
4. ✅ Created update script
5. ✅ Enhanced seed script with count update
6. ✅ Updated all 85 exercises with current counts

### No Breaking Changes
- Existing queries still work
- Old API routes continue functioning
- Can gradually migrate to use cached counts

## Related Files

- `prisma/schema.prisma` - Schema definition
- `scripts/update-exercise-counts.ts` - Count update script
- `scripts/seed-exercises-master.ts` - Enhanced seed script
- `package.json` - Added `db:update-counts` command

## See Also

- [Exercise Database Normalization](./EXERCISE_DATABASE_NORMALIZATION.md)
- [Exercise Inventory Report](./EXERCISE_INVENTORY_REPORT.md)
- [Rating to Likes Refactor](./RATING_TO_LIKES_REFACTOR.md)
