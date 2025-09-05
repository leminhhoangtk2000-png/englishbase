const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Mock the content directory path
const contentDirectory = path.join(__dirname, 'src', 'content');

function getMarkdownFiles(niveau) {
  console.log('=== DEBUG getMarkdownFiles ===');
  console.log('niveau:', niveau);
  console.log('contentDirectory:', contentDirectory);
  
  const niveauPath = path.join(contentDirectory, niveau);
  console.log('niveauPath:', niveauPath);
  
  if (!fs.existsSync(niveauPath)) {
    console.log('Niveau path does not exist!');
    return [];
  }
  
  const sections = [];
  const sectionDirs = fs.readdirSync(niveauPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
  
  console.log('sectionDirs:', sectionDirs);
  
  for (const sectionName of sectionDirs) {
    console.log(`\n=== Processing section: ${sectionName} ===`);
    const sectionPath = path.join(niveauPath, sectionName);
    console.log('sectionPath:', sectionPath);
    
    const markdownFiles = fs.readdirSync(sectionPath)
      .filter(file => file.endsWith('.md') || file.endsWith('.mdx'));
    
    console.log('markdownFiles:', markdownFiles);
    
    const items = [];
    
    for (const fileName of markdownFiles) {
      const filePath = path.join(sectionPath, fileName);
      const fileContents = fs.readFileSync(filePath, 'utf8');
      
      console.log(`\nFile: ${fileName}`);
      console.log('  First 200 chars:', JSON.stringify(fileContents.substring(0, 200)));
      
      const { data, content } = matter(fileContents);
      
      const slug = fileName.replace(/\.(md|mdx)$/, '');
      
      console.log('  Parsed data:', data);
      console.log('  title:', data.title);
      console.log('  order:', data.order);
      console.log('  slug:', slug);
      
      items.push({
        meta: {
          ...data,
          slug,
        },
        content,
      });
    }
    
    // Sort by order field if available
    items.sort((a, b) => {
      const orderA = a.meta.order !== undefined ? a.meta.order : 999;
      const orderB = b.meta.order !== undefined ? b.meta.order : 999;
      return orderA - orderB;
    });
    
    console.log('\nSorted items:');
    items.forEach((item, index) => {
      console.log(`  ${index + 1}. ${item.meta.title} (order: ${item.meta.order})`);
    });
    
    sections.push({
      name: sectionName,
      slug: sectionName,
      items,
    });
  }
  
  return sections;
}

function getNiveauContent(niveau) {
  const sections = getMarkdownFiles(niveau);
  
  return {
    niveau,
    sections: sections.map(section => ({
      name: section.name,
      title: section.name.charAt(0).toUpperCase() + section.name.slice(1),
      slug: section.slug,
      itemCount: section.items.length,
      items: section.items.map(item => ({
        title: item.meta.title,
        description: item.meta.description,
        slug: item.meta.slug,
        tags: item.meta.tags || [],
        order: item.meta.order || 999,
      })),
    })),
  };
}

// Test
console.log('=== TESTING NAVIGATION ===');
const result = getNiveauContent('a1niveau');
console.log('\n=== FINAL RESULT ===');
console.log(JSON.stringify(result, null, 2));
