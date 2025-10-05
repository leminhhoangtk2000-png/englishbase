/**
 * Clean up old test ratings with wrong IDs
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🧹 Cleaning up old ratings with wrong IDs...\n');

  // Delete ratings with old slugified IDs
  const deleted = await prisma.exercise_ratings.deleteMany({
    where: {
      exerciseId: {
        in: [
          'lektion-4-einkaufen-teil-1-a1',
          'lektion-4-einkaufen-teil-2-a1',
          'lektion-3-familie-und-freunde-teil-1-a1'
        ]
      }
    }
  });

  console.log(`✅ Deleted ${deleted.count} old ratings with wrong IDs`);

  // Show remaining ratings
  const remaining = await prisma.exercise_ratings.findMany();

  console.log(`\n📊 Remaining ratings: ${remaining.length}`);
  remaining.forEach((r, i) => {
    console.log(`   ${i + 1}. ${r.exerciseId} - ${'⭐'.repeat(r.rating)}`);
  });

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('Error:', e);
  process.exit(1);
});
