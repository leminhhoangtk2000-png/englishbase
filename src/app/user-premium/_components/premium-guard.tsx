'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  role: string;
}

export function PremiumGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/auth/me');
        
        if (!response.ok) {
          // User not authenticated
          router.push('/login');
          return;
        }
        
        const userData = await response.json();
        
        // Check if user has premium or admin role
        if (userData.role !== 'USER_PREMIUM' && userData.role !== 'ADMIN') {
          // User doesn't have premium permission
          router.push('/user');
          return;
        }
        
        setUser(userData);
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user || (user.role !== 'USER_PREMIUM' && user.role !== 'ADMIN')) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
