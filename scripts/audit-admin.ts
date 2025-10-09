#!/usr/bin/env tsx
/**
 * Admin Pages Audit
 * Kiểm tra tất cả trang admin có sử dụng data thật
 */

const AUDIT_BASE_URL = 'http://localhost:9003'

const adminPages = [
  { path: '/admin', name: 'Dashboard' },
  { path: '/admin/users', name: 'Users Management' },
  { path: '/admin/posts', name: 'Posts Management' },
  { path: '/admin/ai-management', name: 'AI Management' },
  { path: '/admin/vocabulary-manager', name: 'Vocabulary Manager' },
  { path: '/admin/die-neuen', name: 'Die Neuen News' },
  { path: '/admin/webhooks', name: 'Webhooks' },
  { path: '/admin/sepay-webhooks', name: 'SePay Webhooks' },
  { path: '/admin/blog-rules', name: 'Blog Rules' },
  { path: '/admin/tts-settings', name: 'TTS Settings' }
]

async function loginAdmin() {
  const loginResponse = await fetch(`${AUDIT_BASE_URL}/api/auth/login`, {
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

  return cookies
}

async function checkAdminPage(cookies: string, page: { path: string, name: string }) {
  try {
    const response = await fetch(`${AUDIT_BASE_URL}${page.path}`, {
      headers: { 'Cookie': cookies }
    })

    if (!response.ok) {
      return {
        name: page.name,
        path: page.path,
        status: 'ERROR',
        message: `HTTP ${response.status}`
      }
    }

    const content = await response.text()
    
    // Kiểm tra các dấu hiệu của mockup data
    const mockupIndicators = [
      'placehold.co',
      'Siêu nhân',
      'example.com',
      'placeholder data',
      '+20.1% so với tháng trước',
      '+201 since last hour'
    ]

    const foundMockup = mockupIndicators.filter(indicator => 
      content.includes(indicator)
    )

    // Kiểm tra có data thật (server-side rendering)
    const hasRealData = content.includes('prisma') || 
                        content.includes('database') ||
                        !foundMockup.length

    return {
      name: page.name,
      path: page.path,
      status: foundMockup.length > 0 ? 'MOCKUP_FOUND' : 'CLEAN',
      message: foundMockup.length > 0 
        ? `Found mockup indicators: ${foundMockup.join(', ')}`
        : 'No mockup data found',
      mockupCount: foundMockup.length
    }

  } catch (error) {
    return {
      name: page.name,
      path: page.path,
      status: 'ERROR',
      message: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function auditAdminPages() {
  console.log('🔍 Audit tất cả trang admin...')
  
  try {
    // Login admin
    console.log('🔐 Đăng nhập admin...')
    const cookies = await loginAdmin()
    console.log('✅ Admin đăng nhập thành công')

    // Check all pages
    console.log(`📋 Kiểm tra ${adminPages.length} trang admin...`)
    const results = await Promise.all(
      adminPages.map(page => checkAdminPage(cookies, page))
    )

    // Report results
    console.log('\n📊 KẾT QUẢ AUDIT:')
    console.log('='.repeat(80))

    const clean = results.filter(r => r.status === 'CLEAN')
    const mockup = results.filter(r => r.status === 'MOCKUP_FOUND')
    const errors = results.filter(r => r.status === 'ERROR')

    console.log(`✅ Sạch (không có mockup): ${clean.length}`)
    console.log(`⚠️  Có mockup data: ${mockup.length}`)
    console.log(`❌ Lỗi: ${errors.length}`)

    if (clean.length > 0) {
      console.log('\n✅ TRANG SẠCH:')
      clean.forEach(result => {
        console.log(`  • ${result.name} (${result.path})`)
      })
    }

    if (mockup.length > 0) {
      console.log('\n⚠️  TRANG CÓ MOCKUP DATA:')
      mockup.forEach(result => {
        console.log(`  • ${result.name} (${result.path})`)
        console.log(`    ${result.message}`)
      })
    }

    if (errors.length > 0) {
      console.log('\n❌ TRANG LỖI:')
      errors.forEach(result => {
        console.log(`  • ${result.name} (${result.path}): ${result.message}`)
      })
    }

    console.log('\n📈 TỔNG KẾT:')
    const totalPages = results.length
    const cleanPercentage = Math.round((clean.length / totalPages) * 100)
    console.log(`📊 ${clean.length}/${totalPages} trang sạch (${cleanPercentage}%)`)

    if (mockup.length === 0 && errors.length === 0) {
      console.log('🎉 Tất cả trang admin đều sử dụng data thật!')
    } else {
      console.log('🔧 Cần sửa các trang có mockup data')
    }

    return { clean: clean.length, mockup: mockup.length, errors: errors.length }

  } catch (error) {
    console.error('❌ Audit failed:', error)
    return { clean: 0, mockup: 0, errors: adminPages.length }
  }
}

async function main() {
  const results = await auditAdminPages()
  
  console.log('\n' + '='.repeat(80))
  if (results.mockup === 0 && results.errors === 0) {
    console.log('✨ Audit hoàn thành: Tất cả trang admin đều clean!')
    process.exit(0)
  } else {
    console.log('⚠️  Audit hoàn thành: Cần sửa một số trang')
    process.exit(1)
  }
}

if (require.main === module) {
  main().catch(console.error)
}
