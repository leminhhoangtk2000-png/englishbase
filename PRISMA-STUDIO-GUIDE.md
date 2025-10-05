# 🗄️ Prisma Studio - Database Management

## ✅ Prisma Studio đã chạy!

**URL:** http://localhost:5555

## 🚀 Cách khởi động

### Lệnh nhanh:

```bash
cd /Users/khoavo/Documents/GitHub/deutsch/Edu-theme
npx prisma studio
```

### Hoặc dùng npm script (nếu có):

```bash
npm run db:studio
```

## 🔍 Xem dữ liệu

### Tables quan trọng:

#### 1. **users** - Người dùng

- `id`, `email`, `name`, `role`
- Test accounts: admin@edu-theme.com, user@edu-theme.com

#### 2. **exercise_completions** - Hoàn thành bài tập

- `userId`, `exerciseId`, `completedAt`, `timeSpent`
- Tracking: icon ⭕ → ✅

#### 3. **exercise_ratings** - Đánh giá sao

- `userId`, `exerciseId`, `rating` (1-5), `reason`
- Average rating hiển thị trên cards

#### 4. **exercise_views** - Lượt xem

- `userId`, `exerciseId`, `viewedAt`
- Stats: 👁️ views count

#### 5. **exercise_comments** - Bình luận

- `userId`, `exerciseId`, `content`, `createdAt`
- Comments system

#### 6. **vocabulary_entries** - Từ vựng

- German-Vietnamese vocabulary database

## 🧪 Query Examples trong Prisma Studio

### Tìm completions của user:

1. Click table **exercise_completions**
2. Filter: `userId` = `cmf3wfn7m0002bm5kgb1zg7dk`
3. Thấy tất cả bài đã hoàn thành

### Xem ratings của bài tập:

1. Click table **exercise_ratings**
2. Filter: `exerciseId` contains `Familie`
3. Thấy tất cả ratings cho bài đó

### Kiểm tra test users:

1. Click table **users**
2. Thấy 3 accounts:
   - admin@edu-theme.com (ADMIN)
   - premium@edu-theme.com (USER_PREMIUM)
   - user@edu-theme.com (USER)

## 📝 Thao tác trong Prisma Studio

### Xem data:

- Click vào table name bên trái
- Browse data với pagination
- Filter, sort, search

### Thêm record:

- Click **Add record** button
- Điền thông tin
- Save

### Sửa record:

- Click vào row
- Edit fields
- Save changes

### Xóa record:

- Click checkbox bên trái row
- Click **Delete** button
- Confirm

## 🔧 Troubleshooting

### Port 5555 đã bị chiếm:

```bash
# Kill process trên port 5555
lsof -ti:5555 | xargs kill -9

# Khởi động lại
npx prisma studio
```

### Không connect được database:

```bash
# Kiểm tra Docker container
docker ps | grep postgres

# Khởi động lại Docker containers
npm run docker:up
```

### Schema thay đổi:

```bash
# Push schema changes
npm run db:push

# Regenerate Prisma Client
npx prisma generate

# Khởi động lại Studio
npx prisma studio
```

## 🎯 Use Cases

### 1. Debug completion system:

- Vào **exercise_completions** table
- Check exerciseId format
- Verify userId matches
- Confirm completedAt timestamp

### 2. Verify ratings:

- Vào **exercise_ratings** table
- Check average calculation
- View user feedback (reason field)
- Test rating updates

### 3. Monitor user activity:

- Vào **exercise_views** table
- Count views per exercise
- Track viewing patterns
- Popular exercises

### 4. Manage comments:

- Vào **exercise_comments** table
- Moderate content
- Delete spam
- View engagement

## 📊 Current Data (Example)

### exercise_completions:

```
exerciseId: a1/Horen/Familie und Freunde Teil 2 - A1
userId: cmf3wfn7m0002bm5kgb1zg7dk
completedAt: 2025-10-05 04:57:47
timeSpent: 35
attempts: 1
```

### exercise_ratings:

```
exerciseId: a1/Horen/Familie und Freunde Teil 2 - A1
userId: cmf3wfn7m0002bm5kgb1zg7dk
rating: 5
reason: "Bài tập rất hay và dễ hiểu!"
```

## 🌐 Access URLs

- **Prisma Studio:** http://localhost:5555
- **Next.js Dev:** http://localhost:9003
- **pgAdmin:** http://localhost:5050 (nếu có)

## 🔐 Database Connection

**From .env file:**

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5556/edu_theme_db"
```

**Connection details:**

- Host: localhost
- Port: 5556 (Docker mapped port)
- User: postgres
- Password: postgres
- Database: edu_theme_db

## 💡 Tips

1. **Keep Studio open** khi develop để monitor real-time changes
2. **Refresh table** (F5) sau khi API calls
3. **Use filters** để tìm data nhanh
4. **Copy record IDs** để dùng trong tests
5. **Export data** (nếu cần backup)

## 🎉 Prisma Studio Features

- ✅ Visual database browser
- ✅ CRUD operations với UI đẹp
- ✅ Auto-refresh
- ✅ Relationship navigation
- ✅ Filter & search
- ✅ Data validation
- ✅ Real-time updates
- ✅ Dark mode support

**Giờ bạn có thể quản lý database dễ dàng qua UI!** 🚀
