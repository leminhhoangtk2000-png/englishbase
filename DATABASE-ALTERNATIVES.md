# 🗄️ Database Management - Prisma Studio Issues & Alternatives

## ❌ Vấn đề hiện tại

**Triệu chứng:**

- Prisma Studio báo "is up on http://localhost:5555"
- Nhưng browser hiện "ERR_EMPTY_RESPONSE" / "Trang này không hoạt động"
- curl trả về "Empty reply from server"

**Nguyên nhân có thể:**

1. Prisma Studio crash ngay sau khi start
2. Database connection timeout
3. Port conflict với process khác
4. Prisma version incompatibility

---

## ✅ Giải pháp A: Dùng psql command line

### Quick commands:

```bash
# Connect to database
docker exec -it edu-theme-postgres psql -U postgres -d edu_theme_db

# Trong psql prompt:
# List tables
\dt

# View users
SELECT id, email, name, role FROM users;

# View completions
SELECT "userId", "exerciseId", "completedAt" FROM exercise_completions ORDER BY "completedAt" DESC LIMIT 10;

# View ratings
SELECT "userId", "exerciseId", rating, reason FROM exercise_ratings ORDER BY "createdAt" DESC LIMIT 10;

# Exit
\q
```

### Useful queries:

```sql
-- Count records per table
SELECT COUNT(*) FROM users;
SELECT COUNT(*) FROM exercise_completions;
SELECT COUNT(*) FROM exercise_ratings;
SELECT COUNT(*) FROM exercise_views;

-- Latest completions
SELECT
  u.email,
  ec."exerciseId",
  ec."completedAt",
  ec."timeSpent"
FROM exercise_completions ec
JOIN users u ON u.id = ec."userId"
ORDER BY ec."completedAt" DESC
LIMIT 5;

-- Average ratings per exercise
SELECT
  "exerciseId",
  AVG(rating) as avg_rating,
  COUNT(*) as total_ratings
FROM exercise_ratings
GROUP BY "exerciseId"
ORDER BY avg_rating DESC;

-- User activity
SELECT
  u.email,
  COUNT(DISTINCT ec.id) as completions,
  COUNT(DISTINCT er.id) as ratings,
  COUNT(DISTINCT ev.id) as views
FROM users u
LEFT JOIN exercise_completions ec ON ec."userId" = u.id
LEFT JOIN exercise_ratings er ON er."userId" = u.id
LEFT JOIN exercise_views ev ON ev."userId" = u.id
GROUP BY u.id, u.email;
```

---

## ✅ Giải pháp B: Dùng pgAdmin

**Already running:** http://localhost:5050

**Login credentials:**

- Email: admin@admin.com
- Password: admin

**Connect to server:**

1. Right-click "Servers" → Register → Server
2. General tab:
   - Name: `Edu Theme Local`
3. Connection tab:
   - Host: `edu-theme-postgres` (trong Docker network)
   - Port: `5432` (internal Docker port)
   - Database: `edu_theme_db`
   - Username: `postgres`
   - Password: `postgres`
4. Save

**Hoặc nếu pgAdmin chưa chạy:**

```bash
# Check docker-compose.yml for pgAdmin config
docker-compose up -d pgadmin
```

---

## ✅ Giải pháp C: Dùng VS Code Extension

### 1. Install PostgreSQL Extension

**Extension:** "PostgreSQL" by Chris Kolkman

**Steps:**

1. Cmd+Shift+X → Search "PostgreSQL"
2. Install
3. Cmd+Shift+P → "PostgreSQL: New Query"
4. Connection string:
   ```
   postgresql://postgres:postgres@localhost:5556/edu_theme_db
   ```

### 2. Install Database Client Extension

**Extension:** "Database Client" by Weijan Chen

**Features:**

- Visual tree view of tables
- Query editor with autocomplete
- Data viewer/editor
- ERD diagram

---

## ✅ Giải pháp D: NPM scripts for common tasks

### package.json additions:

```json
{
  "scripts": {
    "db:query": "docker exec -it edu-theme-postgres psql -U postgres -d edu_theme_db",
    "db:tables": "docker exec -it edu-theme-postgres psql -U postgres -d edu_theme_db -c '\\dt'",
    "db:users": "docker exec -it edu-theme-postgres psql -U postgres -d edu_theme_db -c 'SELECT id, email, role FROM users;'",
    "db:completions": "docker exec -it edu-theme-postgres psql -U postgres -d edu_theme_db -c 'SELECT * FROM exercise_completions ORDER BY completedAt DESC LIMIT 10;'",
    "db:ratings": "docker exec -it edu-theme-postgres psql -U postgres -d edu_theme_db -c 'SELECT * FROM exercise_ratings ORDER BY createdAt DESC LIMIT 10;'"
  }
}
```

### Usage:

```bash
# Interactive query mode
npm run db:query

# Quick views
npm run db:tables
npm run db:users
npm run db:completions
npm run db:ratings
```

---

## 🔧 Fix Prisma Studio (Advanced)

### Option 1: Downgrade Prisma

```bash
# Current version: 6.14.0
# Try stable version
npm install prisma@5.20.0 @prisma/client@5.20.0

# Regenerate
npx prisma generate

# Try studio
npx prisma studio
```

### Option 2: Use different port

```bash
# Maybe port 5555 has issues
npx prisma studio --port 5557

# Open
open http://localhost:5557
```

### Option 3: Browser flag

```bash
# Disable browser auto-open
npx prisma studio --browser none

# Then manually open
open http://localhost:5555
```

### Option 4: Check for conflicts

```bash
# See what's on port 5555
lsof -i:5555

# Kill all
killall -9 postgres node prisma

# Clean slate
rm -rf node_modules/.prisma
npx prisma generate
npx prisma studio
```

---

## 📊 Quick Data Inspection Scripts

### Create helper scripts:

**scripts/db-inspect.sh:**

```bash
#!/bin/bash

echo "🗄️ Database Inspection Tool"
echo ""

echo "1. Tables:"
docker exec edu-theme-postgres psql -U postgres -d edu_theme_db -c "\dt" | tail -n +4

echo ""
echo "2. Users:"
docker exec edu-theme-postgres psql -U postgres -d edu_theme_db -c "SELECT id, email, role FROM users;" -t

echo ""
echo "3. Recent Completions:"
docker exec edu-theme-postgres psql -U postgres -d edu_theme_db -c "SELECT \"exerciseId\", \"completedAt\" FROM exercise_completions ORDER BY \"completedAt\" DESC LIMIT 5;" -t

echo ""
echo "4. Ratings Summary:"
docker exec edu-theme-postgres psql -U postgres -d edu_theme_db -c "SELECT \"exerciseId\", AVG(rating)::numeric(3,2) as avg, COUNT(*) as total FROM exercise_ratings GROUP BY \"exerciseId\";" -t
```

```bash
chmod +x scripts/db-inspect.sh
./scripts/db-inspect.sh
```

---

## 🎯 Recommended Workflow (Without Prisma Studio)

### For Development:

1. **Use psql for quick checks:**

   ```bash
   npm run db:query
   ```

2. **Use API endpoints for testing:**

   ```bash
   # Check completions
   curl "http://localhost:9003/api/exercise-completion?exerciseId=a1/Horen/Familie%20und%20Freunde%20Teil%202%20-%20A1" | jq

   # Check ratings
   curl "http://localhost:9003/api/exercise-ratings?exerciseId=a1/Horen/Familie%20und%20Freunde%20Teil%202%20-%20A1" | jq
   ```

3. **Use custom scripts for inspection:**
   ```bash
   ./scripts/db-inspect.sh
   ```

### For Production/Debug:

1. **pgAdmin for visual management**
2. **psql for direct queries**
3. **API endpoints for app-level data**

---

## 📝 Summary

**Prisma Studio Issue:**

- Technical problem preventing web UI from loading
- Not critical for development

**Working Alternatives:**
✅ psql command line (fastest)
✅ pgAdmin web UI (visual)
✅ VS Code extensions (integrated)
✅ Custom npm scripts (convenient)
✅ API endpoints (application-level)

**Action Items:**

1. Use psql for immediate needs
2. Try pgAdmin for visual interface
3. Debug Prisma Studio later (non-blocking)
4. Add helper scripts to package.json

**Current Status:**

- ✅ Database running and accessible
- ✅ Can query via psql
- ✅ APIs working
- ✅ App functional
- ❌ Prisma Studio UI not loading (can work around)

**Next Steps:**

```bash
# Quick access to database
npm run db:query

# Or
docker exec -it edu-theme-postgres psql -U postgres -d edu_theme_db
```

**Not blocking development! 🚀**
