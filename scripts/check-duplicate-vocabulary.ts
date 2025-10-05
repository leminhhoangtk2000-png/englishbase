import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface DuplicateWord {
  german: string;
  count: number;
  entries: {
    id: string;
    vietnamese: string;
    example?: string;
    exampleTranslation?: string;
    level: string;
    topic: string;
    type?: string;
    phonetic?: string;
  }[];
}

async function checkDuplicateVocabulary() {
  console.log('🔍 Checking for duplicate vocabulary...\n');

  try {
    // Get all vocabulary entries with their topics and levels
    const allEntries = await prisma.vocabularyEntry.findMany({
      include: {
        topic: {
          include: {
            level: true,
          },
        },
      },
      orderBy: {
        german: 'asc',
      },
    });

    console.log(`📊 Total entries in database: ${allEntries.length}\n`);

    // Group by German word
    const wordGroups = new Map<string, typeof allEntries>();
    
    for (const entry of allEntries) {
      const german = entry.german.toLowerCase().trim();
      if (!wordGroups.has(german)) {
        wordGroups.set(german, []);
      }
      wordGroups.get(german)!.push(entry);
    }

    // Find duplicates (words appearing more than once)
    const duplicates: DuplicateWord[] = [];
    
    for (const [german, entries] of wordGroups.entries()) {
      if (entries.length > 1) {
        duplicates.push({
          german: entries[0].german, // Use original case
          count: entries.length,
          entries: entries.map(e => ({
            id: e.id,
            vietnamese: e.vietnamese,
            example: e.exampleGerman || undefined,
            exampleTranslation: e.exampleVietnamese || undefined,
            level: e.topic.level.name,
            topic: e.topic.name,
            type: e.type || undefined,
            phonetic: e.phonetic || undefined,
          })),
        });
      }
    }

    // Sort by count (most duplicated first)
    duplicates.sort((a, b) => b.count - a.count);

    console.log(`🔄 Found ${duplicates.length} duplicate words\n`);
    console.log('━'.repeat(80));

    // Statistics
    let totalDuplicates = 0;
    let sameExample = 0;
    let sameLevel = 0;
    let sameLevelSameExample = 0;
    let differentLevels = 0;

    for (const dup of duplicates) {
      totalDuplicates += dup.count;

      // Check if examples are the same
      const examples = dup.entries.map(e => e.example).filter(Boolean);
      const uniqueExamples = new Set(examples);
      const hasSameExample = examples.length > 0 && uniqueExamples.size === 1;

      // Check if levels are the same
      const levels = dup.entries.map(e => e.level);
      const uniqueLevels = new Set(levels);
      const hasSameLevel = uniqueLevels.size === 1;

      if (hasSameExample) sameExample++;
      if (hasSameLevel) {
        sameLevel++;
        if (hasSameExample) sameLevelSameExample++;
      } else {
        differentLevels++;
      }
    }

    // Print summary statistics
    console.log('\n📈 SUMMARY STATISTICS:\n');
    console.log(`Total unique words with duplicates: ${duplicates.length}`);
    console.log(`Total duplicate entries: ${totalDuplicates - duplicates.length}`);
    console.log(`Average duplicates per word: ${(totalDuplicates / duplicates.length).toFixed(2)}\n`);
    
    console.log(`Words with same example: ${sameExample} (${(sameExample/duplicates.length*100).toFixed(1)}%)`);
    console.log(`Words in same level: ${sameLevel} (${(sameLevel/duplicates.length*100).toFixed(1)}%)`);
    console.log(`Words with same level AND same example: ${sameLevelSameExample} (${(sameLevelSameExample/duplicates.length*100).toFixed(1)}%)`);
    console.log(`Words across different levels: ${differentLevels} (${(differentLevels/duplicates.length*100).toFixed(1)}%)\n`);

    console.log('━'.repeat(80));

    // Show top 20 most duplicated words
    console.log('\n🔝 TOP 20 MOST DUPLICATED WORDS:\n');
    
    for (let i = 0; i < Math.min(20, duplicates.length); i++) {
      const dup = duplicates[i];
      console.log(`\n${i + 1}. "${dup.german}" - appears ${dup.count} times:`);
      
      for (const entry of dup.entries) {
        console.log(`   📍 ${entry.level} > ${entry.topic}`);
        console.log(`      Vietnamese: ${entry.vietnamese}`);
        if (entry.type) console.log(`      Type: ${entry.type}`);
        if (entry.phonetic) console.log(`      Phonetic: ${entry.phonetic}`);
        if (entry.example) {
          console.log(`      Example: ${entry.example.substring(0, 60)}...`);
          if (entry.exampleTranslation) {
            console.log(`      Translation: ${entry.exampleTranslation.substring(0, 60)}...`);
          }
        }
      }
      
      // Analysis
      const levels = new Set(dup.entries.map(e => e.level));
      const examples = dup.entries.map(e => e.example).filter(Boolean);
      const uniqueExamples = new Set(examples);
      
      if (levels.size === 1) {
        console.log(`   ⚠️  All in same level: ${Array.from(levels)[0]}`);
      } else {
        console.log(`   ℹ️  Across levels: ${Array.from(levels).join(', ')}`);
      }
      
      if (examples.length > 0 && uniqueExamples.size === 1) {
        console.log(`   ⚠️  Same example across all entries`);
      } else if (examples.length > 0) {
        console.log(`   ✅ Different examples (${uniqueExamples.size} unique)`);
      }
    }

    // Group by level combinations
    console.log('\n\n📊 DUPLICATES BY LEVEL DISTRIBUTION:\n');
    const levelCombos = new Map<string, number>();
    
    for (const dup of duplicates) {
      const levels = Array.from(new Set(dup.entries.map(e => e.level))).sort().join(' + ');
      levelCombos.set(levels, (levelCombos.get(levels) || 0) + 1);
    }
    
    for (const [combo, count] of Array.from(levelCombos.entries()).sort((a, b) => b[1] - a[1])) {
      console.log(`   ${combo}: ${count} words`);
    }

    console.log('\n━'.repeat(80));
    console.log('\n✅ Analysis complete!\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDuplicateVocabulary();
