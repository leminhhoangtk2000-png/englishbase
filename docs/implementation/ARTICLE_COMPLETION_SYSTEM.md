# ✨ Article Reading Completion System

## 📋 Overview

Hệ thống tracking completion cho bài viết trong section "die-neuen", cho phép người dùng đánh dấu bài viết đã đọc xong.

## 🎯 Features

### 1. **Article Completion Tracking**

Theo dõi bài viết nào người dùng đã đọc xong với thông tin chi tiết.

#### Key Features:

- ✅ Đánh dấu bài viết đã hoàn thành/chưa hoàn thành
- ✅ Theo dõi thời gian đọc
- ✅ Theo dõi số lần đọc lại (attempts)
- ✅ Lưu thời điểm hoàn thành
- ✅ Persistent theo user
- ✅ Smart completion prompt khi đọc xong

#### Smart Completion Logic:

```
Hiển thị prompt khi:
1. User đã ở trên page ≥ 30 giây
2. User đã scroll xuống ≥ 90% bài viết
3. Bài viết chưa được đánh dấu hoàn thành

Manual completion:
- User có thể toggle bất cứ lúc nào
- Click icon ⭕ trên card
- Click floating button trên article page
```

---

## 📁 Files Created

### Components

#### 1. `ArticleCompletionBadge.tsx`

**Location:** `src/components/articles/`

UI component linh hoạt với 3 variants:

**Badge Variant** (for cards):

```tsx
<ArticleCompletionBadge articleId="article-id" variant="badge" />
```

- Pill-shaped badge
- Xanh khi completed
- Hiển thị "Hoàn thành" hoặc "Chưa hoàn thành"
- Clickable để toggle

**Button Variant** (for pages):

```tsx
<ArticleCompletionBadge articleId="article-id" variant="button" />
```

- Full button với text
- Icon + label
- Loading state
- Hover effects

**Icon Variant** (minimal):

```tsx
<ArticleCompletionBadge articleId="article-id" variant="icon" />
```

- Chỉ có checkmark icon
- Tooltip khi hover
- Kích thước nhỏ nhất
- **Được dùng trên article cards**

---

#### 2. `ArticlePageCompletion.tsx`

**Location:** `src/components/articles/`

Smart tracking component cho article pages:

```tsx
<ArticlePageCompletion
  articleId="article-id"
  minTimeForCompletion={30} // seconds
/>
```

**Features:**

- ⏱️ **Time Tracker** - Hiển thị thời gian đọc (MM:SS)
- 📜 **Scroll Detection** - Phát hiện khi user scroll tới 90%
- 💡 **Smart Prompt** - Animated suggestion sau khi đọc xong
- 🎯 **Floating UI** - Góc dưới phải, không gây khó chịu

**UI States:**

1. **Initial:** Chỉ hiển thị time tracker
2. **After reading:** Prompt xanh bouncing xuất hiện
3. **Completed:** Hiển thị completion badge

---

### Hooks

#### `use-article-completion.ts`

**Location:** `src/hooks/`

React hook để quản lý completion state:

```typescript
const {
  completion, // ArticleCompletionData object
  loading, // boolean
  marking, // boolean (saving state)
  markCompleted, // (timeSpent?) => Promise<boolean>
  unmarkCompleted, // () => Promise<boolean>
} = useArticleCompletion(articleId);
```

**ArticleCompletionData:**

```typescript
{
  completed: boolean;
  completedAt?: string;
  timeSpent?: number;    // seconds
  attempts?: number;     // số lần đọc
}
```

---

### API Routes

#### `api/article-completion/route.ts`

**Location:** `src/app/api/article-completion/`

RESTful endpoints cho completion tracking:

**GET** - Lấy completion status:

```bash
GET /api/article-completion?articleId=article-id

Response:
{
  "completed": true,
  "completedAt": "2025-10-05T10:30:00Z",
  "timeSpent": 180,
  "attempts": 1
}
```

**POST** - Đánh dấu completed:

```bash
POST /api/article-completion
{
  "articleId": "article-id",
  "timeSpent": 180
}
```

**DELETE** - Bỏ đánh dấu:

```bash
DELETE /api/article-completion?articleId=article-id
```

---

### Database

#### Prisma Model

```prisma
model ArticleCompletion {
  id          String   @id @default(cuid())
  userId      String
  articleId   String
  completedAt DateTime @default(now())
  timeSpent   Int?     // seconds
  attempts    Int      @default(1)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([userId, articleId])
  @@index([userId])
  @@index([articleId])
  @@map("article_completions")
}
```

**Migration:**

```bash
npx prisma db push
```

---

## 🎨 UI/UX Design

### Article Cards

**Before:**

```
[Image]
Title
Excerpt
Stats: 📅 Date  👁️ Words  ❤️ Likes
```

**After:**

```
[Image]
Category Badge                [⭕ Icon]
Title
Excerpt
Stats: 📅 Date  👁️ Words  ❤️ Likes
```

**Changes:**

1. ✅ Completion icon (top-right corner của category badge)
2. ⭕ Empty circle = chưa đọc
3. ✅ Green checkmark = đã đọc xong

### Article Pages

**New Features:**

1. **Floating Timer** (bottom-right)
   - Hiển thị thời gian đọc
   - Luôn visible khi đọc
2. **Completion Prompt** (sau khi scroll + time)
   - Animated green card
   - "Đã đọc xong bài viết?"
   - Quick action button
3. **Completion Button**
   - Toggle completion status
   - Hiển thị trạng thái hiện tại
   - Loading feedback

---

## 📊 User Flow

### Lần Đầu Đọc Article

1. **User click article card**
   - Card hiển thị empty circle (chưa đọc)
2. **User vào article page**
   - Timer bắt đầu tự động
   - Floating time tracker xuất hiện
3. **User đọc article** (scroll xuống)
   - Timer tiếp tục đếm
   - Scroll position được track
4. **Sau 30s + scroll tới 90%**
   - Green prompt bounces vào
   - "Đã đọc xong bài viết?"
   - User click "Đánh dấu hoàn thành"
5. **Article được đánh dấu completed**
   - Checkmark chuyển xanh
   - Lưu vào database
   - Card hiển thị completion khi quay lại

### Quay Lại Article Đã Đọc

1. **User thấy checkmark xanh** trên card
2. **Có thể click để bỏ đánh dấu** nếu cần
3. **Completion persistent** qua các sessions

---

## 📈 Usage Examples

### On Article Card

```tsx
import ArticleCard from "@/components/die-neuen/article-card";

<ArticleCard article={article} />;
// Icon tự động hiển thị trong card
```

### On Article Page

```tsx
import { ArticlePageCompletion } from "@/components/articles/ArticlePageCompletion";

export default function ArticlePage() {
  return (
    <>
      <article>{/* Article content */}</article>

      {/* Add completion tracking */}
      <ArticlePageCompletion articleId={articleId} minTimeForCompletion={30} />
    </>
  );
}
```

### Custom Integration

```tsx
import { useArticleCompletion } from "@/hooks/use-article-completion";

function CustomComponent() {
  const { completion, markCompleted } = useArticleCompletion("article-id");

  const handleFinish = async () => {
    const timeSpent = 180; // 3 minutes
    await markCompleted(timeSpent);
  };

  return (
    <div>
      {completion.completed ? (
        <p>✅ Đã đọc {completion.attempts} lần</p>
      ) : (
        <button onClick={handleFinish}>Hoàn thành</button>
      )}
    </div>
  );
}
```

---

## ⚙️ Configuration

### Completion Timing

Thay đổi thời gian tối thiểu:

```tsx
<ArticlePageCompletion
  articleId={articleId}
  minTimeForCompletion={60} // 1 phút thay vì 30 giây
/>
```

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] **Card Display:**
  - [ ] Icon ⭕ xuất hiện
  - [ ] Click chuyển thành ✅
  - [ ] Tooltip hiển thị đúng thông tin
- [ ] **Completion Toggle:**
  - [ ] Click icon đánh dấu completed
  - [ ] Green checkmark xuất hiện
  - [ ] Click lại bỏ đánh dấu
- [ ] **Article Page:**
  - [ ] Timer bắt đầu khi vào page
  - [ ] Time hiển thị đúng
  - [ ] Scroll detection hoạt động
  - [ ] Prompt xuất hiện sau scroll
  - [ ] Completion button hoạt động
- [ ] **Persistence:**
  - [ ] Refresh page giữ completion
  - [ ] Navigate away và quay lại
  - [ ] Check database record

### API Testing

```bash
# Check status
curl http://localhost:9003/api/article-completion?articleId=1

# Mark completed
curl -X POST http://localhost:9003/api/article-completion \
  -H "Content-Type: application/json" \
  -d '{"articleId":"1","timeSpent":180}'

# Unmark
curl -X DELETE "http://localhost:9003/api/article-completion?articleId=1"
```

---

## 🎯 Benefits

### For Users

1. **Track Progress**
   - Biết bài nào đã đọc
   - Biết bài nào còn lại
   - Visual feedback rõ ràng
2. **Smart Suggestions**
   - Prompted sau khi đọc xong
   - Không annoying hay quá sớm
   - Có thể bỏ qua nếu không cần
3. **Flexibility**
   - Toggle thủ công bất cứ lúc nào
   - Unmark nếu cần
   - Track số lần đọc lại

### For Developers

1. **Reusable Components**
   - 3 variants cho different use cases
   - Dễ integrate
   - Consistent API
2. **Analytics Ready**
   - Track thời gian đọc
   - Monitor completion rates
   - Identify popular articles
3. **Extensible**
   - Thêm reading scores
   - Thêm reading notes
   - Thêm reading achievements

---

## 🔧 Troubleshooting

### Icon không hiển thị

- Check ArticleCompletionBadge được import
- Verify articleId được pass đúng
- Check database connection

### Completion không save

- Check API routes hoạt động
- Verify test user tồn tại
- Check Prisma client generated

### Timer không đếm

- Check component mounted
- Verify useEffect dependencies
- Check browser console for errors

---

## 📚 Related Documentation

- `EXERCISE_COMPLETION_SYSTEM.md` - Similar system cho exercises
- `DATABASE.md` - Database setup guide
- `TEST-ACCOUNTS.md` - Test users info

---

## 🚀 Future Enhancements

### Planned Features

1. **Reading Statistics**
   - Total articles read
   - Average reading time
   - Reading streak tracking
2. **Reading Goals**
   - Set daily/weekly targets
   - Progress visualization
   - Achievement badges
3. **Reading History**
   - View all read articles
   - Export reading list
   - Reading analytics dashboard
4. **Social Features**
   - Share read articles
   - Reading recommendations
   - Community reading challenges

---

**Last Updated:** October 5, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
