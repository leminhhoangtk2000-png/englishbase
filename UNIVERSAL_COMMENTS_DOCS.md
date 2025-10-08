# 💬 Universal Comments System Documentation

## 🎯 **Tổng quan**

Universal Comments System là một hệ thống bình luận độc lập có thể nhúng vào bất kỳ trang MDX/MD nào mà không cần authentication phức tạp. Hệ thống hỗ trợ guest comments và có thể mở rộng dễ dàng.

## ✅ **Đã hoàn thành**

### **1. API Endpoints**

- ✅ `GET /api/page-comments` - Lấy comments cho content
- ✅ `POST /api/page-comments` - Tạo comment mới
- ✅ Mock data system với guest users
- ✅ IP-based guest identification

### **2. UniversalComments Component**

- ✅ **Location**: `/src/components/UniversalComments.tsx`
- ✅ Responsive design với dark mode support
- ✅ Guest commenting với localStorage cho tên
- ✅ Nested replies structure (ready for implementation)
- ✅ Real-time updates
- ✅ Input validation và error handling

### **3. MDX Integration**

- ✅ Đã thêm vào `mdx-components.tsx`
- ✅ Đã thêm vào `/mdx/` router
- ✅ Test page tại `/mdx/demo/universal-comments`

## 🚀 **Cách sử dụng**

### **Basic Usage**

```jsx
<UniversalComments contentId="unique-page-id" />
```

### **Advanced Usage**

```jsx
<UniversalComments
  contentId="article-123"
  title="Bình luận bài viết"
  showCount={true}
  minLength={10}
  className="my-custom-comments"
/>
```

### **Props Reference**

| Prop        | Type    | Default      | Description                |
| ----------- | ------- | ------------ | -------------------------- |
| `contentId` | string  | **required** | ID duy nhất cho content    |
| `title`     | string  | "Bình luận"  | Tiêu đề section            |
| `showCount` | boolean | true         | Hiển thị số lượng comments |
| `minLength` | number  | 3            | Độ dài tối thiểu comment   |
| `className` | string  | ""           | CSS class tùy chỉnh        |

## 📄 **Examples**

### **1. Blog Post Comments**

```mdx
---
title: "Bài viết về tiếng Đức"
---

# Học tiếng Đức hiệu quả

Nội dung bài viết...

<UniversalComments
  contentId="blog-hoc-tieng-duc-hieu-qua"
  title="Thảo luận về bài viết"
/>
```

### **2. Exercise Page Comments**

```mdx
---
title: "Bài tập A1 - Artikel"
---

# Bài tập về mạo từ

<Lueckentext exercises={...} />

<UniversalComments
  contentId="a1-artikel-uebungen"
  title="Hỏi đáp về bài tập"
  minLength={5}
/>
```

### **3. Documentation Comments**

```mdx
<UniversalComments
  contentId="docs-installation-guide"
  title="Feedback & Questions"
  showCount={false}
/>
```

## 🔧 **API Reference**

### **GET /api/page-comments**

**Query Parameters:**

- `contentId` (required): ID của content
- `pageUrl` (optional): Alternative identifier

**Response:**

```json
{
  "success": true,
  "comments": [
    {
      "id": "comment_123",
      "content": "Great article!",
      "author": {
        "id": "guest_abc",
        "name": "John Doe",
        "avatar": null,
        "isGuest": true
      },
      "createdAt": "2025-10-07T10:00:00Z",
      "likes": 5,
      "isLiked": false,
      "replies": []
    }
  ],
  "total": 1
}
```

### **POST /api/page-comments**

**Request Body:**

```json
{
  "contentId": "unique-content-id",
  "content": "Comment content",
  "authorName": "User Name",
  "parentId": null
}
```

**Response:**

```json
{
  "success": true,
  "comment": {
    /* New comment object */
  },
  "message": "Comment posted successfully!"
}
```

## 🎨 **Customization**

### **Styling**

Component sử dụng Tailwind CSS và tự động adapt dark mode:

```tsx
<UniversalComments
  contentId="custom-page"
  className="bg-blue-50 dark:bg-blue-900 p-6 rounded-xl"
/>
```

### **Theme Colors**

- Primary: Blue-600
- Success: Green-600
- Error: Red-600
- Background: Gray-50/Gray-800 (dark mode)

## 🔄 **Migration từ hệ thống cũ**

### **Từ Comments component cũ:**

```jsx
// OLD
<Comments url="/page/url" exerciseId="exercise-123" />

// NEW
<UniversalComments contentId="exercise-123" />
```

### **Từ FacebookComments component:**

```jsx
// OLD
<FacebookComments url="/page/url" />

// NEW
<UniversalComments contentId="page-unique-id" />
```

## 🚧 **Roadmap - Tính năng sắp tới**

### **Phase 2: Advanced Features**

- [ ] **Real database integration** (thay thế mock data)
- [ ] **Reply system** (nested comments)
- [ ] **Like/Unlike comments**
- [ ] **Comment moderation** (approve/reject)
- [ ] **Email notifications**

### **Phase 3: Enhanced UX**

- [ ] **Rich text editor** (markdown support)
- [ ] **Image uploads** in comments
- [ ] **@mentions** and notifications
- [ ] **Comment threading** (better nested view)

### **Phase 4: Integration**

- [ ] **User authentication** integration
- [ ] **Admin dashboard** for comment management
- [ ] **Analytics** (comment engagement)
- [ ] **Spam detection** and filtering

## 🐛 **Troubleshooting**

### **Component không hiển thị**

1. Kiểm tra import trong `mdx-components.tsx`
2. Verify `contentId` prop được truyền
3. Check console errors

### **API errors**

1. Verify server đang chạy port 9003
2. Check network tab trong dev tools
3. Validate request body format

### **Styling issues**

1. Ensure Tailwind CSS được load
2. Check dark mode configuration
3. Verify component className prop

## 📞 **Support**

**Test URL**: http://localhost:9003/mdx/demo/universal-comments
**API Base**: http://localhost:9003/api/page-comments
**Component Path**: `/src/components/UniversalComments.tsx`

---

_Last updated: 2025-10-07_
