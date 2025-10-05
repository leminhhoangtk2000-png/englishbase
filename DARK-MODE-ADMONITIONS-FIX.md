# Dark Mode Admonitions Fix

## Problem
Admonitions (:::note, :::tip, :::warning, etc.) had inconsistent styling in dark mode:
- Not using Tailwind's `.dark` class selector
- Colors were not harmonious across different admonition types
- Text contrast was suboptimal in dark theme
- Code blocks inside admonitions had poor visibility

## Solution Applied

### Updated Dark Mode Selectors
Changed from `@media (prefers-color-scheme: dark)` to `.dark` class selector to properly integrate with Tailwind's dark mode system.

### Improved Color Scheme

**Background Colors:**
- Used semi-transparent backgrounds (rgba with 0.1 alpha) for better layering
- Base dark background: `#1e293b` (slate-800)
- Border color: `#334155` (slate-700)

**Type-Specific Colors:**

1. **Note (Blue):**
   - Background: `rgba(59, 130, 246, 0.1)`
   - Border: `#60a5fa`
   - Header: `#93c5fd`
   - Content: `#dbeafe`
   - Code bg: `rgba(59, 130, 246, 0.2)`

2. **Tip (Green):**
   - Background: `rgba(16, 185, 129, 0.1)`
   - Border: `#34d399`
   - Header: `#6ee7b7`
   - Content: `#d1fae5`
   - Code bg: `rgba(16, 185, 129, 0.2)`

3. **Warning (Yellow):**
   - Background: `rgba(245, 158, 11, 0.1)`
   - Border: `#fbbf24`
   - Header: `#fcd34d`
   - Content: `#fef3c7`
   - Code bg: `rgba(245, 158, 11, 0.2)`

4. **Info (Cyan):**
   - Background: `rgba(6, 182, 212, 0.1)`
   - Border: `#22d3ee`
   - Header: `#67e8f9`
   - Content: `#cffafe`
   - Code bg: `rgba(6, 182, 212, 0.2)`

5. **Caution (Orange):**
   - Background: `rgba(234, 88, 12, 0.1)`
   - Border: `#fb923c`
   - Header: `#fdba74`
   - Content: `#ffedd5`
   - Code bg: `rgba(234, 88, 12, 0.2)`

6. **Danger (Red):**
   - Background: `rgba(220, 38, 38, 0.1)`
   - Border: `#f87171`
   - Header: `#fca5a5`
   - Content: `#fee2e2`
   - Code bg: `rgba(220, 38, 38, 0.2)`

### Enhanced Text Readability

- **Strong/Bold text:** Inherits color with proper weight (700)
- **Italic/Em text:** Inherits color with slight transparency (0.9)
- **Links:** Underlined with proper contrast, hover opacity 1
- **Code blocks:** Type-specific background colors for better visibility

### Fallback Support

Kept `@media (prefers-color-scheme: dark)` as fallback for browsers that don't support class-based dark mode.

## Testing

1. Navigate to any page with admonitions (e.g., `/a1niveau/grammatik`)
2. Toggle dark mode using theme switcher
3. Verify all admonition types have:
   - Proper background colors
   - Good text contrast
   - Readable code blocks
   - Consistent border styling

## Files Modified

- `src/styles/admonitions.css` - Complete dark mode rewrite with `.dark` class selectors

## Benefits

✅ Consistent dark mode styling across all admonition types
✅ Better text contrast and readability
✅ Harmonious color scheme that matches overall dark theme
✅ Proper Tailwind dark mode integration
✅ Enhanced code block visibility
✅ Professional, polished appearance
