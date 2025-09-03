// Debug utility để check authentication state
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';

export function AuthDebugger() {
  const { user, loading } = useAuth();

  useEffect(() => {
    console.log('🐛 Auth Debugger: Mounted');
    console.log('🐛 Auth Debugger: Loading:', loading);
    console.log('🐛 Auth Debugger: User:', user);
    
    // Check document cookies
    console.log('🍪 Document cookies:', document.cookie);
    
    // Check if auth-token exists in cookies
    const authToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('auth-token='))
      ?.split('=')[1];
    
    console.log('🍪 Auth token from document.cookie:', authToken ? 'exists' : 'not found');
    if (authToken) {
      console.log('🍪 Auth token preview:', authToken.substring(0, 20) + '...');
    }
    
    // Test fetch to /api/auth/me
    const testAuthAPI = async () => {
      try {
        console.log('🧪 Testing /api/auth/me...');
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        });
        console.log('🧪 Response status:', response.status);
        const data = await response.json();
        console.log('🧪 Response data:', data);
      } catch (error) {
        console.error('🧪 API test failed:', error);
      }
    };
    
    if (!loading) {
      testAuthAPI();
    }
  }, [user, loading]);

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      right: 0,
      background: 'rgba(0,0,0,0.8)',
      color: 'white',
      padding: '10px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '300px'
    }}>
      <div>🐛 Auth Debug</div>
      <div>Loading: {loading ? 'Yes' : 'No'}</div>
      <div>User: {user ? user.email : 'None'}</div>
      <div>Check console for details</div>
    </div>
  );
}
