/**
 * Fix URL-encoded exerciseId in exercise_likes table
 * and sync counts to exercises_master
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Same slugify logic as API
function slugifyExerciseId(id: string): string {
  let decoded = id;
  try {
    decoded = decodeURIComponent(id);
  } catch (e) {
    decoded = id
      .replace(/-20/g, ' ')
      .replace(/-2D/g, '-')
      .replace(/-E2-80-93/g, '-');
  }
  
  return decoded
    .toLowerCase()
    .replace(/\//g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fixEncodedIds() {
  console.log('🔍 Finding and fixing problematic exercise IDs...\n');

  // Get all likes
  const allLikes = await prisma.exercise_likes.findMany({
    select: {
      id: true,
      exerciseId: true,
      userId: true,
      isLiked: true
    }
  });

  console.log(`📊 Found ${allLikes.length} like records\n`);

  let fixedCount = 0;
  let deletedCount = 0;
  let alreadyClean = 0;

  for (const like of allLikes) {
    // Try to clean the ID
    const cleanId = slugifyExerciseId(like.exerciseId);
    
    // Check if clean ID exists in exercises_master
    const exerciseExists = await prisma.exercises_master.findUnique({
      where: { slugId: cleanId },
      select: { slugId: true }
    });

    if (exerciseExists) {
      // Exercise exists, update if needed
      if (like.exerciseId !== cleanId) {
        console.log(`🔧 Fixing: ${like.exerciseId}`);
        console.log(`   →  To: ${cleanId}`);
        
        try {
          await prisma.exercise_likes.update({
            where: { id: like.id },
            data: { exerciseId: cleanId }
          });
          fixedCount++;
        } catch (error: any) {
          if (error.code === 'P2002') {
            // Duplicate - delete it
            await prisma.exercise_likes.delete({ where: { id: like.id } });
            console.log(`   ⚠️ Deleted duplicate`);
            deletedCount++;
          } else {
            console.error(`   ❌ Error:`, error.message);
          }
        }
      } else {
        alreadyClean++;
      }
    } else {
      // Exercise doesn't exist - this is orphaned data
      console.log(`🗑️ Deleting orphan: ${like.exerciseId} (not found in exercises_master)`);
      await prisma.exercise_likes.delete({ where: { id: like.id } });
      deletedCount++;
    }
  }

  console.log(`\n✅ Fixed ${fixedCount} encoded IDs`);
  console.log(`🗑️ Deleted ${deletedCount} orphan/duplicate records`);
  console.log(`✅ ${alreadyClean} IDs were already clean\n`);
}

async function syncCountsToMaster() {
  console.log('🔄 Syncing counts to exercises_master...\n');

  const exercises = await prisma.exercises_master.findMany({
    select: { id: true, slugId: true, title: true, likesCount: true }
  });

  let updatedCount = 0;

  for (const exercise of exercises) {
    // Count actual likes
    const actualCount = await prisma.exercise_likes.count({
      where: {
        exerciseId: exercise.slugId,
        isLiked: true
      }
    });

    // Update if different
    if (actualCount !== exercise.likesCount) {
      console.log(`📊 ${exercise.title}`);
      console.log(`   Cached: ${exercise.likesCount} → Actual: ${actualCount}`);
      
      await prisma.exercises_master.update({
        where: { id: exercise.id },
        data: { likesCount: actualCount }
      });
      
      updatedCount++;
    }
  }

  console.log(`\n✅ Updated ${updatedCount} exercises\n`);
}

async function showSummary() {
  console.log('📈 Summary:\n');

  const totalExercises = await prisma.exercises_master.count();
  const totalLikes = await prisma.exercise_likes.count({
    where: { isLiked: true }
  });
  
  const sumLikes = await prisma.exercises_master.aggregate({
    _sum: { likesCount: true }
  });

  console.log(`Total exercises: ${totalExercises}`);
  console.log(`Total likes in exercise_likes: ${totalLikes}`);
  console.log(`Total likes in exercises_master: ${sumLikes._sum.likesCount}`);
  
  if (totalLikes === sumLikes._sum.likesCount) {
    console.log('✅ Counts are in sync!\n');
  } else {
    console.log(`⚠️ Difference: ${totalLikes - (sumLikes._sum.likesCount || 0)}\n`);
  }

  // Show exercises with most likes
  const topLiked = await prisma.exercises_master.findMany({
    where: { likesCount: { gt: 0 } },
    orderBy: { likesCount: 'desc' },
    take: 5,
    select: {
      title: true,
      level: true,
      likesCount: true
    }
  });

  if (topLiked.length > 0) {
    console.log('🏆 Top Liked Exercises:');
    topLiked.forEach((ex, idx) => {
      console.log(`   ${idx + 1}. ${ex.title} (${ex.level}) - ❤️ ${ex.likesCount}`);
    });
  }
}

async function main() {
  try {
    console.log('🚀 Starting fix and sync process...\n');
    
    // Step 1: Fix encoded IDs
    await fixEncodedIds();
    
    // Step 2: Sync counts
    await syncCountsToMaster();
    
    // Step 3: Show summary
    await showSummary();
    
    console.log('\n✨ All done!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
