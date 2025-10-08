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

// ⚠️ PRODUCTION NOTE: This file is for development only
// In production, all user authentication is handled via database
// These temp users are not used when database is available

// Temporary users for development (disabled for production)
export const tempUsers: TempUser[] = [
  // Development users removed for production deployment
  // Only database users are used in production
];

export function findTempUserByEmail(email: string): TempUser | null {
  return tempUsers.find(user => user.email.toLowerCase() === email.toLowerCase()) || null
}

export function findTempUserById(id: string): TempUser | null {
  return tempUsers.find(user => user.id === id) || null
}
