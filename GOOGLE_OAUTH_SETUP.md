# Hướng dẫn thiết lập Google OAuth

## 1. Tạo Google Cloud Project

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Bật Google+ API và Google OAuth2 API

## 2. Tạo OAuth 2.0 Client IDs

1. Vào **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Chọn **Web application**
4. Điền thông tin:
   - **Name**: Edu Theme OAuth
   - **Authorized JavaScript origins**:
     - `http://localhost:9003`
     - `https://yourdomain.com` (cho production)
   - **Authorized redirect URIs**:
     - `http://localhost:9003/api/auth/google/callback`
     - `https://yourdomain.com/api/auth/google/callback` (cho production)

## 3. Cập nhật Environment Variables

Thêm vào file `.env`:

```bash
# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
```

## 4. Tính năng hiện tại

### 🔐 Xác thực Gmail

- Chỉ chấp nhận địa chỉ Gmail (@gmail.com)
- Đăng ký và đăng nhập bằng Google OAuth
- Tạo tài khoản tự động khi đăng ký bằng Google

### 🎯 User Experience

- **Đăng nhập**: Modal với tùy chọn Google OAuth và đăng nhập thường
- **Đăng ký**: Trang đăng ký với Google OAuth button
- **Welcome**: Trang chào mừng cho người dùng mới
- **Xác thực email**: Tự động verify email từ Google

### 🚀 Các Route API

- `GET /api/auth/google?action=login` - Khởi tạo đăng nhập Google
- `GET /api/auth/google?action=signup` - Khởi tạo đăng ký Google
- `GET /api/auth/google/callback` - Xử lý callback từ Google

### 💾 Database Schema

Các field mới trong User model:

```prisma
googleId             String?    @unique
provider             String?    @default("local")
emailVerified        DateTime?
isEmailVerified      Boolean    @default(false)
password             String?    // Optional cho OAuth users
```

## 5. Flow đăng nhập/đăng ký

### Đăng ký với Google:

1. User click "Đăng ký với Google"
2. Redirect đến Google OAuth
3. User xác nhận permission
4. Google redirect về `/api/auth/google/callback`
5. Tạo user mới trong database
6. Redirect đến `/welcome?new_user=true`

### Đăng nhập với Google:

1. User click "Đăng nhập với Google"
2. Redirect đến Google OAuth
3. User xác nhận permission
4. Google redirect về `/api/auth/google/callback`
5. Tìm user trong database
6. Redirect đến dashboard

### Validation:

- ✅ Chỉ chấp nhận email Gmail
- ✅ Tự động verify email từ Google
- ✅ Xử lý user đã tồn tại
- ✅ Error handling cho các trường hợp edge cases

## 6. Test

1. Chạy development server: `npm run dev`
2. Truy cập `http://localhost:9003/login`
3. Click "Đăng nhập với Google"
4. Kiểm tra flow OAuth hoạt động

## 7. Security

- ✅ HttpOnly cookies
- ✅ CSRF protection với state parameter
- ✅ Secure redirect validation
- ✅ Gmail domain validation
- ✅ JWT token với expiration
