/**
 * Scan all exercise files and populate exercises_master table
 * 
 * Purpose:
 * 1. Create single source of truth for exercise IDs
 * 2. Normalize slug formats (remove URL encoding issues)
 * 3. Enable foreign key relationships for stats tables
 * 
 * Usage: npm run seed:exercises
 */

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper: Slugify exercise ID (same as API)
function slugifyExerciseId(id: string): string {
  return id
    .toLowerCase()
    .replace(/\//g, '-')            // slashes to hyphens  
    .replace(/\s+/g, '-')           // spaces to hyphens
    .replace(/[^\w\-]/g, '-')       // special chars to hyphens
    .replace(/-+/g, '-')            // multiple hyphens to single
    .replace(/^-+|-+$/g, '');       // trim hyphens
}

interface ExerciseData {
  slug: string;        // Full path: "a1/Horen/Im Restaurant teil 2 - A1"
  slugId: string;      // Slugified: "a1-horen-im-restaurant-teil-2-a1"
  title: string;
  level: string;
  category: string;
}

async function scanExercises(): Promise<ExerciseData[]> {
  const exercises: ExerciseData[] = [];
  const exercisesBasePath = path.join(process.cwd(), 'src/content/exercises');
  
  if (!fs.existsSync(exercisesBasePath)) {
    console.log('❌ Exercises directory not found:', exercisesBasePath);
    return exercises;
  }

  const levels = ['a1', 'a2', 'b1', 'b2'];

  for (const level of levels) {
    const levelPath = path.join(exercisesBasePath, level);
    
    if (!fs.existsSync(levelPath)) {
      console.log(`⚠️  Level directory not found: ${level}`);
      continue;
    }

    function scanDirectory(dirPath: string, relativePath: string = '') {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isDirectory()) {
          // Recursively scan subdirectories (Horen, Lesen, etc.)
          scanDirectory(
            path.join(dirPath, entry.name),
            relativePath ? `${relativePath}/${entry.name}` : entry.name
          );
        } else if (entry.name.endsWith('.mdx')) {
          const fullPath = path.join(dirPath, entry.name);
          
          try {
            const content = fs.readFileSync(fullPath, 'utf-8');
            const { data } = matter(content);
            
            const exerciseName = entry.name.replace('.mdx', '');
            const slug = `${level}/${relativePath}/${exerciseName}`;
            const slugId = slugifyExerciseId(slug);
            
            // Extract category from path (e.g., "Horen", "Lesen")
            const category = relativePath.split('/')[0] || 'Allgemein';
            
            exercises.push({
              slug,
              slugId,
              title: data.title || exerciseName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
              level: level.toUpperCase(),
              category
            });
            
            console.log(`✅ Found: ${slug} → ${slugId}`);
          } catch (error) {
            console.error(`❌ Error reading ${fullPath}:`, error);
          }
        }
      }
    }
    
    scanDirectory(levelPath);
  }

  return exercises;
}

async function seedExercises() {
  console.log('🔍 Scanning exercise files...\n');
  
  const exercises = await scanExercises();
  
  console.log(`\n📊 Found ${exercises.length} exercises\n`);

  if (exercises.length === 0) {
    console.log('❌ No exercises found. Check the content/exercises directory.');
    return;
  }

  console.log('💾 Seeding exercises_master table...\n');

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const exercise of exercises) {
    try {
      const result = await prisma.$executeRaw`
        INSERT INTO exercises_master (id, slug, "slugId", title, level, category, "createdAt", "updatedAt")
        VALUES (
          gen_random_uuid()::text,
          ${exercise.slug},
          ${exercise.slugId},
          ${exercise.title},
          ${exercise.level},
          ${exercise.category},
          NOW(),
          NOW()
        )
        ON CONFLICT ("slugId") 
        DO UPDATE SET
          slug = EXCLUDED.slug,
          title = EXCLUDED.title,
          level = EXCLUDED.level,
          category = EXCLUDED.category,
          "updatedAt" = NOW()
        RETURNING id
      `;
      
      if (result) {
        created++;
      } else {
        updated++;
      }
    } catch (error: any) {
      errors++;
      console.error(`❌ Error seeding ${exercise.slug}:`, error.message);
    }
  }

  console.log('\n✅ Seeding complete!');
  console.log(`   Created/Updated: ${created + updated}`);
  console.log(`   Errors: ${errors}`);
}

async function migrateExistingData() {
  console.log('\n🔄 Migrating existing stats to use normalized slugIds...\n');

  // Get all exercises
  const exercises = await prisma.$queryRaw<Array<{slug: string, slugId: string}>>`
    SELECT slug, "slugId" FROM exercises_master
  `;

  console.log(`📊 Found ${exercises.length} exercises in master table\n`);

  // Update exercise_likes
  console.log('📝 Updating exercise_likes...');
  let ratingUpdates = 0;
  
  for (const ex of exercises) {
    // Try to match old format patterns
    const oldFormats = [
      slugifyExerciseId(ex.slug),
      ex.slug.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-20'), // URL encoded
      ex.slug.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-')
    ];

    for (const oldFormat of oldFormats) {
      try {
        const result = await prisma.$executeRaw`
          UPDATE exercise_likes 
          SET "exerciseId" = ${ex.slugId}
          WHERE "exerciseId" = ${oldFormat}
            AND "exerciseId" != ${ex.slugId}
        `;
        if (result > 0) {
          ratingUpdates += result;
          console.log(`  ✅ Updated ${result} ratings: ${oldFormat} → ${ex.slugId}`);
        }
      } catch (error: any) {
        // Unique constraint violation is OK (means already updated)
        if (!error.message.includes('unique constraint')) {
          console.error(`  ❌ Error updating ratings:`, error.message);
        }
      }
    }
  }

  console.log(`✅ Updated ${ratingUpdates} rating records\n`);

  // Update exercise_views
  console.log('📝 Updating exercise_views...');
  let viewUpdates = 0;
  
  for (const ex of exercises) {
    const oldFormats = [
      slugifyExerciseId(ex.slug),
      ex.slug.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-20'),
      ex.slug.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-')
    ];

    for (const oldFormat of oldFormats) {
      try {
        const result = await prisma.$executeRaw`
          UPDATE exercise_views 
          SET "exerciseId" = ${ex.slugId}
          WHERE "exerciseId" = ${oldFormat}
            AND "exerciseId" != ${ex.slugId}
        `;
        if (result > 0) {
          viewUpdates += result;
          console.log(`  ✅ Updated ${result} views: ${oldFormat} → ${ex.slugId}`);
        }
      } catch (error: any) {
        if (!error.message.includes('unique constraint')) {
          console.error(`  ❌ Error updating views:`, error.message);
        }
      }
    }
  }

  console.log(`✅ Updated ${viewUpdates} view records\n`);

  // Update exercise_completions
  console.log('📝 Updating exercise_completions...');
  let completionUpdates = 0;
  
  for (const ex of exercises) {
    const oldFormats = [
      slugifyExerciseId(ex.slug),
      ex.slug.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-20'),
      ex.slug.toLowerCase().replace(/\//g, '-').replace(/\s+/g, '-')
    ];

    for (const oldFormat of oldFormats) {
      try {
        const result = await prisma.$executeRaw`
          UPDATE exercise_completions 
          SET "exerciseId" = ${ex.slugId}
          WHERE "exerciseId" = ${oldFormat}
            AND "exerciseId" != ${ex.slugId}
        `;
        if (result > 0) {
          completionUpdates += result;
          console.log(`  ✅ Updated ${result} completions: ${oldFormat} → ${ex.slugId}`);
        }
      } catch (error: any) {
        if (!error.message.includes('unique constraint')) {
          console.error(`  ❌ Error updating completions:`, error.message);
        }
      }
    }
  }

  console.log(`✅ Updated ${completionUpdates} completion records\n`);

  console.log('🎉 Migration complete!\n');
  console.log('Summary:');
  console.log(`  Ratings: ${ratingUpdates} updated`);
  console.log(`  Views: ${viewUpdates} updated`);
  console.log(`  Completions: ${completionUpdates} updated`);
}

async function updateExerciseCounts() {
  console.log('\n📊 Updating exercise counts...\n');

  const exercises = await prisma.exercises_master.findMany({
    select: { id: true, slugId: true }
  });

  let updatedCount = 0;
  let totalLikes = 0;
  let totalViews = 0;

  for (const exercise of exercises) {
    const likesCount = await prisma.exercise_likes.count({
      where: { exerciseId: exercise.slugId, isLiked: true }
    });

    const viewsCount = await prisma.exercise_views.count({
      where: { exerciseId: exercise.slugId }
    });

    await prisma.exercises_master.update({
      where: { id: exercise.id },
      data: { likesCount, viewsCount }
    });

    updatedCount++;
    totalLikes += likesCount;
    totalViews += viewsCount;
  }

  console.log(`✅ Updated counts for ${updatedCount} exercises`);
  console.log(`   Total: ❤️ ${totalLikes} | 👁️ ${totalViews}\n`);
}

async function main() {
  try {
    // Step 1: Scan and seed exercises
    await seedExercises();

    // Step 2: Migrate existing data
    await migrateExistingData();

    // Step 3: Update counts
    await updateExerciseCounts();

  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
