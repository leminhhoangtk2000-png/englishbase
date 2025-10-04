# 🧪 Test Exercise Routes

## Dev Server Running

✅ http://localhost:9003

---

## 🎯 Test These URLs:

### A1 - Hören (Listening)

```
http://localhost:9003/exercises/a1/Horen/Einkaufen%20teil%201%20-%20A1
```

**Expected:**

- ✅ Breadcrumb navigation (Home → Bài tập → A1 → Horen)
- ✅ Header with level badge (A1) and tags [Nghe]
- ✅ Title: "Lektion 4 - Einkaufen teil 1 - A1"
- ✅ YouTube video embedded (responsive)
- ✅ MultipleChoiceQuiz component working
- ✅ Lueckentext component working
- ✅ Dark theme support
- ✅ Responsive layout

### A1 - Lesen (Reading)

```
http://localhost:9003/exercises/a1/Lesen/Berlin%20%E2%80%93%20Die%20Hauptstadt%20Deutschlands
```

**Expected:**

- ✅ TrueFalseQuiz component working
- ✅ Lueckentext component working
- ✅ Image displayed properly
- ✅ Markdown formatting (bold, lists, etc.)

### A2 - Hören

```
http://localhost:9003/exercises/a2/Horen/%20Wie%20ich%20Deutsch%20gelernt%20habe
```

### B1 - Lesen

```
http://localhost:9003/exercises/b1/Lesen/1.%20LSS%20Nachhaltiger%20Tourismus
```

---

## 📝 What to Check:

### Layout

- [ ] Clean, centered layout (max-w-5xl)
- [ ] White/Dark background cards
- [ ] Proper spacing and padding
- [ ] Breadcrumb navigation works
- [ ] Level badge displays correctly

### Components

- [ ] **MultipleChoiceQuiz** - Radio buttons, submit, results
- [ ] **Lueckentext** - Input fields, check answers, correct/incorrect feedback
- [ ] **TrueFalseQuiz** - Richtig/Falsch buttons, feedback
- [ ] **YouTube iframes** - Responsive, proper aspect ratio
- [ ] **Images** - Rounded corners, proper sizing

### Dark Theme

- [ ] Background changes to dark
- [ ] Text is readable (white/gray-100)
- [ ] Components adapt (dark borders, backgrounds)
- [ ] Buttons have dark variants
- [ ] All text is visible

### Responsive

- [ ] Mobile view (< 768px) - Single column, readable
- [ ] Tablet view (768-1024px) - Proper padding
- [ ] Desktop view (> 1024px) - Optimal width

---

## 🐛 Known Issues to Fix:

1. **File names with spaces** - URLs need encoding
2. **Special characters** (ö, ü, ä, –) in filenames
3. **Navigation** - Need exercise listing page per level
4. **Metadata** - Some exercises missing proper frontmatter

---

## 🔧 Quick Fixes if Needed:

### If components don't render:

```bash
# Check imports in MDX file
cat "src/content/exercises/a1/Horen/Einkaufen teil 1 - A1.mdx" | grep import
```

### If MDX parsing fails:

```bash
# Check for syntax errors
npm run build
```

### If routing doesn't work:

```bash
# Check file exists
ls -la "src/content/exercises/a1/Horen/"
```

---

## ✅ Success Criteria:

Exercise page should:

1. ✅ Load without errors
2. ✅ Display title and description
3. ✅ Render all exercise components
4. ✅ Support dark theme
5. ✅ Be responsive
6. ✅ Have working breadcrumbs
7. ✅ Show proper feedback on answers

---

**Next Steps After Testing:**

1. Fix any routing issues
2. Update all exercise files if needed
3. Create exercise listing pages
4. Add navigation between exercises
5. Improve SEO metadata

---

_Open browser and start testing!_ 🚀
