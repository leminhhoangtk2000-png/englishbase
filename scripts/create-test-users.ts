import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createTestUsers() {
    console.log('🧪 Creating test users...')

    // Hash password "123456"
    const hashedPassword = await bcrypt.hash('123456', 12)

    const testUsers = [
        {
            email: 'admin@edu-theme.com',
            username: 'admin',
            name: 'Admin User',
            password: hashedPassword,
            role: 'ADMIN',
            isPremium: true,
            avatar: null
        },
        {
            email: 'premium@edu-theme.com',
            username: 'premium_user',
            name: 'Premium User',
            password: hashedPassword,
            role: 'USER_PREMIUM',
            isPremium: true,
            avatar: null
        },
        {
            email: 'user@edu-theme.com',
            username: 'regular_user',
            name: 'Regular User',
            password: hashedPassword,
            role: 'USER',
            isPremium: false,
            avatar: null
        }
    ]

    for (const userData of testUsers) {
        try {
            const user = await prisma.user.upsert({
                where: { email: userData.email },
                update: {
                    username: userData.username,
                    name: userData.name,
                    password: userData.password,
                    role: userData.role as any,
                    isPremium: userData.isPremium,
                    avatar: userData.avatar
                },
                create: {
                    email: userData.email,
                    username: userData.username,
                    name: userData.name,
                    password: userData.password,
                    role: userData.role as any,
                    isPremium: userData.isPremium,
                    avatar: userData.avatar
                }
            })

            console.log(`✅ Created/Updated user: ${user.email} (${user.role})`)
        } catch (error) {
            console.error(`❌ Error creating user ${userData.email}:`, error)
        }
    }

    console.log('\n📋 Test User Accounts:')
    console.log('┌─────────────────────────────────────────────────────────────────┐')
    console.log('│                         TEST ACCOUNTS                          │')
    console.log('├─────────────────────────────────────────────────────────────────┤')
    console.log('│ 1. ADMIN USER                                                   │')
    console.log('│    Email: admin@edu-theme.com                                   │')
    console.log('│    Password: 123456                                             │')
    console.log('│    Username: admin                                              │')
    console.log('│    Role: ADMIN                                                  │')
    console.log('│    Premium: Yes                                                 │')
    console.log('│                                                                 │')
    console.log('│ 2. PREMIUM USER                                                 │')
    console.log('│    Email: premium@edu-theme.com                                 │')
    console.log('│    Password: 123456                                             │')
    console.log('│    Username: premium_user                                       │')
    console.log('│    Role: USER_PREMIUM                                           │')
    console.log('│    Premium: Yes                                                 │')
    console.log('│                                                                 │')
    console.log('│ 3. REGULAR USER                                                 │')
    console.log('│    Email: user@edu-theme.com                                    │')
    console.log('│    Password: 123456                                             │')
    console.log('│    Username: regular_user                                       │')
    console.log('│    Role: USER                                                   │')
    console.log('│    Premium: No                                                  │')
    console.log('└─────────────────────────────────────────────────────────────────┘')
    console.log('\n🔗 API Endpoints to test:')
    console.log('• GET /api/users - List all users')
    console.log('• GET /api/users/[id] - Get user details')
    console.log('• GET /api/permissions?userId=[id] - Check user permissions')
    console.log('• GET /api/test-db - Test database connection')
    console.log('\n🌐 Access URLs:')
    console.log('• App: http://localhost:9002')
    console.log('• pgAdmin: http://localhost:5050')
    console.log('• Prisma Studio: npm run db:studio')
}

async function main() {
    try {
        await createTestUsers()
    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    } finally {
        await prisma.$disconnect()
    }
}

main()
