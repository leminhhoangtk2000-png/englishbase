import fs from 'fs';
import path from 'path';

const grammatikDir = path.join(process.cwd(), 'src/content/a1niveau/grammatik');

// List of grammatik files to update
const files = [
  '01-prasens.md',
  '02-artikel-nomen.md',
  '03-wfragen.md',
  '04-kasus.md',
  '05-modalverben.md',
  '06-trennbare-verben.md',
  '07-imperativ.md',
  '08-prapositionen.md',
  '09-negation.md',
  '10-konjunktionen.md',
  '11-quan-tu-nang-cao.md',
  '12-personalpronomen.md',
];

const commentSection = `

---

## Hỏi đáp & Thảo luận 💬

<ExerciseComments
  exerciseId="a1-grammatik-{FILE_ID}"
  url="/a1niveau/grammatik/{FILE_ID}"
/>
`;

function addCommentsToFile(fileName: string) {
  const filePath = path.join(grammatikDir, fileName);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.log(`❌ File not found: ${fileName}`);
    return;
  }

  // Read file content
  let content = fs.readFileSync(filePath, 'utf-8');

  // Check if already has comment
  if (content.includes('ExerciseComments') || content.includes('CommentButton') || content.includes('CommentSystem')) {
    console.log(`⏭️  Skipping ${fileName} - already has comments`);
    return;
  }

  // Add import at the top after frontmatter if not exists
  if (!content.includes('import ExerciseComments')) {
    const frontmatterEnd = content.indexOf('---', 3) + 3;
    const beforeImport = content.substring(0, frontmatterEnd);
    const afterFrontmatter = content.substring(frontmatterEnd);
    
    content = beforeImport + '\n\nimport ExerciseComments from "@/components/exercises/ExerciseComments";' + afterFrontmatter;
  }

  // Generate unique exerciseId from filename
  const fileId = fileName.replace('.md', '').replace('.mdx', '');
  const commentBlock = commentSection.replace('{FILE_ID}', fileId);

  // Add comment section at the end
  content = content.trimEnd() + '\n' + commentBlock;

  // Write back to file
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Added comments to ${fileName}`);
}

// Process all files
console.log('🚀 Adding comment system to A1 Grammatik pages...\n');

files.forEach(file => {
  addCommentsToFile(file);
});

console.log('\n✨ Done! All files processed.');
