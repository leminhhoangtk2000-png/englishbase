# Exercise Completion Fix - User ID Foreign Key Issue

## 🐛 Problem

When clicking the "Đánh dấu hoàn thành" button on exercise pages:
- Button would shake (animation worked)
- But component would NOT hide
- Completion was NOT saved to database

### Root Cause

The API was using a hardcoded `userId = 'user_test_1'` that **did not exist** in the database, causing a **foreign key constraint violation** when trying to save completion.

```typescript
// ❌ OLD CODE (BROKEN)
const userId = currentUser?.id || 'user_test_1';
```

Database error:
```
Foreign key constraint violated on the constraint: `exercise_completions_userId_fkey`
```

## ✅ Solution

Changed API to lookup actual user from database:

```typescript
// ✅ NEW CODE (FIXED)
let userId = currentUser?.id;

if (!userId) {
  // Find any user from database to use as default
  const defaultUser = await prisma.user.findFirst({
    where: { email: 'user@edu-theme.com' }
  });
  userId = defaultUser?.id;
}
```

### Additional Fixes

1. **Correct Prisma Model Name**
   - Changed from `prisma.users` → `prisma.user`
   - Schema uses `model User` not `model users`

2. **Better Error Handling**
   - Added check if no user found in database
   - Returns 401 error instead of failing silently

3. **Debug Logging**
   - Added comprehensive logs to component, hook, and API
   - Helps diagnose issues in development

## 📋 Files Changed

### 1. `/src/app/api/exercise-completion/route.ts`
- Fixed GET endpoint to lookup user
- Fixed POST endpoint to lookup user
- Added debug logging
- Better error messages

### 2. `/src/components/exercises/ExercisePageCompletion.tsx`
- Added debug logs on mount
- Added debug logs when completion state changes
- Added debug logs in handleComplete

### 3. `/src/hooks/use-exercise-completion.ts`
- Added debug logs in useEffect
- Added debug logs in markCompleted
- Better error handling

### 4. `/scripts/clear-exercise-completion.sh`
- New helper script to clear completions for testing

## 🧪 Testing

### Test Completion Flow

1. Go to any exercise page:
   ```
   http://localhost:9003/exercises/a1/Horen/Einkaufen%20teil%202%20-%20A1
   ```

2. You should see green button in bottom-right corner

3. Click "Đánh dấu hoàn thành"

4. **Expected behavior:**
   - Button shakes for 0.5s
   - Component disappears
   - Console shows success logs

5. Refresh page - button should NOT reappear (completion persisted)

### Test API Directly

```bash
# Check completion status
curl "http://localhost:9003/api/exercise-completion?exerciseId=a1/Horen/Test"

# Mark as complete
curl -X POST "http://localhost:9003/api/exercise-completion" \
  -H "Content-Type: application/json" \
  -d '{"exerciseId": "a1/Horen/Test", "timeSpent": 0}'
```

### Clear Completion (For Testing)

```bash
# Using helper script
./scripts/clear-exercise-completion.sh "a1/Horen/Familie und Freunde Teil 1 - A1"

# Or manually
docker exec -it edu-theme-postgres psql -U postgres -d edu_theme_db \
  -c "DELETE FROM exercise_completions WHERE \"exerciseId\" = 'a1/Horen/Test';"
```

## 🔍 Debug Logs

When completion button is clicked, you should see these logs:

### Browser Console
```
🔵 handleComplete called
🔵 exerciseId: a1/Horen/Test
🔵 current completion state: {completed: false}
🟡 markCompleted: Starting... {exerciseId: "a1/Horen/Test", timeSpent: 0}
🟡 markCompleted: Response status 200
🟢 markCompleted: Success! {success: true, completion: {...}}
🔵 completion.completed changed to: true
✅ Component should hide now!
```

### Server Terminal (npm run dev)
```
🟦 POST /api/exercise-completion - Request received
🔧 Using default user: cmgdj0vio000246ypb4b2kagd
🟦 User ID: cmgdj0vio000246ypb4b2kagd
🟦 Request body: {exerciseId: "a1/Horen/Test", timeSpent: 0}
🟢 Completion saved: {id: "...", userId: "...", exerciseId: "...", ...}
```

## 📊 Database Schema

### Users Table
```sql
SELECT id, email, name, role FROM "User" LIMIT 3;
```

Result:
```
id                        | email                 | name         | role
--------------------------+-----------------------+--------------+-------------
cmgdj0vif000046yp8i6xoriy | admin@edu-theme.com   | Admin User   | ADMIN
cmgdj0vim000146yp9nshd7lw | premium@edu-theme.com | Premium User | USER_PREMIUM
cmgdj0vio000246ypb4b2kagd | user@edu-theme.com    | Regular User | USER
```

### Exercise Completions Table
```sql
SELECT * FROM exercise_completions LIMIT 5;
```

## 🚀 Future Improvements

1. **Add Authentication**
   - Currently using fallback user for development
   - Should implement proper auth system
   - Use NextAuth or similar

2. **Add User Context**
   - Create React Context for current user
   - Pass userId from context instead of API lookup

3. **Add Loading States**
   - Show spinner while marking complete
   - Disable button during API call

4. **Add Error Messages**
   - Toast notification on success
   - Error message if API fails
   - Retry mechanism

## 📝 Notes

- Fix was deployed in commit `5676717`
- All debug logs can be removed once stable
- Currently using `user@edu-theme.com` as default for development
- Foreign key relationship ensures data integrity
