# Universal Comments Database Schema Design

## 🎯 Current Status

- **Mock Data**: API hiện đang trả về mock comments
- **Database**: Cần thêm tables cho comments system
- **Prisma Schema**: Cần extend schema hiện tại

## 🗄️ Database Schema Design

### 1. PageComment Model

```prisma
model PageComment {
  id        String   @id @default(cuid())
  contentId String   // Unique identifier for each page/lesson
  content   String   // Comment content
  authorId  String?  // Optional - for registered users
  authorName String  // Display name (for guests or users)
  authorEmail String? // Optional email for guest users
  guestId   String?  // For guest users (IP-based or localStorage ID)
  isGuest   Boolean  @default(true)
  likes     Int      @default(0)
  parentId  String?  // For nested replies
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relations
  author   User?        @relation(fields: [authorId], references: [id], onDelete: SetNull)
  parent   PageComment? @relation("CommentReplies", fields: [parentId], references: [id])
  replies  PageComment[] @relation("CommentReplies")
  likes_records CommentLike[]

  // Indexes for performance
  @@index([contentId])
  @@index([createdAt])
  @@index([parentId])
  @@map("page_comments")
}
```

### 2. CommentLike Model

```prisma
model CommentLike {
  id        String   @id @default(cuid())
  commentId String
  userId    String?  // For registered users
  guestId   String?  // For guest users
  createdAt DateTime @default(now())

  // Relations
  comment PageComment @relation(fields: [commentId], references: [id], onDelete: Cascade)
  user    User?       @relation(fields: [userId], references: [id], onDelete: Cascade)

  // Ensure one like per user/guest per comment
  @@unique([commentId, userId])
  @@unique([commentId, guestId])
  @@map("comment_likes")
}
```

### 3. Extended User Model

```prisma
model User {
  // ... existing fields ...

  // New relations for comments
  comments     PageComment[]
  commentLikes CommentLike[]
}
```

## 📊 Data Structure

### ContentId Patterns

```typescript
// Exercise pages
"exercise-a1-grammatik-artikel";
"exercise-b1-konjunktiv-teil1";

// Niveau pages
"a1niveau-grammatik-verben";
"a2niveau-übungen-perfekt";
"b1niveau-übungen-passiv";

// MDX demo pages
"mdx-demo-components";
```

### Guest User System

```typescript
interface GuestUser {
  guestId: string; // "guest_ABC123" (IP-based)
  authorName: string; // User-provided name
  authorEmail?: string; // Optional email
  isGuest: true;
}
```

### Comment Structure

```typescript
interface CommentData {
  id: string;
  contentId: string; // Page identifier
  content: string;
  authorName: string;
  isGuest: boolean;
  likes: number;
  createdAt: string;
  replies: CommentData[];
}
```

## 🔧 Implementation Plan

### Phase 1: Database Migration

1. Add PageComment and CommentLike models to schema.prisma
2. Run migration: `npx prisma migrate dev --name add-comments`
3. Update API to use real database instead of mock

### Phase 2: API Implementation

1. **GET /api/page-comments**

   - Query by contentId
   - Include nested replies
   - Calculate like counts

2. **POST /api/page-comments**

   - Create new comment
   - Support guest and registered users
   - Handle reply nesting

3. **POST /api/page-comments/[id]/like**
   - Toggle like/unlike
   - Prevent duplicate likes

### Phase 3: Guest User Enhancement

1. Generate stable guestId from IP + localStorage
2. Allow guest name customization
3. Optional email for notifications

## 🚀 Migration Strategy

### Step 1: Backup Current Mock System

```bash
# Keep current mock API as fallback
cp src/app/api/page-comments/route.ts src/app/api/page-comments/route.mock.ts
```

### Step 2: Add Database Models

```bash
# Add models to prisma/schema.prisma
npx prisma migrate dev --name add-universal-comments
npx prisma generate
```

### Step 3: Update API Implementation

```typescript
// Use Prisma instead of mock data
const comments = await prisma.pageComment.findMany({
  where: { contentId },
  include: {
    replies: true,
    likes_records: true,
  },
  orderBy: { createdAt: "desc" },
});
```

## 📈 Scalability Considerations

### Performance Optimizations

- **Indexes**: contentId, createdAt, parentId
- **Pagination**: Limit comments per page
- **Caching**: Redis for popular pages
- **CDN**: Static comment data

### Data Management

- **Soft Delete**: Keep deleted comments with isDeleted flag
- **Moderation**: Add approved/pending status
- **Spam Prevention**: Rate limiting per IP/user
- **Analytics**: Track comment engagement

## 🔒 Security & Privacy

### Guest User Privacy

- No personal data storage beyond name/email
- IP-based IDs are hashed
- Optional data retention policies

### Content Moderation

- Bad word filtering
- Admin moderation panel
- User reporting system
- Auto-hide suspicious content

## 💾 Data Example

### Database Records

```sql
-- Page Comments Table
INSERT INTO page_comments (contentId, content, authorName, guestId, isGuest)
VALUES
  ('a1niveau-grammatik-artikel', 'Der, die, das khó quá!', 'Học viên A', 'guest_abc123', true),
  ('a2niveau-übungen-perfekt', 'Bài tập hay, cảm ơn!', 'Student B', 'guest_def456', true);

-- Comment Likes Table
INSERT INTO comment_likes (commentId, guestId)
VALUES ('comment_id_1', 'guest_abc123');
```

## 🎯 Benefits

### Current Mock System

✅ Fast development and testing
✅ No database dependencies
✅ Consistent demo data

### Future Database System

🚀 **Real user interactions**
🚀 **Persistent data across sessions**
🚀 **Advanced features (likes, replies, moderation)**
🚀 **Analytics and insights**
🚀 **Scalable architecture**

---

**Next Step**: Implement database schema and migrate from mock to real data system! 📊
