# 🧪 Quick Test - Exercise Completion Feature

## 🚀 Start Testing Now!

### Step 1: Open Exercise List

**URL:**

```
http://localhost:9003/exercises/a1
```

**What You Should See:**

- List of exercises với images
- Mỗi exercise card có:
  - Title
  - Description
  - Icon ⭕ hoặc ✅ bên cạnh title
  - Stats (views, comments, rating)

---

### Step 2: Test Icon Toggle on Cards

**Action:**

1. Tìm icon ⭕ (gray circle) bên cạnh exercise title
2. Click vào icon
3. Icon nên chuyển thành ✅ (green checkmark) ngay lập tức
4. Click lại vào ✅
5. Icon quay về ⭕

**Hover Tooltip:**

- Hover vào icon để xem thông tin
- Nội dung: "Click để đánh dấu hoàn thành" hoặc "Đã hoàn thành X lần"

---

### Step 3: Open Exercise Detail Page

**Action:**

1. Click vào bất kỳ exercise card nào (không click vào icon)
2. Exercise page mở ra

**What You Should See:**

- Exercise content/questions
- **Góc dưới bên phải:**
  - Timer card hiển thị: `0:00`
  - Timer bắt đầu đếm: `0:01, 0:02, 0:03...`

---

### Step 4: Test Reading & Completion

**Action:**

1. Đọc exercise content
2. Scroll xuống dưới (≥ 90% trang)
3. Đợi ít nhất 60 giây (1 phút)

**Expected:**

- Sau khi đủ 60s VÀ scroll đủ 90%
- Một card xanh bouncing xuất hiện
- Nội dung: "Đã xem xong bài học?"
- Button: "Đánh dấu hoàn thành"

**Action:** 4. Click button "Đánh dấu hoàn thành"

**Expected:**

- Green card biến mất
- Button ở góc dưới chuyển thành "Đã hoàn thành" (xanh)

---

### Step 5: Verify Persistence

**Action:**

1. Click "Back" hoặc navigate đến `/exercises/a1`
2. Tìm exercise vừa hoàn thành

**Expected:**

- Icon exercise đó đã chuyển thành ✅ xanh
- Hover vào icon → tooltip hiển thị thông tin completion

**Test Persistence:** 3. Refresh trang (F5) 4. Icon vẫn là ✅ xanh

---

## 🎯 Test Scenarios

### Scenario 1: Quick Mark

```
1. Vào list: /exercises/a1
2. Click icon ⭕ trên 3 exercises khác nhau
3. Tất cả icons chuyển ✅
4. Refresh page
5. Tất cả vẫn ✅
```

### Scenario 2: Full Reading Flow

```
1. Vào list: /exercises/a1
2. Thấy exercise với icon ⭕
3. Click vào exercise (không click icon)
4. Thấy timer đếm
5. Scroll xuống + đợi 60s
6. Thấy prompt xanh
7. Click "Đánh dấu hoàn thành"
8. Quay lại list
9. Icon đã ✅
```

### Scenario 3: Toggle On/Off

```
1. Mark exercise as completed (✅)
2. Click ✅ để unmark
3. Icon quay về ⭕
4. Click ⭕ để mark lại
5. Icon chuyển ✅
6. Hover → tooltip hiển thị "attempts: 2"
```

---

## 📸 Screenshots to Check

### Exercise List Page

- [ ] Icons visible bên cạnh titles
- [ ] Icons có màu đúng (gray/green)
- [ ] Hover tooltip works
- [ ] Click toggle works

### Exercise Detail Page

- [ ] Timer visible (bottom-right)
- [ ] Timer đếm đúng (MM:SS)
- [ ] Prompt xuất hiện đúng lúc
- [ ] Button styling correct
- [ ] Completion persists

---

## 🐛 Common Issues

### Issue: Icon không hiển thị

**Check:**

```tsx
// In exercise-level-page.tsx line 328-332
<ExerciseCompletionBadge exerciseId={exercise.slug} variant="icon" />
```

**Solutions:**

- Refresh page
- Check browser console
- Verify exercise.slug exists
- Check API: `curl 'http://localhost:9003/api/exercise-completion?exerciseId=a1/test'`

### Issue: Timer không chạy

**Check:**

- Browser console for errors
- Network tab for API calls
- React DevTools for component state

**Solutions:**

- Clear browser cache
- Check if exerciseId generated correctly
- Verify ExercisePageCompletion mounted

### Issue: Prompt không xuất hiện

**Requirements:**

- Phải scroll ≥ 90% trang
- Phải ở trên page ≥ 60 giây
- Exercise chưa được marked complete

**Check:**

- Scroll đến tận cuối trang
- Đợi đủ thời gian
- Check if already completed

---

## 🔗 Test URLs

### Exercise Lists

```
http://localhost:9003/exercises
http://localhost:9003/exercises/a1
http://localhost:9003/exercises/a2
http://localhost:9003/exercises/b1
http://localhost:9003/exercises/b2
```

### Example Exercise Pages

```
http://localhost:9003/exercises/a1/grammatik/artikel
http://localhost:9003/exercises/a1/grammatik/nomen
http://localhost:9003/exercises/b1/leseverstehen/text-1
```

### API Endpoints

```bash
# GET - Check status
curl 'http://localhost:9003/api/exercise-completion?exerciseId=a1/grammatik/artikel'

# POST - Mark completed
curl -X POST 'http://localhost:9003/api/exercise-completion' \
  -H 'Content-Type: application/json' \
  -d '{"exerciseId":"a1/grammatik/artikel","timeSpent":120}'

# DELETE - Unmark
curl -X DELETE 'http://localhost:9003/api/exercise-completion?exerciseId=a1/grammatik/artikel'
```

---

## ✅ Success Criteria

Feature is working correctly if:

- ✅ Icons visible trên tất cả exercise cards
- ✅ Click icon toggle smooth (⭕ ↔ ✅)
- ✅ Timer đếm chính xác trên detail page
- ✅ Prompt xuất hiện đúng lúc (60s + 90% scroll)
- ✅ Completion button works
- ✅ Data persists sau refresh
- ✅ No console errors
- ✅ Tooltips informative
- ✅ API endpoints respond correctly
- ✅ Database records created

---

## 📊 Check Database

### Using Prisma Studio

```bash
npx prisma studio
```

**Table:** `exercise_completions`

**Columns to Check:**

- `id` - Unique ID
- `userId` - User who completed
- `exerciseId` - Exercise slug (e.g., "a1/grammatik/artikel")
- `completedAt` - Timestamp
- `timeSpent` - Seconds spent
- `attempts` - Number of times completed
- `score` - Optional score

---

## 🎬 Demo Video Checklist

Record screen để demo:

1. [ ] Open /exercises/a1
2. [ ] Show icons on cards
3. [ ] Click icon → toggle ✅
4. [ ] Hover tooltip
5. [ ] Click exercise to open
6. [ ] Show timer counting
7. [ ] Scroll to bottom
8. [ ] Wait for prompt
9. [ ] Click completion button
10. [ ] Go back to list
11. [ ] Show icon is now ✅
12. [ ] Refresh page
13. [ ] Icon still ✅

---

## 📝 Test Report Template

```
Date: _______________
Tester: _______________

✅ Icons visible on cards: [ YES / NO ]
✅ Click toggle works: [ YES / NO ]
✅ Timer counts: [ YES / NO ]
✅ Prompt appears: [ YES / NO ]
✅ Completion saves: [ YES / NO ]
✅ Data persists: [ YES / NO ]

Issues Found:
1. _______________________
2. _______________________
3. _______________________

Browser: _______________________
Screen Size: _______________________
```

---

**Happy Testing! 🎉**

Nếu có vấn đề, check:

- Browser console (F12)
- Network tab
- Server terminal logs
- `EXERCISE_COMPLETION_STATUS.md` for troubleshooting
