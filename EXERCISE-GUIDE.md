# 📚 Hướng dẫn thêm bài tập (Exercise System Guide)

## 🎯 Tổng quan
Hệ thống bài tập cho phép bạn tạo các bài tập độc lập với:
- Các component tương tác (trắc nghiệm, điền từ)
- Không có sidebar bên trái
- Hoạt động như blog posts độc lập
- Hỗ trợ YouTube videos và nội dung đa phương tiện

## 📁 Cấu trúc thư mục
```
src/content/exercises/
├── a1/           # Bài tập trình độ A1
├── a2/           # Bài tập trình độ A2  
├── b1/           # Bài tập trình độ B1
└── b2/           # Bài tập trình độ B2
```

## 🚀 Cách thêm bài tập mới

### Bước 1: Tạo file MDX
Tạo file `.mdx` trong thư mục tương ứng với trình độ:
```
src/content/exercises/a1/ten-bai-tap.mdx
```

### Bước 2: Tạo page route
Tạo thư mục và page.tsx:
```
src/app/exercises/a1/ten-bai-tap/page.tsx
```

### Bước 3: Nội dung page.tsx
```tsx
import TenBaiTap from '@/content/exercises/a1/ten-bai-tap.mdx';

export default function Page() {
  return (
    <main className="container mx-auto max-w-4xl py-6 px-4">
      <div className="mb-6">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <a href="/exercises" className="hover:text-foreground transition-colors">Bài tập</a>
          <span className="font-medium text-foreground">/</span>
          <a href="/exercises/a1" className="hover:text-foreground transition-colors">A1</a>
          <span className="font-medium text-foreground">/</span>
          <div className="font-medium text-foreground">Tên Bài Tập</div>
        </div>
      </div>
      
      <article className="prose prose-lg prose-stone dark:prose-invert max-w-none">
        <TenBaiTap />
      </article>
    </main>
  );
}
```

## 📝 Template MDX file

```mdx
---
title: Tiêu đề bài tập
description: Mô tả ngắn gọn về bài tập
category: A1
authors: [Tác giả]
tags: [Nghe, Từ vựng]
image: img/blog/thumbnail.png
publish: true
---

import { MultipleChoiceQuiz } from '@/components/ui/multiple-choice-quiz';
import { Lueckentext } from '@/components/ui/lueckentext';
import { AuthorCredit } from '@/components/ui/author-credit';
import { Comments } from '@/components/ui/comments';

## 🎧 Đoạn 1: Tiêu đề phần

<iframe width="640" height="360" src="https://www.youtube.com/embed/VIDEO_ID" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### **Bài tập 1: Trắc nghiệm**

<MultipleChoiceQuiz
  questions={[
    {
      question: 'Câu hỏi tiếng Đức?',
      options: ['Đáp án A', 'Đáp án B', 'Đáp án C', 'Đáp án D'],
      correctAnswer: 'Đáp án đúng',
    },
  ]}
/>

### **Bài tập 2: Điền từ**

<Lueckentext
  title="Bài tập điền từ"
  textParts={[
    "Ich gehe jeden ",
    { type: "blank", correctAnswer: "Samstag" },
    " einkaufen.",
  ]}
/>

---

### **Tác giả ✍️**

<AuthorCredit author="Tên tác giả" />

---

<Comments url="https://localhost:9002/exercises/a1/ten-bai-tap" />
```

## 🎮 Các component có sẵn

### 1. MultipleChoiceQuiz
Tạo bài tập trắc nghiệm có feedback tức thì
```jsx
<MultipleChoiceQuiz
  questions={[
    {
      question: 'Câu hỏi',
      options: ['A', 'B', 'C', 'D'],
      correctAnswer: 'Đáp án đúng',
    }
  ]}
/>
```

### 2. Lueckentext  
Tạo bài tập điền từ/cụm từ vào chỗ trống
```jsx
<Lueckentext
  title="Tiêu đề bài tập"
  textParts={[
    "Text before blank ",
    { type: "blank", correctAnswer: "answer" },
    " text after blank",
  ]}
/>
```

### 3. AuthorCredit
Hiển thị thông tin tác giả
```jsx
<AuthorCredit author="Tên tác giả" />
```

### 4. FacebookComments
Tích hợp bình luận Facebook
```jsx
<FacebookComments url="URL của bài tập" />
```

## 🌐 Truy cập bài tập

- Danh sách: `http://localhost:9002/exercises/a1`
- Bài tập cụ thể: `http://localhost:9002/exercises/a1/ten-bai-tap`

## 📸 Thêm hình ảnh

Đặt hình ảnh trong thư mục `public/images/` và sử dụng:
```markdown
![Alt text](/images/ten-hinh.jpg)
```

## 🎯 Lưu ý quan trọng

1. **Naming**: Tên file và thư mục dùng kebab-case (ví-du-ten-bai)
2. **Import**: Tên import phải match với tên file (PascalCase)
3. **Dev Server**: Chạy `npx next dev -p 9002` (không dùng --turbopack)
4. **Commit**: Luôn commit sau khi thêm bài tập mới

## ✅ Checklist khi thêm bài tập mới

- [ ] Tạo file .mdx với frontmatter đầy đủ
- [ ] Tạo page.tsx với route tương ứng  
- [ ] Test bài tập hoạt động đúng
- [ ] Commit code changes
- [ ] Cập nhật URL trong FacebookComments

Bây giờ bạn có thể dễ dàng thêm các bài tập mới theo format này! 🚀
