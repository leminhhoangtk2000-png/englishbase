/**
 * Manual test script to create a review directly in database
 * This bypasses the API to test database connectivity
 * Run with: npx tsx scripts/create-test-review.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking for users...\n');
  
  // Get first user
  const user = await prisma.user.findFirst({
    select: {
      id: true,
      name: true,
      email: true,
      username: true,
    }
  });

  if (!user) {
    console.log('❌ No users found in database!');
    console.log('   Please create a user account first.\n');
    return;
  }

  console.log('✅ Found user:');
  console.log(`   Name: ${user.name}`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Username: ${user.username}\n`);

  // Check if user already has a review
  const existingReview = await prisma.review.findFirst({
    where: { userId: user.id }
  });

  if (existingReview) {
    console.log('⚠️  User already has a review:');
    console.log(`   Rating: ${'⭐'.repeat(existingReview.rating)}`);
    console.log(`   Comment: "${existingReview.content}"`);
    console.log(`   Is Public: ${existingReview.isPublic ? '✅' : '❌'}`);
    console.log(`   Is Approved: ${existingReview.isApproved ? '✅' : '❌'}\n`);
    
    console.log('Do you want to update it? (The script will continue anyway)\n');
  }

  // Create test review
  console.log('📝 Creating test review...\n');
  
  const nextAllowedDate = new Date();
  nextAllowedDate.setFullYear(nextAllowedDate.getFullYear() + 1);

  const review = await prisma.review.upsert({
    where: {
      // Use userId as unique identifier by finding first
      id: existingReview?.id || 'new-review'
    },
    update: {
      rating: 5,
      content: 'Nền tảng học tiếng Đức tuyệt vời! Giao diện thân thiện, nội dung chất lượng, và đội ngũ hỗ trợ nhiệt tình. Tôi đã cải thiện nhiều kỹ năng tiếng Đức nhờ Deutsch.vn. Rất recommend! 🎉',
      isPublic: true,
      isApproved: true,
      nextAllowedDate,
      updatedAt: new Date(),
    },
    create: {
      userId: user.id,
      rating: 5,
      content: 'Nền tảng học tiếng Đức tuyệt vời! Giao diện thân thiện, nội dung chất lượng, và đội ngũ hỗ trợ nhiệt tình. Tôi đã cải thiện nhiều kỹ năng tiếng Đức nhờ Deutsch.vn. Rất recommend! 🎉',
      isPublic: true,
      isApproved: true,
      nextAllowedDate,
    },
    include: {
      user: {
        select: {
          name: true,
          username: true,
        }
      }
    }
  });

  console.log('✅ Review created/updated successfully!\n');
  console.log('Review details:');
  console.log(`   ID: ${review.id}`);
  console.log(`   User: ${review.user.name} (@${review.user.username})`);
  console.log(`   Rating: ${'⭐'.repeat(review.rating)} (${review.rating}/5)`);
  console.log(`   Comment: "${review.content}"`);
  console.log(`   Is Public: ${review.isPublic ? '✅ YES' : '❌ NO'}`);
  console.log(`   Is Approved: ${review.isApproved ? '✅ YES' : '❌ NO'}`);
  console.log(`   Will display on homepage: ${review.isPublic && review.isApproved ? '✅ YES' : '❌ NO'}`);
  console.log(`   Created: ${review.createdAt.toLocaleString('vi-VN')}\n`);

  // Verify it can be fetched by API query
  const displayableReviews = await prisma.review.findMany({
    where: {
      isPublic: true,
      isApproved: true,
    },
    include: {
      user: {
        select: {
          name: true,
          username: true,
        }
      }
    },
    take: 6,
  });

  console.log(`\n📊 Total reviews that will display on homepage: ${displayableReviews.length}`);
  displayableReviews.forEach((r, i) => {
    console.log(`   ${i + 1}. ${r.user.name} - ${'⭐'.repeat(r.rating)}`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
