/**
 * Create multiple test ratings from different users
 * To demonstrate average rating calculation
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎯 Creating multiple test ratings...\n');

  // Get all users
  const users = await prisma.user.findMany({
    take: 3, // Get up to 3 users
    select: { id: true, name: true, email: true }
  });

  if (users.length === 0) {
    console.log('❌ No users found! Please create users first.');
    return;
  }

  console.log(`✅ Found ${users.length} users:\n`);
  users.forEach((u, i) => console.log(`   ${i + 1}. ${u.name} (${u.email})`));
  console.log('');

  // Test exercises with various ratings
  const testData = [
    {
      exerciseId: 'Horen/Einkaufen teil 1 - A1',
      title: 'Lektion 4 - Einkaufen teil 1',
      ratings: [5, 4, 5] // Different ratings from 3 users
    },
    {
      exerciseId: 'Horen/Einkaufen teil 2 - A1',
      title: 'Lektion 4 - Einkaufen teil 2',
      ratings: [5, 5, 4] // Different ratings from 3 users
    },
    {
      exerciseId: 'Horen/Familie und Freunde Teil 1 - A1',
      title: 'Lektion 3 - Familie und Freunde Teil 1',
      ratings: [4, 5, 3] // Different ratings from 3 users
    }
  ];

  for (const data of testData) {
    console.log(`📝 Creating ratings for: ${data.title}`);
    console.log(`   Exercise ID: ${data.exerciseId}`);

    for (let i = 0; i < Math.min(users.length, data.ratings.length); i++) {
      const user = users[i];
      const rating = data.ratings[i];

      try {
        await prisma.exercise_ratings.upsert({
          where: {
            exerciseId_userId: {
              exerciseId: data.exerciseId,
              userId: user.id
            }
          },
          update: {
            rating,
            updatedAt: new Date()
          },
          create: {
            exerciseId: data.exerciseId,
            userId: user.id,
            rating,
            reason: null
          }
        });

        console.log(`   ✅ ${user.name}: ${'⭐'.repeat(rating)} (${rating}/5)`);
      } catch (error) {
        console.log(`   ❌ Failed for ${user.name}: ${error}`);
      }
    }

    // Calculate and show average
    const allRatings = await prisma.exercise_ratings.findMany({
      where: { exerciseId: data.exerciseId },
      select: { rating: true }
    });

    const avg = allRatings.reduce((sum, r) => sum + r.rating, 0) / allRatings.length;
    console.log(`   📊 Average: ${avg.toFixed(1)} ⭐ (${allRatings.length} ratings)`);
    console.log('');
  }

  console.log('✅ All test ratings created successfully!');
  console.log('\n💡 Now refresh your exercise pages to see the average ratings.');

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error('❌ Error:', e);
  process.exit(1);
});
