/**
 * Clean All Exercise Comments
 * 
 * This script deletes ALL exercise comments and likes from the database.
 * Use with caution - this action is IRREVERSIBLE!
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanAllComments() {
  try {
    console.log('🗑️  Starting to clean all exercise comments...\n');

    // Step 1: Delete all comment likes first (foreign key constraint)
    console.log('📌 Step 1: Deleting all comment likes...');
    const deletedLikes = await prisma.exercise_comment_likes.deleteMany({});
    console.log(`✅ Deleted ${deletedLikes.count} comment likes\n`);

    // Step 2: Delete all comments (including replies)
    console.log('📌 Step 2: Deleting all comments...');
    const deletedComments = await prisma.exercise_comments.deleteMany({});
    console.log(`✅ Deleted ${deletedComments.count} comments\n`);

    // Step 3: Verify deletion
    console.log('📌 Step 3: Verifying deletion...');
    const remainingComments = await prisma.exercise_comments.count();
    const remainingLikes = await prisma.exercise_comment_likes.count();

    console.log(`📊 Verification Results:`);
    console.log(`   - Remaining comments: ${remainingComments}`);
    console.log(`   - Remaining likes: ${remainingLikes}\n`);

    if (remainingComments === 0 && remainingLikes === 0) {
      console.log('🎉 SUCCESS! All exercise comments cleaned!\n');
      console.log('📝 Summary:');
      console.log(`   ✅ ${deletedLikes.count} likes deleted`);
      console.log(`   ✅ ${deletedComments.count} comments deleted`);
      console.log(`   ✅ Database is now clean\n`);
    } else {
      console.error('⚠️  WARNING: Some records remain!');
      console.error(`   - Comments: ${remainingComments}`);
      console.error(`   - Likes: ${remainingLikes}\n`);
    }

  } catch (error) {
    console.error('❌ Error cleaning comments:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
cleanAllComments()
  .then(() => {
    console.log('✨ Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Script failed:', error);
    process.exit(1);
  });
