#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ubungenDir = path.join(__dirname, '../src/content/a2niveau/Übungen');

// Files to convert based on URLs provided
const filesToConvert = [
  'adjektivendungen/teil1.mdx',
  'adjektivendungen/teil2.mdx',
  'adjektivendungen/teil4.mdx',
  'steigerung/teil1.mdx',
  'steigerung/teil3.mdx',
  'perfekt-prateritum/teil1.mdx',
  'perfekt-prateritum/teil2.mdx',
  'perfekt-prateritum/teil3.mdx',
  'plusquamperfekt/teil2.mdx',
  'plusquamperfekt/teil3.mdx',
  'nebensatze/teil1.mdx',
  'passiv/teil1.mdx',
  'passiv/teil2.mdx',
  'futur/teil1.mdx',
  'possessivpronomen/teil1.mdx',
  'possessivpronomen/teil2.mdx',
  'reflexivpronomen/teil1.mdx',
  'reflexivpronomen/teil2.mdx',
  'reflexivpronomen/teil3.mdx',
  'reflexivpronomen/teil4.mdx',
  'reflexivpronomen/teil5.mdx',
];

function parseLueckentextToExerciseTable(lueckentextBlock: string): string | null {
  // Extract textParts array content
  const textPartsMatch = lueckentextBlock.match(/textParts=\{(\[[\s\S]*?\])\}/);
  if (!textPartsMatch) return null;
  
  const textPartsStr = textPartsMatch[1];
  
  // Parse exercises from textParts
  const exercises: Array<{id: number, german: string, correctAnswer: string[]}> = [];
  
  // Match patterns like: "1. Text ", { type: "blank", correctAnswer: "answer" }, " more text"
  const lines = textPartsStr.split('\\n",');
  
  let currentId = 1;
  lines.forEach(line => {
    // Extract question number and text
    const questionMatch = line.match(/["'](\d+)\.\s+(.*?)["']/);
    if (!questionMatch) return;
    
    const questionText = questionMatch[2];
    
    // Extract all blanks (correctAnswer values)
    const blanks: string[] = [];
    const blankMatches = line.matchAll(/correctAnswer:\s*["']([^"']+)["']/g);
    for (const match of blankMatches) {
      blanks.push(match[1]);
    }
    
    if (blanks.length > 0) {
      // Replace blanks with __
      let german = questionText;
      blanks.forEach(() => {
        german = german.replace(/\s*\{.*?\}\s*/, ' __ ');
      });
      
      exercises.push({
        id: currentId++,
        german: german.trim(),
        correctAnswer: blanks
      });
    }
  });
  
  if (exercises.length === 0) return null;
  
  // Generate ExerciseTable JSX
  const exercisesJson = JSON.stringify(exercises, null, 2);
  
  return `<ExerciseTable
  exercises={${exercisesJson}}
/>`;
}

function convertFile(filePath: string): void {
  const relativePath = path.relative(ubungenDir, filePath);
  console.log(`\n📝 Processing: ${relativePath}`);
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if already using ExerciseTable
  if (content.includes('ExerciseTable')) {
    console.log('  ⏭️  Already using ExerciseTable, skipping...');
    return;
  }
  
  // Check if using Lueckentext
  if (!content.includes('Lueckentext')) {
    console.log('  ⚠️  No Lueckentext found, skipping...');
    return;
  }
  
  // Replace import statement
  content = content.replace(
    /import Lueckentext from ["']@site\/src\/components\/Quiz\/Lueckentext\/Lueckentext["'];?/g,
    'import { ExerciseTable } from "@/components/exercises/exercise-table";'
  );
  
  // Update AuthorCredit import if exists
  content = content.replace(
    /import AuthorCredit from ["']@site\/src\/components\/Special\/AuthorCredit\/AuthorCredit["'];?/g,
    'import { ExerciseAuthor, ExerciseHelp } from "@/components/exercises/exercise-author";'
  );
  
  // Replace ExerciseComments import if exists
  content = content.replace(
    /import ExerciseComments from ["']@site\/src\/components\/exercise-comments["'];?/g,
    'import ExerciseComments from "@/components/exercises/ExerciseComments";'
  );
  
  // Find and replace each Lueckentext component
  const lueckentextRegex = /<Lueckentext[\s\S]*?\/>/g;
  let match;
  let convertedCount = 0;
  
  while ((match = lueckentextRegex.exec(content)) !== null) {
    const lueckentextBlock = match[0];
    const exerciseTable = parseLueckentextToExerciseTable(lueckentextBlock);
    
    if (exerciseTable) {
      content = content.replace(lueckentextBlock, exerciseTable);
      convertedCount++;
    }
  }
  
  // Replace AuthorCredit with ExerciseAuthor if exists
  content = content.replace(
    /<AuthorCredit\s+name=["']([^"']+)["']\s+description=["']([^"']+)["']\s*\/>/g,
    '<ExerciseAuthor\n  name="$1"\n  description="$2"\n/>'
  );
  
  // Write back to file
  fs.writeFileSync(filePath, content, 'utf-8');
  
  if (convertedCount > 0) {
    console.log(`  ✅ Converted ${convertedCount} Lueckentext components to ExerciseTable`);
  } else {
    console.log(`  ⚠️  Could not convert Lueckentext (complex format)`);
  }
}

// Main execution
console.log('🚀 Starting A2 Übungen conversion to ExerciseTable...\n');

let processedCount = 0;
let skippedCount = 0;

filesToConvert.forEach(file => {
  const filePath = path.join(ubungenDir, file);
  if (fs.existsSync(filePath)) {
    convertFile(filePath);
    processedCount++;
  } else {
    console.log(`⚠️  File not found: ${file}`);
    skippedCount++;
  }
});

console.log(`\n✅ Conversion complete!`);
console.log(`📊 Processed: ${processedCount} files`);
console.log(`⏭️  Skipped: ${skippedCount} files`);
console.log(`\n⚠️  Note: Some files may need manual conversion if format is complex`);
