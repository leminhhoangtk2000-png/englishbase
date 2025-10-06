# Table Rename: exercise_ratings → exercise_likes

## Summary
Renamed `exercise_ratings` to `exercise_likes` to accurately reflect functionality (heart ❤️ likes, not 1-5 star ratings).

## Changes
- ✅ Database table renamed
- ✅ All indexes renamed
- ✅ Prisma schema updated
- ✅ API routes updated (all `src/app/api/` files)
- ✅ Seed script updated
- ✅ Prisma client regenerated

## Stats
- **158 likes** preserved
- **0 data loss**
- **0 downtime**

## Database State
```
exercises_master: 85 exercises
exercise_likes: 158 likes (was exercise_ratings)
exercise_views: 5 views
exercise_comments: 0 comments
exercise_completions: 11 completions
```

## Coverage
- 58/85 exercises (68%) have likes
- 27/85 exercises (32%) have no stats yet (normal - created on user interaction)

See `EXERCISE_DATABASE_NORMALIZATION.md` for full documentation.
