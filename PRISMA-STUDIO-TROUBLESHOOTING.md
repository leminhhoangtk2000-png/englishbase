# 🔧 Prisma Studio Troubleshooting Guide

## ❌ Lỗi: "Trang này không hoạt động" / ERR_EMPTY_RESPONSE

### 🔍 Nguyên nhân phổ biến:

1. **PostgreSQL container không chạy**
2. **DATABASE_URL sai trong .env**
3. **Port 5556 không accessible**
4. **Prisma Client chưa được generate**
5. **Schema không sync với database**

---

## ✅ Giải pháp từng bước

### Bước 1: Kiểm tra Docker Container

```bash
docker ps | grep postgres
```

**Kết quả mong đợi:**

```
edu-theme-postgres   postgres:15-alpine   Up X hours   0.0.0.0:5556->5432/tcp
```

**Nếu không thấy:**

```bash
# Khởi động Docker containers
npm run docker:up

# Hoặc
docker-compose up -d
```

### Bước 2: Kiểm tra DATABASE_URL

```bash
cat .env | grep DATABASE_URL
```

**Phải là:**

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5556/edu_theme_db?schema=public"
```

**Lưu ý:**

- Port: **5556** (không phải 5432)
- Database: **edu_theme_db** (không phải edu_theme)
- Host: **localhost** (không phải 127.0.0.1)

### Bước 3: Test kết nối Database

```bash
# Test trực tiếp với Docker
docker exec edu-theme-postgres psql -U postgres -d edu_theme_db -c "SELECT 1;"

# Nếu OK, sẽ thấy:
#  ?column?
# ----------
#         1
```

**Nếu lỗi "database does not exist":**

```bash
# List databases
docker exec edu-theme-postgres psql -U postgres -c "\l"

# Tìm database đúng (edu_theme_db)
```

### Bước 4: Regenerate Prisma Client

```bash
# Xóa node_modules/.prisma
rm -rf node_modules/.prisma

# Generate lại
npx prisma generate

# Kết quả:
# ✔ Generated Prisma Client to ./node_modules/@prisma/client
```

### Bước 5: Push Schema (nếu cần)

```bash
npx prisma db push

# Hoặc
npm run db:push
```

### Bước 6: Kill process trên port 5555

```bash
# MacOS/Linux
lsof -ti:5555 | xargs kill -9

# Hoặc
killall -9 prisma
```

### Bước 7: Khởi động Prisma Studio

**Method 1: NPM script**

```bash
npm run db:studio
```

**Method 2: With explicit DATABASE_URL**

```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5556/edu_theme_db?schema=public" npx prisma studio
```

**Method 3: Using bash script**

```bash
./scripts/start-prisma-studio.sh
```

### Bước 8: Verify

```bash
# Check if port 5555 is listening
lsof -i:5555

# Should show:
# node    12345 user   25u  IPv4 0xabcdef      0t0  TCP *:5555 (LISTEN)
```

---

## 🚨 Lỗi cụ thể và cách sửa

### Error: "Cannot connect to database"

**Solution:**

```bash
# 1. Restart Docker
docker restart edu-theme-postgres

# 2. Wait 5 seconds
sleep 5

# 3. Try again
npm run db:studio
```

### Error: "Port 5555 already in use"

**Solution:**

```bash
# Kill existing process
lsof -ti:5555 | xargs kill -9

# Start again
npm run db:studio
```

### Error: "Schema file not found"

**Solution:**

```bash
# Make sure you're in project root
cd /Users/khoavo/Documents/GitHub/deutsch/Edu-theme

# Check schema exists
ls -la prisma/schema.prisma

# Start from correct directory
npm run db:studio
```

### Error: "Empty response / ERR_EMPTY_RESPONSE"

**Causes:**

1. Prisma Studio crashed during startup
2. Database connection timeout
3. .env file not loaded

**Solution:**

```bash
# 1. Kill all prisma processes
killall -9 prisma 2>/dev/null

# 2. Clear port
lsof -ti:5555 | xargs kill -9 2>/dev/null

# 3. Verify Docker
docker ps | grep postgres

# 4. Start with explicit env
DATABASE_URL="postgresql://postgres:postgres@localhost:5556/edu_theme_db?schema=public" npx prisma studio --browser none

# 5. Open manually
open http://localhost:5555
```

---

## 🔄 Complete Reset Procedure

Nếu tất cả cách trên không work, làm complete reset:

```bash
# 1. Stop everything
killall -9 prisma node 2>/dev/null
lsof -ti:5555 | xargs kill -9 2>/dev/null
lsof -ti:9003 | xargs kill -9 2>/dev/null

# 2. Restart Docker
docker-compose down
docker-compose up -d
sleep 5

# 3. Clean Prisma
rm -rf node_modules/.prisma
rm -rf .next

# 4. Regenerate
npx prisma generate

# 5. Push schema
npx prisma db push

# 6. Start Studio
npm run db:studio
```

---

## 📝 Checklist trước khi mở Prisma Studio

- [ ] Docker container `edu-theme-postgres` đang chạy
- [ ] Port 5556 accessible (test with psql)
- [ ] File `.env` có DATABASE_URL đúng
- [ ] Port 5555 không bị chiếm
- [ ] Prisma Client đã được generate
- [ ] Schema valid (`npx prisma validate`)

---

## 💡 Tips

### 1. Always check Docker first

```bash
docker ps | grep postgres
```

### 2. Use npm script for consistency

```bash
npm run db:studio
```

### 3. Check logs if fails

```bash
# Terminal will show error messages
# Look for:
# - Connection refused
# - Database not found
# - Port already in use
```

### 4. Verify DATABASE_URL format

```
postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA
```

**Example:**

```
postgresql://postgres:postgres@localhost:5556/edu_theme_db?schema=public
```

---

## 🎯 Quick Commands

```bash
# Status check
docker ps | grep postgres
lsof -i:5555

# Clean start
lsof -ti:5555 | xargs kill -9; npm run db:studio

# Full reset
killall -9 prisma; docker restart edu-theme-postgres; sleep 5; npm run db:studio

# Test connection
docker exec edu-theme-postgres psql -U postgres -d edu_theme_db -c "SELECT NOW();"
```

---

## 📊 Expected Output

**Successful startup:**

```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Prisma Studio is up on http://localhost:5555
```

**Browser shows:**

- Dark UI with left sidebar
- List of tables: users, exercise_completions, exercise_ratings, etc.
- Click table → see data

---

## 🔗 Related Files

- `.env` - Database connection string
- `prisma/schema.prisma` - Database schema
- `docker-compose.yml` - PostgreSQL configuration
- `package.json` - npm scripts
- `scripts/start-prisma-studio.sh` - Automated startup script

---

## 🆘 Still not working?

1. **Check terminal output** for specific error messages
2. **Verify Docker logs:**
   ```bash
   docker logs edu-theme-postgres | tail -50
   ```
3. **Test manual connection:**
   ```bash
   psql "postgresql://postgres:postgres@localhost:5556/edu_theme_db"
   ```
4. **Check .env.example** for correct format
5. **Ask in GitHub issues** with error logs

---

## ✅ Success Indicators

- [ ] Terminal shows "Prisma Studio is up on http://localhost:5555"
- [ ] Browser opens and loads UI
- [ ] Left sidebar shows all tables
- [ ] Can click tables and see data
- [ ] No errors in browser console
- [ ] Can add/edit/delete records

**If all checked ✅ → Prisma Studio is working!** 🎉
