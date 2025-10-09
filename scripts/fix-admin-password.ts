#!/usr/bin/env tsx
/**
 * Fix Admin Password
 * Reset password cho admin user
 */

import { prisma } from '../src/lib/prisma'
import bcrypt from 'bcryptjs'

async function fixAdminPassword() {
  console.log('🔧 Đang sửa password cho admin user...')
  
  try {
    // Hash password mới
    const newPassword = '123456'
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    // Update admin user
    const admin = await prisma.user.update({
      where: { email: 'admin@edu-theme.com' },
      data: { password: hashedPassword }
    })
    
    console.log(`✅ Đã cập nhật password cho admin: ${admin.email}`)
    console.log(`📝 Password mới: ${newPassword}`)
    
    // Test password
    const isValidPassword = await bcrypt.compare(newPassword, hashedPassword)
    console.log(`🔍 Test password: ${isValidPassword ? '✅ OK' : '❌ Failed'}`)
    
  } catch (error) {
    console.error('❌ Lỗi:', error)
  } finally {
    await prisma.$disconnect()
  }
}

if (require.main === module) {
  fixAdminPassword().catch(console.error)
}
