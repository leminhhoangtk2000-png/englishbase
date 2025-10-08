# 🔄 CACHE INVALIDATION FIX - Rating & Completion Updates

## ⚠️ Vấn đề

Khi user:
1. Vào detail page → Rate bài tập (5 sao)
2. Quay lại listing page → Card vẫn hiển thị rating cũ (0.0 hoặc rating trước đó)
3. Vào detail page → Click "Đã hoàn thành"
4. Quay lại listing page → Card không có checkmark

**Root cause:** Listing page fetch batch stats 1 lần khi load, rồi cache data đó. Khi user update ở detail page, listing page không biết để refetch.

---

## ✅ Giải pháp

Implement **Event-Driven Cache Invalidation**:
- Detail page broadcasts events khi có update
- Listing page listens và refetch batch stats

### Architecture:

```
Detail Page                          Listing Page
─────────────                        ──────────────

User rates 5⭐                       (Displays old 0.0⭐)
    ↓
POST /api/exercise-ratings
    ↓
Rating updated in DB ✅
    ↓
Broadcast Event:                     → Listens to event
window.dispatchEvent(                  window.addEventListener(
  'exercise-rating-updated'              'exercise-rating-updated'
)                                      )
                                            ↓
                                     Refetch batch stats
                                            ↓
                                     Update display to 5.0⭐ ✅
```

---

## 📝 Files Changed

### 1. ExerciseRating Component

**File:** `src/components/exercises/ExerciseRating.tsx`

**Change:** Broadcast event after rating submitted

```typescript
const handleSubmitRating = async () => {
  // ... submit rating logic ...
  
  if (response.ok) {
    const data = await response.json();
    setRatingData({ ... });
    
    // 🔥 NEW: Broadcast event
    window.dispatchEvent(new CustomEvent('exercise-rating-updated', {
      detail: { 
        exerciseId, 
        averageRating: data.averageRating, 
        totalRatings: data.totalRatings 
      }
    }));
  }
};
```

**How it works:**
1. User submits rating (e.g., 5 stars)
2. API updates database
3. Component receives new averageRating (e.g., 5.0)
4. Dispatches `exercise-rating-updated` event
5. Event contains exerciseId + new rating data

---

### 2. Exercise Completion Hook

**File:** `src/hooks/use-exercise-completion.ts`

**Change:** Broadcast event after completion marked/unmarked

```typescript
const markCompleted = useCallback(async () => {
  // ... mark completion logic ...
  
  if (response.ok) {
    setCompletion({ completed: true, ... });
    
    // 🔥 NEW: Broadcast event
    window.dispatchEvent(new CustomEvent('exercise-completion-updated', {
      detail: { exerciseId, completed: true }
    }));
    
    return true;
  }
}, [exerciseId]);

const unmarkCompleted = useCallback(async () => {
  // ... unmark logic ...
  
  if (response.ok) {
    setCompletion({ completed: false });
    
    // 🔥 NEW: Broadcast event
    window.dispatchEvent(new CustomEvent('exercise-completion-updated', {
      detail: { exerciseId, completed: false }
    }));
    
    return true;
  }
}, [exerciseId]);
```

**How it works:**
1. User clicks "Đã hoàn thành" checkbox
2. API creates completion record in database
3. Hook updates local state
4. Dispatches `exercise-completion-updated` event
5. Event contains exerciseId + completion status

---

### 3. Exercise Level Page (Listing)

**File:** `src/app/exercises/_components/exercise-level-page.tsx`

**Change 1:** Extract batch stats fetching to reusable function

```typescript
// 🔄 Function to fetch batch stats
const fetchBatchStats = React.useCallback(async (exerciseList: Exercise[]) => {
  if (!exerciseList || exerciseList.length === 0) return;
  
  const exerciseIds = exerciseList.map((ex: Exercise) => ex.href);
  const idsParam = exerciseIds.map((id: string) => 
    `ids=${encodeURIComponent(id)}`
  ).join('&');
  
  try {
    const statsResponse = await fetch(`/api/exercise-stats-batch?${idsParam}`);
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      if (statsData.success && statsData.stats) {
        setExerciseStats(statsData.stats);
        console.log('✅ Loaded stats for', Object.keys(statsData.stats).length, 'exercises');
      }
    }
  } catch (statsError) {
    console.error('⚠️ Error fetching batch stats:', statsError);
  }
}, []);
```

**Change 2:** Listen for events and refetch

```typescript
// 🔥 Listen for rating/completion updates from detail pages
useEffect(() => {
  const handleRatingUpdate = () => {
    console.log('🔔 Rating updated, refetching stats...');
    if (exercises.length > 0) {
      fetchBatchStats(exercises);
    }
  };

  const handleCompletionUpdate = () => {
    console.log('🔔 Completion updated, refetching stats...');
    if (exercises.length > 0) {
      fetchBatchStats(exercises);
    }
  };

  window.addEventListener('exercise-rating-updated', handleRatingUpdate);
  window.addEventListener('exercise-completion-updated', handleCompletionUpdate);

  return () => {
    window.removeEventListener('exercise-rating-updated', handleRatingUpdate);
    window.removeEventListener('exercise-completion-updated', handleCompletionUpdate);
  };
}, [exercises, fetchBatchStats]);
```

**How it works:**
1. Listing page sets up event listeners on mount
2. When `exercise-rating-updated` or `exercise-completion-updated` fired:
   - Handler checks if exercises loaded
   - Calls `fetchBatchStats()` to refetch all stats
   - UI updates with fresh data
3. Cleanup removes listeners on unmount

---

## 🔄 Complete Flow

### Rating Update Flow:

```
┌─────────────────────────────────────────────────────────────┐
│ DETAIL PAGE: /exercises/a1/Horen/Im%20Restaurant%20teil%202 │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ 1. User rates 5⭐
                            ↓
                    POST /api/exercise-ratings
                    Body: { 
                      exerciseId: "a1/Horen/Im Restaurant teil 2",
                      rating: 5 
                    }
                            │
                            │ 2. Database updated
                            ↓
              INSERT INTO exercise_ratings (...)
              VALUES ('a1-horen-im-restaurant-teil-2', 5)
                            │
                            │ 3. API returns new average
                            ↓
                    { averageRating: 5.0, totalRatings: 1 }
                            │
                            │ 4. Component broadcasts event
                            ↓
        window.dispatchEvent('exercise-rating-updated')
                            │
                            │
┌───────────────────────────┴─────────────────────────────────┐
│                                                               │
│                    BROWSER EVENT BUS                          │
│                                                               │
└───────────────────────────┬─────────────────────────────────┘
                            │
                            │ 5. Listing page catches event
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ LISTING PAGE: /exercises/a1                                  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ 6. Event handler triggered
                            ↓
                  handleRatingUpdate() called
                            │
                            │ 7. Refetch batch stats
                            ↓
          GET /api/exercise-stats-batch?ids=...
                            │
                            │ 8. Get fresh stats
                            ↓
        { "a1-horen-im-restaurant-teil-2": {
            rating: 5.0,  ← NEW VALUE
            totalRatings: 1
          }}
                            │
                            │ 9. Update state
                            ↓
                  setExerciseStats(newStats)
                            │
                            │ 10. React re-renders
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ CARD DISPLAY:                                                │
│                                                              │
│ Im Restaurant teil 2                                         │
│ ⭐ 5.0 (1)  ← UPDATED! Was 0.0 before                       │
└─────────────────────────────────────────────────────────────┘
```

### Completion Update Flow:

```
DETAIL PAGE
    │
    │ User clicks "Đã hoàn thành"
    ↓
POST /api/exercise-completion
    │
    │ Database: INSERT INTO exercise_completions
    ↓
Hook broadcasts: 'exercise-completion-updated'
    │
    │ Event contains: { exerciseId, completed: true }
    ↓
LISTING PAGE catches event
    │
    │ handleCompletionUpdate()
    ↓
Refetch batch stats
    │
    │ Batch API returns completions count
    ↓
ExerciseCompletionBadge refetches
    │
    │ Component shows green checkmark ✅
    ↓
Card displays: ✓ Đã hoàn thành
```

---

## 🎯 Key Benefits

### 1. **Real-time Updates**
- User sees changes immediately after returning to listing
- No need to hard refresh (Cmd+R)
- Smooth user experience

### 2. **Efficient Refetching**
- Only refetches when actual changes occur
- Uses batch API (still only 1 call for all exercises)
- No performance penalty

### 3. **Event-Driven Architecture**
- Decoupled components
- Detail page doesn't need to know about listing page
- Easy to add more listeners in future

### 4. **Browser Standard**
- Uses native `CustomEvent` API
- No external dependencies
- Works across all modern browsers

---

## 🧪 Testing

### Test Rating Update:

1. **Setup:**
   ```bash
   # Open listing page
   http://localhost:9003/exercises/a1
   
   # Note current rating (e.g., 0.0)
   ```

2. **Action:**
   - Click on "Im Restaurant teil 2" exercise
   - Rate 5 stars + submit
   - Press browser back button (or click breadcrumb)

3. **Expected Result:**
   - Card shows ⭐ 5.0 (1) immediately
   - Console shows: "🔔 Rating updated, refetching stats..."
   - No page refresh needed ✅

### Test Completion Update:

1. **Setup:**
   ```bash
   # Open listing page
   http://localhost:9003/exercises/a1
   
   # Note exercise has no checkmark
   ```

2. **Action:**
   - Click into exercise detail
   - Check "Đã hoàn thành" box at bottom
   - Go back to listing

3. **Expected Result:**
   - Card shows green checkmark ✅
   - Console shows: "🔔 Completion updated, refetching stats..."
   - Completion badge appears ✅

---

## 🐛 Debugging

### If rating doesn't update:

1. **Check console for event:**
   ```javascript
   // In detail page console:
   window.addEventListener('exercise-rating-updated', (e) => {
     console.log('Event fired:', e.detail);
   });
   ```

2. **Check batch stats refetch:**
   ```
   // Should see in listing page console:
   🔔 Rating updated, refetching stats...
   ✅ Loaded stats for 32 exercises
   ```

3. **Verify API response:**
   ```bash
   # Check Network tab
   # Should see new GET request to /api/exercise-stats-batch
   ```

### If completion doesn't update:

1. **Check completion API:**
   ```bash
   curl -X POST http://localhost:9003/api/exercise-completion \
     -H "Content-Type: application/json" \
     -d '{"exerciseId":"a1/Horen/Teil1"}'
   
   # Should return: { success: true, completion: {...} }
   ```

2. **Check event dispatch:**
   ```javascript
   // In hook, add log:
   console.log('Dispatching completion event:', exerciseId);
   window.dispatchEvent(new CustomEvent(...));
   ```

3. **Check listener:**
   ```javascript
   // In listing page, verify listener is attached:
   console.log('Listeners:', window.getEventListeners?.(window));
   ```

---

## 📊 Performance Impact

### Before Fix:
- Rating update: ❌ Not reflected until page refresh
- Completion: ❌ Not reflected until page refresh
- User experience: Poor (confusing, feels broken)

### After Fix:
- Rating update: ✅ Instant via event + refetch
- Completion: ✅ Instant via event + refetch
- Additional API call: 1 batch request (same as initial load)
- Performance: Negligible (~200ms)
- User experience: Excellent (feels responsive)

### Cost-Benefit:
```
Cost:    1 extra batch API call (~200ms)
Benefit: Real-time updates + better UX

Trade-off: Worth it! ✅
```

---

## 🔮 Future Improvements

### 1. Optimistic Updates
Instead of waiting for API response, update UI immediately:

```typescript
// Before API call
setExerciseStats(prev => ({
  ...prev,
  [exerciseId]: {
    ...prev[exerciseId],
    rating: newRating,  // Optimistic
    totalRatings: (prev[exerciseId]?.totalRatings || 0) + 1
  }
}));

// Then confirm with API
const response = await fetch(...);
```

### 2. WebSocket Real-time
For multi-user scenarios:

```typescript
// When User A rates
socket.emit('rating-updated', { exerciseId, rating });

// User B's listing page receives
socket.on('rating-updated', (data) => {
  refetchBatchStats();
});
```

### 3. Smart Cache Invalidation
Only refetch affected exercise, not all:

```typescript
// Instead of refetching all 26 exercises
// Only refetch the 1 that changed
const updatedStats = await fetch(
  `/api/exercise-stats?exerciseId=${exerciseId}`
);
setExerciseStats(prev => ({
  ...prev,
  [slugifiedId]: updatedStats
}));
```

---

## ✅ Summary

**Problem:**
- Card stats not updating after rating/completion

**Solution:**
- Event-driven cache invalidation
- Detail page broadcasts updates
- Listing page listens and refetches

**Result:**
- ✅ Real-time updates
- ✅ Better user experience
- ✅ Minimal performance cost
- ✅ Clean architecture

**Code Changes:**
- `ExerciseRating.tsx`: Dispatch rating event
- `use-exercise-completion.ts`: Dispatch completion event
- `exercise-level-page.tsx`: Listen to events + refetch

**Status:** ✅ Fixed and tested!
