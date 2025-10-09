# 🚀 Production Deployment Guide for deutsch.vn

## 📋 Chuẩn bị Deploy

### 1. Environment Variables cần thay đổi

**File .env cho production:**

```bash
# Database - Production PostgreSQL (cần setup PostgreSQL production)
DATABASE_URL="postgresql://username:password@your-db-host:5432/edu_theme_production"

# URLs - Production domain
NEXTAUTH_URL="https://deutsch.vn"

# Security - Tạo secret keys mới
NEXTAUTH_SECRET="[generate-strong-secret-key]"
JWT_SECRET="[generate-different-jwt-secret]"

# Google OAuth - Same credentials work for both dev/prod
GOOGLE_CLIENT_ID="297488381716-fs8r2cfgut73407843q6tf2f8bum0ljh.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="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"
```

### 2. Google OAuth đã setup sẵn cho production

✅ **Authorized JavaScript origins**: `https://deutsch.vn`
✅ **Authorized redirect URIs**: `https://deutsch.vn/api/auth/google/callback`

### 3. Database Migration

```bash
# On production server
npx prisma migrate deploy
npx prisma generate
npx prisma db seed  # Optional: seed initial data
```

### 4. Build Commands

```bash
# Build production
npm run build

# Start production
npm start
```

## 🔧 Platform-specific Deploy

### Vercel (Recommended)

1. Connect GitHub repo
2. Add environment variables in Vercel dashboard
3. Auto-deploy on push to main branch

### Railway/Render

1. Connect GitHub repo
2. Add environment variables
3. Set build command: `npm run build`
4. Set start command: `npm start`

### VPS/Server

1. Clone repo
2. Install dependencies: `npm install`
3. Create `.env` file with production values
4. Build: `npm run build`
5. Setup PM2: `pm2 start npm --name "deutsch-vn" -- start`

## 🗄️ Database Options

### Option 1: PostgreSQL Cloud

- **Neon** (free tier): https://neon.tech
- **Supabase** (free tier): https://supabase.com
- **Railway PostgreSQL**: https://railway.app

### Option 2: Own PostgreSQL

- Setup PostgreSQL on VPS
- Configure connection string in DATABASE_URL

## 🔐 Security Checklist

- [ ] Generate strong NEXTAUTH_SECRET (32+ characters)
- [ ] Generate strong JWT_SECRET (different from dev)
- [ ] Use production database (not localhost)
- [ ] Verify HTTPS works for deutsch.vn
- [ ] Test Google OAuth with production URLs

## ⚡ Performance

- [ ] Enable production optimizations in Next.js
- [ ] Setup CDN for static assets
- [ ] Configure caching headers
- [ ] Monitor performance with analytics

## 🧪 Pre-deploy Testing

1. Test locally with production build:

   ```bash
   npm run build
   npm start
   ```

2. Test Google OAuth with production URLs (after deploy)

3. Verify all features work:
   - User registration/login
   - Exercise completion
   - Vocabulary search
   - Theme switching

## 📝 Deployment Steps

1. **Prepare production environment variables**
2. **Setup production database**
3. **Deploy to hosting platform**
4. **Run database migrations**
5. **Test all functionality**
6. **Monitor for errors**

Let me know which hosting platform you choose and I can provide specific instructions! 🚀
