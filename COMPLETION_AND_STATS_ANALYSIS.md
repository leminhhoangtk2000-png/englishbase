# Phân Tích Hệ Thống: Completion Badge, Views, và Comments

## 📊 Tổng Quan

Hệ thống có 3 phần chính hiển thị trên mỗi exercise card:

1. **✅ Completion Badge** (Dấu tick đã đọc)
2. **👁️ View Count** (Số lượt xem)
3. **💬 Comment Count** (Số bình luận)

---

## 1. ✅ HỆ THỐNG COMPLETION BADGE (DẤU TICK ĐÃ ĐỌC)

### 📍 Vị Trí Hiển Thị

```
Card Exercise:
┌─────────────────────────────────────┐
│  [Image]                   [Badge]  │  ← Badge phụ (nếu completed)
│                                     │
│  Tiêu đề           [CheckCircle] ← │  ← Icon variant (chính)
│  Mô tả...                           │
│  ─────────────────────────────────  │
│  ⏱ 5 phút  ⭐ 4.5  👁 120  💬 15   │
└─────────────────────────────────────┘
```

### 🔧 Cơ Chế Hoạt Động

#### A. Component: `ExerciseCompletionBadge.tsx`

**Props:**
```typescript
{
  exerciseId: string;           // VD: "a1/Horen/Familie und Freunde Teil 1 - A1"
  variant: 'badge' | 'button' | 'icon';  // 3 kiểu hiển thị
  className?: string;
  onCompletionChange?: (completed: boolean) => void;
}
```

**3 Variants:**

1. **Icon Variant** (Dùng trên listing page):
   - Hiển thị: `<CheckCircle2>` (xanh) hoặc `<Circle>` (xám)
   - Kích thước: 5x5 (w-5 h-5)
   - Click để toggle completed
   - Có tooltip

2. **Badge Variant** (Dùng trên các card):
   - Hiển thị: Text "Hoàn thành" / "Chưa hoàn thành"
   - Màu: Xanh lá (completed) / Xám (not completed)
   - Click để toggle

3. **Button Variant** (Dùng trên detail page):
   - Hiển thị: Button với text
   - Full-sized button
   - Loading state khi đang process

#### B. Hook: `use-exercise-completion.ts`

**State Management:**
```typescript
interface CompletionData {
  completed: boolean;           // Đã hoàn thành chưa?
  completedAt?: string;         // Thời gian hoàn thành
  timeSpent?: number;           // Thời gian làm bài (giây)
  attempts?: number;            // Số lần làm
}
```

**Luồng Hoạt Động:**

```
1. Component Mount
   ↓
2. useEffect → Fetch API: GET /api/exercise-completion?exerciseId=xxx
   ↓
3. Nhận response: { completed: true/false, ... }
   ↓
4. Update state → Component re-render
   ↓
5. Hiển thị icon tương ứng
```

**Auto-Refresh Feature (Mới):**
```typescript
// Listen visibility change
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    fetchCompletion(); // Refetch khi user quay lại tab
  }
});
```

**Flow khi user click:**
```
User Click Icon
   ↓
handleToggle() called
   ↓
marking = true (show loading)
   ↓
Call API: POST /api/exercise-completion
   ↓
API save to database
   ↓
Update local state: completed = true
   ↓
Component re-render → Show green checkmark
```

#### C. API Endpoint: `/api/exercise-completion`

**GET - Check Completion:**
```typescript
GET /api/exercise-completion?exerciseId=a1/Horen/Test

Response:
{
  completed: true,
  completedAt: "2025-10-05T12:47:12.587Z",
  timeSpent: null,
  attempts: 1
}
```

**POST - Mark Complete:**
```typescript
POST /api/exercise-completion
Body: { exerciseId: "a1/Horen/Test", timeSpent: 0 }

Database Operation:
- Tìm user (hiện tại: user@edu-theme.com)
- Upsert vào bảng exercise_completions:
  * Nếu chưa có: tạo mới với attempts = 1
  * Nếu đã có: increment attempts++
```

#### D. Database Schema

```sql
TABLE: exercise_completions
┌──────────────┬───────────┬──────────────────────────────┐
│ Cột          │ Type      │ Mô tả                        │
├──────────────┼───────────┼──────────────────────────────┤
│ id           │ TEXT      │ Primary key (cuid)           │
│ userId       │ TEXT      │ FK → User.id                 │
│ exerciseId   │ TEXT      │ "a1/Horen/Test"              │
│ completedAt  │ TIMESTAMP │ Thời gian hoàn thành         │
│ timeSpent    │ INTEGER   │ Giây (nullable)              │
│ attempts     │ INTEGER   │ Số lần làm                   │
└──────────────┴───────────┴──────────────────────────────┘

UNIQUE CONSTRAINT: (userId, exerciseId)
→ Mỗi user chỉ có 1 completion record cho 1 exercise
```

### 🔄 Luồng Hoàn Chỉnh

**Scenario: User đánh dấu hoàn thành**

```
1. User ở listing page: /exercises/a1
   ├─ Component mount → Fetch completions cho tất cả cards
   └─ Hiển thị Circle (xám) cho bài chưa làm

2. User click vào "Familie und Freunde Teil 1"
   ├─ Navigate to: /exercises/a1/Horen/Familie%20und%20Freunde%20Teil%201%20-%20A1
   └─ Detail page load

3. User click nút "Đánh dấu hoàn thành" ở góc dưới phải
   ├─ Call: POST /api/exercise-completion
   ├─ Database: INSERT exercise_completions
   ├─ Component state: completed = true
   └─ Component hide (return null)

4. User back về listing page
   ├─ Tab visibility change → Trigger refetch
   ├─ Call: GET /api/exercise-completion?exerciseId=...
   ├─ Response: { completed: true }
   └─ Icon update: Circle → CheckCircle2 (xanh)

5. User refresh page
   ├─ Component re-mount
   ├─ Fetch lại completion status
   └─ Icon vẫn xanh (data persisted in DB)
```

---

## 2. 👁️ HỆ THỐNG VIEW COUNT (ĐẾM LƯỢT XEM)

### 🔧 Cơ Chế Hoạt Động

#### A. Component: `ExerciseStatsDisplay.tsx`

```typescript
// Hiển thị trên footer của mỗi card
<ExerciseStatsDisplay exerciseId="a1/Horen/Test" />

// Render:
<Eye /> 120  <MessageCircle /> 15
```

#### B. Hook: `use-exercise-stats.ts`

**Fetch Stats:**
```typescript
useEffect(() => {
  fetch(`/api/exercise-stats?exerciseId=${exerciseId}`)
    .then(res => res.json())
    .then(data => setStats(data.stats));
}, [exerciseId]);
```

**State:**
```typescript
{
  views: 120,        // Tổng số lượt xem
  comments: 15,      // Tổng số bình luận
  rating: 4.5,       // Điểm trung bình
  totalRatings: 23   // Số người đánh giá
}
```

#### C. API: `/api/exercise-stats`

**GET - Fetch Stats:**
```typescript
GET /api/exercise-stats?exerciseId=a1/Horen/Test

Logic:
1. Count views từ bảng exercise_views
2. Count comments (hiện tại = 0, chưa implement)
3. Tính average rating từ bảng exercise_ratings

Response:
{
  success: true,
  stats: {
    views: 120,
    comments: 0,
    rating: 4.5,
    totalRatings: 23
  }
}
```

#### D. View Tracking API: `/api/exercise-views`

**POST - Record View:**
```typescript
POST /api/exercise-views
Body: { exerciseId: "a1/Horen/Test", userId: "xxx" }

Logic:
1. Get IP address từ request headers
2. Get User Agent từ headers
3. Check duplicate: Có view nào từ IP/user này trong 24h không?
   ├─ Có → Return (không đếm duplicate)
   └─ Không → INSERT new view record

Database:
INSERT INTO exercise_views (exerciseId, userId, ipAddress, userAgent)
```

#### E. Database Schema

```sql
TABLE: exercise_views
┌────────────┬───────────┬──────────────────────────────┐
│ Cột        │ Type      │ Mô tả                        │
├────────────┼───────────┼──────────────────────────────┤
│ id         │ TEXT      │ Primary key                  │
│ exerciseId │ TEXT      │ Bài tập                      │
│ userId     │ TEXT      │ User (nullable)              │
│ ipAddress  │ TEXT      │ IP của viewer                │
│ userAgent  │ TEXT      │ Browser info                 │
│ createdAt  │ TIMESTAMP │ Thời gian xem                │
└────────────┴───────────┴──────────────────────────────┘

UNIQUE CONSTRAINT: KHÔNG CÓ
→ Có thể có nhiều views từ cùng user/IP (sau 24h)
```

### 🔄 Luồng View Tracking

**Khi nào view được track?**

```
Option 1: Listing Page (CHƯA IMPLEMENT)
   ├─ Card xuất hiện trên viewport
   ├─ Call trackExerciseView(exerciseId)
   └─ POST /api/exercise-views

Option 2: Detail Page (NÊN IMPLEMENT)
   ├─ User mở detail page
   ├─ useEffect on mount
   ├─ trackExerciseView(exerciseId)
   └─ POST /api/exercise-views

Option 3: Manual Track
   ├─ Component call trackExerciseView()
   └─ API record view
```

**Anti-Spam Logic:**
```
1. User A xem bài lúc 10:00 → View recorded
2. User A xem lại bài lúc 10:30 → KHÔNG record (trong 24h)
3. User A xem lại bài lúc 10:00 ngày mai → View recorded (sau 24h)

Spam Prevention:
- Check IP + exerciseId trong 24h
- Check userId + exerciseId trong 24h
- Nếu có record → skip
```

---

## 3. 💬 HỆ THỐNG COMMENT COUNT (ĐẾM BÌNH LUẬN)

### 🚧 Trạng Thái: CHƯA IMPLEMENT ĐẦY ĐỦ

#### A. Current Implementation

```typescript
// Trong ExerciseStatsDisplay.tsx
<MessageCircle className="w-4 h-4" />
<span>{stats.comments}</span>  // Luôn = 0

// Trong API exercise-stats
const commentsCount = 0;  // Hardcoded
```

#### B. Database Schema (CHỜ IMPLEMENT)

```sql
TABLE: exercise_comments (TÊN GIẢ ĐỊNH)
┌────────────┬───────────┬──────────────────────────────┐
│ Cột        │ Type      │ Mô tả                        │
├────────────┼───────────┼──────────────────────────────┤
│ id         │ TEXT      │ Primary key                  │
│ exerciseId │ TEXT      │ Bài tập                      │
│ userId     │ TEXT      │ FK → User.id                 │
│ content    │ TEXT      │ Nội dung comment             │
│ parentId   │ TEXT      │ Nullable (for replies)       │
│ createdAt  │ TIMESTAMP │ Thời gian comment            │
│ updatedAt  │ TIMESTAMP │ Thời gian edit               │
└────────────┴───────────┴──────────────────────────────┘
```

#### C. TODO: Implement Comments

**1. API Endpoints Cần Tạo:**
```typescript
// Lấy comments
GET /api/exercise-comments?exerciseId=xxx
Response: { comments: [...], total: 15 }

// Tạo comment mới
POST /api/exercise-comments
Body: { exerciseId, content, parentId? }

// Xóa comment
DELETE /api/exercise-comments/[id]

// Edit comment
PATCH /api/exercise-comments/[id]
Body: { content }
```

**2. Component Cần Tạo:**
```typescript
// Comment list component
<ExerciseComments exerciseId="..." />
  └─ <CommentItem comment={...} />
      └─ <CommentReply parentId={...} />

// Comment form
<CommentForm exerciseId="..." onSubmit={handleSubmit} />
```

**3. Update Stats API:**
```typescript
// Trong /api/exercise-stats
const commentsCount = await prisma.exercise_comments.count({
  where: { exerciseId }
});
```

---

## 4. 📊 SO SÁNH CÁC HỆ THỐNG

| Feature         | Completion Badge | View Count     | Comment Count  |
|-----------------|------------------|----------------|----------------|
| **Status**      | ✅ Hoàn chỉnh    | ✅ Hoàn chỉnh  | 🚧 Chưa làm    |
| **Database**    | ✅ exercise_completions | ✅ exercise_views | ❌ Chưa có bảng |
| **API**         | ✅ GET/POST/DELETE | ✅ GET/POST | ❌ Chưa có      |
| **Component**   | ✅ 3 variants    | ✅ Display     | ❌ Chưa có      |
| **Hook**        | ✅ use-exercise-completion | ✅ use-exercise-stats | ❌ Cần tạo |
| **Auto-refresh**| ✅ Visibility API | ❌ No auto-refresh | N/A |
| **Anti-spam**   | N/A              | ✅ 24h window  | N/A            |
| **User Action** | ✅ Click toggle  | 🔄 Auto track  | N/A            |

---

## 5. 🔍 ĐIỂM MẠNH VÀ HẠN CHẾ

### ✅ Điểm Mạnh

1. **Completion System:**
   - ✅ Auto-refresh khi quay lại tab
   - ✅ Data persist trong database
   - ✅ Multiple variants cho flexibility
   - ✅ Comprehensive debug logging

2. **View Tracking:**
   - ✅ Anti-spam với 24h window
   - ✅ Track IP + User Agent
   - ✅ Support anonymous users

3. **Architecture:**
   - ✅ Separation of concerns (Component/Hook/API)
   - ✅ Type-safe với TypeScript
   - ✅ Client + Server components

### ⚠️ Hạn Chế & Cần Cải Thiện

1. **Comments:**
   - ❌ Chưa implement
   - 📝 TODO: Tạo API, component, database schema

2. **View Tracking:**
   - ⚠️ Chưa có auto-track khi mở detail page
   - ⚠️ Stats không real-time update
   - 📝 Cần thêm tracking call ở detail page

3. **Performance:**
   - ⚠️ Mỗi card fetch riêng (N+1 problem)
   - 💡 Có thể optimize: Fetch tất cả stats 1 lần cho listing page

4. **Auth:**
   - ⚠️ Hardcode user fallback (user@edu-theme.com)
   - 📝 Cần implement proper authentication

---

## 6. 🚀 KẾ HOẠCH PHÁT TRIỂN

### Phase 1: Hoàn thiện Comments (HIGH PRIORITY)
```
✅ Create database schema
✅ Build API endpoints
✅ Create components
✅ Integrate with stats display
```

### Phase 2: Optimize Performance
```
✅ Batch fetch stats for listing page
✅ Implement caching strategy
✅ Add loading states
```

### Phase 3: Enhanced Tracking
```
✅ Auto-track views on detail page
✅ Track time spent on exercises
✅ Analytics dashboard
```

### Phase 4: Authentication
```
✅ Implement NextAuth
✅ Remove hardcoded user fallback
✅ User profiles and history
```

---

## 7. 📝 CODE EXAMPLES

### Cách Sử Dụng Trên Listing Page

```tsx
// Card component
<Card>
  <CardHeader>
    <ExerciseCompletionBadge 
      exerciseId="a1/Horen/Test"
      variant="icon"  // Icon ở góc phải
    />
  </CardHeader>
  
  <CardFooter>
    <ExerciseStatsDisplay 
      exerciseId="a1/Horen/Test"  // Views + Comments
    />
  </CardFooter>
</Card>
```

### Cách Track View Manually

```typescript
import { trackExerciseView } from '@/hooks/use-exercise-stats';

// Trong detail page component
useEffect(() => {
  trackExerciseView(exerciseId);
}, [exerciseId]);
```

### Cách Query Stats Từ Database

```sql
-- Tổng views của 1 bài tập
SELECT COUNT(*) FROM exercise_views 
WHERE exerciseId = 'a1/Horen/Test';

-- Unique viewers (24h)
SELECT COUNT(DISTINCT ipAddress) FROM exercise_views 
WHERE exerciseId = 'a1/Horen/Test' 
AND createdAt > NOW() - INTERVAL '24 hours';

-- Top viewed exercises
SELECT exerciseId, COUNT(*) as views
FROM exercise_views
GROUP BY exerciseId
ORDER BY views DESC
LIMIT 10;
```

---

## 8. 🎯 KẾT LUẬN

### Hệ Thống Hiện Tại (As-Is)

- ✅ **Completion Badge**: Hoàn chỉnh và ổn định
- ✅ **View Tracking**: Hoạt động tốt, có anti-spam
- ❌ **Comments**: Chưa có, cần implement

### Điểm Cần Lưu Ý

1. **Completion** dùng 1 record/user/exercise (can toggle on/off)
2. **Views** có thể có nhiều records (mỗi 24h+ là 1 view mới)
3. **Stats** fetch mỗi lần component mount (có thể optimize)
4. **User** hiện tại fallback về test user (cần auth system)

### Next Steps

Xem các TODO sections để biết roadmap phát triển tiếp theo.

---

**Document Created:** October 6, 2025  
**Last Updated:** October 6, 2025  
**Version:** 1.0
