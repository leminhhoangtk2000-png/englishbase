import * as fs from 'fs';
import * as path from 'path';

const testFile = '/Users/khoavo/Documents/GitHub/deutsch/Edu-theme/src/content/b1niveau/vokabular/1-koerperteile/01-der-kopf.md';
const content = fs.readFileSync(testFile, 'utf-8');

console.log('File length:', content.length);
console.log('\nSearching for tables...\n');

// Simple line-by-line parser
const lines = content.split('\n');
let inTable = false;
let rowCount = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  
  // Detect table separator
  if (line.match(/^\|[-:\s]+\|[-:\s]+\|[-:\s]+\|[-:\s]+\|[-:\s]+\|$/)) {
    console.log(`Found table at line ${i}`);
    inTable = true;
    continue;
  }
  
  if (inTable && line.startsWith('|')) {
    const cells = line.split('|').map(c => c.trim()).filter(c => c);
    if (cells.length >= 5 && cells[0].match(/^\d+$/)) {
      console.log(`Row ${rowCount}:`, {
        number: cells[0],
        german: cells[1],
        plural: cells[2],
        phonetic: cells[3],
        vietnamese: cells[4]
      });
      rowCount++;
    }
  }
  
  if (inTable && !line.startsWith('|')) {
    inTable = false;
    if (rowCount > 0) {
      console.log(`\nTable ended. Found ${rowCount} rows\n`);
      rowCount = 0;
    }
  }
}

console.log('\nDone!');
