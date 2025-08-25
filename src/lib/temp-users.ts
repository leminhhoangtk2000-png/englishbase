// Temporary in-memory user store for development when database is not available
export interface TempUser {
  id: string
  email: string
  password: string
  name: string | null
  username: string | null
  role: 'ADMIN' | 'USER_PREMIUM' | 'USER'
  isPremium: boolean
  avatar: string | null
}

// Temporary users for development
export const tempUsers: TempUser[] = [
  {
    id: 'admin-001',
    email: 'admin@edu-theme.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeU/UY3E2wOsYkVB2', // 123456
    name: 'Admin User',
    username: 'admin',
    role: 'ADMIN',
    isPremium: true,
    avatar: null
  },
  {
    id: 'premium-001',
    email: 'premium@edu-theme.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeU/UY3E2wOsYkVB2', // 123456
    name: 'Premium User',
    username: 'premium_user',
    role: 'USER_PREMIUM',
    isPremium: true,
    avatar: null
  },
  {
    id: 'user-001',
    email: 'user@edu-theme.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LeU/UY3E2wOsYkVB2', // 123456
    name: 'Regular User',
    username: 'regular_user',
    role: 'USER',
    isPremium: false,
    avatar: null
  }
]

export function findTempUserByEmail(email: string): TempUser | null {
  return tempUsers.find(user => user.email.toLowerCase() === email.toLowerCase()) || null
}

export function findTempUserById(id: string): TempUser | null {
  return tempUsers.find(user => user.id === id) || null
}
