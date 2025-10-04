# 📚 Hướng dẫn Thêm Bài Tập (Exercise Content Guide)

## 🎯 Tổng quan

Bài tập được lưu trong thư mục `/src/content/exercises/` với cấu trúc phân cấp theo niveau (A1, A2, B1, B2).

## 📁 Cấu trúc thư mục

```
src/content/exercises/
├── a1/                          # Bài tập A1
│   ├── einkaufen-teil-1.mdx    # File bài tập
│   ├── einkaufen-teil-1.meta.json  # Metadata (optional)
│   └── familie-und-freunde.mdx
├── a2/                          # Bài tập A2 (cần tạo)
├── b1/                          # Bài tập B1 (cần tạo)
└── b2/                          # Bài tập B2 (cần tạo)
```

## 🔧 Các loại Component Bài tập

### 1. **Lueckentext** (Điền từ vào chỗ trống)

```mdx
import { Lueckentext } from "@/components/ui/lueckentext";

<Lueckentext
  title="Bài tập đục lỗ: Chủ đề X"
  textParts={[
    "Ich gehe jeden ",
    { type: "blank", correctAnswer: "Samstag" },
    " einkaufen. Ich kaufe ",
    { type: "blank", correctAnswer: "Brot" },
    " und Milch.",
  ]}
/>
```

**Cách dùng:**

- Xen kẽ text và blank objects
- `correctAnswer` là đáp án đúng (không phân biệt hoa thường)

---

### 2. **MultipleChoiceQuiz** (Trắc nghiệm)

```mdx
import { MultipleChoiceQuiz } from "@/components/ui/multiple-choice-quiz";

<MultipleChoiceQuiz
  questions={[
    {
      question: "Was ist richtig?",
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correctAnswer: "Option 2",
    },
    {
      question: "Wo ist das?",
      options: ["Berlin", "München", "Hamburg", "Köln"],
      correctAnswer: "Berlin",
    },
  ]}
/>
```

---

### 3. **Satzbildung** (Sắp xếp từ thành câu)

```mdx
import Satzbildung from "@/components/exercises/satzbildung";

<Satzbildung
  title="Bài tập sắp xếp câu"
  exercises={[
    {
      words: ["Ich", "gehe", "heute", "ins", "Kino"],
      correctSentence: "Ich gehe heute ins Kino.",
      instruction: "Động từ chia ở vị trí 2",
    },
    {
      words: ["Wann", "kommst", "du", "nach", "Hause"],
      correctSentence: "Wann kommst du nach Hause?",
      instruction: "W-Frage: động từ sau từ để hỏi",
    },
  ]}
/>
```

---

### 4. **MatchingQuiz** (Ghép cặp)

```mdx
import MatchingQuiz from "@/components/exercises/matching-quiz";

<MatchingQuiz
  title="Ghép câu hỏi với câu trả lời"
  questions={["Wie heißt du?", "Woher kommst du?", "Was machst du?"]}
  answers={["Ich heiße Maria.", "Ich komme aus Vietnam.", "Ich bin Studentin."]}
  correctPairs={[
    [0, 0], // Câu hỏi 0 với câu trả lời 0
    [1, 1],
    [2, 2],
  ]}
/>
```

---

### 5. **ExerciseTable** (Bài tập dạng bảng)

```mdx
import { ExerciseTable } from "@/components/exercises/exercise-table";

<ExerciseTable
  title="Chia động từ"
  subtitle="Chia động từ trong ngoặc"
  exercises={[
    {
      id: 1,
      german: "Ich __ nach Berlin. (fahren)",
      correctAnswer: "fahre",
      explanation: 'Động từ "fahren" chia với "ich" là "fahre"',
    },
    {
      id: 2,
      german: "Er __ ein Buch. (lesen)",
      correctAnswer: "liest",
      explanation: "Động từ bất quy tắc: lesen → er liest",
    },
  ]}
/>
```

---

## 📝 Template Tạo Bài Tập Mới

### Bước 1: Tạo file MDX

Tạo file mới trong thư mục tương ứng:

```bash
# Ví dụ tạo bài tập A2
src/content/exercises/a2/dativ-akkusativ.mdx
```

### Bước 2: Viết nội dung

```mdx
---
title: "Dativ und Akkusativ - A2"
description: "Bài tập về Dativ và Akkusativ"
category: "A2"
authors: ["YourName"]
tags: ["Grammatik", "Dativ", "Akkusativ"]
image: img/exercises/dativ-akkusativ.png
publish: true
---

import { MultipleChoiceQuiz } from "@/components/ui/multiple-choice-quiz";
import { Lueckentext } from "@/components/ui/lueckentext";
import { AuthorCredit } from "@/components/ui/author-credit";

# Dativ und Akkusativ Übungen

## 📖 Phần 1: Trắc nghiệm

<MultipleChoiceQuiz
  questions={[
    {
      question: "Ich gebe ____ Buch. (der Mann)",
      options: ["der Mann", "dem Mann", "den Mann", "des Mannes"],
      correctAnswer: "dem Mann",
    },
  ]}
/>

## ✏️ Phần 2: Điền từ

<Lueckentext
  title="Điền Dativ hoặc Akkusativ"
  textParts={[
    "Ich gebe ",
    { type: "blank", correctAnswer: "dem" },
    " Kind ein Geschenk. Ich sehe ",
    { type: "blank", correctAnswer: "den" },
    " Mann.",
  ]}
/>

---

### **Tác giả ✍️**

<AuthorCredit author="YourName" />

---
```

### Bước 3: Tạo Metadata (Optional)

Tạo file `.meta.json` cùng tên:

```json
{
  "title": "Dativ und Akkusativ",
  "description": "Bài tập về Dativ và Akkusativ",
  "level": "A2",
  "topics": ["Grammatik", "Dativ", "Akkusativ"],
  "duration": 15,
  "difficulty": "intermediate"
}
```

---

## 🎨 Best Practices

### 1. **Cấu trúc rõ ràng**

- Dùng heading (##) để phân chia phần
- Mỗi phần có emoji để dễ nhận diện
- Giải thích ngắn gọn trước mỗi bài tập

### 2. **Đa dạng dạng bài**

- Kết hợp nhiều loại bài tập
- Bắt đầu từ dễ → khó
- Có video hoặc audio nếu có thể

### 3. **Giải thích rõ ràng**

- Thêm `explanation` cho câu khó
- Dùng tiếng Việt để giải thích
- Thêm tips và lưu ý

### 4. **Responsive**

- Tất cả components đã responsive
- Test trên mobile và desktop
- Dark theme đã được hỗ trợ

---

## 🚀 Workflow Thêm Bài Tập

### 1. Lập kế hoạch

```
- Chọn niveau (A1, A2, B1, B2)
- Chọn chủ đề (Grammatik, Wortschatz, Hören, Lesen)
- Quyết định độ dài và độ khó
```

### 2. Tạo file

```bash
# Tạo thư mục nếu chưa có
mkdir -p src/content/exercises/a2

# Tạo file bài tập
touch src/content/exercises/a2/ten-bai-tap.mdx
```

### 3. Viết nội dung

```
- Import components cần thiết
- Viết frontmatter
- Thêm nội dung bài tập
- Thêm author credit
```

### 4. Test

```bash
# Chạy dev server
npm run dev

# Truy cập
http://localhost:9003/exercises/a2/ten-bai-tap
```

### 5. Commit & Push

```bash
git add src/content/exercises/
git commit -m "feat: Add new exercise for A2 - [Topic]"
git push origin main
```

---

## 📊 Ví dụ Bài Tập Hoàn Chỉnh

### File: `src/content/exercises/a2/perfekt-ubungen.mdx`

```mdx
---
title: "Perfekt Übungen - A2"
description: "Bài tập về thì Perfekt"
category: "A2"
authors: ["TeacherName"]
tags: ["Grammatik", "Perfekt", "Verben"]
publish: true
---

import { MultipleChoiceQuiz } from "@/components/ui/multiple-choice-quiz";
import { Lueckentext } from "@/components/ui/lueckentext";
import { ExerciseTable } from "@/components/exercises/exercise-table";
import Satzbildung from "@/components/exercises/satzbildung";
import { AuthorCredit } from "@/components/ui/author-credit";

# 🎯 Perfekt Übungen

## 📚 Lý thuyết nhanh

Perfekt = **haben/sein + Partizip II**

- **haben**: hầu hết các động từ
- **sein**: động từ di chuyển, thay đổi trạng thái, sein/bleiben/werden

---

## ✅ Bài 1: Trắc nghiệm

<MultipleChoiceQuiz
  questions={[
    {
      question: "Ich ___ gestern ins Kino ___. (gehen)",
      options: [
        "habe ... gegangen",
        "bin ... gegangen",
        "habe ... gegehen",
        "bin ... gegehen",
      ],
      correctAnswer: "bin ... gegangen",
    },
    {
      question: "Er ___ ein Buch ___. (lesen)",
      options: [
        "hat ... gelesen",
        "ist ... gelesen",
        "hat ... geliest",
        "ist ... geliest",
      ],
      correctAnswer: "hat ... gelesen",
    },
  ]}
/>

---

## ✏️ Bài 2: Điền từ

<Lueckentext
  title="Chia động từ ở Perfekt"
  textParts={[
    "Gestern ",
    { type: "blank", correctAnswer: "bin" },
    " ich nach Berlin ",
    { type: "blank", correctAnswer: "gefahren" },
    ". Dort ",
    { type: "blank", correctAnswer: "habe" },
    " ich meine Freundin ",
    { type: "blank", correctAnswer: "getroffen" },
    ".",
  ]}
/>

---

## 🔤 Bài 3: Sắp xếp câu

<Satzbildung
  title="Sắp xếp từ thành câu Perfekt"
  exercises={[
    {
      words: ["Ich", "habe", "gestern", "ein", "Buch", "gelesen"],
      correctSentence: "Ich habe gestern ein Buch gelesen.",
      instruction: "Perfekt: haben/sein ở vị trí 2, Partizip II cuối câu",
    },
    {
      words: ["Er", "ist", "nach", "Hause", "gekommen"],
      correctSentence: "Er ist nach Hause gekommen.",
      instruction: '"kommen" dùng với "sein"',
    },
  ]}
/>

---

## 📋 Bài 4: Chia động từ

<ExerciseTable
  title="Chia động từ trong ngoặc"
  subtitle="Sử dụng thì Perfekt"
  exercises={[
    {
      id: 1,
      german: "Ich __ gestern nach Berlin __. (fahren)",
      correctAnswer: ["bin", "gefahren"],
      explanation: 'fahren → bin gefahren (động từ di chuyển dùng "sein")',
    },
    {
      id: 2,
      german: "Sie __ ein Buch __. (lesen)",
      correctAnswer: ["hat", "gelesen"],
      explanation: 'lesen → hat gelesen (động từ thường dùng "haben")',
    },
  ]}
/>

---

### **Tác giả ✍️**

<AuthorCredit author="TeacherName" />

---

:::tip 💡 Gợi ý học tập

- Học thuộc list động từ với "sein"
- Luyện tập mỗi ngày 15 phút
- Kết hợp nghe và viết
  :::
```

---

## 🎨 Styling & Theme

Tất cả components đã support:

- ✅ Dark theme
- ✅ Responsive design
- ✅ Accessible (keyboard navigation)
- ✅ Print-friendly

---

## 🔗 Tài liệu tham khảo

- [MDX Documentation](https://mdxjs.com/)
- [Next.js Dynamic Routes](https://nextjs.org/docs/routing/dynamic-routes)
- [Component Examples](./src/components/exercises/)

---

## 📞 Support

Nếu cần hỗ trợ:

1. Xem ví dụ trong `/src/content/exercises/a1/`
2. Tham khảo components trong `/src/components/exercises/`
3. Test trên dev server trước khi commit

---

**Happy Teaching! 📚✨**
