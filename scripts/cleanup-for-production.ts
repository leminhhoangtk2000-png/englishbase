import { prisma } from '../src/lib/prisma.js';
import bcrypt from 'bcryptjs';

async function cleanupUsersForProduction() {
  console.log('🧹 Cleaning up test users for production...');
  
  try {
    // 1. Delete all non-admin users
    console.log('🗑️  Deleting test users...');
    const deletedUsers = await prisma.user.deleteMany({
      where: {
        role: {
          in: ['USER', 'USER_PREMIUM']
        }
      }
    });
    console.log(`✅ Deleted ${deletedUsers.count} test users`);

    // 2. Update admin password to something more secure
    console.log('🔐 Updating admin password...');
    const newPassword = 'AdminSecure2025!';
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    
    const updatedAdmin = await prisma.user.updateMany({
      where: {
        role: 'ADMIN'
      },
      data: {
        password: hashedPassword
      }
    });
    console.log(`✅ Updated ${updatedAdmin.count} admin account(s)`);

    // 3. Show remaining users
    console.log('👥 Remaining users:');
    const remainingUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    remainingUsers.forEach(user => {
      console.log(`   - ${user.email} (${user.role}) - Created: ${user.createdAt.toISOString().split('T')[0]}`);
    });

    console.log('');
    console.log('🎉 Production cleanup completed!');
    console.log('📝 Admin credentials:');
    console.log(`   Email: admin@edu-theme.com`);
    console.log(`   Password: ${newPassword}`);
    console.log('');
    console.log('⚠️  IMPORTANT: Change this password after first login!');

  } catch (error) {
    console.error('❌ Error during cleanup:', error);
    throw error;
  }
}

async function main() {
  try {
    await cleanupUsersForProduction();
  } catch (error) {
    console.error('❌ Cleanup failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main();
}

export { cleanupUsersForProduction };
