# 🚀 EDU-THEME STARTUP GUIDE

## Hướng dẫn khởi động dự án ổn định mỗi lần

### 📋 Checklist trước khi bắt đầu

- [ ] Docker Desktop đang chạy (cho PostgreSQL)
- [ ] Node.js v18+ đã được cài đặt
- [ ] Terminal đã mở tại thư mục dự án

---

## 🎯 QUICK START (3 bước)

```bash
# 1. Start database
npm run docker:up

# 2. Start dev server
npm run dev

# 3. Verify everything works
./scripts/verify-ubungen.sh
```

Server sẽ chạy tại: **http://localhost:9003**

---

## 📝 CHI TIẾT CÁC LỆNH

### 1️⃣ Khởi động Database

```bash
npm run docker:up
```

Lệnh này sẽ:

- Start PostgreSQL container on port 5432
- Start pgAdmin on port 5050
- Create database nếu chưa tồn tại

**Kiểm tra**: `docker ps` sẽ show 2 containers đang chạy

### 2️⃣ Khởi động Development Server

```bash
npm run dev
```

Server sẽ start tại port **9003**

**Lưu ý**:

- Không dùng port 3000 (đã có project khác)
- Auto-reload khi file thay đổi
- Hot Module Replacement (HMR) enabled

### 3️⃣ Verify Hệ thống

```bash
./scripts/verify-ubungen.sh
```

Script này kiểm tra:

- ✅ Server đang chạy
- ✅ Không có file page.tsx blocking
- ✅ MDX files tồn tại
- ✅ Components hoạt động đúng

---

## 🔧 TROUBLESHOOTING

### Vấn đề: Page hiển thị "Loading..." mãi

**Nguyên nhân**: Client-side component chưa render

**Giải pháp**:

```bash
# 1. Hard refresh browser
Cmd + Shift + R (Mac) hoặc Ctrl + Shift + R (Windows)

# 2. Nếu vẫn không work, restart server
Cmd + C (stop server)
npm run dev
```

### Vấn đề: Exercises hiển thị dạng text thay vì interactive

**Nguyên nhân**: MDX parsing không hoạt động

**Giải pháp**:

1. Check browser console (F12) xem có errors không
2. Verify file `/src/components/mdx-components-renderer.tsx` tồn tại
3. Restart server

### Vấn đề: Sidebar "On This Page" không hiển thị

**Nguyên nhân**: TOC không detect được headings

**Giải pháp**:

1. Đảm bảo MDX file có headings (##, ###, ####)
2. Check component `/src/components/docs-toc-client.tsx`
3. Reload page sau vài giây (client-side detection)

### Vấn đề: Port 9003 đã được sử dụng

```bash
# Kill process đang dùng port 9003
lsof -ti:9003 | xargs kill -9

# Hoặc đổi port khác
npm run dev -- -p 9004
```

---

## 🎨 CẤU TRÚC DỰ ÁN QUAN TRỌNG

### Files KHÔNG ĐƯỢC XÓA/SỬA:

```
src/
├── components/
│   ├── mdx-components-renderer.tsx  ⭐ Core MDX parsing
│   ├── docs-toc-client.tsx         ⭐ Sidebar TOC
│   └── exercises/
│       ├── exercise-table.tsx      ⭐ Exercise component
│       └── ...
├── app/
│   └── a1niveau/
│       └── [[...slug]]/
│           └── page.tsx            ⭐ Dynamic routing
└── content/
    └── a1niveau/
        └── Übungen/                ⭐ MDX files
            ├── artikel/
            ├── perfekt-ubungen/
            └── ...
```

### Files ĐÃ XÓA (không cần nữa):

❌ `/src/app/a1niveau/Übungen/*/page.tsx` - Blocking MDX routing
❌ `/src/data/teil1-artikel-exercises.ts` - Old data format

---

## ✅ KIỂM TRA HOẠT ĐỘNG ĐÚNG

### 1. Test Exercise Page

Mở: http://localhost:9003/a1niveau/%C3%9Cbungen/artikel/teil-1

**Expected**:

- ✅ Hiển thị interactive fill-in-the-blank inputs
- ✅ Mỗi exercise có 2 input fields
- ✅ Có button "Check Answers"
- ✅ Sidebar "On This Page" hiển thị sections

**NOT expected**:

- ❌ Raw text: `{id: 1, german: "...", correctAnswer: [...]}`
- ❌ "Loading..." forever
- ❌ Console errors

### 2. Test Multiple Pages

```bash
# Artikel pages
http://localhost:9003/a1niveau/%C3%9Cbungen/artikel/teil-1
http://localhost:9003/a1niveau/%C3%9Cbungen/artikel/teil-2

# Perfekt pages
http://localhost:9003/a1niveau/%C3%9Cbungen/perfekt-ubungen/teil1
http://localhost:9003/a1niveau/%C3%9Cbungen/perfekt-ubungen/teil2
```

Tất cả phải load thành công (không có 404)

### 3. Browser Console Check

Press F12 → Console tab

**Expected logs**:

```
[MDX Client] ✅ Extracted attributes: {...}
[parseExercisesArray] 🎯 TOTAL PARSED: 10 exercises
```

**NO errors về**:

- Cannot find module
- Undefined component
- Failed to parse

---

## 🔄 WORKFLOW DEVELOPMENT

### Khi thêm/sửa MDX files:

1. Edit file trong `/src/content/a1niveau/Übungen/`
2. Save file (auto-save sau 1 giây)
3. Browser auto-reload
4. Check results

**KHÔNG CẦN restart server!**

### Khi sửa components:

1. Edit file trong `/src/components/`
2. Save file
3. Server auto-compile
4. Browser auto-reload

**CÓ THỂ cần hard refresh nếu cache issue**

---

## 📚 USEFUL SCRIPTS

```bash
# Database
npm run docker:up          # Start containers
npm run docker:down        # Stop containers
npm run db:studio          # Open Prisma Studio

# Development
npm run dev                # Start dev server
npm run build              # Production build
npm run test:users         # Create test accounts

# Verification
./scripts/verify-ubungen.sh           # Check A1 Übungen
./scripts/audit-ubungen-files.js      # Audit MDX files
./scripts/test-exercise-regex.js      # Test regex parsing
```

---

## 🎯 EXPECTED FINAL STATE

Khi mọi thứ hoạt động đúng:

1. ✅ Server running on port 9003
2. ✅ 35 MDX files trong /Übungen/
3. ✅ 0 blocking page.tsx files
4. ✅ All pages return 200 OK
5. ✅ Exercises render as interactive components
6. ✅ Sidebar TOC shows navigation
7. ✅ No console errors
8. ✅ Browser console shows parsing logs

---

## 💡 PRO TIPS

### Tip 1: Quick Verify

```bash
# One-liner để check mọi thứ OK
curl -I http://localhost:9003/a1niveau/%C3%9Cbungen/artikel/teil-1 && echo "✅ Server OK"
```

### Tip 2: Watch Logs

```bash
# Xem server logs real-time
npm run dev | grep "Übungen"
```

### Tip 3: Clean Restart

```bash
# Full clean restart
lsof -ti:9003 | xargs kill -9
rm -rf .next
npm run dev
```

### Tip 4: Performance Check

```bash
# Check build size
npm run build
# Should complete without errors
```

---

## 🆘 EMERGENCY FIXES

### Nếu MỌI THỨ BỊ HỎNG:

```bash
# 1. Stop everything
lsof -ti:9003 | xargs kill -9
npm run docker:down

# 2. Clean install
rm -rf node_modules .next
npm install

# 3. Restart fresh
npm run docker:up
npm run dev

# 4. Verify
./scripts/verify-ubungen.sh
```

### Restore to working state:

Nếu code bị sửa sai, restore các files quan trọng từ commit này:

```bash
git checkout main -- src/components/mdx-components-renderer.tsx
git checkout main -- src/components/docs-toc-client.tsx
git checkout main -- src/app/a1niveau/[[...slug]]/page.tsx
```

---

## 📞 SUPPORT

Nếu gặp vấn đề:

1. Check TROUBLESHOOTING section ở trên
2. Run verification script: `./scripts/verify-ubungen.sh`
3. Check browser console (F12)
4. Check server terminal logs

**Key files to inspect**:

- `/src/components/mdx-components-renderer.tsx` - Line 600-650 (bracket matching)
- `/src/components/docs-toc-client.tsx` - Line 18-90 (TOC logic)
- `/src/app/a1niveau/[[...slug]]/page.tsx` - Line 230-250 (rendering)

---

**Last Updated**: 3 tháng 10, 2025
**Project**: Edu-theme - German-Vietnamese Learning Platform
**Status**: ✅ STABLE & PRODUCTION READY
