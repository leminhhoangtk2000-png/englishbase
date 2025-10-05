# ⭐ Exercise Rating System - COMPLETE!

## ✅ Đã hoàn thành

Hệ thống đánh giá sao (rating) cho bài tập đã được thêm vào và **lấy dữ liệu thật từ database**.

## 📦 Components được tạo

### 1. ExerciseRating Component

**File:** `/src/components/exercises/ExerciseRating.tsx`

**3 Variants:**

#### a) `inline` - Cho card list

```tsx
<ExerciseRating exerciseId="a1/Horen/..." variant="inline" />
```

Hiển thị: ⭐ 4.5 (2)

#### b) `card` - Cho detail page (compact)

```tsx
<ExerciseRating exerciseId="a1/Horen/..." variant="card" />
```

Features:

- Hiển thị rating trung bình + số lượng đánh giá
- Form đánh giá (nếu chưa rate)
- Hiển thị rating của user (nếu đã rate)
- Nút "Sửa đánh giá"

#### c) `full` - Cho detail page (expanded)

```tsx
<ExerciseRating exerciseId="a1/Horen/..." variant="full" />
```

Features:

- Hiển thị đầy đủ thông tin
- Form đánh giá mở rộng
- Textarea cho lý do đánh giá

## 🎯 Tích hợp

### List Page (exercise-level-page.tsx)

```tsx
<CardFooter>
  <div className="flex items-center gap-4">
    <Clock />
    <span>{exercise.duration}</span>
    <ExerciseRating exerciseId={`${level}/${exercise.slug}`} variant="inline" />
  </div>
  <ExerciseStatsDisplay exerciseId={`${level}/${exercise.slug}`} />
</CardFooter>
```

### Detail Page (exercises/[[...slug]]/page.tsx)

```tsx
<article>
  <ExerciseMDXRenderer source={mdxSource} />
</article>;

{
  /* Rating Section */
}
<div className="mt-6">
  <ExerciseRating exerciseId={exerciseId} variant="card" />
</div>;
```

## 🗄️ Database Schema

**Table:** `exercise_ratings`

| Column     | Type      | Description          |
| ---------- | --------- | -------------------- |
| id         | text      | Primary key          |
| exerciseId | text      | Exercise identifier  |
| userId     | text      | User identifier      |
| rating     | integer   | 1-5 stars            |
| reason     | text      | Optional explanation |
| createdAt  | timestamp | Creation time        |
| updatedAt  | timestamp | Last update          |

**Unique constraint:** `(exerciseId, userId)` - Mỗi user chỉ rate 1 lần/bài

## 📡 API Endpoints

### GET `/api/exercise-ratings`

**Query params:**

- `exerciseId` (required)
- `userId` (optional)

**Response:**

```json
{
  "averageRating": 4.5,
  "totalRatings": 2,
  "ratings": [
    {
      "id": "...",
      "userId": "...",
      "rating": 5,
      "reason": "Bài tập rất hay!",
      "createdAt": "2025-10-05T05:05:00.146Z"
    }
  ],
  "userRating": {
    "rating": 5,
    "reason": "Bài tập rất hay!",
    ...
  }
}
```

### POST `/api/exercise-ratings`

**Body:**

```json
{
  "exerciseId": "a1/Horen/Familie und Freunde Teil 2 - A1",
  "userId": "cmf3wfn7m0002bm5kgb1zg7dk",
  "rating": 5,
  "reason": "Bài tập rất hay và dễ hiểu!"
}
```

**Response:**

```json
{
  "rating": {...},
  "averageRating": 4.5,
  "totalRatings": 2
}
```

## 🧪 Test Data

### Tạo rating test:

```bash
# Rating 5 sao từ user
curl -X POST "http://localhost:9003/api/exercise-ratings" \
  -H "Content-Type: application/json" \
  -d '{
    "exerciseId": "a1/Horen/Familie und Freunde Teil 2 - A1",
    "userId": "cmf3wfn7m0002bm5kgb1zg7dk",
    "rating": 5,
    "reason": "Bài tập rất hay!"
  }'

# Rating 4 sao từ admin
curl -X POST "http://localhost:9003/api/exercise-ratings" \
  -H "Content-Type: application/json" \
  -d '{
    "exerciseId": "a1/Horen/Familie und Freunde Teil 2 - A1",
    "userId": "cmf3wfn7e0000bm5k6ce5ozpn",
    "rating": 4,
    "reason": "Tốt nhưng hơi khó"
  }'
```

### Verify trong database:

```bash
docker exec -it edu-theme-postgres psql -U postgres -d edu_theme_db -c "SELECT \"exerciseId\", \"userId\", rating, reason FROM exercise_ratings ORDER BY \"createdAt\" DESC LIMIT 5;"
```

## 🎨 UI Features

### List Page

- ⭐ 4.5 (2) - Compact inline display
- Shows average rating + total count
- Màu vàng cho icon sao
- Font size nhỏ, phù hợp với card

### Detail Page

**Card variant features:**

1. **Header:**

   - ⭐ 4.5 (lớn, bold)
   - "2 đánh giá" (text nhỏ)
   - Nút "Đánh giá" (nếu chưa rate)

2. **User's Rating (nếu đã rate):**

   - "Đánh giá của bạn:"
   - 5 sao (small, readonly)
   - Lý do: "Bài tập rất hay!"
   - Nút "Sửa đánh giá"

3. **Rating Form (khi click):**
   - StarRating interactive (hover effects)
   - Label real-time: "Xuất sắc", "Tốt", etc.
   - Textarea cho lý do (optional)
   - Nút "Gửi đánh giá" / "Cập nhật"
   - Nút "Hủy"

## 🔄 User Flow

### Chưa đánh giá:

1. Vào detail page
2. Thấy "⭐ 4.5 (2 đánh giá)"
3. Click nút "Đánh giá"
4. Form xuất hiện
5. Click vào sao (1-5)
6. Thấy label "Xuất sắc", "Tốt", v.v.
7. (Optional) Nhập lý do
8. Click "Gửi đánh giá"
9. Form đóng, hiển thị "Đánh giá của bạn"

### Đã đánh giá:

1. Vào detail page
2. Thấy rating của mình
3. Click "Sửa đánh giá"
4. Form mở với rating cũ
5. Sửa rating/lý do
6. Click "Cập nhật đánh giá"
7. Rating được update

### Trên list page:

1. Scroll qua cards
2. Mỗi card hiển thị: ⭐ 4.5 (2)
3. Click vào card → vào detail page
4. Có thể đánh giá ở đó

## 🚨 Temporary Auth Bypass

**Giống như completion system**, rating cũng dùng fallback user:

```typescript
// 🔧 TEMPORARY: Use test user
const userId = "cmf3wfn7m0002bm5kgb1zg7dk"; // user@edu-theme.com
```

**Trước production:**

- Thêm proper authentication
- Get userId từ session
- Remove hardcoded userId

## ✅ Testing Checklist

- [x] API GET - Fetch ratings (works)
- [x] API POST - Create rating (works)
- [x] API POST - Update rating (upsert works)
- [x] Database storage (verified)
- [x] Average calculation (correct: 4.5 from 5+4)
- [x] Component renders on list page
- [x] Component renders on detail page
- [x] Star interaction (clickable, hover effects)
- [x] Form submission (with reason)
- [x] Display user's rating
- [x] Edit rating functionality

## 📊 Data Examples

### Current Ratings in DB:

```
exerciseId                                | userId        | rating | reason
-----------------------------------------|---------------|--------|---------------------------
a1/Horen/Familie und Freunde Teil 2 - A1 | user@...      |      5 | Bài tập rất hay và dễ hiểu!
a1/Horen/Familie und Freunde Teil 2 - A1 | admin@...     |      4 | Tốt nhưng hơi khó
```

**Average:** 4.5
**Total:** 2 ratings

## 🎯 Next Steps

1. ✅ **DONE:** Basic rating system
2. ✅ **DONE:** Database integration
3. ✅ **DONE:** List page display
4. ✅ **DONE:** Detail page form
5. 🔜 **TODO:** Add authentication (remove temporary bypass)
6. 🔜 **TODO:** Add rating distribution chart (5⭐: 50%, 4⭐: 50%, etc.)
7. 🔜 **TODO:** Add pagination for ratings list
8. 🔜 **TODO:** Add moderation (flag inappropriate reasons)

## 🎉 Kết quả

**BÂY GIỜ HỆ THỐNG CÓ:**

1. ✅ Completion tracking (icon ⭕ → ✅)
2. ✅ Timer + auto-complete (45s)
3. ✅ Rating system (⭐ 1-5 sao)
4. ✅ Database thật (không phải mockdata)
5. ✅ User ratings + average calculation
6. ✅ Edit rating capability
7. ✅ Reason/feedback optional

**Test ngay:**

1. Vào http://localhost:9003/exercises/a1
2. Xem rating trên cards: ⭐ 4.5 (2)
3. Click vào "Familie und Freunde Teil 2"
4. Scroll xuống thấy rating card
5. Click "Đánh giá" hoặc "Sửa đánh giá"
6. Chọn số sao, nhập lý do
7. Submit → Thấy rating update!

🚀 **HOÀN HẢO!**
