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
    console.log('AuthContext - refreshUser called')
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include', // Important for cookies
      })
      console.log('AuthContext - /api/auth/me response:', response.status, response.ok)
      
      if (response.ok) {
        const data = await response.json()
        console.log('AuthContext - User data from API:', data.user)
        setUser(data.user)
        // Store user in localStorage as backup
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-user', JSON.stringify(data.user))
        }
      } else {
        console.log('AuthContext - API failed, trying localStorage')
        // Try to get user from localStorage
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('auth-user')
          if (storedUser) {
            try {
              const user = JSON.parse(storedUser)
              console.log('AuthContext - User from localStorage:', user)
              setUser(user)
              return
            } catch (e) {
              console.log('AuthContext - localStorage parse error:', e)
              localStorage.removeItem('auth-user')
            }
          }
        }
        setUser(null)
      }
    } catch (error) {
      console.log('AuthContext - refreshUser error:', error)
      // Try to get user from localStorage as fallback
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('auth-user')
        if (storedUser) {
          try {
            const user = JSON.parse(storedUser)
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
    refreshUser().finally(() => {
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
