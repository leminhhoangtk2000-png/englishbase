# 📝 Hướng Dẫn Sử Dụng Quiz Group - Gộp Câu Hỏi & Tính Điểm Chung

## ✨ Tính Năng Mới

Component `MultipleChoiceQuizGroup` cho phép bạn:

- ✅ Gộp nhiều câu hỏi trắc nghiệm thành 1 bài tập
- ✅ Tính điểm tổng thể cho toàn bộ bài tập
- ✅ Hiển thị progress bar (đã làm bao nhiêu câu)
- ✅ Phải chọn đủ tất cả câu mới được nộp bài
- ✅ Hiển thị kết quả tổng quan với emoji và thông điệp động

## 🎯 Cách Sử Dụng

### Cách 1: Trong File MDX (Markdown)

```mdx
<MultipleChoiceQuizGroup
  title="Bài tập 1: Trắc nghiệm (Multiple Choice)"
  questions={[
    {
      question: "Wann geht die Person einkaufen?",
      options: [
        "Jeden Freitag",
        "Jeden Samstag",
        "Jeden Sonntag",
        "Jeden Montag",
      ],
      correctAnswer: "Jeden Freitag",
    },
    {
      question: "Was macht die Person oft im Supermarkt?",
      options: [
        "Sie kauft nur Brot",
        "Sie vergleicht die Preise",
        "Sie geht schnell einkaufen",
        "Sie kauft teure Dinge",
      ],
      correctAnswer: "Sie vergleicht die Preise",
    },
    {
      question: "Warum vergleicht die Person die Preise?",
      options: [
        "Weil sie reich ist",
        "Weil manche Dinge teuer sind",
        "Weil sie Zeit hat",
        "Weil es Spaß macht",
      ],
      correctAnswer: "Weil manche Dinge teuer sind",
    },
  ]}
/>
```

### Cách 2: Thay Thế Nhiều Component MultipleChoiceQuiz Riêng Lẻ

**❌ TRƯỚC (mỗi câu một component - tính điểm riêng):**

```mdx
<MultipleChoiceQuiz
  question="Wann geht die Person einkaufen?"
  options={["Jeden Freitag", "Jeden Samstag", "Jeden Sonntag", "Jeden Montag"]}
  correctAnswer="Jeden Freitag"
/>

<MultipleChoiceQuiz
  question="Was macht die Person oft im Supermarkt?"
  options={[
    "Sie kauft nur Brot",
    "Sie vergleicht die Preise",
    "Sie geht schnell einkaufen",
    "Sie kauft teure Dinge",
  ]}
  correctAnswer="Sie vergleicht die Preise"
/>
```

**✅ SAU (gộp lại - tính điểm chung):**

```mdx
<MultipleChoiceQuizGroup
  title="Bài tập 1: Trắc nghiệm (Multiple Choice)"
  questions={[
    {
      question: "Wann geht die Person einkaufen?",
      options: [
        "Jeden Freitag",
        "Jeden Samstag",
        "Jeden Sonntag",
        "Jeden Montag",
      ],
      correctAnswer: "Jeden Freitag",
    },
    {
      question: "Was macht die Person oft im Supermarkt?",
      options: [
        "Sie kauft nur Brot",
        "Sie vergleicht die Preise",
        "Sie geht schnell einkaufen",
        "Sie kauft teure Dinge",
      ],
      correctAnswer: "Sie vergleicht die Preise",
    },
  ]}
/>
```

## 🎨 Giao Diện

### 1. Header

- Hiển thị số lượng câu hỏi
- Tiêu đề bài tập

### 2. Progress Bar

- Hiển thị số câu đã chọn / tổng số câu
- Thanh tiến trình màu xanh
- Thông báo "✓ Đã hoàn thành!" khi chọn đủ

### 3. Câu Hỏi

- Số thứ tự câu hỏi
- Các đáp án dạng button
- Highlight câu đã chọn

### 4. Nút Nộp Bài

- Chỉ hiện khi chọn đủ tất cả câu
- Button "Nộp bài" màu xanh gradient
- Button "Xóa tất cả" để làm lại

### 5. Kết Quả

- Emoji động theo điểm số:
  - 🎉 Điểm ≥ 80%: Xuất sắc
  - 👍 Điểm ≥ 50%: Tốt
  - 💪 Điểm < 50%: Cần cố gắng
- Hiển thị số câu đúng/tổng số câu
- Phần trăm điểm số
- Thông điệp khuyến khích
- Button "🔄 Làm lại bài tập"

## 📊 Ví Dụ Thực Tế

File: `/content/a1niveau/ubungen/04-einkaufen1.mdx`

```mdx
---
title: "Lektion 4 - Einkaufen teil 1 - A1"
description: "Đây là bài tập của tôi"
level: "A1"
topic: "Hören"
order: 4
---

# 🛍️ Đoạn 1: Ich gehe einkaufen

<YouTubeEmbed
  src="https://www.youtube.com/embed/xyz"
  title="4.1 Luyện nghe tiếng Đức mỗi ngày | Deutsch.vn"
/>

## Bài tập 1: Trắc nghiệm (Multiple Choice)

<MultipleChoiceQuizGroup
  title="Bài tập 1: Trắc nghiệm (Multiple Choice)"
  questions={[
    {
      question: "Wann geht die Person einkaufen?",
      options: [
        "Jeden Freitag",
        "Jeden Samstag",
        "Jeden Sonntag",
        "Jeden Montag",
      ],
      correctAnswer: "Jeden Freitag",
    },
    {
      question: "Was macht die Person oft im Supermarkt?",
      options: [
        "Sie kauft nur Brot",
        "Sie vergleicht die Preise",
        "Sie geht schnell einkaufen",
        "Sie kauft teure Dinge",
      ],
      correctAnswer: "Sie vergleicht die Preise",
    },
    {
      question: "Warum vergleicht die Person die Preise?",
      options: [
        "Weil sie reich ist",
        "Weil manche Dinge teuer sind",
        "Weil sie Zeit hat",
        "Weil es Spaß macht",
      ],
      correctAnswer: "Weil manche Dinge teuer sind",
    },
  ]}
/>
```

## 🔄 Migration Guide

Để chuyển đổi file hiện tại:

1. **Tìm tất cả MultipleChoiceQuiz** trong file
2. **Gộp chúng lại** thành một mảng `questions`
3. **Đặt trong MultipleChoiceQuizGroup** với title phù hợp
4. **Xóa các component cũ** đi

## 💡 Lưu Ý

- ✅ Component đã được thêm vào MDX renderer, có thể dùng ngay
- ✅ Nền video đã đổi thành đen thuần (`bg-black`)
- ✅ Video bo góc 15px và căn giữa
- ⚠️ Phải định dạng đúng JSON trong MDX (dùng dấu ngoặc kép)
- 📝 Title là optional, có thể bỏ qua nếu không cần

## 🎯 Khi Nào Dùng Cái Nào?

### Dùng `MultipleChoiceQuiz` (câu đơn):

- Khi có 1 câu hỏi độc lập
- Muốn tính điểm riêng cho từng câu
- Bài tập nhỏ, nhanh

### Dùng `MultipleChoiceQuizGroup` (gộp câu):

- ✅ Khi có từ 2 câu trở lên
- ✅ Muốn tính điểm tổng cho bài tập
- ✅ Muốn học sinh làm hết mới xem kết quả
- ✅ Bài tập chính thức, có cấu trúc

## 🚀 Kết Quả

- Video: Nền đen thuần, bo góc 15px, căn giữa ✅
- Quiz: Gộp nhiều câu, tính điểm chung, progress bar ✅
- UX: Học sinh phải làm hết mới nộp bài ✅
- Feedback: Emoji và thông điệp động theo điểm ✅
