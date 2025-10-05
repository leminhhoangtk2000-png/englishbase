/**
 * Script to approve all existing reviews
 * Run with: npx tsx scripts/approve-all-reviews.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking unapproved reviews...');
  
  const unapprovedReviews = await prisma.review.findMany({
    where: { isApproved: false },
    include: {
      user: {
        select: {
          name: true,
          username: true,
        }
      }
    }
  });

  console.log(`\nFound ${unapprovedReviews.length} unapproved reviews:\n`);
  
  unapprovedReviews.forEach((review, index) => {
    console.log(`${index + 1}. User: ${review.user.name} (@${review.user.username})`);
    console.log(`   Rating: ${review.rating} ⭐`);
    console.log(`   Comment: ${review.content.substring(0, 50)}...`);
    console.log(`   Created: ${review.createdAt.toLocaleString('vi-VN')}\n`);
  });

  if (unapprovedReviews.length === 0) {
    console.log('✅ All reviews are already approved!');
    return;
  }

  console.log('✅ Approving all reviews...\n');

  const result = await prisma.review.updateMany({
    where: { isApproved: false },
    data: { isApproved: true }
  });

  console.log(`✅ Successfully approved ${result.count} reviews!`);
  
  // Verify
  const allReviews = await prisma.review.findMany({
    select: {
      rating: true,
      isApproved: true,
      isPublic: true,
    }
  });

  const approved = allReviews.filter(r => r.isApproved).length;
  const public_ = allReviews.filter(r => r.isPublic).length;
  
  console.log('\n📊 Review Statistics:');
  console.log(`   Total reviews: ${allReviews.length}`);
  console.log(`   Approved: ${approved}`);
  console.log(`   Public: ${public_}`);
  console.log(`   Will display on homepage: ${allReviews.filter(r => r.isApproved && r.isPublic).length}`);
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
