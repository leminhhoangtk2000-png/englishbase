# Dark Theme Admonitions - Final Design

## 🎨 Design Principles

### Problem
- Admonition cards trong dark theme có màu quá sáng/chói, khó đọc
- Background transparency quá thấp (0.15), card không rõ ràng
- Content text dùng màu quá sáng (#dbeafe, #d1fae5, etc.)

### Solution
- Sử dụng themed background colors với opacity 0.3
- Text content dùng slate-300 (#cbd5e1) cho readability
- Border-left tăng lên 4px để nổi bật theme color
- Strong/em text dùng slate-200 (#e2e8f0) để emphasis

---

## 🎯 Color Specifications

### Base Card (all admonitions)
```css
.dark .admonition {
  background-color: #1e293b;  /* slate-800 */
  border-color: #475569;      /* slate-600 */
}
```

### 1. Note (Blue)
```css
.dark .admonition-note {
  background-color: rgba(30, 58, 138, 0.3);  /* dark blue-900 */
  border-left-color: #3b82f6;                /* blue-500 */
  border-left-width: 4px;
}

Header: #60a5fa (blue-400)
Content: #cbd5e1 (slate-300)
Code: rgba(59, 130, 246, 0.2) bg + #93c5fd text
```

### 2. Tip (Green)
```css
.dark .admonition-tip {
  background-color: rgba(6, 78, 59, 0.3);    /* dark green-900 */
  border-left-color: #10b981;                /* emerald-500 */
  border-left-width: 4px;
}

Header: #34d399 (emerald-400)
Content: #cbd5e1 (slate-300)
Code: rgba(16, 185, 129, 0.2) bg + #6ee7b7 text
```

### 3. Warning (Yellow)
```css
.dark .admonition-warning {
  background-color: rgba(120, 53, 15, 0.3);  /* dark amber-900 */
  border-left-color: #f59e0b;                /* amber-500 */
  border-left-width: 4px;
}

Header: #fbbf24 (amber-400)
Content: #cbd5e1 (slate-300)
Code: rgba(245, 158, 11, 0.2) bg + #fbbf24 text
```

### 4. Info (Cyan)
```css
.dark .admonition-info {
  background-color: rgba(8, 51, 68, 0.3);    /* dark cyan-900 */
  border-left-color: #06b6d4;                /* cyan-500 */
  border-left-width: 4px;
}

Header: #22d3ee (cyan-400)
Content: #cbd5e1 (slate-300)
Code: rgba(6, 182, 212, 0.2) bg + #67e8f9 text
```

### 5. Caution (Orange)
```css
.dark .admonition-caution {
  background-color: rgba(124, 45, 18, 0.3);  /* dark orange-900 */
  border-left-color: #ea580c;                /* orange-600 */
  border-left-width: 4px;
}

Header: #fb923c (orange-400)
Content: #cbd5e1 (slate-300)
Code: rgba(234, 88, 12, 0.2) bg + #fdba74 text
```

### 6. Danger (Red)
```css
.dark .admonition-danger {
  background-color: rgba(127, 29, 29, 0.3);  /* dark red-900 */
  border-left-color: #dc2626;                /* red-600 */
  border-left-width: 4px;
}

Header: #f87171 (red-400)
Content: #cbd5e1 (slate-300)
Code: rgba(220, 38, 38, 0.2) bg + #fca5a5 text
```

---

## 📝 Text Elements

### Content Text
- Default: `#cbd5e1` (slate-300) - easy to read, not too bright
- Strong/Bold: `#e2e8f0` (slate-200) - slightly lighter for emphasis
- Emphasis/Italic: `#e2e8f0` (slate-200)
- Links: `#60a5fa` (blue-400) with underline
- Code: Theme-specific colors (see above)

### Headers
- All headers: Theme color (blue-400, emerald-400, etc.)
- Font weight: 600 (semibold)

---

## ✅ Key Improvements

1. **Better Visibility**
   - Increased opacity from 0.15 to 0.3
   - Used themed dark backgrounds instead of bright color overlays

2. **Better Readability**
   - Content text: slate-300 (#cbd5e1) instead of bright colors
   - Strong/em: slate-200 (#e2e8f0) for proper emphasis
   - Not too bright, not too dark - perfect balance

3. **Better Theme Consistency**
   - Each type has its own themed dark background
   - Border-left-width: 4px makes theme color stand out
   - Code blocks use subtle backgrounds (0.2 opacity)

4. **WCAG Compliance**
   - Content text (#cbd5e1) on dark backgrounds meets AA standards
   - Headers use vibrant colors but not for long-form text
   - Good contrast ratios throughout

---

## 🧪 Testing

### Manual Testing
1. Visit http://localhost:9003
2. Navigate to any page with admonitions (e.g., `/a1niveau/grammatik/04-kasus`)
3. Toggle dark mode
4. Check all 6 admonition types:
   - :::note
   - :::tip
   - :::warning
   - :::info
   - :::caution
   - :::danger

### What to Check
- [ ] Cards are clearly visible with themed backgrounds
- [ ] Content text is easy to read (not too bright, not too dark)
- [ ] Borders are prominent (4px, theme colors)
- [ ] Headers stand out with theme colors
- [ ] Code blocks are visible but not distracting
- [ ] Strong/em text has proper emphasis
- [ ] Links are clickable and visible

---

## 📦 Files Modified

- `src/styles/admonitions.css` - Complete dark mode redesign

---

## 🎉 Result

Dark mode admonitions giờ đây:
- ✅ Dễ đọc với slate-300 content text
- ✅ Rõ ràng với 0.3 opacity themed backgrounds
- ✅ Nổi bật với 4px colored borders
- ✅ Professional với proper typography hierarchy
- ✅ Comfortable để đọc trong thời gian dài

Không còn chói mắt, không còn khó đọc! 🎊
