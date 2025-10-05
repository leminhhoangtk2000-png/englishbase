# 🐛 Fix: Sidebar Active Highlight for Übungen

## ❌ Problem

Sidebar không highlight trang đang active trong phần Übungen (Bài tập).

**User Report**: "Übung vẫn ko được đánh dấu vào thẻ mà tôi đang đọc trang đó"

## 🔍 Root Cause

**Case Mismatch** giữa config và URL thực tế:

### Config (WRONG):

```typescript
// src/config/b1niveau.ts
href: "/b1niveau/übungen/relativsatze/teil2"; // lowercase ü
```

### Actual URL (CORRECT):

```
http://localhost:9003/b1niveau/Übungen/relativsatze/teil2  // uppercase Ü
```

### Why This Happened:

- German character `Ü` (uppercase) trong file path
- Config dùng `ü` (lowercase)
- JavaScript strict comparison: `pathname === href` → **FALSE**
- → Không match → Không highlight

## ✅ Solution

### Fix: Update config để match URL case

**Command**:

```bash
sed -i '' 's|/b1niveau/übungen/|/b1niveau/Übungen/|g' src/config/b1niveau.ts
```

**Changes**:

```diff
- href: "/b1niveau/übungen/relativsatze/teil2"
+ href: "/b1niveau/Übungen/relativsatze/teil2"

- href: "/b1niveau/übungen/passiv/teil1"
+ href: "/b1niveau/Übungen/passiv/teil1"

// ... all Übungen URLs updated
```

## 🎯 Result

### Before Fix:

```tsx
pathname: "/b1niveau/Übungen/relativsatze/teil2"
href:     "/b1niveau/übungen/relativsatze/teil2"
isActive: false  ❌ // No match, no highlight
```

### After Fix:

```tsx
pathname: "/b1niveau/Übungen/relativsatze/teil2"
href:     "/b1niveau/Übungen/relativsatze/teil2"
isActive: true   ✅ // Perfect match, highlights!
```

## 🎨 Visual Result

### After Fix:

```
📁 Übungen (BOLD)
   ├─ 📂 Relativsätze Übungen (BOLD)
   │   ├─ Teil 1 (normal)
   │   ├─ Teil 2 (highlighted) ⭐ ← Active page with:
   │   │                            - bg-primary/15
   │   │                            - border-l-2 border-primary
   │   │                            - font-semibold
   │   ├─ Teil 3 (normal)
   │   ├─ Teil 4 (normal)
   │   └─ Teil 5 (normal)
```

## 📝 Highlight Styles (Already Working)

```tsx
className={cn(
  "flex w-full items-center rounded-md p-2 text-sm hover:bg-secondary/50 hover:text-foreground transition-colors",
  {
    "bg-primary/15 border-l-2 border-primary font-semibold text-foreground": isActive,
    //  ↑ Background     ↑ Left border          ↑ Bold text           ↑ Full color
  }
)}
```

### Active Link Features:

- ✅ **Background**: Light primary color (`bg-primary/15`)
- ✅ **Left Border**: 2px primary colored border (`border-l-2 border-primary`)
- ✅ **Font Weight**: Semi-bold (`font-semibold`)
- ✅ **Text Color**: Full foreground color (not muted)

## 🧪 Testing

### Test URLs:

```bash
# All should now highlight correctly:
http://localhost:9003/b1niveau/Übungen/relativsatze/teil2
http://localhost:9003/b1niveau/Übungen/relativsatze/teil3
http://localhost:9003/b1niveau/Übungen/passiv/teil1
http://localhost:9003/b1niveau/Übungen/passiv/teil2
http://localhost:9003/b1niveau/Übungen/doppelkonjunktionen/teil6
```

### Expected Behavior:

1. ✅ Section "Übungen" auto-opens
2. ✅ Subsection "Relativsätze Übungen" auto-opens
3. ✅ Current page "Teil 2" highlighted with:
   - Light blue background
   - Blue left border
   - Bold text
4. ✅ Scroll position maintained

## 🔧 Technical Details

### How Highlight Works:

1. **Pathname Detection**:

   ```tsx
   const pathname = usePathname(); // from Next.js router
   ```

2. **Exact Match Check**:

   ```tsx
   const isActive = pathname === subItem.href;
   ```

3. **Apply Styles**:
   ```tsx
   className={cn("base-styles", {
     "active-styles": isActive
   })}
   ```

### Case Sensitivity Rules:

- ✅ URLs **ARE** case-sensitive in web routing
- ✅ File system on macOS is **case-insensitive** by default
- ⚠️ **Must match** exact case in config

## 📚 Related Files

- `src/config/b1niveau.ts` - Navigation config (FIXED)
- `src/app/b1niveau/_components/sidebar-nav.tsx` - Sidebar component
- Actual content files: `src/content/b1niveau/Übungen/**/*.mdx`

## 💡 Lessons Learned

### German Characters in URLs:

- `Ä` → Must use exact case (not `ä`)
- `Ö` → Must use exact case (not `ö`)
- `Ü` → Must use exact case (not `ü`)
- `ß` → Lowercase only (no uppercase equivalent)

### Best Practice:

```typescript
// ✅ GOOD: Match file system case
href: "/b1niveau/Übungen/grammatik";

// ❌ BAD: Different case
href: "/b1niveau/übungen/grammatik";
```

## ✅ Status

**RESOLVED** ✅ - Sidebar active highlighting now works perfectly for all Übungen pages!

---

**Fix date**: 3/10/2025  
**Files changed**: `src/config/b1niveau.ts` (20+ href updates)
**Issue**: Case mismatch in German character Ü  
**Solution**: Update all `/übungen/` → `/Übungen/` in config
