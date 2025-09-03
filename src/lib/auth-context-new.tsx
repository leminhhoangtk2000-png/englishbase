'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AuthUser } from './auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refreshUser = async () => {
    try {
      console.log('🔄 Auth Context: Refreshing user data...')
      const response = await fetch('/api/auth/me', {
        credentials: 'include', // Important for cookies
      })
      console.log('🔄 Auth Context: Response status:', response.status)
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Auth Context: User data received:', data.user?.email)
        setUser(data.user)
        // Store user in localStorage as backup
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-user', JSON.stringify(data.user))
        }
      } else {
        console.log('❌ Auth Context: No user data, checking localStorage...')
        // Try to get user from localStorage
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('auth-user')
          if (storedUser) {
            try {
              const user = JSON.parse(storedUser)
              console.log('📦 Auth Context: Restored user from localStorage:', user.email)
              setUser(user)
              return
            } catch (e) {
              localStorage.removeItem('auth-user')
            }
          }
        }
        setUser(null)
      }
    } catch (error) {
      console.error('❌ Auth Context: Error refreshing user:', error)
      // Try to get user from localStorage as fallback
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('auth-user')
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser)
            console.log('📦 Auth Context: Restored user from localStorage (error fallback):', user.email)
            setUser(user)
            return
          } catch (e) {
            localStorage.removeItem('auth-user')
          }
        }
      }
      setUser(null)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include', // Important for cookies
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        // Store user in localStorage as backup
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-user', JSON.stringify(data.user))
        }
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, error: 'Có lỗi xảy ra khi đăng nhập' }
    }
  }

  const signup = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
        credentials: 'include',
      })

      const data = await response.json()

      if (response.ok) {
        setUser(data.user)
        // Store user in localStorage as backup
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-user', JSON.stringify(data.user))
        }
        return { success: true }
      } else {
        return { success: false, error: data.error }
      }
    } catch (error) {
      console.error('Signup error:', error)
      return { success: false, error: 'Có lỗi xảy ra khi đăng ký' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      setUser(null)
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth-user')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  useEffect(() => {
    console.log('🚀 Auth Context: Component mounted, checking authentication...')
    refreshUser().finally(() => {
      console.log('🏁 Auth Context: Initial auth check complete')
      setLoading(false)
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
