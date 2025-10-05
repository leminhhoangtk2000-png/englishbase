# 🎯 Quick Test Guide - Article Completion

## 🚀 Start Testing Now!

### 1. Open Browser

```
http://localhost:9003/die-neuen
```

### 2. What You'll See

**Article List:**

- Mỗi article card có icon ⭕ ở góc trên bên phải
- Icon màu xám = chưa đọc
- Icon xanh ✅ = đã đọc

### 3. Test Quick Toggle

**On Article Card:**

1. Click vào icon ⭕
2. → Icon chuyển thành ✅ xanh ngay lập tức
3. Click lại vào ✅
4. → Icon quay về ⭕ xám

**Hover Tooltip:**

- Hover vào icon để xem thông tin
- "Click để đánh dấu hoàn thành" hoặc "Đã hoàn thành X lần"

### 4. Test Full Reading Flow

**Click vào bài viết:**

1. URL: `http://localhost:9003/die-neuen/1`
2. Góc dưới bên phải xuất hiện timer: `0:00`
3. Timer bắt đầu đếm: `0:01, 0:02, 0:03...`

**Scroll xuống đọc:** 4. Scroll xuống cuối bài (≥ 90%) 5. Đợi ít nhất 30 giây

**Completion Prompt:** 6. Sau 30s + scroll 90%, một card xanh bouncing xuất hiện 7. Nội dung: "Đã đọc xong bài viết?" 8. Button: "Đánh dấu hoàn thành"

**Mark Complete:** 9. Click button "Đánh dấu hoàn thành" 10. Card xanh biến mất 11. Button chuyển thành "Đã hoàn thành" màu xanh

**Verify:** 12. Quay lại `/die-neuen` 13. Icon bài vừa đọc đã chuyển thành ✅ xanh 14. Hover vào để xem thời gian hoàn thành

### 5. Test Different Articles

**Articles Available:**

- `/die-neuen/1` - Deutschland führt neue Energiepolitik ein
- `/die-neuen/2` - Künstliche Intelligenz revolutioniert...
- `/die-neuen/3` - Bildung der Zukunft...
- `/die-neuen/4` - Deutsche Wirtschaft wächst...

---

## 🧪 API Testing

### Test via cURL

**Check status:**

```bash
curl 'http://localhost:9003/api/article-completion?articleId=1'
```

**Mark completed:**

```bash
curl -X POST 'http://localhost:9003/api/article-completion' \
  -H 'Content-Type: application/json' \
  -d '{"articleId":"1","timeSpent":180}'
```

**Unmark:**

```bash
curl -X DELETE 'http://localhost:9003/api/article-completion?articleId=1'
```

### Run Test Script

```bash
./scripts/test-article-completion.sh
```

---

## ✅ Expected Behavior

### On First Visit

- All icons are ⭕ (empty circle, gray)
- No articles marked as completed

### After Click Icon

- Icon immediately changes to ✅ (green)
- No page reload needed
- Persistent after refresh

### On Article Page

- Timer starts automatically
- Shows format MM:SS (e.g., 2:30)
- Updates every second

### After Reading (30s + 90% scroll)

- Green bouncing card appears
- Contains "Đã đọc xong bài viết?" message
- Has "Đánh dấu hoàn thành" button

### After Marking Complete

- Prompt disappears
- Button shows "Đã hoàn thành" (green)
- Icon on card list is ✅ green
- Data saved to database

### On Revisit

- Icon still ✅ green
- Can click to unmark
- Tooltip shows completion info

---

## 🐛 Troubleshooting

### Icon không hiển thị

- Check browser console for errors
- Verify API is running: `curl http://localhost:9003/api/article-completion?articleId=1`
- Check database: `npx prisma studio`

### Click không hoạt động

- Đảm bảo click đúng vào icon (stop event propagation)
- Check network tab trong DevTools
- Xem API response

### Timer không đếm

- Check browser console
- Verify component mounted
- Look for JavaScript errors

### Prompt không xuất hiện

- Đợi đủ 30 giây
- Scroll xuống ≥ 90% trang
- Bài đã được mark complete rồi?

---

## 📱 Mobile Testing

Test trên mobile/tablet:

1. Responsive design
2. Touch events
3. Scroll detection
4. Fixed positioning

---

## 🎨 Visual Inspection

### Check These Elements:

**Article Card:**

- [ ] Icon positioned correctly (top-right)
- [ ] Icon size appropriate (w-5 h-5)
- [ ] Colors correct (gray/green)
- [ ] Hover effect works
- [ ] Click doesn't trigger card link

**Article Page:**

- [ ] Timer positioned (fixed bottom-right)
- [ ] Timer visible while scrolling
- [ ] Timer format correct (MM:SS)
- [ ] Prompt animation smooth
- [ ] Prompt positioned correctly
- [ ] Button styling correct

**Tooltips:**

- [ ] Show on hover
- [ ] Correct content
- [ ] Positioned well
- [ ] Readable text

---

## 📊 Test Scenarios

### Scenario 1: New User

1. No articles marked
2. Click icon → mark complete
3. Refresh → still marked
4. Navigate away → come back → still marked

### Scenario 2: Quick Mark

1. List view
2. Click icon on multiple articles
3. All icons turn green
4. No errors in console

### Scenario 3: Full Reading

1. Open article
2. Wait 30+ seconds
3. Scroll to bottom
4. See prompt
5. Click button
6. Verify completion

### Scenario 4: Toggle

1. Mark as complete
2. Unmark
3. Mark again
4. Check attempts count increases

### Scenario 5: Multiple Articles

1. Mark article 1 complete
2. Mark article 2 complete
3. Go back to list
4. Both show ✅
5. Unmark article 1
6. Article 2 still ✅

---

## 🎯 Success Criteria

Feature is working if:

- ✅ All icons visible on cards
- ✅ Click toggle works smoothly
- ✅ Timer counts correctly
- ✅ Prompt appears at right time
- ✅ Completion persists
- ✅ No console errors
- ✅ API endpoints work
- ✅ Database records created
- ✅ UI responsive
- ✅ Tooltips informative

---

## 📸 Screenshots

Take screenshots of:

1. Article list with icons
2. Hover tooltip
3. Timer on article page
4. Completion prompt
5. Completed button state
6. List after completion

---

## 🔗 Useful Links

- **Test Pages:**

  - List: http://localhost:9003/die-neuen
  - Article 1: http://localhost:9003/die-neuen/1
  - Article 2: http://localhost:9003/die-neuen/2

- **API Endpoints:**

  - GET: http://localhost:9003/api/article-completion?articleId=1
  - POST: http://localhost:9003/api/article-completion
  - DELETE: http://localhost:9003/api/article-completion?articleId=1

- **Database:**

  - Studio: `npx prisma studio`
  - Table: `article_completions`

- **Documentation:**
  - Technical: `docs/implementation/ARTICLE_COMPLETION_SYSTEM.md`
  - User Guide: `docs/guides/ARTICLE_READING_GUIDE.md`
  - Summary: `ARTICLE_COMPLETION_IMPLEMENTATION.md`

---

**Happy Testing! 🎉**

If you find any issues, check the logs:

```bash
# Browser console
# Network tab
# Server terminal output
```
