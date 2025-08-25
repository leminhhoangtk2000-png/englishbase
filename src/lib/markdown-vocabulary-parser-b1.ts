import { VocabularyEntry } from './vocabulary-data';

export interface MarkdownVocabularySection {
  title: string;
  words: VocabularyEntry[];
}

export function parseVocabularyMarkdownB1(markdownContent: string): MarkdownVocabularySection[] {
  const sections: MarkdownVocabularySection[] = [];

  // Split content by main sections (identified by ## headers)
  const sectionRegex = /## \*\*(.+?)\*\*/g;
  const matches = [...markdownContent.matchAll(sectionRegex)];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    const sectionTitle = match[1].replace(/🧑‍⚕️|🏠|🏡|🌳|🏢|📌|🔧|⚡|🎯/g, '').trim();

    // Get content between this section and the next
    const startIndex = match.index! + match[0].length;
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

function parseVocabularyTableB1(content: string): VocabularyEntry[] {
  const words: VocabularyEntry[] = [];

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

function extractTypeFromGermanB1(german: string): string {
  // Determine from article
  if (german.startsWith('der ')) {
    return 'Nomen';
  } else if (german.startsWith('die ')) {
    return 'Nomen';
  } else if (german.startsWith('das ')) {
    return 'Nomen';
  }

  return 'Nomen'; // Default for B1 content
}

function addExamplesFromSectionB1(words: VocabularyEntry[], content: string): VocabularyEntry[] {
  const result = [...words];

  // Find examples section
  const examplesRegex = /### \*\*📌 Ví dụ và Giải nghĩa\*\*[\s\S]*?(?=###|---|\z)/;
  const examplesMatch = content.match(examplesRegex);

  if (!examplesMatch) return result;

  const examplesContent = examplesMatch[1];

  // Parse individual examples - B1 format
  const exampleRegex = /\d+\.\s+\*\*(.*?)\*\*[\s\S]*?-\s+\*\*Ví dụ:\*\*\s+(.*?)\n[\s\S]*?-\s+\*\*Giải nghĩa:\*\*\s+(.*?)(?=\n\d+\.|\z)/g;

  const exampleMatches: RegExpExecArray[] = [];
  let match;
  while ((match = exampleRegex.exec(examplesContent)) !== null) {
    exampleMatches.push(match);
  }

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

// Function to generate new vocabulary JSON file from parsed B1 markdown
export function generateVocabularyJSONB1(sections: MarkdownVocabularySection[], topic: string = 'kopf-b1'): VocabularyEntry[] {
  const allWords: VocabularyEntry[] = [];

  sections.forEach(section => {
    allWords.push(...section.words);
  });

  return allWords;
}
