#!/usr/bin/env node

/**
 * Script to standardize all exercise MDX files to multiline format
 * Converts: exercises={[{id: 1, german: "...", correctAnswer: ["A", "B"]}, {id: 2, ...}]}
 * To: exercises={[\n  {\n    id: 1,\n    german: "...",\n    correctAnswer: ["A", "B"],\n  },\n  ...
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const ÜBUNGEN_DIR = path.join(__dirname, '../src/content/a1niveau/Übungen');

console.log('🔍 Searching for MDX files with ExerciseTable components...\n');

// Find all MDX files
const mdxFiles = glob.sync(`${ÜBUNGEN_DIR}/**/*.mdx`);

console.log(`Found ${mdxFiles.length} MDX files\n`);

let processedCount = 0;
let errorCount = 0;

mdxFiles.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Check if file has ExerciseTable with exercises prop
    if (!content.includes('exercises={')) {
      return;
    }
    
    console.log(`\n📝 Processing: ${path.relative(ÜBUNGEN_DIR, filePath)}`);
    
    // Find all ExerciseTable components with inline exercises
    const exerciseTableRegex = /<ExerciseTable\s+exercises=\{([^}]+\})\s*\}/g;
    
    let newContent = content;
    let hasChanges = false;
    
    // Match all ExerciseTable components
    const matches = [...content.matchAll(/<ExerciseTable\s+exercises=\{(\[[^\]]*\])\}\s*\/>/gs)];
    
    if (matches.length === 0) {
      console.log('   ⚠️ No inline exercises found (might already be multiline)');
      return;
    }
    
    matches.forEach(match => {
      const fullMatch = match[0];
      const exercisesArray = match[1];
      
      // Check if already multiline (has newlines)
      if (exercisesArray.includes('\n')) {
        console.log('   ✅ Already multiline format');
        return;
      }
      
      console.log(`   🔄 Converting single-line to multiline...`);
      
      // Parse exercises array
      const exerciseMatches = [...exercisesArray.matchAll(/\{id:\s*(\d+),\s*german:\s*"([^"]+)",\s*correctAnswer:\s*\[([^\]]+)\]\}/g)];
      
      if (exerciseMatches.length === 0) {
        console.log('   ❌ Could not parse exercises');
        return;
      }
      
      // Build multiline format
      const formattedExercises = exerciseMatches.map(exMatch => {
        const id = exMatch[1];
        const german = exMatch[2];
        const answers = exMatch[3];
        
        return `  {
    id: ${id},
    german: "${german}",
    correctAnswer: [${answers}],
  }`;
      }).join(',\n');
      
      const newExerciseTable = `<ExerciseTable\n  exercises={[\n${formattedExercises},\n]}\n/>`;
      
      newContent = newContent.replace(fullMatch, newExerciseTable);
      hasChanges = true;
      
      console.log(`   ✅ Converted ${exerciseMatches.length} exercises to multiline format`);
    });
    
    if (hasChanges) {
      // Backup original
      fs.writeFileSync(filePath + '.backup', content);
      
      // Write new content
      fs.writeFileSync(filePath, newContent);
      
      processedCount++;
      console.log(`   💾 File updated (backup created: ${path.basename(filePath)}.backup)`);
    }
    
  } catch (error) {
    console.error(`\n❌ Error processing ${filePath}:`, error.message);
    errorCount++;
  }
});

console.log('\n' + '='.repeat(60));
console.log(`\n✅ Processing complete!`);
console.log(`   Processed: ${processedCount} files`);
console.log(`   Errors: ${errorCount} files`);
console.log(`   Total MDX files: ${mdxFiles.length}\n`);
