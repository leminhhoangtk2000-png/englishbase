# Exercise Components Documentation

## Tổng quan

Hệ thống Exercise Components được thiết kế để tạo ra các bài tập tương tác cho việc học tiếng Đức. Tất cả components đều hỗ trợ responsive design và dark mode.

## Danh sách Components

### 1. Lueckentext (Điền chỗ trống)

Component để tạo bài tập điền chỗ trống với tự động chấm điểm.

```tsx
import { Lueckentext } from '@/components/exercises';

<Lueckentext
  title="Bài tập: Điền mạo từ"
  textParts={[
    "1. ", { type: "blank", correctAnswer: "Der" }, " Tisch ist groß.", "\n",
    "2. ", { type: "blank", correctAnswer: "Die" }, " Katze schläft."
  ]}
/>
```

**Props:**
- `title` (string, optional): Tiêu đề bài tập
- `textParts` (array): Mảng chứa text và blank objects

**Blank Object:**
- `type: "blank"` (required)
- `correctAnswer` (string): Đáp án đúng

### 2. MultipleChoice (Trắc nghiệm)

Component tạo bài tập trắc nghiệm với nhiều lựa chọn.

```tsx
import { MultipleChoice } from '@/components/exercises';

<MultipleChoice
  title="Bài tập: Chọn đáp án đúng"
  questions={[
    {
      question: "_____ Hund ist freundlich.",
      options: [
        { text: "Der", isCorrect: true, explanation: "Hund là danh từ giống đực" },
        { text: "Die", isCorrect: false },
        { text: "Das", isCorrect: false }
      ]
    }
  ]}
/>
```

**Props:**
- `title` (string, optional): Tiêu đề bài tập
- `questions` (array): Mảng câu hỏi

**Question Object:**
- `question` (string): Nội dung câu hỏi
- `options` (array): Các lựa chọn
- `explanation` (string, optional): Giải thích câu hỏi

**Option Object:**
- `text` (string): Nội dung đáp án
- `isCorrect` (boolean): Đáp án đúng hay sai
- `explanation` (string, optional): Giải thích đáp án

### 3. MatchingExercise (Ghép cặp)

Component tạo bài tập ghép cặp từ vựng.

```tsx
import { MatchingExercise } from '@/components/exercises';

<MatchingExercise
  title="Ghép từ Đức - Việt"
  leftColumnTitle="Tiếng Đức"
  rightColumnTitle="Tiếng Việt"
  items={[
    { id: "1", left: "der Hund", right: "con chó" },
    { id: "2", left: "die Katze", right: "con mèo" }
  ]}
/>
```

**Props:**
- `title` (string, optional): Tiêu đề bài tập
- `leftColumnTitle` (string): Tiêu đề cột trái
- `rightColumnTitle` (string): Tiêu đề cột phải
- `items` (array): Mảng các cặp để ghép

**Item Object:**
- `id` (string): ID duy nhất
- `left` (string): Nội dung cột trái
- `right` (string): Nội dung cột phải
- `explanation` (string, optional): Giải thích

### 4. WritingExercise (Bài tập viết)

Component tạo bài tập viết văn với kiểm tra từ khóa và độ dài.

```tsx
import { WritingExercise } from '@/components/exercises';

<WritingExercise
  title="Viết về gia đình"
  prompt={{
    question: "Hãy viết về gia đình bạn",
    minWords: 50,
    maxWords: 100,
    keywords: ["Familie", "Vater", "Mutter"],
    hints: ["Bắt đầu với 'Meine Familie...'"],
    sampleAnswer: "Meine Familie ist sehr wichtig..."
  }}
/>
```

**Props:**
- `title` (string, optional): Tiêu đề bài tập
- `prompt` (object): Thông tin bài tập

**Prompt Object:**
- `question` (string): Câu hỏi
- `minWords` (number, optional): Số từ tối thiểu
- `maxWords` (number, optional): Số từ tối đa
- `keywords` (array, optional): Từ khóa cần sử dụng
- `hints` (array, optional): Gợi ý
- `sampleAnswer` (string, optional): Câu trả lời mẫu

### 5. GrammarBox (Hộp ngữ pháp)

Component hiển thị quy tắc ngữ pháp với ví dụ và mẹo.

```tsx
import { GrammarBox } from '@/components/exercises';

<GrammarBox
  title="Mạo từ (der, die, das)"
  level="A1"
  rules={[
    {
      rule: "Danh từ giống đực dùng 'der'",
      explanation: "Các danh từ giống đực sử dụng mạo từ 'der'",
      examples: ["der Mann", "der Tisch"]
    }
  ]}
  tips={["Học từ vựng cùng với mạo từ"]}
  exceptions={["das Mädchen dùng 'das' mặc dù là nữ"]}
/>
```

**Props:**
- `title` (string): Tiêu đề ngữ pháp
- `level` (string): Cấp độ (A1, A2, B1, B2, C1, C2)
- `rules` (array): Quy tắc ngữ pháp
- `tips` (array, optional): Mẹo ghi nhớ
- `exceptions` (array, optional): Ngoại lệ

### 6. VocabularyList (Danh sách từ vựng)

Component hiển thị từ vựng dạng flashcard 3D với phân loại.

```tsx
import { VocabularyList } from '@/components/exercises';

<VocabularyList
  title="Từ vựng A1: Gia đình"
  words={[
    {
      german: "der Vater",
      vietnamese: "người cha",
      pronunciation: "ˈfaːtɐ",
      example: "Mein Vater arbeitet.",
      exampleTranslation: "Cha tôi làm việc.",
      category: "Gia đình",
      level: "A1"
    }
  ]}
  showCategories={true}
/>
```

**Props:**
- `title` (string): Tiêu đề danh sách
- `words` (array): Mảng từ vựng
- `showCategories` (boolean): Hiển thị filter theo danh mục

**Word Object:**
- `german` (string): Từ tiếng Đức
- `vietnamese` (string): Nghĩa tiếng Việt
- `pronunciation` (string, optional): Phiên âm
- `example` (string, optional): Ví dụ
- `exampleTranslation` (string, optional): Dịch ví dụ
- `category` (string, optional): Danh mục
- `level` (string, optional): Cấp độ

### 7. AuthorCredit (Thông tin tác giả)

Component hiển thị thông tin tác giả bài viết.

```tsx
import { AuthorCredit } from '@/components/exercises';

<AuthorCredit 
  author="Lonia" 
  role="Giáo viên tiếng Đức"
  date="30/08/2025"
  bio="Chuyên gia với 5 năm kinh nghiệm"
/>
```

### 8. FacebookComments (Hệ thống bình luận)

Component tạo hệ thống bình luận tương tác.

```tsx
import { FacebookComments } from '@/components/exercises';

<FacebookComments 
  url="https://example.com/lesson"
  initialComments={[
    {
      id: "1",
      author: "Học viên A",
      content: "Bài học rất hay!",
      timestamp: "29/08/2025",
      likes: 3
    }
  ]}
/>
```

## Sử dụng trong MDX

Tất cả components có thể được sử dụng trực tiếp trong file MDX:

```mdx
---
title: Bài học A1
description: Học mạo từ der, die, das
---

# Bài học: Mạo từ

import { Lueckentext, GrammarBox } from '@/components/exercises';

<GrammarBox
  title="Mạo từ cơ bản"
  level="A1"
  rules={[...]}
/>

<Lueckentext
  textParts={[...]}
/>
```

## Features chung

### Đánh giá tự động
- Tính điểm phần trăm
- Hiển thị feedback màu sắc
- Thông báo kết quả (Xuất sắc, Khá tốt, Cần cải thiện)

### UI/UX
- Responsive design cho mobile/tablet/desktop
- Dark mode support
- Smooth animations
- Accessible design
- Loading states

### Tương tác
- Nút "Kiểm tra" và "Làm lại"
- Hover effects
- Click animations
- Audio pronunciation (Text-to-Speech)

## Customization

### Màu sắc
Mỗi component có scheme màu riêng:
- Lueckentext: Blue
- MultipleChoice: Purple  
- MatchingExercise: Green
- WritingExercise: Yellow
- GrammarBox: Indigo
- VocabularyList: Teal

### Styling
Tất cả components sử dụng Tailwind CSS và có thể override bằng custom CSS.

## Best Practices

1. **Dữ liệu**: Luôn validate dữ liệu input trước khi truyền vào components
2. **Performance**: Sử dụng React.memo cho lists lớn
3. **Accessibility**: Đảm bảo tất cả interactive elements có proper labels
4. **Mobile**: Test trên các kích thước màn hình khác nhau
5. **Content**: Giữ nội dung ngắn gọn và rõ ràng

## Troubleshooting

### Component không render
- Kiểm tra import path
- Đảm bảo tất cả required props được truyền
- Check console for errors

### Styling issues
- Verify Tailwind CSS classes
- Check CSS conflicts
- Ensure proper component hierarchy

### Performance issues
- Use React DevTools Profiler
- Implement proper memoization
- Optimize re-renders

## Changelog

### v1.0.0 (30/08/2025)
- Initial release
- 8 exercise components
- Full MDX support
- Responsive design
- Dark mode support
