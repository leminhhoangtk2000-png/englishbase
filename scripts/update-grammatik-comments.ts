import fs from 'fs';
import path from 'path';

const grammatikDir = path.join(process.cwd(), 'src/content/a1niveau/grammatik');

// List of grammatik files to update
const files = [
  '01-prasens.mdx',
  '02-artikel-nomen.mdx',
  '03-wfragen.mdx',
  '04-kasus.mdx',
  '05-modalverben.mdx',
  '06-trennbare-verben.mdx',
  '07-imperativ.mdx',
  '08-prapositionen.mdx',
  '09-negation.mdx',
  '10-konjunktionen.mdx',
  '11-quan-tu-nang-cao.mdx',
  '12-personalpronomen.mdx',
];

function updateCommentsInFile(fileName: string) {
  const filePath = path.join(grammatikDir, fileName);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${fileName}`);
    return;
  }

  // Read file content
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Generate unique exerciseId from filename
  const fileId = fileName.replace('.mdx', '');
  
  // Step 1: Add import if not exists
  if (!content.includes('import ExerciseComments')) {
    const frontmatterEnd = content.indexOf('---', 3);
    if (frontmatterEnd !== -1) {
      const beforeFrontmatter = content.substring(0, frontmatterEnd + 3);
      const afterFrontmatter = content.substring(frontmatterEnd + 3);
      
      content = beforeFrontmatter + '\n\nimport ExerciseComments from "@/components/exercises/ExerciseComments";' + afterFrontmatter;
      modified = true;
      console.log(`  ✓ Added import to ${fileName}`);
    }
  }

  // Step 2: Replace old CommentButton with ExerciseComments
  if (content.includes('<CommentButton')) {
    // Remove old CommentButton block
    content = content.replace(/<CommentButton[\s\S]*?\/>/g, '');
    
    // Add new ExerciseComments at the end
    const newCommentSection = `

---

## Hỏi đáp & Thảo luận 💬

<ExerciseComments
  exerciseId="a1-grammatik-${fileId}"
  url="/a1niveau/grammatik/${fileId}"
/>
`;
    
    content = content.trimEnd() + '\n' + newCommentSection;
    modified = true;
    console.log(`  ✓ Replaced CommentButton with ExerciseComments in ${fileName}`);
  }
  // Step 3: Add ExerciseComments if not exists
  else if (!content.includes('ExerciseComments')) {
    const newCommentSection = `

---

## Hỏi đáp & Thảo luận 💬

<ExerciseComments
  exerciseId="a1-grammatik-${fileId}"
  url="/a1niveau/grammatik/${fileId}"
/>
`;
    
    content = content.trimEnd() + '\n' + newCommentSection;
    modified = true;
    console.log(`  ✓ Added ExerciseComments to ${fileName}`);
  } else {
    console.log(`  ⏭️  ${fileName} already has ExerciseComments`);
  }

  // Write back to file if modified
  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✅ Updated ${fileName}`);
  }
}

// Process all files
console.log('🚀 Updating comment system in A1 Grammatik pages...\n');

files.forEach(file => {
  updateCommentsInFile(file);
});

console.log('\n✨ Done! All files processed.');
