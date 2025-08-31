# 📚 Hướng dẫn Upload Bài tập MDX

## 🎯 **QUY TRÌNH ĐẦY ĐỦ THÊM BÀI TẬP**

### **Bước 1: Chuẩn bị file MDX**

#### **📍 Vị trí đặt file:**
```
src/content/exercises/[TRÌNH_ĐỘ]/[tên-bài-tập].mdx
```

#### **🔤 Naming Convention:**
- ✅ **Đúng**: `familie-und-freunde.mdx`
- ✅ **Đúng**: `einkaufen-im-supermarkt.mdx`  
- ❌ **Sai**: `Familie und Freunde.mdx` (có space)
- ❌ **Sai**: `Familie_Freunde.mdx` (có underscore)

#### **📝 Template MDX hoàn chỉnh:**
```mdx
---
title: Tiêu đề bài tập - A1
description: Mô tả ngắn gọn về bài tập
category: A1
authors: [Tên tác giả]
tags: [Nghe, Chủ đề]
image: img/blog/thumbnail.png
publish: true
---

import { MultipleChoiceQuiz } from '@/components/ui/multiple-choice-quiz';
import { Lueckentext } from '@/components/ui/lueckentext';
import { AuthorCredit } from '@/components/ui/author-credit';
import { FacebookComments } from '@/components/ui/facebook-comments';

## 🎧 Đoạn 1: Tiêu đề

<iframe 
  width="640" 
  height="360" 
  src="https://www.youtube.com/embed/VIDEO_ID" 
  title="YouTube video player" 
  frameBorder="0" 
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
  referrerPolicy="strict-origin-when-cross-origin" 
  allowFullScreen
></iframe>

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
  title="Tiêu đề bài tập điền từ"
  textParts={[
    "Text before blank ",
    { type: "blank", correctAnswer: "answer" },
    " text after blank.",
  ]}
/>

---

### **Tác giả ✍️**

<AuthorCredit author="Tên tác giả" />

---

<FacebookComments url="https://localhost:9002/exercises/[level]/[exercise-name]" />
```

### **Bước 2: Tạo Page Route**

#### **📍 Vị trí:**
```
src/app/exercises/[TRÌNH_ĐỘ]/[tên-bài-tập]/page.tsx
```

#### **📝 Template page.tsx:**
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

## 📂 **CẤU TRÚC THƯ MỤC HOÀN CHỈNH**

```
src/
├── content/exercises/
│   ├── a1/
│   │   ├── einkaufen-teil-1.mdx        ✅ CÓ SẴN
│   │   ├── familie-und-freunde.mdx     ✅ VỪA TẠO
│   │   └── [bài-tập-mới].mdx          👈 THÊM TẠI ĐÂY
│   ├── a2/
│   │   └── [bài-tập-a2].mdx           👈 THÊM TẠI ĐÂY  
│   ├── b1/
│   │   └── [bài-tập-b1].mdx           👈 THÊM TẠI ĐÂY
│   └── b2/
│       └── [bài-tập-b2].mdx           👈 THÊM TẠI ĐÂY
│
└── app/exercises/
    ├── a1/
    │   ├── einkaufen-teil-1/page.tsx     ✅ CÓ SẴN
    │   ├── familie-und-freunde/page.tsx  ✅ VỪA TẠO
    │   └── [bài-tập-mới]/page.tsx       👈 TẠO TƯƠNG ỨNG
    ├── a2/
    ├── b1/
    └── b2/
```

## 🚀 **WORKFLOW NHANH**

### **Cho mỗi bài tập mới:**

1. **Tạo file MDX:**
   ```bash
   # Ví dụ cho bài tập A1 về "Wetter"
   src/content/exercises/a1/wetter-und-klima.mdx
   ```

2. **Tạo thư mục page:**
   ```bash
   src/app/exercises/a1/wetter-und-klima/page.tsx
   ```

3. **Copy template và chỉnh sửa nội dung**

4. **Test tại:**
   ```
   http://localhost:9002/exercises/a1/wetter-und-klima
   ```

## 📱 **URLS SẼ TỰ ĐỘNG HOẠT ĐỘNG**

- **Danh sách A1**: `http://localhost:9002/exercises/a1`
- **Bài tập cụ thể**: `http://localhost:9002/exercises/a1/[tên-bài-tập]`

## ✅ **VÍ DỤ HOÀN CHỈNH**

Tôi đã tạo sẵn:
- ✅ `src/content/exercises/a1/familie-und-freunde.mdx`
- ✅ `src/app/exercises/a1/familie-und-freunde/page.tsx`
- 🌐 **Test tại**: http://localhost:9002/exercises/a1/familie-und-freunde

## 🎯 **TIẾP THEO:**

**Bạn chỉ cần:**
1. **Copy file MDX** của bạn vào đúng thư mục trình độ
2. **Tạo page.tsx** tương ứng 
3. **Follow template** tôi đã tạo sẵn

**Hệ thống sẽ tự động:**
- Hiển thị trong danh sách exercises
- Tạo navigation breadcrumb
- Load interactive components
- Hỗ trợ YouTube videos

🚀 **Sẵn sàng nhận content của bạn!**
