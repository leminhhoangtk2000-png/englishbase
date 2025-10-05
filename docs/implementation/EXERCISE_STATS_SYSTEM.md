# Hệ thống Thống kê Bài tập - Real-time Analytics

## 📊 Tổng quan

Hệ thống theo dõi và hiển thị thống kê thực tế cho các bài tập bao gồm:

- **Lượt xem (Views)**: Số lần bài tập được xem
- **Bình luận (Comments)**: Số lượng bình luận (bao gồm replies)
- **Đánh giá (Ratings)**: Điểm đánh giá trung bình và tổng số đánh giá

## 🗄️ Database Schema

### 1. Bảng `exercise_views`

```prisma
model exercise_views {
  id         String   @id @default(cuid())
  exerciseId String
  userId     String?
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime @default(now())

  @@index([exerciseId])
  @@index([exerciseId, createdAt])
  @@map("exercise_views")
}
```

**Chức năng**:

- Track mỗi lần xem bài tập
- Lưu userId (nếu đăng nhập) hoặc IP address
- Chống spam: Không đếm duplicate views trong 24 giờ từ cùng user/IP

### 2. Bảng `exercise_ratings`

```prisma
model exercise_ratings {
  id         String   @id @default(cuid())
  exerciseId String
  userId     String
  rating     Int
  reason     String?
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([exerciseId, userId])
  @@index([exerciseId])
  @@map("exercise_ratings")
}
```

**Chức năng**:

- Mỗi user chỉ đánh giá 1 lần cho mỗi bài tập
- Rating từ 1-5 sao
- Có thể cập nhật đánh giá
- Ghi lại lý do đánh giá (optional)

## 🔌 API Endpoints

### 1. GET `/api/exercise-stats?exerciseId={id}`

Lấy tất cả thống kê của một bài tập.

**Response**:

```json
{
  "success": true,
  "stats": {
    "views": 1234,
    "comments": 45,
    "rating": 4.6,
    "totalRatings": 67
  }
}
```

### 2. POST `/api/exercise-views`

Ghi nhận một lượt xem.

**Request Body**:

```json
{
  "exerciseId": "eine-wohnung-in-leipzig-finden",
  "userId": "user123" // optional
}
```

**Anti-spam**: Không đếm duplicate views trong 24 giờ từ cùng user/IP.

### 3. GET `/api/exercise-ratings?exerciseId={id}&userId={uid}`

Lấy thông tin đánh giá.

**Response**:

```json
{
  "averageRating": 4.6,
  "totalRatings": 67,
  "ratings": [...],
  "userRating": {
    "rating": 5,
    "reason": "Bài tập rất hay!"
  }
}
```

### 4. POST `/api/exercise-ratings`

Tạo hoặc cập nhật đánh giá.

**Request Body**:

```json
{
  "exerciseId": "eine-wohnung-in-leipzig-finden",
  "userId": "user123",
  "rating": 5,
  "reason": "Bài tập rất hay!" // optional
}
```

## 🎣 React Hooks

### `useExerciseStats(exerciseId)`

Hook để fetch và theo dõi thống kê bài tập.

```typescript
import { useExerciseStats } from "@/hooks/use-exercise-stats";

function MyComponent({ exerciseId }) {
  const { stats, loading, error } = useExerciseStats(exerciseId);

  return (
    <div>
      <p>Views: {stats.views}</p>
      <p>Comments: {stats.comments}</p>
      <p>Rating: {stats.rating.toFixed(1)} ⭐</p>
    </div>
  );
}
```

### `trackExerciseView(exerciseId, userId?)`

Hàm để ghi nhận lượt xem (gọi khi user mở bài tập).

```typescript
import { trackExerciseView } from "@/hooks/use-exercise-stats";

useEffect(() => {
  trackExerciseView(exerciseId, userId);
}, [exerciseId]);
```

## 🧩 React Components

### 1. `<ExerciseStatsDisplay />`

Hiển thị thống kê đầy đủ với loading state.

```tsx
import { ExerciseStatsDisplay } from "@/components/exercises/ExerciseStatsDisplay";

<ExerciseStatsDisplay exerciseId="eine-wohnung-in-leipzig-finden" />;
```

**Hiển thị**:

```
👁️ 1.2k  💬 45  ⭐ 4.6
```

### 2. `<ExerciseViewTracker />`

Component ẩn để tự động track views.

```tsx
import { ExerciseViewTracker } from "@/components/exercises/ExerciseViewTracker";

export default function ExercisePage({ params }) {
  return (
    <>
      <ExerciseViewTracker exerciseId={params.slug} userId={currentUserId} />
      {/* Nội dung bài tập */}
    </>
  );
}
```

## 📋 Cách sử dụng

### Bước 1: Cập nhật Database

```bash
# Khởi động Docker (PostgreSQL)
npm run docker:up

# Chạy migration
npm run db:push

# Kiểm tra database
npm run db:studio
```

### Bước 2: Thêm tracking vào trang bài tập

```tsx
// src/app/a1niveau/[[...slug]]/page.tsx
import { ExerciseViewTracker } from "@/components/exercises/ExerciseViewTracker";

export default function ExercisePage({ params }) {
  const exerciseId = params.slug?.join("/") || "";

  return (
    <>
      <ExerciseViewTracker exerciseId={exerciseId} />
      {/* Nội dung bài tập */}
    </>
  );
}
```

### Bước 3: Hiển thị stats ở danh sách

```tsx
// src/app/exercises/_components/exercise-level-page.tsx
import { ExerciseStatsDisplay } from "@/components/exercises/ExerciseStatsDisplay";

<ExerciseStatsDisplay exerciseId={exercise.slug} />;
```

## 🔄 Cập nhật ExerciseComments

Hệ thống bình luận đã tích hợp sẵn với database, nhưng đảm bảo:

```tsx
// Component đã có sẵn
import { ExerciseComments } from "@/components/exercises/ExerciseComments";

<ExerciseComments exerciseId="eine-wohnung-in-leipzig-finden" />;
```

Comments được tự động đếm qua API `/api/exercise-stats`.

## 📊 Kiểm tra thống kê

### Qua API

```bash
# Lấy stats của một bài tập
curl http://localhost:9003/api/exercise-stats?exerciseId=eine-wohnung-in-leipzig-finden

# Track một lượt xem
curl -X POST http://localhost:9003/api/exercise-views \
  -H "Content-Type: application/json" \
  -d '{"exerciseId":"eine-wohnung-in-leipzig-finden"}'
```

### Qua Prisma Studio

```bash
npm run db:studio
```

Mở: http://localhost:5555

- Xem bảng `exercise_views`
- Xem bảng `exercise_ratings`
- Xem bảng `exercise_comments`

## 🎯 Lưu ý quan trọng

### 1. Exercise ID phải nhất quán

- Sử dụng `slug` của bài tập làm `exerciseId`
- Ví dụ: `eine-wohnung-in-leipzig-finden`

### 2. User ID

- Nếu có hệ thống auth: truyền `userId`
- Nếu chưa: để `null`, system sẽ dùng IP address

### 3. Performance

- Stats được cache ở client side
- Loading states để tránh flash
- Graceful degradation nếu API lỗi

### 4. Anti-spam

- Views: 1 lần / 24 giờ / user hoặc IP
- Ratings: Mỗi user chỉ rate 1 lần (có thể update)

## 🚀 Next Steps

### Tính năng bổ sung có thể thêm:

1. **Analytics Dashboard** - Xem thống kê tổng quan
2. **Trending Exercises** - Bài tập hot nhất tuần
3. **User History** - Lịch sử xem của user
4. **Time-based Analytics** - Views theo thời gian
5. **Export Stats** - Export ra CSV/Excel

### Tối ưu hiệu năng:

1. Cache stats với Redis
2. Aggregate views hàng giờ/ngày
3. Index optimization cho queries lớn
4. CDN caching cho stats ít thay đổi

## 📝 Migration từ Mock Data

Hệ thống cũ dùng mock data trong `mockExercises`. Bây giờ:

### ❌ Trước (Mock):

```tsx
views: 1200,
comments: 15,
rating: 4.8,
```

### ✅ Sau (Real):

```tsx
<ExerciseStatsDisplay exerciseId={exercise.slug} />
```

Tất cả số liệu giờ đây là **THẬT** từ database! 🎉

---

**Tác giả**: AI Assistant  
**Ngày tạo**: 5/10/2025  
**Version**: 1.0.0
