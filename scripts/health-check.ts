#!/usr/bin/env tsx
/**
 * Quick Server Health Check
 * Kiểm tra nhanh trạng thái server và authentication
 */

const BASE_URL = 'http://localhost:9003'

interface HealthCheckResult {
  endpoint: string
  status: 'OK' | 'ERROR'
  responseTime: number
  details: string
}

async function checkEndpoint(path: string, method: string = 'GET', body?: any): Promise<HealthCheckResult> {
  const url = `${BASE_URL}${path}`
  const start = Date.now()
  
  try {
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    
    if (body) {
      options.body = JSON.stringify(body)
    }
    
    const response = await fetch(url, options)
    const responseTime = Date.now() - start
    
    return {
      endpoint: path,
      status: 'OK',
      responseTime,
      details: `${response.status} ${response.statusText}`
    }
  } catch (error) {
    return {
      endpoint: path,
      status: 'ERROR',
      responseTime: Date.now() - start,
      details: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

async function quickHealthCheck() {
  console.log('🏥 Kiểm tra sức khỏe server...')
  console.log('🌐 Server URL:', BASE_URL)
  
  const checks = [
    checkEndpoint('/'),
    checkEndpoint('/api/auth/me'),
    checkEndpoint('/api/test-overview'),
    checkEndpoint('/login'),
    checkEndpoint('/dashboard'),
    checkEndpoint('/admin'),
    checkEndpoint('/api/auth/login', 'POST', { email: 'test', password: 'test' })
  ]
  
  const results = await Promise.all(checks)
  
  console.log('\n📊 KẾT QUẢ KIỂM TRA:')
  console.log('='.repeat(80))
  
  results.forEach(result => {
    const statusIcon = result.status === 'OK' ? '✅' : '❌'
    const endpoint = result.endpoint.padEnd(25)
    const time = `${result.responseTime}ms`.padEnd(8)
    console.log(`${statusIcon} ${endpoint} | ${time} | ${result.details}`)
  })
  
  const healthy = results.filter(r => r.status === 'OK').length
  const total = results.length
  
  console.log('='.repeat(80))
  console.log(`📈 Tổng kết: ${healthy}/${total} endpoints hoạt động bình thường`)
  
  if (healthy === total) {
    console.log('🎉 Server đang hoạt động tốt!')
  } else {
    console.log('⚠️ Có vấn đề với server, kiểm tra logs!')
  }
  
  return healthy === total
}

if (require.main === module) {
  quickHealthCheck()
    .then(isHealthy => {
      process.exit(isHealthy ? 0 : 1)
    })
    .catch(error => {
      console.error('❌ Health check failed:', error)
      process.exit(1)
    })
}
