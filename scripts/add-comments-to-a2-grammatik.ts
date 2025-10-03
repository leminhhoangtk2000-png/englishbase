#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const grammatikDir = path.join(__dirname, '../src/content/a2niveau/grammatik');

// List of grammar files (excluding index)
const files = [
  '01-perfekt.md',
  '02-adjektivdeklination.md',
  '03-komparativ-superlativ.md',
  '04-perfekt-advanced.md',
  '05-prateritum.md',
  '06-plusquamperfekt.md',
  '07-nebensatze.md',
  '08-passiv.md',
  '09-futur.md',
  '10-passiv-alternativen.md',
  '11-possessivpronomen.md',
  '12-reflexivpronomen.md',
  '13-genitiv.md',
];

function generateExerciseId(filename: string): string {
  // Convert filename to exercise ID
  // Example: 01-perfekt.md -> a2-grammatik-01-perfekt
  const slug = filename.replace(/\.mdx?$/, '');
  return `a2-grammatik-${slug}`;
}

function addExerciseComments(filePath: string): void {
  const filename = path.basename(filePath);
  const exerciseId = generateExerciseId(filename);
  const slug = filename.replace(/\.mdx?$/, '');
  
  console.log(`Processing: ${filename}`);
  
  // Read file content
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Check if ExerciseComments already exists
  if (content.includes('<ExerciseComments')) {
    console.log(`  ⏭️  Already has ExerciseComments, skipping...`);
    return;
  }
  
  // Check if it already has the import
  const hasImport = content.includes('import ExerciseComments');
  
  // Find frontmatter end
  const frontmatterMatch = content.match(/^---\n[\s\S]*?\n---\n/);
  
  if (!frontmatterMatch) {
    console.log(`  ⚠️  No frontmatter found, skipping...`);
    return;
  }
  
  const frontmatterEnd = frontmatterMatch[0].length;
  const beforeFrontmatter = content.substring(0, frontmatterEnd);
  let afterFrontmatter = content.substring(frontmatterEnd);
  
  // Add import after frontmatter if not exists
  if (!hasImport) {
    afterFrontmatter = `\nimport ExerciseComments from "@/components/exercises/ExerciseComments";\n${afterFrontmatter}`;
  }
  
  // Add ExerciseComments section at the end
  const exerciseCommentsBlock = `

---

## Hỏi đáp & Thảo luận 💬

<ExerciseComments
  exerciseId="${exerciseId}"
  url="/a2niveau/grammatik/${slug}"
/>
`;
  
  // Combine everything
  const newContent = beforeFrontmatter + afterFrontmatter + exerciseCommentsBlock;
  
  // Change extension to .mdx
  const newFilePath = filePath.replace(/\.md$/, '.mdx');
  
  // Write to new file
  fs.writeFileSync(newFilePath, newContent, 'utf-8');
  
  // Delete old .md file if different
  if (newFilePath !== filePath) {
    fs.unlinkSync(filePath);
    console.log(`  ✅ Converted to .mdx and added ExerciseComments`);
  } else {
    console.log(`  ✅ Added ExerciseComments`);
  }
}

// Process index.md separately (convert to .mdx but don't add comments)
function convertIndexToMdx(): void {
  const indexPath = path.join(grammatikDir, 'index.md');
  const newIndexPath = path.join(grammatikDir, 'index.mdx');
  
  if (fs.existsSync(indexPath) && !fs.existsSync(newIndexPath)) {
    const content = fs.readFileSync(indexPath, 'utf-8');
    fs.writeFileSync(newIndexPath, content, 'utf-8');
    fs.unlinkSync(indexPath);
    console.log('✅ Converted index.md to index.mdx');
  }
}

// Main execution
console.log('🚀 Starting A2 Grammatik conversion...\n');

files.forEach(file => {
  const filePath = path.join(grammatikDir, file);
  if (fs.existsSync(filePath)) {
    addExerciseComments(filePath);
  }
});

convertIndexToMdx();

console.log('\n✅ All done! A2 Grammatik files converted to .mdx with ExerciseComments');
