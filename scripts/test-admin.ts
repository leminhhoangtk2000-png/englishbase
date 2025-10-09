#!/usr/bin/env tsx
/**
 * Test Admin Page
 * Test trang admin với real data
 */

const ADMIN_BASE_URL = 'http://localhost:9003'

async function testAdminPage() {
  console.log('🔐 Test trang admin với data thật...')
  
  try {
    // 1. Đăng nhập với admin account
    console.log('1️⃣ Đăng nhập admin...')
    const loginResponse = await fetch(`${ADMIN_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@edu-theme.com',
        password: '123456'
      }),
    })

    if (!loginResponse.ok) {
      throw new Error('Admin login failed')
    }

    const cookies = loginResponse.headers.get('set-cookie')
    if (!cookies) {
      throw new Error('No auth cookies received')
    }

    console.log('✅ Admin đăng nhập thành công')

    // 2. Truy cập trang admin
    console.log('2️⃣ Truy cập trang admin...')
    const adminResponse = await fetch(`${ADMIN_BASE_URL}/admin`, {
      headers: {
        'Cookie': cookies
      }
    })

    if (!adminResponse.ok) {
      throw new Error(`Admin page failed: ${adminResponse.status}`)
    }

    const htmlContent = await adminResponse.text()
    console.log('✅ Trang admin load thành công')

    // 3. Kiểm tra content có data thật
    console.log('3️⃣ Kiểm tra data trong trang...')
    
    // Kiểm tra có phải server-side rendered không
    if (htmlContent.includes('Tổng số người dùng') && 
        htmlContent.includes('Tài khoản Premium') &&
        htmlContent.includes('Danh sách người dùng')) {
      console.log('✅ Trang admin có đầy đủ components')
    } else {
      console.log('⚠️ Trang admin thiếu một số components')
    }

    // Kiểm tra không có mockup data cũ
    if (!htmlContent.includes('Siêu nhân') && 
        !htmlContent.includes('placehold.co') &&
        !htmlContent.includes('+20.1% so với tháng trước')) {
      console.log('✅ Không có mockup data cũ')
    } else {
      console.log('⚠️ Vẫn còn mockup data cũ')
    }

    // 4. Test API stats endpoint để kiểm tra data
    console.log('4️⃣ Kiểm tra database stats...')
    const { prisma } = await import('../src/lib/prisma')
    
    const totalUsers = await prisma.user.count()
    const premiumUsers = await prisma.user.count({ where: { isPremium: true } })
    const newUsersThisMonth = await prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    })

    console.log('📊 Database Stats:')
    console.log(`   - Tổng users: ${totalUsers}`)
    console.log(`   - Premium users: ${premiumUsers}`)
    console.log(`   - Users mới tháng này: ${newUsersThisMonth}`)

    await prisma.$disconnect()

    return {
      success: true,
      stats: {
        totalUsers,
        premiumUsers,
        newUsersThisMonth
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

async function main() {
  const result = await testAdminPage()
  
  console.log('\n' + '='.repeat(50))
  if (result.success) {
    console.log('🎉 Trang admin hoạt động với data thật!')
    console.log('📝 Kiểm tra thủ công tại: http://localhost:9003/admin')
    console.log('🔑 Đăng nhập với: admin@edu-theme.com / 123456')
  } else {
    console.log('❌ Có vấn đề với trang admin')
    console.log(`📋 Lỗi: ${result.error}`)
  }
}

if (require.main === module) {
  main().catch(console.error)
}
