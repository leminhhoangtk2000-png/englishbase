# 🎯 pgAdmin Setup Guide - Thay thế Prisma Studio

## ✅ pgAdmin đã được khởi động!

pgAdmin là công cụ quản lý PostgreSQL **mạnh mẽ hơn và ổn định hơn Prisma Studio**.

---

## 🔐 Thông tin đăng nhập

**URL:** http://localhost:5050

**Login credentials:**

- Email: `admin@edu-theme.com`
- Password: `admin123`

---

## 📦 Kết nối Database lần đầu

Sau khi đăng nhập vào pgAdmin, làm theo các bước:

### 1. Thêm Server mới

1. Click chuột phải vào **"Servers"** → **"Register"** → **"Server..."**

2. Tab **"General":**

   - Name: `Edu Theme DB`

3. Tab **"Connection":**

   - Host: `postgres` (hoặc `host.docker.internal` trên macOS)
   - Port: `5432`
   - Maintenance database: `edu_theme_db`
   - Username: `postgres`
   - Password: `postgres`
   - ✅ Check "Save password"

4. Click **"Save"**

---

## 🗂️ Xem dữ liệu

Sau khi kết nối thành công:

1. Mở rộng: **Servers** → **Edu Theme DB** → **Databases** → **edu_theme_db** → **Schemas** → **public** → **Tables**

2. Xem dữ liệu bảng:
   - Chuột phải vào tên bảng (vd: `users`)
   - Chọn **"View/Edit Data"** → **"All Rows"**

---

## 🔍 Các bảng quan trọng

| Bảng                   | Mô tả                 | Số dòng hiện tại |
| ---------------------- | --------------------- | ---------------- |
| `users`                | Người dùng            | 3                |
| `exercise_completions` | Bài tập đã hoàn thành | 4                |
| `exercise_ratings`     | Đánh giá bài tập      | 14               |
| `vocabulary_entries`   | Từ vựng               | 92+              |
| `posts`                | Bài viết blog         | -                |

---

## 💡 Ưu điểm của pgAdmin

✅ **Ổn định hơn Prisma Studio** - Không bị lỗi ERR_EMPTY_RESPONSE  
✅ **Nhiều tính năng hơn** - Query editor, backup/restore, user management  
✅ **Chạy trong Docker** - Không phụ thuộc vào macOS/Node.js  
✅ **Giao diện chuyên nghiệp** - Phù hợp cho production database

---

## 🚀 Quick Commands

```bash
# Start pgAdmin
docker compose up -d pgadmin

# Stop pgAdmin
docker compose stop pgadmin

# View pgAdmin logs
docker logs edu-theme-pgadmin

# Restart pgAdmin
docker compose restart pgadmin
```

---

## 📊 Thay thế hoàn toàn Prisma Studio

### Cách 1: pgAdmin (Giao diện đẹp)

```bash
# Mở pgAdmin
open http://localhost:5050
```

### Cách 2: db-query.sh (Command line nhanh)

```bash
# Xem statistics
./scripts/db-query.sh stats

# Xem users
./scripts/db-query.sh users

# Chế độ interactive
./scripts/db-query.sh interactive
```

### Cách 3: psql trực tiếp

```bash
docker exec -it edu-theme-postgres psql -U postgres -d edu_theme_db
```

---

## ⚠️ Lưu ý

- **Host connection từ Docker:** Dùng `postgres` (tên service)
- **Host connection từ macOS:** Dùng `localhost:5556`
- pgAdmin chạy trên **port 5050**, không conflict với Prisma Studio
- Credentials đã được lưu trong `docker-compose.yml`

---

## 🐛 Troubleshooting

### Không kết nối được database?

**Lỗi:** "could not connect to server"

**Giải pháp 1:** Thử host khác

- Thay `postgres` bằng `host.docker.internal` (macOS/Windows)
- Hoặc dùng `172.17.0.1` (Linux)

**Giải pháp 2:** Kiểm tra network

```bash
docker network ls
docker network inspect edu-network
```

**Giải pháp 3:** Restart containers

```bash
docker compose restart postgres pgadmin
```

---

## 🎉 Kết luận

**pgAdmin > Prisma Studio** vì:

- ✅ Không bị bug ERR_EMPTY_RESPONSE
- ✅ Chạy ổn định trong Docker
- ✅ Nhiều tính năng hơn (query editor, backup, v.v.)
- ✅ Phù hợp cho cả development và production

**Không cần Prisma Studio nữa!** 🚀
