# 📚 Chuẩn Hóa Bài Tập Hören - A1

## 🎯 File Chuẩn (Reference)
**File**: `Einkaufen teil 1 - A1.mdx`  
**URL**: http://localhost:9003/exercises/a1/Horen/Einkaufen%20teil%201%20-%20A1

## ✅ Cấu Trúc Chuẩn

### 1. **Frontmatter**
```yaml
---
title: Lektion X - [Tên bài] - A1
description: Đây là bài tập của tôi
category: A1
authors: [Cơ Bản]
tags: [Nghe]
image: img/blog/hrX.png
publish: True
---
```

### 2. **Imports**
```tsx
import { MultipleChoiceQuiz } from "@/components/ui/multiple-choice-quiz";
import { Lueckentext } from "@/components/ui/lueckentext";
import { AuthorCredit } from "@/components/ui/author-credit";
```

**Khuyến nghị**: Thêm `MultipleChoiceQuizGroup` để gộp câu hỏi:
```tsx
import { MultipleChoiceQuizGroup } from "@/components/ui/multiple-choice-quiz-group";
```

### 3. **Video Section**
```mdx
## 🛍️ Đoạn 1: [Tên đoạn]

<iframe
  width="640"
  height="360"
  src="https://www.youtube.com/embed/VIDEO_ID"
  title="YouTube video player"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
  referrerpolicy="strict-origin-when-cross-origin"
  allowfullscreen
></iframe>
```

**Theme Applied**:
- ✅ Video căn giữa (CSS global)
- ✅ Bo góc 20px (CSS global)
- ✅ Dark mode: `background: hsl(240, 10%, 3.9%)`
- ✅ Responsive design

### 4. **Bài Tập Trắc Nghiệm**

**Cách 1: Riêng lẻ (Hiện tại)**
```tsx
### **Bài tập 1: Trắc nghiệm (Multiple Choice)**

<MultipleChoiceQuiz
  questions={[
    {
      question: "...",
      options: ["...", "...", "...", "..."],
      correctAnswer: "..."
    }
  ]}
/>
```

**Cách 2: Gộp nhóm (Khuyến nghị) ✨**
```tsx
### **Bài tập 1: Trắc nghiệm (Multiple Choice)**

<MultipleChoiceQuizGroup
  title="Bài tập 1: Trắc nghiệm (Multiple Choice)"
  questions={[
    {
      question: "...",
      options: ["...", "...", "...", "..."],
      correctAnswer: "..."
    },
    {
      question: "...",
      options: ["...", "...", "...", "..."],
      correctAnswer: "..."
    }
  ]}
/>
```

**Lợi ích**:
- ✅ Tính điểm tổng thể
- ✅ Progress bar
- ✅ Phải làm hết mới nộp bài
- ✅ UX tốt hơn

### 5. **Bài Tập Đục Lỗ**
```tsx
### **Bài tập 2: Đục lỗ (Lückentext)**

<Lueckentext
  title="Bài tập đục lỗ: Đoạn 1"
  textParts={[
    "Text before blank ",
    { type: "blank", correctAnswer: "answer" },
    " text after blank"
  ]}
/>
```

## 📋 Checklist Cho Mỗi File

- [ ] Frontmatter đúng format
- [ ] Import đầy đủ components
- [ ] Video có emoji icon phù hợp
- [ ] Video iframe đúng cấu trúc
- [ ] MultipleChoiceQuiz hoặc MultipleChoiceQuizGroup
- [ ] Lueckentext có title
- [ ] Dark theme hoạt động tốt
- [ ] Video căn giữa và bo góc 20px

## 🎨 Theme Specifications

### Colors (Dark Mode)
```css
--background: 240 10% 3.9%;        /* Main background */
--foreground: 0 0% 98%;            /* Text color */
--card: 240 10% 3.9%;              /* Card background */
--border: dark:border-gray-800;    /* Borders */
```

### Video Styling
```css
border-radius: 20px;
display: block;
margin: 0 auto;
max-width: 100%;
```

### Quiz Components
```css
Card background: dark:bg-background
Headers: dark:bg-background
Borders: dark:border-gray-800
Buttons hover: dark:hover:bg-gray-900
```

## 📂 Danh Sách Files Cần Kiểm Tra

1. ✅ Einkaufen teil 1 - A1.mdx (Chuẩn)
2. [ ] Einkaufen teil 2 - A1.mdx
3. [ ] Familie und Freunde Teil 1 - A1.mdx
4. [ ] Familie und Freunde Teil 2 - A1.mdx
5. [ ] Im Restaurant teil 1 - A1.mdx
6. [ ] Im Restaurant teil 2 - A1.mdx
7. [ ] Sich vorstellen Teil 1 - A1.mdx
8. [ ] Sich vorstellen Teil 2 - A1.mdx
9. [ ] Tagesablauf teil 1 - A1.mdx
10. [ ] Tagesablauf teil 2 - A1.mdx
11. [ ] Unterwegs tei 1 - A1.mdx
12. [ ] Unterwegs tei 2 - A1.mdx
13. [ ] Wohnen teil 1 - A1.mdx
14. [ ] Wohnen teil 2 - A1.mdx
15. [ ] Zahlen und Uhrzeit Teil 1 - A1.mdx
16. [ ] Zahlen und Uhrzeit Teil 2 - A1.mdx

## 🔧 Quick Fixes

### Fix 1: Add MultipleChoiceQuizGroup Import
```bash
# Add import to all files
find src/content/exercises/a1/Horen -name "*.mdx" -exec sed -i '' 's/import { Lueckentext }/import { MultipleChoiceQuizGroup } from "@\/components\/ui\/multiple-choice-quiz-group";\nimport { Lueckentext }/' {} \;
```

### Fix 2: Verify Theme Consistency
All files should automatically use the global CSS and Tailwind config for:
- ✅ Dark background: `hsl(240, 10%, 3.9%)`
- ✅ Video centering and 20px border-radius
- ✅ Component styling from `dark:bg-background`

## 🎯 Kết Quả Mong Muốn

- **Consistent UI**: Tất cả bài tập có giao diện giống nhau
- **Dark Theme**: Màu nền đồng nhất `240 10% 3.9%`
- **Video Style**: Căn giữa, bo góc 20px
- **Interactive**: Quiz có progress bar và tính điểm tổng
- **Responsive**: Hoạt động tốt trên mobile

## 📝 Notes

- Tất cả files đã có cấu trúc tương tự
- Theme đã được áp dụng global qua CSS và Tailwind
- Chỉ cần đảm bảo components đúng và imports đầy đủ
- Video styling tự động qua global CSS

---

**Status**: ✅ Theme đã được chuẩn hóa  
**Reference**: Einkaufen teil 1 - A1.mdx  
**Updated**: 4 tháng 10, 2025
