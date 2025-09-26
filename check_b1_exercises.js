const fs = require('fs');
const path = require('path');

// Function to check B1 exercise files
function analyzeB1File(filePath, relativePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const issues = [];
    
    // Check if file starts with frontmatter
    if (!content.startsWith('---')) {
      issues.push('Missing frontmatter completely');
    } else {
      // Extract frontmatter
      const frontmatterEnd = content.indexOf('---', 3);
      if (frontmatterEnd === -1) {
        issues.push('Malformed frontmatter');
      } else {
        const frontmatter = content.substring(3, frontmatterEnd);
        
        // Check for required fields in B1 standard format
        if (!frontmatter.includes('title:')) issues.push('Missing title field');
        if (!frontmatter.includes('description:')) issues.push('Missing description field');
        if (!frontmatter.includes('level:')) issues.push('Missing level field');
        if (!frontmatter.includes('topic:')) issues.push('Missing topic field');
      }
    }
    
    // Check if content looks like exercise format
    const hasExercisePattern = content.match(/\d+\.\s+.*?\[.*?\]/);
    const hasBlankPattern = content.includes('___') || content.includes('__');
    
    // Check for any component usage
    const hasComponents = content.includes('<') && content.includes('>');
    
    return {
      file: relativePath,
      issues: issues,
      hasContent: content.length > 100,
      hasExercises: hasExercisePattern !== null,
      hasBlanks: hasBlankPattern,
      hasComponents: hasComponents,
      needsConversion: issues.length > 0 || (!hasComponents && hasExercises),
      contentLength: content.length,
      preview: content.substring(0, 200).replace(/\n/g, ' ')
    };
  } catch (error) {
    return {
      file: relativePath,
      issues: [`File read error: ${error.message}`],
      hasContent: false,
      hasExercises: false,
      hasBlanks: false,
      hasComponents: false,
      needsConversion: true,
      contentLength: 0,
      preview: 'ERROR'
    };
  }
}

// Get all B1 exercise files
const b1ExercisesPath = 'src/content/b1niveau/Übungen';
const results = [];

if (fs.existsSync(b1ExercisesPath)) {
  function scanDir(dir, prefix = '') {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        scanDir(fullPath, prefix + item + '/');
      } else if (item.endsWith('.md') || item.endsWith('.mdx')) {
        const relativePath = `b1niveau/${prefix}${item}`;
        const analysis = analyzeB1File(fullPath, relativePath);
        results.push(analysis);
      }
    });
  }
  
  scanDir(b1ExercisesPath);
}

// Print results
console.log('=== B1 EXERCISE FILES ANALYSIS ===\n');

console.log(`📊 SUMMARY:`);
console.log(`Total B1 exercise files: ${results.length}`);
console.log(`Files with issues: ${results.filter(r => r.issues.length > 0).length}`);
console.log(`Files with exercises: ${results.filter(r => r.hasExercises).length}`);
console.log(`Files with components: ${results.filter(r => r.hasComponents).length}`);
console.log(`Files needing conversion: ${results.filter(r => r.needsConversion).length}\n`);

console.log('�� DETAILED ANALYSIS:\n');

results.forEach(file => {
  console.log(`📁 ${file.file}`);
  console.log(`   Content: ${file.contentLength} chars`);
  console.log(`   Has exercises: ${file.hasExercises ? '✅' : '❌'}`);
  console.log(`   Has blanks: ${file.hasBlanks ? '✅' : '❌'}`);
  console.log(`   Has components: ${file.hasComponents ? '✅' : '❌'}`);
  console.log(`   Needs conversion: ${file.needsConversion ? '🔄' : '✅'}`);
  
  if (file.issues.length > 0) {
    file.issues.forEach(issue => {
      console.log(`   ❌ ${issue}`);
    });
  }
  
  if (file.preview && file.preview !== 'ERROR') {
    console.log(`   Preview: "${file.preview}..."`);
  }
  console.log('');
});

console.log('🔧 RECOMMENDATIONS:\n');

const noFrontmatter = results.filter(f => f.issues.some(i => i.includes('frontmatter')));
const hasExercises = results.filter(f => f.hasExercises && !f.hasComponents);
const needsComponents = results.filter(f => f.needsConversion);

if (noFrontmatter.length > 0) {
  console.log(`1. ADD FRONTMATTER (${noFrontmatter.length} files):`);
  noFrontmatter.forEach(f => console.log(`   - ${f.file}`));
  console.log('');
}

if (hasExercises.length > 0) {
  console.log(`2. CONVERT TO EXERCISETABLE (${hasExercises.length} files):`);
  hasExercises.forEach(f => console.log(`   - ${f.file}`));
  console.log('');
}

if (needsComponents.length > 0) {
  console.log(`3. NEEDS B1 ROUTER UPDATE:`);
  console.log(`   The B1 router doesn't support MDX/ExerciseTable components like A1/A2`);
  console.log(`   Options:`);
  console.log(`   a) Update B1 router to match A1/A2 router with MDX support`);
  console.log(`   b) Keep B1 simple but add proper frontmatter to exercise files`);
  console.log('');
}

