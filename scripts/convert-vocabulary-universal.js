#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Parser for A1 format (original)
function parseVocabularyMarkdownA1(markdownContent) {
  const sections = [];

  // Split content by main sections (identified by ## headers)
  const sectionRegex = /## \*\*(.+?)\*\*/g;
  const matches = [...markdownContent.matchAll(sectionRegex)];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const sectionTitle = match[1].replace(/🏠|🏡|🌳|🏢|🏠/g, '').trim();

    // Get content between this section and the next
    const startIndex = match.index + match[0].length;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index : markdownContent.length;
    const sectionContent = markdownContent.slice(startIndex, endIndex);

    // Parse vocabulary table
    const words = parseVocabularyTableA1(sectionContent);

    // Parse examples
    const wordsWithExamples = addExamplesFromSectionA1(words, sectionContent);

    if (wordsWithExamples.length > 0) {
      sections.push({
        title: sectionTitle,
        words: wordsWithExamples
      });
    }
  }

  return sections;
}

// Parser for B1 format (new)
function parseVocabularyMarkdownB1(markdownContent) {
  const sections = [];

  // Split content by main sections (identified by ## headers)
  const sectionRegex = /## \*\*(.+?)\*\*/g;
  const matches = [...markdownContent.matchAll(sectionRegex)];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const sectionTitle = match[1].replace(/🧑‍⚕️|🏠|🏡|🌳|🏢|📌|🔧|⚡|🎯/g, '').trim();

    // Get content between this section and the next
    const startIndex = match.index + match[0].length;
    const endIndex = i < matches.length - 1 ? matches[i + 1].index : markdownContent.length;
    const sectionContent = markdownContent.slice(startIndex, endIndex);

    // Parse vocabulary table (B1 format)
    const words = parseVocabularyTableB1(sectionContent);

    // Parse examples (B1 format)
    const wordsWithExamples = addExamplesFromSectionB1(words, sectionContent);

    if (wordsWithExamples.length > 0) {
      sections.push({
        title: sectionTitle,
        words: wordsWithExamples
      });
    }
  }

  return sections;
}

function parseVocabularyTableA1(content) {
  const words = [];

  // Find the table section
  const tableRegex = /\|.*?\|.*?\|.*?\|.*?\|.*?\|\s*\n\|.*?\|.*?\|.*?\|.*?\|.*?\|\s*\n((?:\|.*?\|.*?\|.*?\|.*?\|.*?\|\s*\n)*)/;
  const tableMatch = content.match(tableRegex);

  if (!tableMatch) return words;

  const tableRows = tableMatch[1].trim().split('\n');

  for (const row of tableRows) {
    if (!row.trim() || !row.includes('|')) continue;

    const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);

    if (cells.length >= 5) {
      const [german, plural, type, phonetic, vietnamese] = cells;

      // Clean up the data
      const cleanGerman = german.replace(/\*\*/g, '').trim();
      const cleanPhonetic = phonetic.replace(/\[|\]/g, '').trim();
      const cleanType = extractTypeFromGerman(type, cleanGerman);

      words.push({
        german: cleanGerman,
        plural: plural.trim(),
        phonetic: cleanPhonetic,
        vietnamese: vietnamese.trim(),
        exampleGerman: '', // Will be filled by addExamplesFromSection
        exampleVietnamese: '', // Will be filled by addExamplesFromSection
        type: cleanType,
        level: 'A1' // Default level, can be overridden
      });
    }
  }

  return words;
}

function parseVocabularyTableB1(content) {
  const words = [];

  // Find the table section - B1 format has different columns
  const tableRegex = /\|.*?\|.*?\|.*?\|.*?\|.*?\|\s*\n\|.*?\|.*?\|.*?\|.*?\|.*?\|\s*\n((?:\|.*?\|.*?\|.*?\|.*?\|.*?\|\s*\n)*)/;
  const tableMatch = content.match(tableRegex);

  if (!tableMatch) return words;

  const tableRows = tableMatch[1].trim().split('\n');

  for (const row of tableRows) {
    if (!row.trim() || !row.includes('|')) continue;

    const cells = row.split('|').map(cell => cell.trim()).filter(cell => cell);

    if (cells.length >= 5) {
      // B1 format: |Thứ tự|Danh từ|Danh từ số nhiều|Phiên âm|Nghĩa|
      const [order, german, plural, phonetic, vietnamese] = cells;

      // Clean up the data
      const cleanGerman = german.replace(/\*\*/g, '').trim();
      const cleanPhonetic = phonetic.trim();
      const cleanType = extractTypeFromGermanB1(cleanGerman);

      words.push({
        german: cleanGerman,
        plural: plural.trim(),
        phonetic: cleanPhonetic,
        vietnamese: vietnamese.trim(),
        exampleGerman: '', // Will be filled by addExamplesFromSectionB1
        exampleVietnamese: '', // Will be filled by addExamplesFromSectionB1
        type: cleanType,
        level: 'B1' // B1 level
      });
    }
  }

  return words;
}

function extractTypeFromGerman(typeCell, german) {
  // Extract type from the format like "Nomen (f.)" or "Adjektiv"
  if (typeCell.includes('Nomen')) {
    return 'Nomen';
  } else if (typeCell.includes('Adjektiv')) {
    return 'Adjektiv';
  } else if (typeCell.includes('Verb')) {
    return 'Verb';
  } else if (typeCell.includes('Phrase')) {
    return 'Phrase';
  }

  // Fallback: determine from article
  if (german.startsWith('der ') || german.startsWith('die ') || german.startsWith('das ')) {
    return 'Nomen';
  }

  return 'Nomen'; // Default
}

function extractTypeFromGermanB1(german) {
  // Determine from article
  if (german.startsWith('der ') || german.startsWith('die ') || german.startsWith('das ')) {
    return 'Nomen';
  }

  return 'Nomen'; // Default for B1 content
}

function addExamplesFromSectionA1(words, content) {
  const result = [...words];

  // Find examples section
  const examplesRegex = /### \*\*📌 Ví dụ và Giải nghĩa\*\*(.*?)(?=###|---|\z)/s;
  const examplesMatch = content.match(examplesRegex);

  if (!examplesMatch) return result;

  const examplesContent = examplesMatch[1];

  // Parse individual examples
  const exampleRegex = /\d+\.\s+\*\*(.*?)\*\*\s+\((.*?)\)\s*\n\s*-\s+\*\*Ví dụ:\*\*\s+(.*?)\n\s*-\s+\*\*Giải nghĩa:\*\*\s+(.*?)(?=\n\d+\.|\z)/gs;

  const exampleMatches = [...examplesContent.matchAll(exampleRegex)];

  for (const match of exampleMatches) {
    const [, german, , exampleGerman, exampleVietnamese] = match;

    // Find corresponding word entry
    const wordIndex = result.findIndex(word =>
      word.german === german.trim() ||
      word.german.includes(german.trim()) ||
      german.trim().includes(word.german)
    );

    if (wordIndex !== -1) {
      result[wordIndex].exampleGerman = exampleGerman.trim();
      result[wordIndex].exampleVietnamese = exampleVietnamese.trim();
    }
  }

  return result;
}

function addExamplesFromSectionB1(words, content) {
  const result = [...words];

  // Find examples section
  const examplesRegex = /### \*\*📌 Ví dụ và Giải nghĩa\*\*(.*?)(?=###|---|\z)/s;
  const examplesMatch = content.match(examplesRegex);

  if (!examplesMatch) return result;

  const examplesContent = examplesMatch[1];

  // Parse individual examples - B1 format
  const exampleRegex = /\d+\.\s+\*\*(.*?)\*\*\s*\n\s*-\s+\*\*Ví dụ:\*\*\s+(.*?)\n\s*-\s+\*\*Giải nghĩa:\*\*\s+(.*?)(?=\n\d+\.|\z)/gs;

  const exampleMatches = [...examplesContent.matchAll(exampleRegex)];

  for (const match of exampleMatches) {
    const [, german, exampleGerman, exampleVietnamese] = match;

    // Find corresponding word entry
    const wordIndex = result.findIndex(word =>
      word.german === german.trim() ||
      word.german.includes(german.trim()) ||
      german.trim().includes(word.german)
    );

    if (wordIndex !== -1) {
      result[wordIndex].exampleGerman = exampleGerman.trim();
      result[wordIndex].exampleVietnamese = exampleVietnamese.trim();
    }
  }

  return result;
}

// Auto-detect format and parse accordingly
function detectFormatAndParse(markdownContent) {
  // Check if it's B1 format by looking for the specific table header pattern
  const hasB1Format = markdownContent.includes('|**Thứ tự**|**Danh từ**|**Danh từ số nhiều**|**Phiên âm**|**Nghĩa**|');

  if (hasB1Format) {
    console.log('🔍 Detected B1 format');
    return parseVocabularyMarkdownB1(markdownContent);
  } else {
    console.log('🔍 Detected A1 format');
    return parseVocabularyMarkdownA1(markdownContent);
  }
}

// Main function to convert markdown to JSON
function convertMarkdownToJSON(inputFile, outputFile) {
  try {
    // Read markdown file
    const markdownContent = fs.readFileSync(inputFile, 'utf8');

    // Auto-detect format and parse the markdown
    const sections = detectFormatAndParse(markdownContent);

    // Flatten all words from all sections
    const allWords = [];
    sections.forEach(section => {
      allWords.push(...section.words);
    });

    // Write JSON file
    fs.writeFileSync(outputFile, JSON.stringify(allWords, null, 2), 'utf8');

    console.log(`✅ Successfully converted ${inputFile} to ${outputFile}`);
    console.log(`📊 Total words: ${allWords.length}`);
    console.log(`📑 Sections: ${sections.map(s => s.title).join(', ')}`);

  } catch (error) {
    console.error(`❌ Error converting ${inputFile}:`, error.message);
  }
}

// CLI usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length !== 2) {
    console.log('Usage: node convert-vocabulary-universal.js <input.md> <output.json>');
    console.log('Example: node convert-vocabulary-universal.js "1. Wohnen.md" vocabulary-wohnen.json');
    console.log('Example: node convert-vocabulary-universal.js "1. Der Kopf.md" vocabulary-body-b1.json');
    process.exit(1);
  }

  const [inputFile, outputFile] = args;
  convertMarkdownToJSON(inputFile, outputFile);
}

module.exports = {
  parseVocabularyMarkdownA1,
  parseVocabularyMarkdownB1,
  detectFormatAndParse,
  convertMarkdownToJSON
};
