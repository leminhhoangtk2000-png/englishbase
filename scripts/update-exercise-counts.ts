/**
 * Update exercise counts in exercises_master table
 * This script calculates and updates likesCount and viewsCount
 * for all exercises based on their related tables.
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateExerciseCounts() {
  console.log('🔄 Starting exercise counts update...\n');

  try {
    // Get all exercises
    const exercises = await prisma.exercises_master.findMany({
      select: { id: true, slugId: true, title: true }
    });

    console.log(`📊 Found ${exercises.length} exercises to update\n`);

    let updatedCount = 0;

    for (const exercise of exercises) {
      // Count likes (only where isLiked = true)
      const likesCount = await prisma.exercise_likes.count({
        where: {
          exerciseId: exercise.slugId,
          isLiked: true
        }
      });

      // Count views
      const viewsCount = await prisma.exercise_views.count({
        where: {
          exerciseId: exercise.slugId
        }
      });

      // Update exercise with counts
      await prisma.exercises_master.update({
        where: { id: exercise.id },
        data: {
          likesCount,
          viewsCount
        }
      });

      updatedCount++;

      // Log progress for exercises with activity
      if (likesCount > 0 || viewsCount > 0) {
        console.log(
          `✅ ${exercise.title.substring(0, 40)}... | ` +
          `❤️ ${likesCount} | 👁️ ${viewsCount}`
        );
      }
    }

    console.log(`\n✅ Successfully updated ${updatedCount} exercises!`);

    // Show summary statistics
    const stats = await prisma.exercises_master.aggregate({
      _sum: {
        likesCount: true,
        viewsCount: true
      },
      _max: {
        likesCount: true,
        viewsCount: true
      }
    });

    console.log('\n📈 Summary Statistics:');
    console.log(`   Total Likes: ${stats._sum.likesCount || 0}`);
    console.log(`   Total Views: ${stats._sum.viewsCount || 0}`);
    console.log(`   Max Likes per Exercise: ${stats._max.likesCount || 0}`);
    console.log(`   Max Views per Exercise: ${stats._max.viewsCount || 0}`);

    // Show top 5 most liked exercises
    const topLiked = await prisma.exercises_master.findMany({
      where: { likesCount: { gt: 0 } },
      orderBy: { likesCount: 'desc' },
      take: 5,
      select: {
        title: true,
        level: true,
        category: true,
        likesCount: true,
        viewsCount: true
      }
    });

    if (topLiked.length > 0) {
      console.log('\n🏆 Top Liked Exercises:');
      topLiked.forEach((ex, idx) => {
        console.log(
          `   ${idx + 1}. ${ex.title.substring(0, 40)} - ` +
          `${ex.level}/${ex.category} (❤️ ${ex.likesCount})`
        );
      });
    }

  } catch (error) {
    console.error('❌ Error updating exercise counts:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateExerciseCounts()
  .then(() => {
    console.log('\n✨ All done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
