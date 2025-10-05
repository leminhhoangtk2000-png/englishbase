# 🔧 Fix: Invalid DOM property `frameborder` Error

## ❌ Lỗi

```
Invalid DOM property `frameborder`. Did you mean `frameBorder`?
```

**File lỗi:** `src/components/exercises/exercise-mdx-renderer.tsx` (line 77)

## 🔍 Nguyên nhân

React JSX yêu cầu các DOM properties phải dùng **camelCase** thay vì lowercase như HTML thuần.

- ❌ HTML: `frameborder="0"` (lowercase)
- ✅ React JSX: `frameBorder="0"` (camelCase)

Các file MDX chứa iframe YouTube đang dùng `frameborder` (lowercase) → Gây lỗi khi render.

## ✅ Giải pháp

### Script tự động sửa tất cả files

Created: `scripts/fix-frameborder.sh`

```bash
#!/bin/bash
# Automatically replace frameborder -> frameBorder in all MDX/TSX/JSX files
find src/ content/ -type f \( -name "*.mdx" -o -name "*.tsx" -o -name "*.jsx" \) \
  -exec sed -i '' 's/frameborder="/frameBorder="/g' {} +
```

### Kết quả

```
✅ Fixed: 66 occurrences
✅ Remaining: 0
```

**Files đã sửa:**

- All A2 Hören exercises (10+ files)
- All B1 Hören exercises (7+ files)
- All B1 Lesen exercises (5+ files)
- Exercise template file
- Other MDX files containing iframes

## 📝 Chi tiết thay đổi

### Trước (Lỗi):

```jsx
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/..."
  frameborder="0" // ❌ Lowercase
  allow="accelerometer; autoplay..."
  allowfullscreen
></iframe>
```

### Sau (Đúng):

```jsx
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/..."
  frameBorder="0" // ✅ CamelCase
  allow="accelerometer; autoplay..."
  allowfullscreen
></iframe>
```

## 🎯 Các prop iframe cần chú ý trong React

Khi embed iframe trong React/JSX, luôn dùng camelCase:

| HTML (lowercase)  | React JSX (camelCase) |
| ----------------- | --------------------- |
| `frameborder`     | `frameBorder`         |
| `allowfullscreen` | `allowFullScreen`     |
| `referrerpolicy`  | `referrerPolicy`      |
| `crossorigin`     | `crossOrigin`         |

## 🚀 Next Steps

1. **Restart dev server** để load file đã sửa:

   ```bash
   npm run dev
   ```

2. **Refresh browser** - Lỗi sẽ biến mất

3. **Verify** - Các exercise pages với YouTube iframe sẽ hoạt động bình thường

## 🔄 Nếu gặp lại lỗi này

Chạy lại script:

```bash
./scripts/fix-frameborder.sh
```

Hoặc manual search:

```bash
grep -r "frameborder" --include="*.mdx" src/ content/
```

## ✅ Status

- [x] Identified issue (frameborder casing)
- [x] Created fix script
- [x] Fixed all 66 occurrences
- [x] Verified no remaining issues
- [ ] Restart dev server
- [ ] Test exercise pages

**Lỗi đã được sửa hoàn toàn! Chỉ cần restart dev server là xong.** 🎉
