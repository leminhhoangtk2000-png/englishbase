# Markdown Features Guide - Edu-theme Platform

## ✅ **PROBLEM FIXED: Admonitions Now Display Correctly!**

**Previous Issue:** `:::note`, `:::tip`, `:::warning` blocks were not displaying on the website.

**Solution Applied:** All admonition blocks have been converted to standard blockquotes for universal compatibility.

**New Syntax to Use:**

```markdown
> 💡 **Mẹo nhớ**  
> Động từ tác động trực tiếp vào đối tượng nào → đối tượng đó ở **Akkusativ**.

> ✅ **Tip**  
> Use this format for helpful tips and advice.

> ⚠️ **Important**  
> Use this format for warnings and important notes.

> ℹ️ **Information**  
> Use this format for additional information.

> 🚨 **Caution**  
> Use this format for critical warnings.
```

---

## Overview

This document outlines all the Markdown features supported in the Edu-theme German-Vietnamese language learning platform. Our system supports standard Markdown, extended features, and custom components specifically designed for language learning.

## 📝 Standard Markdown Syntax

### Headers

```markdown
# H1 - Main Title

## H2 - Section Title

### H3 - Subsection Title

#### H4 - Sub-subsection Title

##### H5 - Minor Heading

###### H6 - Smallest Heading
```

### Text Formatting

```markdown
**Bold text**
_Italic text_
**_Bold and italic_**
~~Strikethrough~~
`Inline code`
```

### Lists

#### Unordered Lists

```markdown
- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3
```

#### Ordered Lists

```markdown
1. First item
2. Second item
   1. Nested numbered item
   2. Another nested item
3. Third item
```

### Links and Images

```markdown
[Link text](https://example.com)
[Link with title](https://example.com "Title")
![Alt text](image.jpg)
![Image with title](image.jpg "Image title")
```

### Code Blocks

````markdown
```javascript
const greeting = "Hallo Welt!";
console.log(greeting);
```

```python
def greet(name):
    return f"Hallo {name}!"
```

```typescript
interface VocabularyEntry {
  german: string;
  vietnamese: string;
  level: string;
}
```
````

### Tables

```markdown
| German  | Vietnamese | Level |
| ------- | ---------- | ----- |
| Hallo   | Xin chào   | A1    |
| Tschüss | Tạm biệt   | A1    |
| Danke   | Cảm ơn     | A1    |
```

### Blockquotes

```markdown
> This is a blockquote
>
> It can span multiple lines
>
> > And can be nested
```

### Horizontal Rules

```markdown
---

---

---
```

## 🎓 Language Learning Specific Features

### Frontmatter for Content Organization

Every content file should include frontmatter for proper organization:

```yaml
---
title: "Lesson Title - Tiêu đề bài học"
description: "Brief description of the lesson content"
level: "A1" | "A2" | "B1" | "B2"
topic: "Grammatik" | "Vokabular" | "Übungen"
order: 1
difficulty: "beginner" | "intermediate" | "advanced"
tags: ["grammar", "vocabulary", "exercises"]
author: "Author Name"
lastUpdated: "2025-01-22"
---
```

### German Gender Notation

```markdown
**der** Vater - cha, bố  
**die** Mutter - mẹ  
**das** Kind - đứa trẻ, em bé
```

### Vocabulary Lists

```markdown
### 👨‍👩‍👧‍👦 Familie - Gia đình

- **der Vater** - cha, bố
- **die Mutter** - mẹ
- **das Kind** - đứa trẻ, em bé
- **die Eltern** - bố mẹ
- **die Geschwister** - anh chị em ruột
```

### Grammar Examples

```markdown
### Perfekt Formation

**Structure**: haben/sein + Partizip II

**Examples**:

- Ich **habe** gegessen. - Tôi đã ăn.
- Sie **ist** gekommen. - Cô ấy đã đến.
- Wir **haben** gelernt. - Chúng tôi đã học.
```

### Exercise Formatting

```markdown
### 📝 Übung 1: Fill in the blanks

1. Ich **\_** nach Hause. (gehen - Präsens)
2. Sie **\_** ein Buch. (lesen - Präsens)
3. Wir **\_** Deutsch. (lernen - Präsens)

**Antworten**: gehe, liest, lernen
```

## 🎨 Visual Enhancement Features

### Emoji Usage for Categories

```markdown
📚 **Grammatik** - Grammar lessons
📖 **Vokabular** - Vocabulary lessons  
✏️ **Übungen** - Exercises
🎯 **Ziele** - Learning objectives
💡 **Tipp** - Tips and hints
⚠️ **Achtung** - Important notes
✅ **Richtig** - Correct answers
❌ **Falsch** - Wrong answers
```

### Color-Coded Content Blocks

```markdown
> 💡 **Tipp**: Use flashcards to memorize vocabulary faster.

> ⚠️ **Achtung**: This grammar rule has exceptions.

> ✅ **Gut zu wissen**: This expression is commonly used in everyday conversation.
```

### Progress Indicators

```markdown
**Lernfortschritt**: ████████░░ 80%

**Schwierigkeitsgrad**: ⭐⭐⭐☆☆ (3/5)

**Zeitaufwand**: ⏱️ 15-20 Minuten
```

## 🔧 Technical Features

### Auto-Generated Table of Contents

```markdown
<!-- TOC is automatically generated for articles with multiple H2/H3 headers -->
```

### Cross-References

```markdown
Siehe auch: [Adjektivdeklination](./02-adjektivdeklination.md)
Weiterführend: [Präteritum](../grammatik/05-prateritum.md)
```

### Audio Pronunciation Notes

```markdown
**Aussprache**: [haʊ̯s] - House
**Betonung**: erste Silbe - First syllable stressed
```

### Cultural Context Boxes

```markdown
### 🇩🇪 Kultureller Kontext

In Deutschland ist es üblich, sich mit Handschlag zu begrüßen.
In Germany, it's customary to greet with a handshake.
```

## 📱 Responsive Design Features

### Mobile-Friendly Tables

```markdown
<!-- Tables automatically become scrollable on mobile devices -->

| Very Long German Word | Very Long Vietnamese Translation | Grammar Notes |
| --------------------- | -------------------------------- | ------------- |
| Donaudampfschiffahrt  | Du thuyền hơi nước sông Danube   | Compound noun |
```

### Collapsible Sections

```markdown
<details>
<summary>📋 Show Answer / Hiển thị đáp án</summary>

The correct answer is: **der Hund**

Đáp án đúng là: **der Hund** (con chó)

</details>
```

## 🎯 Content Structure Best Practices

### Lesson Structure Template

```markdown
---
title: "Lesson Title - Tiêu đề bài học"
description: "Lesson description"
level: "A2"
topic: "Vokabular"
order: 3
---

# Lesson Title - Tiêu đề bài học

## 📋 Nội dung bài học - Lesson Content

Brief introduction in both German and Vietnamese.

## 📚 Từ vựng trọng tâm - Key Vocabulary

### Category 1

- **word1** - translation
- **word2** - translation

## 🎯 Mục tiêu học tập - Learning Objectives

After this lesson, you will be able to:

- ✅ Objective 1
- ✅ Objective 2

## 💡 Ngữ pháp trọng tâm - Key Grammar

### Grammar Point 1

Explanation with examples

## 📝 Bài tập thực hành - Practice Exercises

### Exercise 1

Instructions and examples

## 📖 Bài đọc thêm - Additional Reading

Optional supplementary content

---

**📚 Chúc các bạn học tốt! - Happy learning!**
```

### Navigation Structure

```markdown
<!-- Breadcrumb navigation is automatically generated -->

Home > A2 Niveau > Vokabular > Current Page

<!-- Previous/Next navigation -->

← [Previous Lesson](./02-previous-lesson.md) | [Next Lesson](./04-next-lesson.md) →
```

## 🚀 Advanced Features

### Interactive Elements

```markdown
<!-- Buttons and interactive elements can be added -->

[🔊 Pronunciation](audio:pronunciation.mp3)
[📝 Practice Quiz](quiz:lesson3-quiz)
[🎮 Interactive Game](game:vocabulary-match)
```

### Theme Support

```markdown
<!-- Content automatically adapts to Light/Dark/Nude themes -->
<!-- No special markdown needed - handled by CSS -->
```

### Search Integration

```markdown
<!-- All content is automatically indexed for search -->
<!-- Use consistent terminology for better findability -->
```

## 📊 Analytics and Progress Tracking

### Progress Markers

```markdown
<!-- Progress is automatically tracked -->

**Completed**: ✅  
**In Progress**: 🔄  
**Not Started**: ⏸️
```

### Difficulty Indicators

```markdown
**Beginner**: 🟢 Easy to understand  
**Intermediate**: 🟡 Requires some knowledge  
**Advanced**: 🔴 Complex concepts
```

## 🎨 Styling Guidelines

### Consistent Formatting

- **German words**: Always bold
- **Vietnamese translations**: Regular text after dash
- **Grammar terms**: Italic when first introduced
- **Examples**: Use code blocks or quotes
- **Categories**: Use emoji + bold headers

### Color Coding (CSS Classes)

```markdown
<!-- These are handled by CSS, just use semantic markdown -->

.grammar-point { } <!-- Grammar explanations -->
.vocabulary-item { } <!-- Vocabulary entries -->
.exercise-block { } <!-- Exercise sections -->
.cultural-note { } <!-- Cultural context -->
```

## 🔍 SEO and Accessibility

### SEO-Friendly Structure

- Use semantic heading hierarchy (H1 → H2 → H3)
- Include descriptive alt text for images
- Use meaningful link text
- Include meta descriptions in frontmatter

### Accessibility Features

- Screen reader friendly markup
- Keyboard navigation support
- High contrast theme support
- Alternative text for all visual elements

---

## 📚 Quick Reference

### Most Used Features

1. **Headers**: `# ## ###` for hierarchy
2. **Bold German**: `**der Hund**`
3. **Lists**: `- item` or `1. item`
4. **Links**: `[text](url)`
5. **Code**: `` `code` `` or ``` blocks
6. **Tables**: `| col1 | col2 |`
7. **Frontmatter**: YAML at top of file

### Common Patterns

- Vocabulary: `**German** - Vietnamese`
- Grammar: `**Rule**: Explanation`
- Examples: `> Quote format`
- Exercises: `### 📝 Title`
- Tips: `> 💡 **Tipp**: Content`

---

**Last Updated**: January 22, 2025  
**Platform**: Edu-theme German-Vietnamese Learning Platform  
**Markdown Processor**: Next.js with custom extensions  
**Themes**: Light, Dark, Nude themes supported
