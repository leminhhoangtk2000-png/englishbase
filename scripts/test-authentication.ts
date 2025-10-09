#!/usr/bin/env tsx
/**
 * Authentication Test Script
 * Kiểm tra toàn diện hệ thống đăng ký và đăng nhập
 */

import { prisma } from '../src/lib/prisma'

const BASE_URL = 'http://localhost:9003'

interface TestResult {
  name: string
  success: boolean
  message: string
  duration: number
}

class AuthenticationTester {
  private results: TestResult[] = []
  
  private async measure<T>(name: string, fn: () => Promise<T>): Promise<T> {
    const start = Date.now()
    try {
      const result = await fn()
      const duration = Date.now() - start
      this.results.push({
        name,
        success: true,
        message: 'Thành công',
        duration
      })
      return result
    } catch (error) {
      const duration = Date.now() - start
      this.results.push({
        name,
        success: false,
        message: error instanceof Error ? error.message : 'Lỗi không xác định',
        duration
      })
      throw error
    }
  }

  async testDatabaseConnection() {
    await this.measure('Kết nối Database', async () => {
      const userCount = await prisma.user.count()
      console.log(`✅ Database kết nối thành công. Có ${userCount} users`)
    })
  }

  async testCreateTestUser() {
    const testUser = {
      email: 'test.auth@gmail.com',
      password: 'Test123456',
      name: 'Test Authentication User',
      username: 'testauth'
    }

    await this.measure('Tạo User Test', async () => {
      // Xóa user test nếu đã tồn tại
      await prisma.user.deleteMany({
        where: { email: testUser.email }
      })

      // Tạo user mới để test
      const hashedPassword = await import('bcryptjs').then(bcrypt => 
        bcrypt.hash(testUser.password, 10)
      )

      const user = await prisma.user.create({
        data: {
          email: testUser.email,
          password: hashedPassword,
          name: testUser.name,
          username: testUser.username,
          role: 'USER',
          isPremium: false
        }
      })

      console.log(`✅ Tạo user test: ${user.email}`)
    })

    return testUser
  }

  async testLoginAPI(email: string, password: string) {
    return await this.measure('API Đăng Nhập', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(`Login failed: ${data.message}`)
      }

      if (!data.success || !data.user) {
        throw new Error('Login response không hợp lệ')
      }

      console.log(`✅ Đăng nhập thành công: ${data.user.email}`)
      
      // Lấy cookie từ response
      const cookies = response.headers.get('set-cookie')
      if (!cookies || !cookies.includes('auth-token')) {
        throw new Error('Không tìm thấy auth-token cookie')
      }

      console.log(`✅ Auth token được set trong cookie`)
      return { user: data.user, cookies }
    })
  }

  async testLoginWrongPassword(email: string) {
    await this.measure('Test Sai Mật Khẩu', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password: 'wrongpassword' }),
      })

      if (response.ok) {
        throw new Error('Login với mật khẩu sai không được reject')
      }

      const data = await response.json()
      if (response.status !== 401) {
        throw new Error(`Expected 401, got ${response.status}`)
      }

      console.log(`✅ Login với mật khẩu sai đã được reject đúng cách`)
    })
  }

  async testAuthMeAPI(cookies: string) {
    return await this.measure('API Kiểm Tra Auth', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/me`, {
        headers: {
          'Cookie': cookies
        }
      })

      if (!response.ok) {
        throw new Error(`Auth check failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.user) {
        throw new Error('Không tìm thấy user trong response')
      }

      console.log(`✅ Auth check thành công: ${data.user.email}`)
      return data.user
    })
  }

  async testAuthMeWithoutToken() {
    await this.measure('Test Auth Không Token', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/me`)

      if (response.ok) {
        throw new Error('Auth check không token không được reject')
      }

      if (response.status !== 401) {
        throw new Error(`Expected 401, got ${response.status}`)
      }

      console.log(`✅ Auth check không token đã được reject đúng cách`)
    })
  }

  async testLogoutAPI(cookies: string) {
    await this.measure('API Đăng Xuất', async () => {
      const response = await fetch(`${BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Cookie': cookies
        }
      })

      if (!response.ok) {
        throw new Error(`Logout failed: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error('Logout response không hợp lệ')
      }

      // Kiểm tra cookie có bị clear không
      const setCookies = response.headers.get('set-cookie')
      if (!setCookies || !setCookies.includes('auth-token=;')) {
        throw new Error('Auth token cookie không được clear')
      }

      console.log(`✅ Đăng xuất thành công và cookie đã được clear`)
    })
  }

  async testProtectedRoute(path: string, cookies?: string) {
    await this.measure(`Protected Route: ${path}`, async () => {
      const headers: Record<string, string> = {}
      if (cookies) {
        headers['Cookie'] = cookies
      }

      const response = await fetch(`${BASE_URL}${path}`, { headers })

      if (cookies) {
        // Với token, route should allow access hoặc return HTML
        if (!response.ok && response.status !== 200) {
          throw new Error(`Protected route failed with token: ${response.status}`)
        }
        console.log(`✅ Protected route ${path} accessible với token`)
      } else {
        // Không có token, should redirect hoặc return 401/403
        if (response.ok) {
          const text = await response.text()
          if (!text.includes('login') && !text.includes('đăng nhập')) {
            throw new Error(`Protected route ${path} accessible without token`)
          }
        }
        console.log(`✅ Protected route ${path} đã redirect khi không có token`)
      }
    })
  }

  async testExistingUsers() {
    await this.measure('Test Users Có Sẵn', async () => {
      const testUsers = [
        { email: 'admin@edu-theme.com', expectedRole: 'ADMIN' },
        { email: 'premium@edu-theme.com', expectedRole: 'USER_PREMIUM' },
        { email: 'user@edu-theme.com', expectedRole: 'USER' },
      ]

      for (const testUser of testUsers) {
        const user = await prisma.user.findUnique({
          where: { email: testUser.email }
        })

        if (!user) {
          console.log(`⚠️ Test user ${testUser.email} không tồn tại`)
          continue
        }

        if (user.role !== testUser.expectedRole) {
          console.log(`⚠️ Test user ${testUser.email} có role ${user.role}, expected ${testUser.expectedRole}`)
          continue
        }

        // Test login với password mặc định
        if (user.password) {
          try {
            const bcrypt = await import('bcryptjs')
            const isValidDefault = await bcrypt.compare('123456', user.password)
            if (isValidDefault) {
              console.log(`✅ Test user ${testUser.email} có thể login với password mặc định`)
            } else {
              console.log(`⚠️ Test user ${testUser.email} không thể login với password mặc định`)
            }
          } catch (error) {
            console.log(`⚠️ Không thể test password cho ${testUser.email}`)
          }
        }
      }
    })
  }

  async cleanupTestData() {
    await this.measure('Cleanup Test Data', async () => {
      await prisma.user.deleteMany({
        where: { 
          email: {
            in: ['test.auth@gmail.com']
          }
        }
      })
      console.log(`✅ Đã xóa test data`)
    })
  }

  printResults() {
    console.log('\n' + '='.repeat(80))
    console.log('📊 KẾT QUẢ TEST AUTHENTICATION')
    console.log('='.repeat(80))

    const successful = this.results.filter(r => r.success)
    const failed = this.results.filter(r => !r.success)

    console.log(`\n✅ Thành công: ${successful.length}/${this.results.length}`)
    console.log(`❌ Thất bại: ${failed.length}/${this.results.length}`)

    if (failed.length > 0) {
      console.log('\n❌ CÁC TEST THẤT BẠI:')
      failed.forEach(result => {
        console.log(`  • ${result.name}: ${result.message}`)
      })
    }

    console.log('\n📈 CHI TIẾT THỜI GIAN:')
    this.results.forEach(result => {
      const status = result.success ? '✅' : '❌'
      console.log(`  ${status} ${result.name}: ${result.duration}ms`)
    })

    const totalTime = this.results.reduce((sum, r) => sum + r.duration, 0)
    console.log(`\n⏱️ Tổng thời gian: ${totalTime}ms`)
    
    console.log('\n' + '='.repeat(80))
  }
}

async function main() {
  console.log('🚀 Bắt đầu test Authentication System...')
  console.log('🌐 Server URL:', BASE_URL)
  
  const tester = new AuthenticationTester()
  
  try {
    // Test database connection
    await tester.testDatabaseConnection()
    
    // Test existing users
    await tester.testExistingUsers()
    
    // Create test user
    const testUser = await tester.testCreateTestUser()
    
    // Test login với thông tin đúng
    const loginResult = await tester.testLoginAPI(testUser.email, testUser.password)
    
    // Test login với mật khẩu sai
    await tester.testLoginWrongPassword(testUser.email)
    
    // Test auth check với token
    await tester.testAuthMeAPI(loginResult.cookies)
    
    // Test auth check không token
    await tester.testAuthMeWithoutToken()
    
    // Test protected routes
    await tester.testProtectedRoute('/dashboard', loginResult.cookies)
    await tester.testProtectedRoute('/admin', loginResult.cookies)
    await tester.testProtectedRoute('/user', loginResult.cookies)
    await tester.testProtectedRoute('/dashboard') // without token
    
    // Test logout
    await tester.testLogoutAPI(loginResult.cookies)
    
    // Test auth sau khi logout
    await tester.testAuthMeWithoutToken()
    
  } catch (error) {
    console.error('❌ Test thất bại:', error)
  } finally {
    // Cleanup
    await tester.cleanupTestData()
    await prisma.$disconnect()
  }
  
  tester.printResults()
}

if (require.main === module) {
  main().catch(console.error)
}
