#!/usr/bin/env tsx
/**
 * Test Signup Function
 * Test chức năng đăng ký tài khoản mới
 */

const SIGNUP_BASE_URL = 'http://localhost:9003'

async function testSignup() {
  console.log('🚀 Test chức năng đăng ký...')
  
  const testUser = {
    email: 'testsignup@example.com',
    password: 'Test123456',
    name: 'Test Signup User'
  }
  
  try {
    // Test đăng ký
    console.log(`📝 Đăng ký với email: ${testUser.email}`)
    
    const response = await fetch(`${SIGNUP_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      console.log(`✅ Đăng ký thành công!`)
      console.log(`   - User: ${data.user.name}`)
      console.log(`   - Email: ${data.user.email}`)
      console.log(`   - Role: ${data.user.role}`)
      
      // Kiểm tra cookie
      const cookies = response.headers.get('set-cookie')
      if (cookies && cookies.includes('auth-token')) {
        console.log(`   - Cookie: ✅ Auth token được set`)
        
        // Test đăng ký lại cùng email (should fail)
        console.log(`\n🔄 Test đăng ký lại cùng email...`)
        const duplicateResponse = await fetch(`${SIGNUP_BASE_URL}/api/auth/signup`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(testUser),
        })
        
        if (!duplicateResponse.ok) {
          const errorData = await duplicateResponse.json()
          console.log(`✅ Đăng ký duplicate đã được reject: ${errorData.message}`)
        } else {
          console.log(`❌ Đăng ký duplicate không được reject!`)
        }
        
        // Test login với tài khoản vừa tạo
        console.log(`\n🔑 Test đăng nhập với tài khoản vừa tạo...`)
        const loginResponse = await fetch(`${SIGNUP_BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: testUser.email,
            password: testUser.password
          }),
        })
        
        if (loginResponse.ok) {
          const loginData = await loginResponse.json()
          console.log(`✅ Đăng nhập thành công với tài khoản vừa tạo`)
          console.log(`   - User: ${loginData.user.name}`)
        } else {
          console.log(`❌ Không thể đăng nhập với tài khoản vừa tạo`)
        }
        
      } else {
        console.log(`❌ Cookie: Auth token không được set`)
      }
      
      return true
    } else {
      console.log(`❌ Đăng ký thất bại: ${data.message}`)
      return false
    }
  } catch (error) {
    console.log(`❌ Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return false
  }
}

async function cleanupTestUser() {
  console.log(`\n🧹 Cleanup test user...`)
  try {
    const { prisma } = await import('../src/lib/prisma')
    await prisma.user.deleteMany({
      where: { 
        email: 'testsignup@example.com'
      }
    })
    console.log(`✅ Test user đã được xóa`)
    await prisma.$disconnect()
  } catch (error) {
    console.log(`⚠️ Không thể cleanup: ${error}`)
  }
}

async function main() {
  const success = await testSignup()
  await cleanupTestUser()
  
  console.log('\n' + '='.repeat(50))
  if (success) {
    console.log('🎉 Chức năng đăng ký hoạt động bình thường!')
    console.log('💡 Bạn có thể test thủ công tại: http://localhost:9003/signup')
  } else {
    console.log('❌ Có vấn đề với chức năng đăng ký')
  }
}

if (require.main === module) {
  main().catch(console.error)
}
