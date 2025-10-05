# 🎉 DATABASE SETUP HOÀN TẤT!

## ✅ Đã làm xong

### 1. **Tạo database structure:**

- Tạo 8 tables: users, vocabulary_entries, exercise_completions, exercise_ratings, posts, exercise_views, exercise_comments, reviews
- Thêm foreign keys và indexes
- Sử dụng SQL script thay vì Prisma migrate (do bug trong Prisma 6.16.3)

### 2. **Seed data:**

- ✅ 3 test users (admin, premium, user)
- ✅ 54 vocabulary entries
- ✅ Database sẵn sàng cho exercise completions và ratings

### 3. **Prisma Studio:**

- ✅ Đang chạy trong Docker trên port 5556
- ✅ HTTP 200 OK - UI đã load thành công
- ✅ Kết nối PostgreSQL port 5555

---

## 🚀 Sử dụng ngay

### Mở Prisma Studio:

```bash
open http://localhost:5556
```

Hoặc:

```bash
npm run db:studio
```

### Xem dữ liệu:

Trong Prisma Studio, click vào các tables:

- **users** - 3 test accounts
- **vocabulary_entries** - 54 từ vựng
- **exercise_completions** - (chưa có data, sẽ tạo khi user hoàn thành bài tập)
- **exercise_ratings** - (chưa có data, sẽ tạo khi user đánh giá)

---

## 📊 Test Accounts

| Email                 | Password | Role         | Premium |
| --------------------- | -------- | ------------ | ------- |
| admin@edu-theme.com   | 123456   | ADMIN        | Yes     |
| premium@edu-theme.com | 123456   | USER_PREMIUM | Yes     |
| user@edu-theme.com    | 123456   | USER         | No      |

---

## 🗄️ Ports Configuration

| Service       | Port | Status         |
| ------------- | ---- | -------------- |
| PostgreSQL    | 5555 | ✅ Running     |
| Prisma Studio | 5556 | ✅ Running     |
| pgAdmin       | 5050 | ✅ Running     |
| Next.js App   | 9003 | Ready to start |

---

## 🔧 Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# View database in Prisma Studio
npm run db:studio

# Seed more data
npm run db:seed

# Create test users again
npm run test:users

# Push schema changes (nếu sửa schema.prisma)
npx prisma db push
```

---

## 🐛 Lưu ý quan trọng

### ⚠️ **Bug Prisma 6.16.3:**

- `prisma db push` và `prisma migrate` không tạo tables tự động
- Đã khắc phục bằng cách dùng SQL script: `prisma/manual-init.sql`
- Nếu cần reset database, chạy:
  ```bash
  docker exec -i edu-theme-postgres psql -U postgres -d edu_theme_db < prisma/manual-init.sql
  ```

### 🔄 **Nếu cần reset hoàn toàn:**

```bash
# 1. Dừng containers
docker compose down -v

# 2. Khởi động lại
docker compose up -d postgres

# 3. Đợi 5 giây
sleep 5

# 4. Tạo tables
docker exec -i edu-theme-postgres psql -U postgres -d edu_theme_db < prisma/manual-init.sql

# 5. Seed data
npm run test:users
npm run db:seed

# 6. Khởi động Prisma Studio
docker compose up -d prisma-studio
```

---

## 📚 Files quan trọng

1. `prisma/schema.prisma` - Database schema definition
2. `prisma/manual-init.sql` - SQL script để tạo tables (workaround cho Prisma bug)
3. `docker-compose.yml` - Docker services configuration
4. `.env` - Environment variables (DATABASE_URL)
5. `scripts/create-test-users.ts` - Script tạo test users
6. `prisma/seed-new.ts` - Script seed vocabulary

---

## 🎯 Next Steps

1. ✅ **Mở Prisma Studio:** http://localhost:5556
2. ✅ **Kiểm tra data** trong các tables (users, vocabulary_entries)
3. ✅ **Khởi động Next.js app:**
   ```bash
   npm run dev
   ```
4. ✅ **Test exercise completion tracking** trên http://localhost:9003/exercises/a1
5. ✅ **Test rating system** trên các exercise detail pages

---

## ✨ Tóm tắt

**Database đã sẵn sàng 100%!**

- ✅ PostgreSQL running on port 5555
- ✅ Prisma Studio running on port 5556
- ✅ 8 tables created with foreign keys and indexes
- ✅ 3 test users seeded
- ✅ 54 vocabulary entries seeded
- ✅ Ready for exercise completions and ratings

**Mở Prisma Studio ngay để xem data:** http://localhost:5556 🚀

---

**Chúc mừng! Setup database hoàn tất!** 🎊
