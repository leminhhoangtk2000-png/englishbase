# 🔧 Parser Fix - Support Both Prop Names

## ❌ Vấn đề gặp phải:

**Console Error**: "No sentences found in Satzbildung props"

### Nguyên nhân:

- **Parser** trong `mdx-components-renderer.tsx` chỉ tìm prop name `sentences=`
- **MDX files** sử dụng prop name `exercises=` (theo format A2)
- **Không match** → Parser trả về null → Component không render

## ✅ Giải pháp:

### 1. Update Regex để accept cả 2 prop names

**File**: `src/components/mdx-components-renderer.tsx`

**Trước đây** (chỉ accept `sentences=`):

```typescript
const sentencesMatch = propsStr.match(/sentences=\{(\[[\s\S]*?\])\}/);
if (!sentencesMatch) {
  console.error("No sentences found in Satzbildung props");
  return null;
}
```

**Sau khi fix** (accept cả `sentences=` hoặc `exercises=`):

```typescript
let sentencesMatch = propsStr.match(
  /(?:sentences|exercises)=\{(\[[\s\S]*?\])\}/
);
if (!sentencesMatch) {
  console.error("No sentences/exercises found in Satzbildung props");
  return null;
}
```

### 2. Support cả `words:` và `parts:` trong array items

**Trước đây**:

```typescript
const partsMatch = block.match(/parts:\s*\[([\s\S]*?)\]/);
const correctAnswerMatch = block.match(/correctAnswer:\s*["'](.*?)["']/);
```

**Sau khi fix**:

```typescript
const partsMatch = block.match(/(?:parts|words):\s*\[([\s\S]*?)\]/);
const correctAnswerMatch = block.match(
  /(?:correctAnswer|correctSentence):\s*["'](.*?)["']/
);
```

## 🎯 Kết quả:

### ✅ Parser giờ accept TẤT CẢ các format:

#### Format 1: A2 style (sentences + parts)

```jsx
<Satzbildung
  sentences={[
    {
      parts: ["Câu 1", "Câu 2"],
      correctAnswer: "Câu kết hợp",
    },
  ]}
/>
```

#### Format 2: Current style (exercises + words)

```jsx
<Satzbildung
  exercises={[
    {
      words: ["Câu 1", "Câu 2"],
      correctSentence: "Câu kết hợp",
    },
  ]}
/>
```

#### Format 3: Mixed (exercises + parts + correctAnswer)

```jsx
<Satzbildung
  exercises={[
    {
      parts: ["Câu 1", "Câu 2"],
      correctAnswer: "Câu kết hợp",
    },
  ]}
/>
```

**Tất cả đều hoạt động!** ✅

## 🔄 Backward Compatibility:

- ✅ **A2 pages** vẫn hoạt động (dùng `sentences=`)
- ✅ **B1 pages** vẫn hoạt động (dùng `exercises=`)
- ✅ **Không cần sửa** bất kỳ MDX file nào
- ✅ **Future-proof**: Có thể dùng bất kỳ tên nào

## 📊 Testing Results:

```bash
./test-b1-satzbildung.sh
```

**Kết quả**: 6/6 pages PASS ✅

- Relativsätze Teil 2 ✅
- Relativsätze Teil 3 ✅
- Relativsätze Teil 4 ✅
- Passiv Teil 1 ✅
- Passiv Teil 2 ✅
- Doppelkonjunktionen Teil 6 ✅

## 📝 Technical Details:

### Regex Breakdown:

**`(?:sentences|exercises)`**:

- `(?:...)` = Non-capturing group
- `sentences|exercises` = Match either "sentences" OR "exercises"
- Flexible prop name matching

**`(?:parts|words)`**:

- Match either "parts" OR "words" in array items
- Both formats work seamlessly

**`(?:correctAnswer|correctSentence)`**:

- Match either property name
- Maximum compatibility

## 🎨 Benefits:

1. **Flexibility**: Developers có thể dùng tên prop theo ý thích
2. **Compatibility**: A2 và B1 đều hoạt động
3. **No Breaking Changes**: Không phá code cũ
4. **Future-proof**: Dễ dàng thêm alias mới nếu cần

## ✅ Status:

**RESOLVED** ✅ - Parser giờ đã hoàn toàn flexible và backward compatible!

---

**Fix date**: 3/10/2025  
**Files changed**: `src/components/mdx-components-renderer.tsx` (lines 507-510, 536-540)
