const fs = require('fs');
const path = require('path');

const b1ExercisesDir = '.';

function analyzeFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    // Check for frontmatter
    const hasFrontmatter = content.startsWith('---');
    
    // Count bracket-style exercises [answer]
    const bracketExercises = (content.match(/\[([^\]]+)\]/g) || []).length;
    
    // Check for modern components
    const hasExerciseTable = content.includes('<ExerciseTable');
    const hasOldComponents = content.includes('Lueckentext') || content.includes('AuthorCredit');
    
    // Get file size
    const stats = fs.statSync(filePath);
    
    return {
      path: filePath,
      hasFrontmatter,
      bracketExercises,
      hasExerciseTable,
      hasOldComponents,
      lineCount: lines.length,
      fileSize: stats.size,
      needsConversion: !hasFrontmatter || bracketExercises > 0 || hasOldComponents
    };
  } catch (error) {
    return { path: filePath, error: error.message };
  }
}

function scanDirectory(dir) {
  const results = [];
  
  try {
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
      if (item.name === 'index.md' || item.name.startsWith('.')) continue;
      
      const fullPath = path.join(dir, item.name);
      
      if (item.isDirectory()) {
        // Scan subdirectory
        const subResults = scanDirectory(fullPath);
        results.push(...subResults);
      } else if (item.name.endsWith('.md') || item.name.endsWith('.mdx')) {
        const analysis = analyzeFile(fullPath);
        results.push(analysis);
      }
    }
  } catch (error) {
    console.error(`Error scanning ${dir}: ${error.message}`);
  }
  
  return results;
}

console.log('🔍 Analyzing ALL B1 exercises for conversion...\n');

const allFiles = scanDirectory(b1ExercisesDir);
const exerciseFiles = allFiles.filter(f => !f.error);
const errorFiles = allFiles.filter(f => f.error);

console.log(`📊 SUMMARY:`);
console.log(`Total files: ${allFiles.length}`);
console.log(`Valid exercise files: ${exerciseFiles.length}`);
console.log(`Error files: ${errorFiles.length}`);
console.log('');

// Group by conversion needs
const needsConversion = exerciseFiles.filter(f => f.needsConversion);
const alreadyModern = exerciseFiles.filter(f => !f.needsConversion);

console.log(`✅ Already modern format: ${alreadyModern.length}`);
console.log(`🔄 Needs conversion: ${needsConversion.length}`);
console.log('');

// Breakdown by issue type
const noFrontmatter = exerciseFiles.filter(f => !f.hasFrontmatter);
const hasBrackets = exerciseFiles.filter(f => f.bracketExercises > 0);
const hasOldComp = exerciseFiles.filter(f => f.hasOldComponents);

console.log(`📝 CONVERSION NEEDED:`);
console.log(`Missing frontmatter: ${noFrontmatter.length}`);
console.log(`Has bracket exercises: ${hasBrackets.length}`);
console.log(`Has old components: ${hasOldComp.length}`);
console.log('');

// Show detailed list
console.log(`📋 FILES NEEDING CONVERSION:`);
needsConversion.forEach((file, index) => {
  const relativePath = file.path.replace('./', '');
  console.log(`${index + 1}. ${relativePath}`);
  console.log(`   - Frontmatter: ${file.hasFrontmatter ? '✅' : '❌'}`);
  console.log(`   - Bracket exercises: ${file.bracketExercises}`);
  console.log(`   - Old components: ${file.hasOldComponents ? '❌' : '✅'}`);
  console.log(`   - Lines: ${file.lineCount}, Size: ${file.fileSize} bytes`);
  console.log('');
});

if (errorFiles.length > 0) {
  console.log(`❌ ERROR FILES:`);
  errorFiles.forEach(file => {
    console.log(`- ${file.path}: ${file.error}`);
  });
}
