# 📚 Exercise Components Overview

## 🎯 Tổng quan các Components Bài tập

Hệ thống bài tập tiếng Đức có **9 components chính** được chia thành 3 nhóm:

---

## 🔥 **INTERACTIVE EXERCISES** (4 components)
*Các bài tập tương tác có chấm điểm và feedback*

### 1. **Lueckentext** 📝
- **Chức năng**: Bài tập điền từ vào chỗ trống (Fill in the blanks)
- **Props**: `title`, `textParts` (array with text và blank objects)
- **Features**: 
  - Real-time validation
  - Score calculation 
  - Retry functionality
  - Highlighted correct/incorrect answers
- **Use case**: Luyện ngữ pháp, từ vựng trong ngữ cảnh

### 2. **MultipleChoice** ✅
- **Chức năng**: Bài tập trắc nghiệm nhiều lựa chọn
- **Props**: `title`, `questions` (array of question objects)
- **Features**:
  - Multiple questions support
  - Explanation for each option
  - Progress indicator
  - Score tracking
- **Use case**: Kiểm tra hiểu biết ngữ pháp, từ vựng

### 3. **MatchingExercise** 🔗
- **Chức năng**: Bài tập nối từ Đức-Việt
- **Props**: `title`, `items`, `leftColumnTitle`, `rightColumnTitle`
- **Features**:
  - Click-to-match interface
  - Shuffle functionality
  - Visual feedback
  - Explanations for matches
- **Use case**: Học từ vựng mới, ôn tập từ đã học

### 4. **WritingExercise** ✍️
- **Chức năng**: Bài tập viết tự do
- **Props**: `title`, `prompt` (with question, hints, keywords)
- **Features**:
  - Word count tracking
  - Min/max word limits
  - Sample answer display
  - Keyword suggestions
- **Use case**: Luyện viết, diễn đạt ý tưởng

---

## 📖 **LEARNING SUPPORT** (2 components)
*Components hỗ trợ học tập, không tương tác*

### 5. **GrammarBox** 📏
- **Chức năng**: Hiển thị quy tắc ngữ pháp
- **Props**: `title`, `level`, `rules`, `tips`, `exceptions`
- **Features**:
  - Level-based color coding (A1-C2)
  - Multiple grammar rules
  - Tips and exceptions
  - Clear examples
- **Use case**: Giải thích ngữ pháp trước/sau bài tập

### 6. **VocabularyList** 📚
- **Chức năng**: Danh sách từ vựng với flashcard
- **Props**: `title`, `words`, `showCategories`
- **Features**:
  - Flip card interface
  - Category filtering
  - Pronunciation guide
  - Examples with translations
- **Use case**: Học từ vựng mới theo chủ đề

---

## 💬 **CONTENT & SOCIAL** (3 components)
*Components về nội dung và tương tác xã hội*

### 7. **CommentSystem** 💬
- **Chức năng**: Hệ thống bình luận GitHub-style
- **Props**: `exerciseId`, `currentUserId`, `currentUserName`, `showCommentsInitially`
- **Features**:
  - Claps system (👏)
  - Nested replies
  - Dark mode support
  - Mock data fallback
- **Use case**: Thảo luận về bài tập, Q&A

### 8. **AuthorCredit** 👤
- **Chức năng**: Thông tin tác giả bài tập
- **Props**: `author`, `date`, `role`, `avatar`, `bio`
- **Features**:
  - Author information display
  - Role and date
  - Optional avatar and bio
- **Use case**: Credit cho người tạo bài tập

### 9. **FacebookComments** 👥
- **Chức năng**: Hệ thống bình luận giống Facebook
- **Props**: `url`, `initialComments`
- **Features**:
  - Like system (❤️)
  - Reply functionality
  - Social sharing
- **Use case**: Alternative comment system

---

## 🎨 **Design System**

### **Common Features:**
- ✅ **TypeScript** với full type safety
- ✅ **Responsive design** cho mobile/desktop
- ✅ **Dark mode support** 
- ✅ **Accessibility** với proper ARIA labels
- ✅ **Lucide icons** consistent throughout
- ✅ **Tailwind CSS** styling
- ✅ **shadcn/ui** components

### **Exercise States:**
- 🟡 **Initial**: Chưa làm bài
- 🔵 **In Progress**: Đang làm bài  
- 🟢 **Completed**: Đã hoàn thành
- 🔴 **Error**: Có lỗi

---

## 📋 **Usage trong MDX**

```mdx
<Lueckentext 
  title="Bài tập điền từ"
  textParts={[
    "Ich ", 
    { type: "blank", correctAnswer: "bin" }, 
    " Student."
  ]}
/>

<MultipleChoice 
  title="Chọn đáp án đúng"
  questions={[{
    question: "Was ist das?",
    options: [
      { text: "Das ist ein Buch", isCorrect: true },
      { text: "Das ist eine Buch", isCorrect: false }
    ]
  }]}
/>

<VocabularyList 
  title="Từ vựng mới"
  words={[
    { german: "das Buch", vietnamese: "cuốn sách" }
  ]}
/>

<CommentSystem exerciseId="unique-id" />
```

---

## 🚀 **Roadmap - Components sắp tới**

- **DragDropExercise**: Kéo thả từ/câu
- **ListeningExercise**: Bài tập nghe  
- **SpeakingExercise**: Bài tập nói
- **VerbConjugation**: Chia động từ
- **CaseExercise**: Luyện tập cách (Nominativ, Akkusativ, etc.)
- **ProgressTracker**: Theo dõi tiến độ học tập

---

## 💡 **Best Practices**

1. **Luôn có title** cho accessibility
2. **Provide explanations** trong feedback
3. **Test responsive** trên mobile
4. **Include level indicators** (A1-C2) khi phù hợp
5. **Use consistent icons** từ Lucide React
6. **Support dark mode** trong styling
