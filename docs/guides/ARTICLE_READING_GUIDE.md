# 📖 Hướng Dẫn Sử Dụng Tính Năng Đánh Dấu Đọc Xong

## 🎯 Tổng Quan

Tính năng giúp bạn theo dõi bài viết nào đã đọc xong trong section "die-neuen".

---

## ✅ Cách Hoạt Động

### 1. **Trên Danh Sách Bài Viết**

- Mỗi bài viết có icon **⭕** (tròn xám) ở góc trên bên phải
- **Chưa đọc:** ⭕ Icon tròn rỗng màu xám
- **Đã đọc:** ✅ Icon tick xanh

### 2. **Đánh Dấu Nhanh**

Click vào icon ⭕ trên card:

- **1 click:** Đánh dấu đã đọc → Icon chuyển ✅ xanh
- **Click lại:** Bỏ đánh dấu → Icon quay lại ⭕ xám

### 3. **Khi Đọc Bài Viết**

Khi bạn click vào bài viết để đọc:

1. **Timer bắt đầu tự động**

   - Góc dưới bên phải hiển thị thời gian đọc
   - Format: MM:SS (ví dụ: 2:30 = 2 phút 30 giây)

2. **Đọc bài viết**

   - Scroll xuống đọc content
   - Timer tiếp tục đếm

3. **Cuối bài viết**

   - Sau khi đọc đủ 30 giây VÀ scroll xuống gần hết bài (90%)
   - Một prompt xanh sẽ bounce xuất hiện
   - Nội dung: "Đã đọc xong bài viết?"
   - Click button "Đánh dấu hoàn thành"

4. **Hoàn thành!**
   - Icon trên card list chuyển thành ✅ xanh
   - Thông tin được lưu vào database
   - Khi quay lại list sẽ thấy icon xanh

---

## 🎨 Giao Diện

### Trên Card List

```
┌─────────────────────────────┐
│ [Image]                     │
│                             │
│ Politik ⭕                  │ <- Icon completion ở đây
│                             │
│ Deutschland führt neue      │
│ Energiepolitik ein          │
│                             │
│ Die Bundesregierung...      │
│                             │
│ 📅 15.02.2024  👁️ 850     │
└─────────────────────────────┘
```

### Trên Article Page

**Góc dưới phải:**

```
┌──────────────┐
│ 🕐 2:30      │  <- Timer
└──────────────┘

Sau khi scroll + đủ thời gian:

┌──────────────────────────┐
│ ✅ Đã đọc xong bài viết? │  <- Prompt
│                          │
│ [Đánh dấu hoàn thành]    │
└──────────────────────────┘
```

---

## 💡 Tips

### Đánh Dấu Thủ Công

Bạn **KHÔNG CẦN** đợi prompt xuất hiện:

- Có thể click icon ⭕ trên card bất cứ lúc nào
- Có thể click button completion ở góc dưới phải bất cứ lúc nào
- Linh hoạt 100%

### Bỏ Đánh Dấu

Nếu đánh dấu nhầm hoặc muốn đọc lại:

- Click lại vào icon ✅ xanh
- Sẽ quay về trạng thái ⭕ chưa đọc

### Đọc Lại

Khi đọc bài đã đánh dấu hoàn thành:

- Icon vẫn là ✅ xanh
- Có thể đánh dấu hoàn thành lại
- Hệ thống track số lần đọc

---

## 📊 Thông Tin Track

Mỗi lần đánh dấu hoàn thành, hệ thống lưu:

1. **Thời điểm hoàn thành** - Ngày giờ đánh dấu
2. **Thời gian đọc** - Số giây spent trên page
3. **Số lần đọc** - Đếm số attempts

Hover vào icon để xem thông tin chi tiết!

---

## 🎯 Tại Sao Cần Tính Năng Này?

### Cho Người Học

- ✅ **Theo dõi tiến độ:** Biết bài nào đã đọc, bài nào chưa
- ✅ **Động lực học:** Visual feedback giúp có động lực
- ✅ **Quản lý thời gian:** Biết mình dành bao nhiêu thời gian đọc
- ✅ **Tránh quên:** Không cần nhớ bài nào đã đọc rồi

### Cho Giáo Viên/Admin

- 📊 Track reading behavior của students
- 📈 Xem bài nào được đọc nhiều nhất
- ⏱️ Monitor thời gian đọc trung bình
- 🎯 Identify bài khó (ít người hoàn thành)

---

## ❓ FAQ

### Q: Icon không xuất hiện?

**A:** Kiểm tra:

- Đã login chưa? (cần test user)
- Refresh lại trang
- Check console log có lỗi không

### Q: Click icon không hoạt động?

**A:**

- Đảm bảo click đúng vào icon (không click vào card)
- Đợi icon load xong (không còn spinner)
- Check network tab có gọi API không

### Q: Prompt không xuất hiện?

**A:**

- Đã scroll xuống ≥ 90% bài chưa?
- Đã ở trên page ≥ 30 giây chưa?
- Bài đã được đánh dấu hoàn thành rồi?

### Q: Timer không đếm?

**A:**

- Refresh lại trang
- Check browser console
- Đảm bảo JavaScript không bị block

### Q: Muốn reset hết completion?

**A:** Hiện tại cần xóa trong database:

```sql
DELETE FROM article_completions WHERE userId = 'your-user-id';
```

---

## 🚀 Demo Flow

### Scenario: Đọc bài lần đầu

1. Vào http://localhost:9003/die-neuen
2. Thấy list articles, mỗi bài có icon ⭕
3. Click vào bài "Deutschland führt neue Energiepolitik ein"
4. Timer bắt đầu đếm ở góc dưới phải: 0:01, 0:02, 0:03...
5. Scroll xuống đọc bài
6. Sau ~30 giây + scroll gần hết, prompt xanh xuất hiện
7. Click "Đánh dấu hoàn thành"
8. Quay lại list → Icon đã chuyển ✅ xanh
9. Hover vào icon → Tooltip hiển thị thông tin

### Scenario: Toggle quick

1. Vào list articles
2. Thấy bài chưa đọc (icon ⭕)
3. Click trực tiếp vào icon
4. Icon chuyển ✅ xanh ngay lập tức
5. Click lại → quay về ⭕

---

## 📝 Notes

- Tính năng này **tương tự** với exercise completion
- Code reusable, có thể áp dụng cho blog posts
- Đang dùng test user: `user@edu-theme.com`
- Sau này sẽ integrate với real authentication

---

**Cập nhật lần cuối:** 5/10/2025  
**Trạng thái:** ✅ Production Ready  
**Liên hệ:** Nếu có vấn đề, check `ARTICLE_COMPLETION_SYSTEM.md`
