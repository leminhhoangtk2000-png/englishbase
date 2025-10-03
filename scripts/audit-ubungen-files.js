#!/usr/bin/env node

/**
 * Comprehensive audit of all A1 Übungen MDX files
 * Checks: file existence, ExerciseTable presence, format type
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const ÜBUNGEN_DIR = path.join(__dirname, '../src/content/a1niveau/Übungen');

console.log('🔍 COMPREHENSIVE A1 ÜBUNGEN AUDIT\n');
console.log('=' .repeat(70));

// Find all MDX files
const mdxFiles = glob.sync(`${ÜBUNGEN_DIR}/**/*.mdx`);

console.log(`\n📊 Found ${mdxFiles.length} MDX files\n`);

let stats = {
  total: mdxFiles.length,
  withExerciseTable: 0,
  singleLine: 0,
  multiLine: 0,
  otherComponents: 0,
  errors: 0
};

const filesByType = {
  singleLine: [],
  multiLine: [],
  otherComponents: [],
  noExercises: []
};

mdxFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = path.relative(ÜBUNGEN_DIR, filePath);
    
    // Check for ExerciseTable
    if (!content.includes('<ExerciseTable')) {
      filesByType.noExercises.push(relativePath);
      return;
    }
    
    stats.withExerciseTable++;
    
    // Extract exercises prop
    const exercisesMatch = content.match(/exercises=\{(\[[^\]]*\])\}/);
    
    if (!exercisesMatch) {
      // Check for other components
      if (content.includes('<Lueckentext') || content.includes('<MatchingQuiz') || 
          content.includes('<FormingQuestions') || content.includes('<Satzbildung')) {
        stats.otherComponents++;
        filesByType.otherComponents.push(relativePath);
      }
      return;
    }
    
    const exercisesStr = exercisesMatch[1];
    
    // Determine format type
    if (exercisesStr.includes('\n')) {
      stats.multiLine++;
      filesByType.multiLine.push(relativePath);
    } else {
      stats.singleLine++;
      filesByType.singleLine.push(relativePath);
    }
    
  } catch (error) {
    console.error(`❌ Error reading ${filePath}:`, error.message);
    stats.errors++;
  }
});

console.log('=' .repeat(70));
console.log('\n📈 STATISTICS\n');
console.log(`  Total MDX files:              ${stats.total}`);
console.log(`  Files with ExerciseTable:     ${stats.withExerciseTable}`);
console.log(`  ├─ Single-line format:        ${stats.singleLine}`);
console.log(`  ├─ Multi-line format:         ${stats.multiLine}`);
console.log(`  └─ Other components:          ${stats.otherComponents}`);
console.log(`  Files without exercises:      ${filesByType.noExercises.length}`);
console.log(`  Errors:                       ${stats.errors}\n`);

if (filesByType.singleLine.length > 0) {
  console.log('=' .repeat(70));
  console.log(`\n⚠️  SINGLE-LINE FORMAT FILES (${filesByType.singleLine.length}):\n`);
  filesByType.singleLine.forEach(file => console.log(`  - ${file}`));
}

if (filesByType.multiLine.length > 0) {
  console.log('=' .repeat(70));
  console.log(`\n✅ MULTI-LINE FORMAT FILES (${filesByType.multiLine.length}):\n`);
  filesByType.multiLine.forEach(file => console.log(`  - ${file}`));
}

if (filesByType.otherComponents.length > 0) {
  console.log('=' .repeat(70));
  console.log(`\n🔧 FILES WITH OTHER COMPONENTS (${filesByType.otherComponents.length}):\n`);
  filesByType.otherComponents.forEach(file => console.log(`  - ${file}`));
}

if (filesByType.noExercises.length > 0) {
  console.log('=' .repeat(70));
  console.log(`\n📄 FILES WITHOUT EXERCISETABLE (${filesByType.noExercises.length}):\n`);
  filesByType.noExercises.forEach(file => console.log(`  - ${file}`));
}

console.log('\n' + '='.repeat(70));
console.log('\n✅ Audit complete!\n');

// Recommendations
if (stats.singleLine > 0) {
  console.log('💡 RECOMMENDATION:');
  console.log('   All single-line files should work with the current flexible regex.');
  console.log('   If you want to standardize, consider converting to multiline format.\n');
}
