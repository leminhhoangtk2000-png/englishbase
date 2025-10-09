#!/usr/bin/env tsx
/**
 * Simple Login Test
 * Test đăng nhập đơn giản với các test users
 */

const LOGIN_BASE_URL = 'http://localhost:9003'

async function testLogin(email: string, password: string) {
  console.log(`\n🔑 Test đăng nhập: ${email}`)
  
  try {
    const response = await fetch(`${LOGIN_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok && data.success) {
      console.log(`✅ Đăng nhập thành công`)
      console.log(`   - User: ${data.user.name}`)
      console.log(`   - Role: ${data.user.role}`)
      console.log(`   - Premium: ${data.user.isPremium}`)
      
      // Get cookie from response
      const cookies = response.headers.get('set-cookie')
      if (cookies && cookies.includes('auth-token')) {
        console.log(`   - Cookie: ✅ Set thành công`)
        
        // Test auth check
        const authResponse = await fetch(`${LOGIN_BASE_URL}/api/auth/me`, {
          headers: { 'Cookie': cookies }
        })
        
        if (authResponse.ok) {
          console.log(`   - Auth Check: ✅ Thành công`)
        } else {
          console.log(`   - Auth Check: ❌ Thất bại (${authResponse.status})`)
        }
        
      } else {
        console.log(`   - Cookie: ❌ Không được set`)
      }
      
      return true
    } else {
      console.log(`❌ Đăng nhập thất bại: ${data.message}`)
      return false
    }
  } catch (error) {
    console.log(`❌ Lỗi: ${error instanceof Error ? error.message : 'Unknown error'}`)
    return false
  }
}

async function main() {
  console.log('🚀 Test đăng nhập với các test accounts...')
  
  const testAccounts = [
    { email: 'admin@edu-theme.com', password: '123456' },
    { email: 'premium@edu-theme.com', password: '123456' },
    { email: 'user@edu-theme.com', password: '123456' },
    { email: 'wrong@email.com', password: '123456' }, // Should fail
    { email: 'user@edu-theme.com', password: 'wrongpass' }, // Should fail
  ]
  
  let successful = 0
  let total = testAccounts.length - 2 // Trừ 2 test case thất bại
  
  for (const account of testAccounts) {
    const isSuccess = await testLogin(account.email, account.password)
    if (isSuccess && !account.email.includes('wrong') && account.password === '123456') {
      successful++
    }
  }
  
  console.log('\n' + '='.repeat(50))
  console.log(`📊 Kết quả: ${successful}/${total} test accounts hoạt động`)
  
  if (successful === total) {
    console.log('🎉 Tất cả test accounts đều hoạt động bình thường!')
  } else {
    console.log('⚠️ Có vấn đề với một số test accounts')
  }
  
  console.log('\n💡 Để test thủ công, mở trình duyệt và truy cập:')
  console.log(`   🌐 ${LOGIN_BASE_URL}/login`)
  console.log('   📝 Sử dụng các tài khoản ở trên để đăng nhập')
}

if (require.main === module) {
  main().catch(console.error)
}
