const fs = require('fs');
const path = require('path');

// Function to check frontmatter and syntax
function analyzeFile(filePath, relativePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Check if file starts with frontmatter
    if (!content.startsWith('---')) {
      issues.push('Missing frontmatter');
    } else {
      // Extract frontmatter
      const frontmatterEnd = content.indexOf('---', 3);
      if (frontmatterEnd === -1) {
        issues.push('Malformed frontmatter');
      } else {
        const frontmatter = content.substring(3, frontmatterEnd);
        
        // Check for required fields in A1/A2 standard format
        if (!frontmatter.includes('title:')) issues.push('Missing title field');
        if (!frontmatter.includes('description:')) issues.push('Missing description field');
        if (!frontmatter.includes('level:')) issues.push('Missing level field');
        if (!frontmatter.includes('topic:')) issues.push('Missing topic field');
        
        // Check for old format markers
        if (frontmatter.includes('id:')) issues.push('Using old id field (should be removed)');
        if (frontmatter.includes('author:')) issues.push('Using old author field (use ExerciseAuthor component instead)');
      }
    }
    
    // Check for old imports
    if (content.includes("from '@site/")) issues.push('Using old @site/ imports');
    if (content.includes('Lueckentext')) issues.push('Using old Lueckentext component (should use ExerciseTable)');
    if (content.includes('AuthorCredit')) issues.push('Using old AuthorCredit component (should use ExerciseAuthor)');
    
    // Check for new format components
    if (content.includes('ExerciseTable')) {
      // Check if imports are correct
      if (!content.includes('from "@/components/exercises/exercise-table"')) {
        issues.push('ExerciseTable used but import missing or incorrect');
      }
    }
    
    // Check file extension
    if (!filePath.endsWith('.mdx') && (content.includes('<') || content.includes('import '))) {
      issues.push('Should be .mdx file (contains JSX/imports)');
    }
    
    return {
      file: relativePath,
      issues: issues,
      hasContent: content.length > 100,
      isOldFormat: content.includes('Lueckentext') || content.includes('@site/'),
      isNewFormat: content.includes('ExerciseTable') && content.includes('"@/components/exercises/')
    };
  } catch (error) {
    return {
      file: relativePath,
      issues: [`File read error: ${error.message}`],
      hasContent: false,
      isOldFormat: false,
      isNewFormat: false
    };
  }
}

// Get all A1 and A2 exercise files
const levels = ['a1niveau', 'a2niveau'];
const results = [];

levels.forEach(level => {
  const exercisesPath = `src/content/${level}/Übungen`;
  
  if (fs.existsSync(exercisesPath)) {
    function scanDir(dir, prefix = '') {
      const items = fs.readdirSync(dir);
      
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          scanDir(fullPath, prefix + item + '/');
        } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
          const relativePath = `${level}/${prefix}${item}`;
          const analysis = analyzeFile(fullPath, relativePath);
          results.push(analysis);
        }
      });
    }
    
    scanDir(exercisesPath);
  }
});

// Print results
console.log('=== EXERCISE FILES ANALYSIS ===\n');

const problemFiles = results.filter(r => r.issues.length > 0);
const oldFormatFiles = results.filter(r => r.isOldFormat);
const newFormatFiles = results.filter(r => r.isNewFormat);

console.log(`📊 SUMMARY:`);
console.log(`Total files analyzed: ${results.length}`);
console.log(`Files with issues: ${problemFiles.length}`);
console.log(`Old format files: ${oldFormatFiles.length}`);
console.log(`New format files: ${newFormatFiles.length}`);
console.log(`Files without issues: ${results.length - problemFiles.length}\n`);

if (problemFiles.length > 0) {
  console.log('🚨 FILES WITH ISSUES:\n');
  
  problemFiles.forEach(file => {
    console.log(`📁 ${file.file}`);
    file.issues.forEach(issue => {
      console.log(`   ❌ ${issue}`);
    });
    console.log(`   Format: ${file.isOldFormat ? 'OLD' : file.isNewFormat ? 'NEW' : 'UNKNOWN'}`);
    console.log('');
  });
}

console.log('🔧 RECOMMENDED ACTIONS:\n');

if (oldFormatFiles.length > 0) {
  console.log(`1. UPDATE ${oldFormatFiles.length} OLD FORMAT FILES:`);
  oldFormatFiles.forEach(file => {
    console.log(`   - ${file.file}`);
  });
  console.log('');
}

const frontmatterIssues = problemFiles.filter(f => 
  f.issues.some(i => i.includes('frontmatter') || i.includes('Missing'))
);

if (frontmatterIssues.length > 0) {
  console.log(`2. FIX FRONTMATTER IN ${frontmatterIssues.length} FILES:`);
  frontmatterIssues.forEach(file => {
    console.log(`   - ${file.file}`);
  });
  console.log('');
}

