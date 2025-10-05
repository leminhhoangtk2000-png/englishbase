#!/bin/bash

# 🔧 Prisma Studio Quick Start Script

echo "🗄️ Khởi động Prisma Studio..."

# Kill existing process on port 5555
echo "📌 Dọn dẹp port 5555..."
lsof -ti:5555 | xargs kill -9 2>/dev/null || true
sleep 1

# Check Docker
echo "🐳 Kiểm tra Docker..."
if ! docker ps | grep -q "edu-theme-postgres"; then
    echo "❌ PostgreSQL container không chạy!"
    echo "▶️  Chạy: npm run docker:up"
    exit 1
fi

echo "✅ PostgreSQL container OK"

# Check .env
if [ ! -f .env ]; then
    echo "❌ File .env không tồn tại!"
    exit 1
fi

echo "✅ File .env OK"

# Generate Prisma Client
echo "🔄 Generate Prisma Client..."
npx prisma generate

# Start Prisma Studio
echo "🚀 Khởi động Prisma Studio..."
echo "🌐 URL: http://localhost:5555"
echo ""
echo "📝 Để dừng: Ctrl+C"
echo ""

npx prisma studio --port 5555

