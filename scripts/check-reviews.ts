/**
 * Script to check all reviews in database
 * Run with: npx tsx scripts/check-reviews.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔍 Checking all reviews in database...\n');
  
  const allReviews = await prisma.review.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          username: true,
          email: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  console.log(`📊 Total reviews in database: ${allReviews.length}\n`);
  
  if (allReviews.length === 0) {
    console.log('❌ No reviews found in database!');
    console.log('\n💡 Possible reasons:');
    console.log('   1. Review was not successfully saved to database');
    console.log('   2. Database connection issue');
    console.log('   3. Review submission had an error\n');
    return;
  }

  allReviews.forEach((review, index) => {
    console.log(`\n${index + 1}. Review ID: ${review.id}`);
    console.log(`   User: ${review.user.name} (@${review.user.username})`);
    console.log(`   Email: ${review.user.email}`);
    console.log(`   Rating: ${'⭐'.repeat(review.rating)} (${review.rating}/5)`);
    console.log(`   Comment: "${review.content}"`);
    console.log(`   Is Public: ${review.isPublic ? '✅' : '❌'}`);
    console.log(`   Is Approved: ${review.isApproved ? '✅' : '❌'}`);
    console.log(`   Created: ${review.createdAt.toLocaleString('vi-VN')}`);
    console.log(`   Updated: ${review.updatedAt.toLocaleString('vi-VN')}`);
    console.log(`   Will display on homepage: ${review.isPublic && review.isApproved ? '✅ YES' : '❌ NO'}`);
  });

  // Summary
  const approved = allReviews.filter(r => r.isApproved).length;
  const public_ = allReviews.filter(r => r.isPublic).length;
  const displayable = allReviews.filter(r => r.isApproved && r.isPublic).length;
  
  console.log('\n\n📊 Summary:');
  console.log(`   Total reviews: ${allReviews.length}`);
  console.log(`   Approved: ${approved}`);
  console.log(`   Public: ${public_}`);
  console.log(`   Will display on homepage: ${displayable}`);
  
  if (displayable === 0 && allReviews.length > 0) {
    console.log('\n⚠️  WARNING: You have reviews but none will display on homepage!');
    console.log('   All reviews need both isPublic=true AND isApproved=true');
  }
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
