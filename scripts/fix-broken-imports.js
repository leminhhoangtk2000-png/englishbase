#!/usr/bin/env node

/**
 * Fix broken imports in all Übungen MDX files
 * Removes malformed import statements and duplicate content
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const ÜBUNGEN_DIR = path.join(__dirname, '../src/content/a1niveau/Übungen');

console.log('🔧 FIXING BROKEN IMPORTS IN MDX FILES\n');
console.log('='.repeat(70));

const mdxFiles = glob.sync(`${ÜBUNGEN_DIR}/**/*.mdx`);

let fixedCount = 0;
let errorCount = 0;

mdxFiles.forEach(filePath => {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;
    let hasChanges = false;
    
    const relativePath = path.relative(ÜBUNGEN_DIR, filePath);
    
    // Check for broken imports
    const brokenPatterns = [
      /import Exerci<div/g,
      /import AuthorCredit from "@site\/src\/components/g,
      /^m "@\/components\/exercises\/ExerciseComments";$/gm,
      /<AuthorCredit\s+author="[^"]*"\s*\/>/g,
      /### \*\*Tác giả ✍️\*\*/g,
    ];
    
    brokenPatterns.forEach(pattern => {
      if (pattern.test(content)) {
        hasChanges = true;
      }
    });
    
    if (!hasChanges) return;
    
    console.log(`\n📝 Fixing: ${relativePath}`);
    
    // Remove broken import line
    content = content.replace(/import Exerci<div[\s\S]*?<\/div>/g, '');
    
    // Remove AuthorCredit import
    content = content.replace(/import AuthorCredit from "@site\/src\/components[^;]*;?\n?/g, '');
    
    // Remove raw import text
    content = content.replace(/^m "@\/components\/exercises\/ExerciseComments";?\n?/gm, '');
    
    // Remove AuthorCredit usage
    content = content.replace(/### \*\*Tác giả ✍️\*\*\n\n<AuthorCredit\s+author="[^"]*"\s*\/>\n\n?/g, '');
    
    // Remove duplicate "Hỏi đáp" sections (keep only the last one)
    const hoiDapMatches = [...content.matchAll(/### \*\*Hỏi đáp ❓💬\*\*/g)];
    if (hoiDapMatches.length > 1) {
      console.log(`   ⚠️  Found ${hoiDapMatches.length} "Hỏi đáp" sections, keeping only the last one`);
      // Remove all but last
      let tempContent = content;
      for (let i = 0; i < hoiDapMatches.length - 1; i++) {
        tempContent = tempContent.replace(/### \*\*Hỏi đáp ❓💬\*\*[\s\S]*?<ExerciseComments[\s\S]*?\/>\s*\{\s*"\s*\}\s*\n?/, '');
      }
      content = tempContent;
    }
    
    // Clean up extra blank lines
    content = content.replace(/\n{3,}/g, '\n\n');
    
    // Ensure proper ExerciseComments import
    if (content.includes('<ExerciseComments') && !content.includes('import ExerciseComments')) {
      // Add import after MultipleChoiceQuiz import
      content = content.replace(
        /(import { MultipleChoiceQuiz } from "@\/components\/ui\/multiple-choice-quiz";)\n/,
        '$1\nimport ExerciseComments from "@/components/exercises/ExerciseComments";\n'
      );
      console.log('   ✅ Added ExerciseComments import');
    }
    
    if (content !== originalContent) {
      // Backup original
      fs.writeFileSync(filePath + '.backup', originalContent);
      
      // Write fixed content
      fs.writeFileSync(filePath, content);
      
      fixedCount++;
      console.log(`   💾 File fixed (backup created)`);
    }
    
  } catch (error) {
    console.error(`\n❌ Error processing ${filePath}:`, error.message);
    errorCount++;
  }
});

console.log('\n' + '='.repeat(70));
console.log(`\n✅ Fixing complete!`);
console.log(`   Fixed: ${fixedCount} files`);
console.log(`   Errors: ${errorCount} files`);
console.log(`   Total: ${mdxFiles.length} files\n`);

if (fixedCount > 0) {
  console.log('💡 Backup files created with .backup extension');
  console.log('   If everything looks good, you can delete them:\n');
  console.log('   find src/content/a1niveau/Übungen -name "*.backup" -delete\n');
}
