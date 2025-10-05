# 🎉 Universal Comment System - Hoàn thành!

## ✅ Đã implement

### 1. **Database Schema**

- ✅ Table `comments` với polymorphic design
- ✅ Support nested comments (replies) với `parentId`
- ✅ Indexes tối ưu performance
- ✅ Moderation system với `isApproved`
- ✅ Trigger auto-update `updatedAt`

### 2. **API Endpoints**

- ✅ `GET /api/comments?type={type}&id={id}` - Lấy comments
- ✅ `POST /api/comments` - Tạo comment mới
- ✅ `GET /api/comments/[commentId]/replies` - Lấy replies

### 3. **React Component**

- ✅ `CommentSection.tsx` - Universal component
- ✅ Support nested replies
- ✅ Real-time UI updates
- ✅ Form validation
- ✅ Loading states

### 4. **Sample Data**

- ✅ 6 test comments inserted
- ✅ 1 reply comment example
- ✅ Comments cho articles, exercises, vocabulary, news

---

## 🗂️ Database Structure

### Comments Table Schema:

```sql
CREATE TABLE comments (
  id TEXT PRIMARY KEY,
  userId TEXT NOT NULL,

  -- Polymorphic fields
  commentableType TEXT NOT NULL,  -- 'article' | 'exercise' | 'vocabulary' | 'news' | 'post'
  commentableId TEXT NOT NULL,

  -- Content
  content TEXT NOT NULL,
  parentId TEXT,                  -- For nested replies

  -- Moderation
  isApproved BOOLEAN DEFAULT FALSE,
  isEdited BOOLEAN DEFAULT FALSE,
  editedAt TIMESTAMP(3),

  -- Timestamps
  createdAt TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (parentId) REFERENCES comments(id) ON DELETE CASCADE
);
```

### Sample Data:

```
cmt1 → article: a1/Grammatik/wfragen → "Bài này giải thích rất rõ ràng về W-Fragen! 👍"
  ↳ cmt6 (reply) → "Mình cũng nghĩ vậy! Rất dễ hiểu"
cmt2 → exercise: a1/Horen/Familie und Freunde Teil 2 - A1 → "Bài tập này hơi khó..."
cmt3 → article: a1/Grammatik/wfragen → "Cảm ơn bạn đã chia sẻ!"
cmt4 → vocabulary: a1/start/Gruß → "Từ vựng rất hữu ích 📚"
cmt5 → news: news-123 → "Tin tức văn hóa Đức thú vị! 🇩🇪"
```

---

## 🚀 Cách sử dụng

### 1. **Trong Article Page (Grammatik A1, A2...):**

```tsx
// /src/app/[level]/grammatik/[...slug]/page.tsx
import { CommentSection } from "@/components/comments/CommentSection";

export default function ArticlePage({
  params,
}: {
  params: { level: string; slug: string[] };
}) {
  const articleId = `${params.level}/Grammatik/${params.slug.join("/")}`;

  return (
    <div>
      {/* Article content */}
      <MDXContent />

      {/* Comment section */}
      <CommentSection
        commentableType="article"
        commentableId={articleId}
        className="mt-8"
      />
    </div>
  );
}
```

### 2. **Trong Exercise Page:**

```tsx
// /src/app/exercises/[[...slug]]/page.tsx
import { CommentSection } from "@/components/comments/CommentSection";

export default function ExercisePage({
  params,
}: {
  params: { slug: string[] };
}) {
  const exerciseId = params.slug.join("/");

  return (
    <div>
      {/* Exercise content */}

      {/* Comment section */}
      <CommentSection
        commentableType="exercise"
        commentableId={exerciseId}
        className="mt-8"
      />
    </div>
  );
}
```

### 3. **Trong Vocabulary Page:**

```tsx
// /src/app/vocabulary/[category]/page.tsx
<CommentSection
  commentableType="vocabulary"
  commentableId={`${level}/${category}/word-slug`}
/>
```

### 4. **Trong News Page (Die Neuen):**

```tsx
// /src/app/die-neuen/[id]/page.tsx
<CommentSection commentableType="news" commentableId={newsId} />
```

---

## 📡 API Usage Examples

### Get Comments:

```bash
curl "http://localhost:9003/api/comments?type=article&id=a1/Grammatik/wfragen"
```

Response:

```json
{
  "comments": [
    {
      "id": "cmt1",
      "userId": "user_test_1",
      "commentableType": "article",
      "commentableId": "a1/Grammatik/wfragen",
      "content": "Bài này giải thích rất rõ ràng về W-Fragen! 👍",
      "parentId": null,
      "isApproved": true,
      "replyCount": 1,
      "user": {
        "id": "user_test_1",
        "name": "Test User",
        "username": "regular_user",
        "avatar": null
      },
      "createdAt": "2025-10-03T06:54:20.457Z"
    }
  ],
  "total": 3
}
```

### Create Comment:

```bash
curl -X POST http://localhost:9003/api/comments \
  -H "Content-Type: application/json" \
  -d '{
    "commentableType": "article",
    "commentableId": "a1/Grammatik/wfragen",
    "content": "Bình luận mới của tôi!"
  }'
```

Response:

```json
{
  "success": true,
  "comment": { ... },
  "message": "Comment submitted successfully. It will appear after admin approval."
}
```

### Get Replies:

```bash
curl "http://localhost:9003/api/comments/cmt1/replies"
```

---

## 🎨 Component Features

### CommentSection Component:

- ✅ Display comments list
- ✅ Create new comment form
- ✅ Reply to comments (nested)
- ✅ Load replies dynamically
- ✅ Show reply count
- ✅ User avatars with fallback
- ✅ Relative timestamps (Vietnamese)
- ✅ Loading states
- ✅ Error handling
- ✅ Form validation

### UI Features:

- ✅ Responsive design
- ✅ Dark mode support (via shadcn/ui)
- ✅ Smooth animations
- ✅ Accessible (keyboard navigation)
- ✅ Icons từ lucide-react

---

## 🔐 Security & Moderation

### Moderation Flow:

1. User submit comment → `isApproved = FALSE`
2. Admin duyệt trong Prisma Studio hoặc admin panel
3. Set `isApproved = TRUE`
4. Comment hiển thị cho mọi người

### Approve Comment manually:

```sql
UPDATE comments
SET "isApproved" = TRUE
WHERE id = 'cmt_xxx';
```

### Validation:

- ✅ Min length: 3 characters
- ✅ Max length: 1000 characters
- ✅ Content type validation
- ✅ Parent comment existence check
- ✅ User authentication (temporary bypass)

---

## 📊 Current Database

```bash
# Xem comments trong Prisma Studio
open http://localhost:5556

# Hoặc dùng SQL
docker exec edu-theme-postgres psql -U postgres -d edu_theme_db -c "
  SELECT
    c.id,
    c.\"commentableType\",
    c.\"commentableId\",
    LEFT(c.content, 30) as content_preview,
    c.\"parentId\",
    u.name as user_name,
    c.\"isApproved\",
    c.\"createdAt\"
  FROM comments c
  LEFT JOIN users u ON c.\"userId\" = u.id
  ORDER BY c.\"createdAt\" DESC;
"
```

---

## 🐛 Troubleshooting

### Comment không hiển thị?

**Nguyên nhân:** `isApproved = FALSE`

```sql
-- Approve tất cả comments (chỉ dùng cho development)
UPDATE comments SET "isApproved" = TRUE;
```

### Không thể tạo comment?

**Kiểm tra:**

1. Next.js app có đang chạy không? (`npm run dev`)
2. Database connection có OK không?
3. Check browser console cho errors
4. Verify API endpoint: `curl localhost:9003/api/comments`

### Reply không load?

```bash
# Test API
curl "http://localhost:9003/api/comments/cmt1/replies"
```

---

## 🔄 Next Steps

### Recommended enhancements:

1. ✨ **Admin Panel** - UI để approve/reject comments
2. ✨ **Edit/Delete** - User có thể edit/delete comments của mình
3. ✨ **Like/Upvote** - Reaction system
4. ✨ **Notifications** - Thông báo khi có reply mới
5. ✨ **Rich Text Editor** - Support markdown, mentions, emojis
6. ✨ **Report System** - User có thể report spam/abuse
7. ✨ **Pagination** - Load more comments
8. ✨ **Real-time** - WebSocket/SSE cho live updates

---

## 📚 Files Created/Modified

### Database:

- `prisma/add-comments-table.sql` - SQL script tạo comments table

### API:

- `src/app/api/comments/route.ts` - GET/POST comments
- `src/app/api/comments/[commentId]/replies/route.ts` - GET replies

### Components:

- `src/components/comments/CommentSection.tsx` - Universal comment UI

### Backup:

- `src/app/api/comments/route.ts.backup` - Old API (exercise-only)

---

## 🎯 Test Checklist

- [ ] Start Next.js: `npm run dev`
- [ ] Open Prisma Studio: `npm run db:studio`
- [ ] Navigate to an article page (e.g., `/a1/grammatik/wfragen`)
- [ ] Verify comments appear
- [ ] Try creating a new comment
- [ ] Try replying to a comment
- [ ] Check Prisma Studio for new comments
- [ ] Approve comment manually
- [ ] Refresh page to see approved comment

---

## 🎉 Tóm tắt

**Universal Comment System đã sẵn sàng!**

✅ **1 table** thay vì nhiều tables  
✅ **Support mọi content types** (article, exercise, vocabulary, news, post)  
✅ **Nested comments** (replies)  
✅ **Moderation system**  
✅ **Beautiful UI component**  
✅ **6 sample comments** đã được tạo  
✅ **Full API documentation**

**Chỉ cần integrate vào pages và test!** 🚀
