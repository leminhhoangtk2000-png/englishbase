import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUsers() {
    try {
        console.log('🔍 Checking created users...\n')

        const users = await prisma.user.findMany({
            orderBy: { createdAt: 'desc' }
        })

        if (users.length === 0) {
            console.log('❌ No users found in database')
            return
        }

        console.log(`✅ Found ${users.length} users:\n`)

        users.forEach((user, index) => {
            console.log(`${index + 1}. ${user.name || 'No name'}`)
            console.log(`   Email: ${user.email}`)
            console.log(`   Username: ${user.username || 'No username'}`)
            console.log(`   Role: ${user.role}`)
            console.log(`   Premium: ${user.isPremium ? 'Yes' : 'No'}`)
            console.log(`   ID: ${user.id}`)
            console.log(`   Created: ${user.createdAt}`)
            console.log('')
        })

        // Test specific test accounts
        console.log('🧪 Checking test accounts:')
        const testEmails = ['admin@edu-theme.com', 'premium@edu-theme.com', 'user@edu-theme.com']

        for (const email of testEmails) {
            const user = await prisma.user.findUnique({
                where: { email }
            })

            if (user) {
                console.log(`✅ ${email} - ${user.role} (Premium: ${user.isPremium})`)
            } else {
                console.log(`❌ ${email} - Not found`)
            }
        }

    } catch (error) {
        console.error('❌ Error checking users:', error)
    } finally {
        await prisma.$disconnect()
    }
}

checkUsers()
