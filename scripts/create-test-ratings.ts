/**
 * Script to create test ratings for exercises
 * This helps test the rating display on exercise cards
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🎯 Creating test exercise ratings...\n');

  // Get first user
  const user = await prisma.user.findFirst();

  if (!user) {
    console.log('❌ No users found! Please create a user first.');
    return;
  }

  console.log(`✅ Found user: ${user.name} (${user.email})\n`);

  // Test exercise IDs (slugs from your images)
  const testExercises = [
    {
      id: 'lektion-4-einkaufen-teil-1-a1',
      title: 'Lektion 4 - Einkaufen teil 1 - A1',
      rating: 5
    },
    {
      id: 'lektion-4-einkaufen-teil-2-a1',
      title: 'Lektion 4 - Einkaufen teil 2 - A1',
      rating: 5
    },
    // Add more if needed
    {
      id: 'lektion-3-familie-und-freunde-teil-1-a1',
      title: 'Lektion 3 - Familie und Freunde Teil 1 - A1',
      rating: 4
    }
  ];

  for (const exercise of testExercises) {
    try {
      // Create or update rating
      const rating = await prisma.exercise_ratings.upsert({
        where: {
          exerciseId_userId: {
            exerciseId: exercise.id,
            userId: user.id
          }
        },
        update: {
          rating: exercise.rating
        },
        create: {
          userId: user.id,
          exerciseId: exercise.id,
          rating: exercise.rating,
          reason: `Test rating for ${exercise.title}`
        }
      });

      console.log(`✅ Created rating for: ${exercise.title}`);
      console.log(`   Exercise ID: ${exercise.id}`);
      console.log(`   Rating: ${'⭐'.repeat(exercise.rating)} (${exercise.rating}/5)\n`);
    } catch (error) {
      console.error(`❌ Error creating rating for ${exercise.id}:`, error);
    }
  }

  // Verify ratings created
  const allRatings = await prisma.exercise_ratings.findMany({
    where: {
      userId: user.id
    }
  });

  console.log('\n📊 Summary:');
  console.log(`   Total ratings by ${user.name}: ${allRatings.length}`);
  console.log('\n   Exercises rated:');
  allRatings.forEach((r, i) => {
    console.log(`   ${i + 1}. ${r.exerciseId} - ${'⭐'.repeat(r.rating)}`);
  });

  console.log('\n✅ Test ratings created successfully!');
  console.log('\n💡 Now refresh your exercise pages to see the ratings.');
}

main()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
