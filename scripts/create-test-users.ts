#!/usr/bin/env tsx
/**
 * Create Test Users Script
 * Tạo các user test cho development
 */

import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

interface TestUser {
  email: string
  password: string
  name: string
  username: string
  role: 'ADMIN' | 'USER_PREMIUM' | 'USER'
  isPremium: boolean
}

const testUsers: TestUser[] = [
  {
    email: 'admin@edu-theme.com',
    password: '123456',
    name: 'Admin User',
    username: 'admin',
    role: 'ADMIN',
    isPremium: true
  },
  {
    email: 'premium@edu-theme.com',
    password: '123456',
    name: 'Premium User',
    username: 'premium',
    role: 'USER_PREMIUM',
    isPremium: true
  },
  {
    email: 'user@edu-theme.com',
    password: '123456',
    name: 'Regular User',
    username: 'user',
    role: 'USER',
    isPremium: false
  }
]

async function createTestUsers() {
  console.log('🚀 Tạo test users...')

  for (const userData of testUsers) {
    try {
      // Kiểm tra user đã tồn tại chưa
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      })

      if (existingUser) {
        console.log(`⚠️ User ${userData.email} đã tồn tại, bỏ qua...`)
        continue
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10)

      // Tạo user
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          password: hashedPassword,
          name: userData.name,
          username: userData.username,
          role: userData.role,
          isPremium: userData.isPremium
        }
      })

      console.log(`✅ Đã tạo user: ${user.email} (${user.role})`)

    } catch (error) {
      console.error(`❌ Lỗi tạo user ${userData.email}:`, error)
    }
  }

  console.log('\n📋 THÔNG TIN ĐĂNG NHẬP TEST:')
  console.log('================================')
  testUsers.forEach(user => {
    console.log(`${user.role.padEnd(12)} | ${user.email.padEnd(25)} | ${user.password}`)
  })
  console.log('================================')

  await prisma.$disconnect()
}

if (require.main === module) {
  createTestUsers().catch(console.error)
}
