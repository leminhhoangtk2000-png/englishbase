import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DuplicateAnalysis {
  german: string;
  level: string;
  count: number;
  entries: {
    id: string;
    vietnamese: string;
    type: string;
    phonetic?: string;
    exampleGerman?: string;
    topicName: string;
  }[];
  isDuplicate100: boolean;
  reason: string;
}

async function analyzeAndCleanupDuplicates() {
  console.log('🔍 Analyzing duplicates for cleanup...\n');

  try {
    // Get all vocabulary entries
    const allEntries = await prisma.vocabularyEntry.findMany({
      include: {
        topic: {
          include: {
            level: true,
          },
        },
      },
      orderBy: [
        { german: 'asc' },
        { topic: { level: { order: 'asc' } } },
      ],
    });

    console.log(`📊 Total entries: ${allEntries.length}\n`);

    // Group by german + level
    const groupKey = (entry: typeof allEntries[0]) => 
      `${entry.german.toLowerCase().trim()}|||${entry.topic.level.name}`;

    const groups = new Map<string, typeof allEntries>();
    
    for (const entry of allEntries) {
      const key = groupKey(entry);
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(entry);
    }

    // Analyze duplicates within same level
    const duplicateAnalysis: DuplicateAnalysis[] = [];
    
    for (const [key, entries] of groups.entries()) {
      if (entries.length > 1) {
        const [german, level] = key.split('|||');
        
        // Check if 100% duplicate (same german, vietnamese, type)
        const signatures = entries.map(e => 
          `${e.vietnamese.toLowerCase().trim()}|||${e.type}`
        );
        const uniqueSignatures = new Set(signatures);
        
        // Check if examples are the same
        const examples = entries.map(e => e.exampleGerman || '').filter(Boolean);
        const uniqueExamples = new Set(examples);
        
        let isDuplicate100 = false;
        let reason = '';
        
        if (uniqueSignatures.size === 1) {
          if (examples.length > 0 && uniqueExamples.size === 1) {
            isDuplicate100 = true;
            reason = '100% duplicate: same word, meaning, type, and example';
          } else if (examples.length === 0) {
            isDuplicate100 = true;
            reason = '100% duplicate: same word, meaning, type (no examples)';
          } else {
            isDuplicate100 = false;
            reason = 'Same word and meaning, but different examples';
          }
        } else {
          isDuplicate100 = false;
          reason = 'Different meanings or types';
        }
        
        duplicateAnalysis.push({
          german: entries[0].german,
          level,
          count: entries.length,
          entries: entries.map(e => ({
            id: e.id,
            vietnamese: e.vietnamese,
            type: e.type,
            phonetic: e.phonetic || undefined,
            exampleGerman: e.exampleGerman || undefined,
            topicName: e.topic.name,
          })),
          isDuplicate100,
          reason,
        });
      }
    }

    // Sort by level and count
    duplicateAnalysis.sort((a, b) => {
      if (a.level !== b.level) return a.level.localeCompare(b.level);
      return b.count - a.count;
    });

    // Statistics
    const duplicates100 = duplicateAnalysis.filter(d => d.isDuplicate100);
    const duplicatesPartial = duplicateAnalysis.filter(d => !d.isDuplicate100);
    
    console.log('━'.repeat(80));
    console.log('\n📈 DUPLICATE ANALYSIS:\n');
    console.log(`Total duplicate groups in same level: ${duplicateAnalysis.length}`);
    console.log(`  ❌ 100% duplicates (can be deleted): ${duplicates100.length}`);
    console.log(`  ⚠️  Partial duplicates (keep): ${duplicatesPartial.length}\n`);

    // Calculate entries to delete
    let totalEntriesToDelete = 0;
    for (const dup of duplicates100) {
      totalEntriesToDelete += dup.count - 1; // Keep 1, delete rest
    }
    
    console.log(`📊 Entries that will be deleted: ${totalEntriesToDelete}`);
    console.log(`💾 Database size after cleanup: ${allEntries.length - totalEntriesToDelete} entries\n`);

    console.log('━'.repeat(80));

    // Show 100% duplicates by level
    console.log('\n🗑️  100% DUPLICATES TO DELETE:\n');
    
    const byLevel = new Map<string, typeof duplicates100>();
    for (const dup of duplicates100) {
      if (!byLevel.has(dup.level)) {
        byLevel.set(dup.level, []);
      }
      byLevel.get(dup.level)!.push(dup);
    }

    for (const [level, dups] of Array.from(byLevel.entries()).sort()) {
      const entriesToDelete = dups.reduce((sum, d) => sum + d.count - 1, 0);
      console.log(`\n📚 Level ${level}: ${dups.length} duplicate words (${entriesToDelete} entries to delete)`);
      
      for (const dup of dups.slice(0, 10)) { // Show first 10
        console.log(`\n   "${dup.german}" - appears ${dup.count} times:`);
        for (let i = 0; i < dup.entries.length; i++) {
          const entry = dup.entries[i];
          const marker = i === 0 ? '✅ KEEP' : '❌ DELETE';
          console.log(`      ${marker} - Topic: ${entry.topicName}`);
          console.log(`         Vietnamese: ${entry.vietnamese}`);
          console.log(`         Type: ${entry.type}`);
          if (entry.exampleGerman) {
            console.log(`         Example: ${entry.exampleGerman.substring(0, 50)}...`);
          }
        }
      }
      
      if (dups.length > 10) {
        console.log(`\n   ... and ${dups.length - 10} more duplicate words in ${level}`);
      }
    }

    // Show some partial duplicates as examples
    console.log('\n\n━'.repeat(80));
    console.log('\n✅ PARTIAL DUPLICATES (WILL KEEP - Different meanings/examples):\n');
    
    for (const dup of duplicatesPartial.slice(0, 5)) {
      console.log(`\n   "${dup.german}" in ${dup.level} - ${dup.count} entries:`);
      console.log(`   Reason: ${dup.reason}`);
      for (const entry of dup.entries) {
        console.log(`      📍 ${entry.topicName}`);
        console.log(`         Vietnamese: ${entry.vietnamese}`);
        console.log(`         Type: ${entry.type}`);
      }
    }

    console.log('\n\n━'.repeat(80));

    // Ask for confirmation
    console.log('\n⚠️  READY TO DELETE DUPLICATES\n');
    console.log(`This will delete ${totalEntriesToDelete} duplicate entries.`);
    console.log('For each duplicate word, we will keep the FIRST entry and delete the rest.\n');
    
    console.log('💡 To proceed with deletion, run:');
    console.log('   npx tsx scripts/cleanup-duplicate-vocabulary.ts --confirm\n');

    // Check if --confirm flag is present
    if (process.argv.includes('--confirm')) {
      console.log('🚀 Starting deletion...\n');
      
      let deletedCount = 0;
      
      for (const dup of duplicates100) {
        // Keep first entry, delete rest
        const idsToDelete = dup.entries.slice(1).map(e => e.id);
        
        if (idsToDelete.length > 0) {
          const result = await prisma.vocabularyEntry.deleteMany({
            where: {
              id: {
                in: idsToDelete,
              },
            },
          });
          
          deletedCount += result.count;
          console.log(`   ✅ Deleted ${result.count} duplicates of "${dup.german}" in ${dup.level}`);
        }
      }
      
      console.log(`\n🎉 Cleanup completed! Deleted ${deletedCount} duplicate entries.`);
      console.log(`📊 Remaining entries: ${allEntries.length - deletedCount}\n`);
    } else {
      console.log('ℹ️  This was a DRY RUN. No entries were deleted.');
      console.log('   Run with --confirm flag to actually delete duplicates.\n');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeAndCleanupDuplicates();
