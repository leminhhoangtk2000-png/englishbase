# 📖 Hướng Dẫn Sử Dụng Tính Năng Đánh Giá & Hoàn Thành

## ⭐ Rating System (Đánh Giá Bài Tập)

### Cách Hoạt Động

1. **Đánh Giá Bài Tập**
   - Mỗi user chỉ có thể đánh giá **1 lần** cho mỗi bài tập
   - Rating từ **1 đến 5 sao**
   - Nếu đánh giá lại, rating cũ sẽ được **cập nhật**
   
2. **Hiển Thị Trên Card**
   - Hiển thị **trung bình** tất cả ratings
   - Hiển thị **số lượng** người đã đánh giá
   - Format: `⭐ 4.7 (3)` = 4.7 sao từ 3 người
   
3. **Tính Trung Bình**
   - Ví dụ: Có 3 ratings: 5⭐, 4⭐, 5⭐
   - Trung bình: (5 + 4 + 5) / 3 = **4.7 sao**

### Ví Dụ Data Thực Tế

```typescript
// Database: exercise_ratings table
{
  exerciseId: "Horen/Einkaufen teil 1 - A1",
  ratings: [
    { userId: "user1", rating: 5 }, // Admin: 5 sao
    { userId: "user2", rating: 4 }, // Premium: 4 sao
    { userId: "user3", rating: 5 }  // Regular: 5 sao
  ]
}

// Hiển thị trên UI
⭐ 4.7 (3)  // (5+4+5)/3 = 4.7 từ 3 người
```

### API Endpoint

**GET** `/api/exercise-stats?exerciseId={slug}`

```json
{
  "success": true,
  "stats": {
    "views": 0,
    "comments": 0,
    "rating": 4.666666666666667,  // Trung bình
    "totalRatings": 3               // Tổng số đánh giá
  }
}
```

### Component Usage

```tsx
import { ExerciseStatsDisplay } from '@/components/exercises/ExerciseStatsDisplay';

<ExerciseStatsDisplay 
  exerciseId="Horen/Einkaufen teil 1 - A1" 
/>

// Hiển thị: 👁️ 0  💬 0  ⭐ 4.7 (3)
```

---

## ✅ Completion System (Đánh Dấu Hoàn Thành)

### Cách Hoạt Động

1. **Thủ Công 100%**
   - Người dùng **tự click** icon để đánh dấu
   - **Không tự động** khi scroll hay đọc lâu
   - Đơn giản, rõ ràng

2. **Toggle On/Off**
   - Click 1 lần: ✅ Đánh dấu hoàn thành
   - Click lại: ⭕ Bỏ đánh dấu
   - Lưu vào database ngay lập tức

3. **Tracking Info**
   - Thời gian hoàn thành
   - Số lần làm lại (attempts)
   - Điểm số (nếu có)

### UI Components

#### 1. Icon trên Card (Minimal)

```tsx
<ExerciseCompletionBadge 
  exerciseId="exercise-slug"
  variant="icon"
/>
```

**Hiển thị:**
- ⭕ Chưa hoàn thành (xám, rỗng)
- ✅ Đã hoàn thành (xanh, đầy)
- Tooltip hiển thị thông tin chi tiết

#### 2. Button trên Exercise Page

```tsx
<ExerciseCompletionBadge 
  exerciseId="exercise-slug"
  variant="button"
/>
```

**Hiển thị:**
- Button: "Đánh dấu hoàn thành"
- Sau khi click: "Đã hoàn thành" (xanh)

#### 3. Badge Full Info

```tsx
<ExerciseCompletionBadge 
  exerciseId="exercise-slug"
  variant="badge"
/>
```

**Hiển thị:**
- Badge: "Hoàn thành" / "Chưa hoàn thành"
- Với icon và màu sắc rõ ràng

### Database Schema

```prisma
model exercise_completions {
  id          String   @id @default(cuid())
  userId      String
  exerciseId  String
  completedAt DateTime @default(now())
  
  timeSpent   Int?     // seconds
  score       Int?     // 0-100
  attempts    Int      @default(1)
  
  @@unique([userId, exerciseId])
}
```

### API Endpoints

#### Check Status
```bash
GET /api/exercise-completion?exerciseId=exercise-slug

Response:
{
  "completed": true,
  "completedAt": "2025-10-05T10:30:00Z",
  "attempts": 2
}
```

#### Mark Completed
```bash
POST /api/exercise-completion
{
  "exerciseId": "exercise-slug"
}
```

#### Unmark
```bash
DELETE /api/exercise-completion?exerciseId=exercise-slug
```

---

## 🎯 Testing

### Tạo Test Data

#### 1. Tạo Ratings Từ Nhiều Users

```bash
npx tsx scripts/create-multiple-ratings.ts
```

Tạo 3 ratings/bài từ 3 users khác nhau.

#### 2. Test Completion

1. Vào trang exercise list
2. Click icon ⭕ trên card
3. Icon chuyển thành ✅ xanh
4. Refresh → vẫn giữ trạng thái

### Kiểm Tra Database

```bash
# Check ratings
npx tsx -e "
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const ratings = await prisma.exercise_ratings.findMany();
console.log(ratings);
"

# Check completions
npx tsx -e "
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const completions = await prisma.exercise_completions.findMany();
console.log(completions);
"
```

---

## 📊 Hiển Thị Thực Tế

### Trước Khi Fix

```
❌ Rating hiển thị sai
   - Chỉ show rating từ 1 user
   - Không show số lượng đánh giá
   - Format: ⭐ 5.0

❌ Completion tự động
   - Timer đếm 60s
   - Track scroll position
   - Auto-suggest → confusing
```

### Sau Khi Fix

```
✅ Rating hiển thị đúng
   - Show trung bình từ tất cả users
   - Show số lượng: ⭐ 4.7 (3)
   - Font weight khác nhau cho dễ đọc

✅ Completion manual
   - Click để toggle
   - Không có timer
   - Đơn giản, rõ ràng
```

---

## 🔧 Troubleshooting

### Rating không hiển thị

1. **Check exerciseId format:**
   ```bash
   # Phải match với API
   Đúng:  "Horen/Einkaufen teil 1 - A1"
   Sai:   "lektion-4-einkaufen-teil-1-a1"
   ```

2. **Check database:**
   ```bash
   npx tsx scripts/cleanup-ratings.ts
   ```

3. **Tạo lại test data:**
   ```bash
   npx tsx scripts/create-multiple-ratings.ts
   ```

### Completion không save

1. **Check authentication:**
   - User phải đăng nhập
   - Check `getCurrentUser()`

2. **Check API:**
   ```bash
   curl -X POST http://localhost:9003/api/exercise-completion \
     -H "Content-Type: application/json" \
     -d '{"exerciseId": "test"}'
   ```

3. **Check database schema:**
   ```bash
   npx prisma db push
   ```

---

## 📝 Notes

### Rating System
- ✅ Mỗi user 1 rating/bài
- ✅ Tự động tính trung bình
- ✅ Update được rating cũ
- ✅ Hiển thị số lượng đánh giá

### Completion System
- ✅ 100% manual (click to toggle)
- ✅ Lưu vào database instant
- ✅ Persistent across sessions
- ✅ Track attempts & time

### Performance
- ⚡ Cache exercise stats
- ⚡ Lazy load completion state
- ⚡ Optimistic UI updates
- ⚡ Debounce API calls

---

*Last Updated: October 5, 2025*
