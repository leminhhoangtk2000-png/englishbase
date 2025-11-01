import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Configure logging based on environment
const logConfig = process.env.NODE_ENV === 'production' 
  ? ['error', 'warn'] // Only log errors and warnings in production
  : ['query', 'error', 'warn']; // Log queries in development for debugging

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: logConfig as any,
    // Error formatting for better debugging
    errorFormat: process.env.NODE_ENV === 'production' ? 'minimal' : 'pretty',
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
