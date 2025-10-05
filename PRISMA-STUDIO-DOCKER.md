# 🎉 Prisma Studio trong Docker - Đã hoạt động!

## ✅ Cấu hình mới

### 📦 Ports đã thay đổi:

| Service       | Port cũ  | Port mới | URL                   |
| ------------- | -------- | -------- | --------------------- |
| PostgreSQL    | 5556     | **5555** | localhost:5555        |
| Prisma Studio | Không có | **5556** | http://localhost:5556 |
| pgAdmin       | 5050     | 5050     | http://localhost:5050 |

---

## 🚀 Cách sử dụng

### 1. Khởi động tất cả services:

```bash
docker compose up -d
```

### 2. Truy cập Prisma Studio:

**URL:** http://localhost:5556

**Không cần đăng nhập!** Prisma Studio sẽ tự động kết nối với database.

### 3. Dừng services:

```bash
docker compose down
```

---

## 🗂️ Containers đang chạy:

1. **edu-theme-postgres** (PostgreSQL 15)

   - Port: 5555 (external) → 5432 (internal)
   - Database: `edu_theme_db`
   - User: `postgres`
   - Password: `postgres`

2. **edu-theme-prisma-studio** (Prisma Studio)

   - Port: 5556
   - Chạy trong Node.js Alpine container
   - Tự động cài Prisma và khởi động Studio

3. **edu-theme-pgadmin** (pgAdmin)
   - Port: 5050
   - Email: admin@edu-theme.com
   - Password: admin123

---

## 📊 Database Connection Strings

### Từ localhost (Next.js app):

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5555/edu_theme_db?schema=public"
```

### Từ Docker container khác:

```
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/edu_theme_db?schema=public"
```

---

## 🔧 Prisma Commands

### Generate Prisma Client:

```bash
npx prisma generate
```

### Run migrations:

```bash
npx prisma migrate dev
```

### Reset database:

```bash
npx prisma migrate reset
```

### Seed database:

```bash
npx prisma db seed
```

---

## 🐛 Troubleshooting

### Prisma Studio không load?

1. **Kiểm tra logs:**

```bash
docker logs edu-theme-prisma-studio
```

2. **Restart container:**

```bash
docker compose restart prisma-studio
```

3. **Rebuild container:**

```bash
docker compose up -d --build prisma-studio
```

### Database connection error?

1. **Kiểm tra PostgreSQL logs:**

```bash
docker logs edu-theme-postgres
```

2. **Test connection:**

```bash
docker exec -it edu-theme-postgres psql -U postgres -d edu_theme_db -c "SELECT version();"
```

### Port conflict?

Nếu port 5555 hoặc 5556 bị chiếm:

```bash
# Tìm process đang dùng port
lsof -i:5555
lsof -i:5556

# Kill process
kill -9 <PID>

# Hoặc thay đổi port trong docker-compose.yml
```

---

## 💡 Ưu điểm của setup mới

✅ **Prisma Studio chạy ổn định trong Docker** - Không còn lỗi ERR_EMPTY_RESPONSE  
✅ **Port 5555 cho PostgreSQL** - Dễ nhớ hơn 5556  
✅ **Tất cả services trong 1 docker-compose** - Dễ quản lý  
✅ **Auto-restart** - Containers tự động khởi động lại khi Docker start  
✅ **Isolated environment** - Không ảnh hưởng đến Node.js local

---

## 🎯 Quick Commands

```bash
# Start all services
docker compose up -d

# Stop all services
docker compose down

# View all logs
docker compose logs -f

# View Prisma Studio logs only
docker logs -f edu-theme-prisma-studio

# Restart Prisma Studio
docker compose restart prisma-studio

# Open Prisma Studio in browser
open http://localhost:5556

# Access PostgreSQL CLI
docker exec -it edu-theme-postgres psql -U postgres -d edu_theme_db
```

---

## 🔄 Cập nhật schema

Mỗi khi thay đổi `prisma/schema.prisma`:

```bash
# 1. Generate Prisma Client (local)
npx prisma generate

# 2. Restart Prisma Studio để reload schema
docker compose restart prisma-studio

# 3. Đợi 5-10 giây rồi refresh browser
```

---

## 📈 Monitoring

### Kiểm tra resource usage:

```bash
docker stats
```

### Kiểm tra disk usage:

```bash
docker system df
```

### Clean up unused resources:

```bash
docker system prune -a
```

---

## 🎉 Kết luận

**Bạn đã có Prisma Studio chạy ổn định trong Docker!**

- ✅ Không còn bug ERR_EMPTY_RESPONSE
- ✅ Chạy độc lập với macOS/Node.js version
- ✅ Dễ share với team (chỉ cần `docker compose up`)
- ✅ Production-like environment

**URL Prisma Studio:** http://localhost:5556 🚀
