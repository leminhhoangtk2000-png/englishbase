# 🧪 Test Accounts Guide

## 📋 Available Test Accounts

Tôi đã tạo 3 tài khoản test với các quyền khác nhau để bạn có thể test đầy đủ chức năng của hệ thống:

### 1. 👑 **ADMIN Account**
```
📧 Email: admin@edu-theme.com
� Password: 123456
�👤 Username: admin
🎭 Role: ADMIN
💎 Premium: Yes
🔑 Permissions: Full system access
```

**Có thể làm gì:**
- ✅ Quản lý tất cả users
- ✅ Tạo, sửa, xóa nội dung
- ✅ Truy cập premium features
- ✅ Xem analytics và thống kê
- ✅ Kiểm duyệt comments
- ✅ Tạo và quản lý exercises
- ✅ Quản lý vocabulary database
- 🎯 **Dashboard**: Chuyển đến `/admin`

### 2. 💎 **PREMIUM USER Account**
```
📧 Email: premium@edu-theme.com
🔑 Password: 123456
👤 Username: premium_user
🎭 Role: USER_PREMIUM
💎 Premium: Yes
🔑 Permissions: Premium features access
```

**Có thể làm gì:**
- ✅ Truy cập tất cả premium content
- ✅ Unlimited vocabulary learning
- ✅ Advanced exercises
- ✅ No ads (khi implement)
- ✅ Priority support
- ❌ Không thể quản lý users khác
- ❌ Không thể quản lý nội dung
- 🎯 **Dashboard**: Chuyển đến `/user-premium`

### 3. 👤 **REGULAR USER Account**
```
📧 Email: user@edu-theme.com
� Password: 123456
�👤 Username: regular_user
🎭 Role: USER
💎 Premium: No
🔑 Permissions: Basic features only
```

**Có thể làm gì:**
- ✅ Học vocabulary cơ bản
- ✅ Làm basic exercises
- ✅ Đọc free content
- ✅ Comment trên bài viết
- ❌ Không truy cập premium content
- ❌ Limited vocabulary access
- ❌ No advanced exercises
- 🎯 **Dashboard**: Chuyển đến `/user`

## 🔗 Test URLs & Endpoints

### 🌐 **Web Pages**
- **Test Dashboard**: http://localhost:9002/test-dashboard
- **Admin Users Management**: http://localhost:9002/admin/users
- **Vocabulary Page**: http://localhost:9002/vocabulary
- **pgAdmin**: http://localhost:5050 (admin@edu-theme.com / admin123)

### 🔌 **API Endpoints**
```bash
# Test database connection
GET /api/test-db

# Get overview and all test data
GET /api/test-overview

# User management
GET /api/users
GET /api/users/[user-id]
PATCH /api/users/[user-id]

# Permission checking
GET /api/permissions?userId=[user-id]

# Vocabulary
GET /api/vocabulary?level=B1&search=der
POST /api/vocabulary
```

## 🧪 **How to Test**

### 1. **Start the application:**
```bash
# Make sure Docker is running
npm run docker:up

# Start development server
npm run dev
# or if port 9002 is busy:
npx next dev --turbopack -p 9003
```

### 2. **Test API endpoints:**
```bash
# Quick test - should show user stats
curl http://localhost:9002/api/test-overview

# Get all users
curl http://localhost:9002/api/users

# Check admin permissions
curl "http://localhost:9002/api/permissions?userId=<admin-user-id>"

# Test vocabulary search
curl "http://localhost:9002/api/vocabulary?level=B1&search=der"
```

### 3. **Test web interface:**
- Visit: http://localhost:9002/test-dashboard
- Check user management: http://localhost:9002/admin/users
- Test vocabulary: http://localhost:9002/vocabulary

### 4. **Database access:**
- **Prisma Studio**: `npm run db:studio` (opens at http://localhost:5555)
- **pgAdmin**: http://localhost:5050
  - Email: admin@edu-theme.com
  - Password: admin123

## 🔄 **Reset Test Data**

Nếu cần reset lại test users:

```bash
# Recreate test users
npm run test:users

# Or reset entire database
npm run db:reset
npm run test:users
```

## 🎯 **Test Scenarios**

### **Scenario 1: Role-based Access**
1. Get user ID từ `/api/users`
2. Check permissions với `/api/permissions?userId=<id>`
3. Verify các permissions khác nhau giữa ADMIN, USER_PREMIUM, USER

### **Scenario 2: User Management (Admin Only)**
1. Login as admin
2. Visit `/admin/users`
3. Try changing user roles
4. Verify permission updates

### **Scenario 3: Premium Content Access**
1. Test với USER account - should be limited
2. Test với USER_PREMIUM account - should have full access
3. Test với ADMIN account - should have full access

### **Scenario 4: Vocabulary System**
1. Search vocabulary với different levels
2. Test pagination
3. Verify role-based access to advanced features

## 🚨 **Troubleshooting**

### Database không connect được:
```bash
# Check Docker containers
docker-compose ps

# Restart containers
npm run docker:down
npm run docker:up

# Check database connection
npm run db:push
```

### Prisma client issues:
```bash
# Regenerate client
npm run db:generate

# Reset and reseed
npm run db:reset
```

### Port conflicts:
```bash
# Check what's using port 9002
lsof -i :9002

# Use different port
npx next dev --turbopack -p 9003
```

---

## 📞 **Support**

Nếu có vấn đề với test accounts hoặc database setup, hãy check:

1. ✅ Docker containers đang chạy: `docker-compose ps`
2. ✅ Database schema updated: `npm run db:push`
3. ✅ Prisma client generated: `npm run db:generate`
4. ✅ Test users created: `npm run test:users`

**Happy Testing! 🚀**
