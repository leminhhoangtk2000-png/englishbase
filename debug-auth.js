// Simple debug script để test authentication
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNtZjBmMWYyZDAwMDAxdmF4YmM1d2N0OGsiLCJlbWFpbCI6ImFkbWluQGVkdS10aGVtZS5jb20iLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3NTY2OTI5MzMsImV4cCI6MTc1NzI5NzczM30.OTcTTIgoYn6Gkjmi8mdKh09lZsXGD4F64ETx-tb_bb0';

console.log('🔍 Testing JWT verification...');
console.log('JWT_SECRET:', JWT_SECRET.substring(0, 10) + '...');

try {
  const decoded = jwt.verify(sampleToken, JWT_SECRET);
  console.log('✅ Token valid:', decoded);
  
  // Check expiration
  const now = Math.floor(Date.now() / 1000);
  const exp = decoded.exp;
  console.log('⏰ Current time:', now);
  console.log('⏰ Token expires:', exp);
  console.log('⏰ Time until expiry:', exp - now, 'seconds');
  
  if (exp < now) {
    console.log('❌ Token is EXPIRED!');
  } else {
    console.log('✅ Token is still valid');
  }
  
} catch (error) {
  console.error('❌ Token verification failed:', error.message);
}
