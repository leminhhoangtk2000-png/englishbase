# Exercise Completion Debug Guide

## 🔴 Vấn đề hiện tại

Khi đánh dấu hoàn thành bài học:

- ✅ Component hiển thị OK
- ✅ API được gọi
- ❌ **Không lưu vào database** (0 rows trong exercise_completions)
- ❌ **Badge không update** trên list page

## 🔍 Nguyên nhân

**BẠN CHƯA LOGIN!**

Khi chưa login:

```typescript
const currentUser = await getCurrentUser(); // Returns null
if (!currentUser) {
  return NextResponse.json({ completed: false }); // GET returns false
  // hoặc
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 }); // POST fails
}
```

## ✅ Giải pháp

### Bước 1: Login vào hệ thống

1. Mở browser: http://localhost:9003/login
2. Đăng nhập với một trong các tài khoản test:

**Admin Account:**

- Email: `admin@edu-theme.com`
- Password: `admin123`

**Premium Account:**

- Email: `premium@edu-theme.com`
- Password: `premium123`

**Regular User:**

- Email: `user@edu-theme.com`
- Password: `user123`

### Bước 2: Test completion

Sau khi login:

1. Vào trang exercises: http://localhost:9003/exercises/a1
2. Click vào bất kỳ bài tập nào
3. Ô đánh dấu xuất hiện ngay (màu xanh lá)
4. Click "Đánh dấu hoàn thành" hoặc đợi 45 giây
5. Quay lại list page → Icon sẽ đổi từ ⭕ thành ✅

### Bước 3: Verify trong database

```bash
docker exec -it edu-theme-postgres psql -U postgres -d edu_theme_db -c "SELECT \"userId\", \"exerciseId\", \"completedAt\" FROM exercise_completions ORDER BY \"completedAt\" DESC LIMIT 5;"
```

Bạn sẽ thấy dữ liệu mới được insert!

## 🧪 Debug Commands

### Kiểm tra authentication status

```bash
# Open browser console (F12) và chạy:
document.cookie
# Phải thấy: "auth-token=..."
```

### Kiểm tra API với auth

```bash
# Trong browser console, sau khi login:
fetch('/api/exercise-completion?exerciseId=test').then(r => r.json()).then(console.log)
```

### Kiểm tra database

```bash
# Users
docker exec -it edu-theme-postgres psql -U postgres -d edu_theme_db -c "SELECT id, email FROM users;"

# Completions
docker exec -it edu-theme-postgres psql -U postgres -d edu_theme_db -c "SELECT * FROM exercise_completions;"
```

## 🎯 Expected Flow

1. **User clicks completion button**
   → Component calls `markCompleted()`
2. **Hook sends POST request**
   → `/api/exercise-completion` with exerciseId
3. **API checks authentication**
   → `getCurrentUser()` reads cookie
4. **If authenticated:**
   → Insert/update in `exercise_completions` table
   → Return `{ success: true, completion: {...} }`
5. **Hook updates local state**
   → `setCompletion({ completed: true, ... })`
6. **Badge component re-renders**
   → Shows ✅ instead of ⭕

## 🚨 Common Issues

### Issue 1: "completed: false" luôn luôn

**Cause:** Chưa login
**Solution:** Login tại /login

### Issue 2: "Unauthorized" error

**Cause:** Cookie expired hoặc invalid
**Solution:** Login lại

### Issue 3: Badge không update sau khi complete

**Cause:** Badge component không re-fetch data
**Solution:** Reload page hoặc navigate back

### Issue 4: Database trống (0 rows)

**Cause:** API không lưu vì không có user
**Solution:** Login trước khi test

## 📝 Test Checklist

- [ ] Login với account test
- [ ] Verify cookie tồn tại (F12 → Application → Cookies)
- [ ] Vào exercise detail page
- [ ] Click completion button
- [ ] Check browser console (không có error)
- [ ] Check database có row mới
- [ ] Quay lại list page
- [ ] Verify icon đổi thành ✅

## 🔧 Development Tips

Nếu muốn **skip authentication** để test nhanh:

```typescript
// Tạm thời modify src/app/api/exercise-completion/route.ts
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    // TEMPORARY: Use test user if not authenticated
    const userId = currentUser?.id || 'cmf3wfn7m0002bm5kgb1zg7dk'; // user@edu-theme.com

    const body = await request.json();
    const { exerciseId, timeSpent, score } = body;

    const completion = await prisma.exercise_completions.upsert({
      where: {
        userId_exerciseId: {
          userId, // Use fallback user
          exerciseId
        }
      },
      // ... rest of code
    });
  }
}
```

⚠️ **Chỉ dùng cho development, KHÔNG commit code này!**
