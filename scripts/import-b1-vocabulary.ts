import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface VocabWord {
  german: string;
  vietnamese: string;
  plural?: string;
  type: string;
  phonetic?: string;
}

function mapWordType(typeVi: string): string {
  const typeMap: Record<string, string> = {
    'Danh từ': 'NOMEN',
    'Động từ': 'VERB',
    'Tính từ': 'ADJEKTIV',
    'Trạng từ': 'ADVERB',
    'Đại từ': 'PRONOMEN',
    'Giới từ': 'PRAPOSITION',
    'Liên từ': 'KONJUNKTION',
    'Cụm từ': 'PHRASE',
    'Thành ngữ': 'REDEWENDUNG',
    'verb': 'VERB',
    'adj': 'ADJEKTIV',
    'adv': 'ADVERB',
  };
  return typeMap[typeVi] || 'NOMEN';
}

// Detect type from article (der/die/das)
function detectTypeFromArticle(word: string): string {
  if (word.startsWith('der ') || word.startsWith('die ') || word.startsWith('das ')) {
    return 'NOMEN';
  }
  return 'NOMEN'; // Default for German words
}

function parseVocabularyTable(content: string): VocabWord[] {
  const words: VocabWord[] = [];
  
  // Line-by-line parser for all B1 formats
  const lines = content.split('\n');
  let inTable = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Detect table separator (3, 4, or 5 columns)
    if (trimmed.match(/^\|[-:\s]+\|[-:\s]+\|[-:\s]+/) && trimmed.endsWith('|')) {
      inTable = true;
      continue;
    }
    
    if (inTable && trimmed.startsWith('|')) {
      const cells = trimmed.split('|').map(c => c.trim()).filter(c => c);
      
      // Skip header row with **
      if (cells.some(c => c.includes('**Từ vựng**') || c.includes('**Loại từ**'))) {
        continue;
      }
      
      // Format 1: number | word | plural | phonetic | meaning (5 columns)
      if (cells.length >= 5 && cells[0].match(/^\d+$/)) {
        const german = cells[1].replace(/\*\*/g, '').trim();
        const plural = cells[2] !== '-' && cells[2] !== '' ? cells[2].trim() : undefined;
        const phonetic = cells[3] !== '-' ? cells[3].replace(/[\[\]]/g, '').trim() : undefined;
        const vietnamese = cells[4].trim();
        
        if (german && vietnamese) {
          words.push({
            german,
            vietnamese,
            plural,
            type: detectTypeFromArticle(german),
            phonetic,
          });
        }
      }
      // Format 2: word | plural | type | phonetic | meaning (5 columns)
      else if (cells.length >= 5 && !cells[0].match(/^\d+$/)) {
        const german = cells[0].replace(/\*\*/g, '').trim();
        const plural = cells[1] !== '-' && cells[1] !== '' ? cells[1].trim() : undefined;
        const type = cells[2].trim();
        const phonetic = cells[3] !== '-' ? cells[3].replace(/[\[\]]/g, '').trim() : undefined;
        const vietnamese = cells[4].trim();
        
        if (german && vietnamese && type) {
          const exists = words.find(w => w.german === german && w.vietnamese === vietnamese);
          if (!exists) {
            words.push({
              german,
              vietnamese,
              plural,
              type: mapWordType(type),
              phonetic,
            });
          }
        }
      }
      // Format 3: word | type | phonetic | meaning (4 columns)
      else if (cells.length === 4) {
        const german = cells[0].replace(/\*\*/g, '').trim();
        const type = cells[1].trim();
        const phonetic = cells[2] !== '-' ? cells[2].replace(/[\[\]]/g, '').trim() : undefined;
        const vietnamese = cells[3].trim();
        
        if (german && vietnamese && type && !german.match(/^\d+$/)) {
          const exists = words.find(w => w.german === german && w.vietnamese === vietnamese);
          if (!exists) {
            words.push({
              german,
              vietnamese,
              type: mapWordType(type),
              phonetic,
            });
          }
        }
      }
      // Format 4: word | phonetic | meaning (3 columns - rare)
      else if (cells.length === 3) {
        const german = cells[0].replace(/\*\*/g, '').trim();
        const phonetic = cells[1] !== '-' ? cells[1].replace(/[\[\]]/g, '').trim() : undefined;
        const vietnamese = cells[2].trim();
        
        if (german && vietnamese && !german.match(/^\d+$/)) {
          const exists = words.find(w => w.german === german && w.vietnamese === vietnamese);
          if (!exists) {
            words.push({
              german,
              vietnamese,
              type: detectTypeFromArticle(german),
              phonetic,
            });
          }
        }
      }
    }
    
    if (inTable && !trimmed.startsWith('|')) {
      inTable = false;
    }
  }
  
  return words;
}

async function importB1Vocabulary() {
  console.log('🚀 Importing B1 vocabulary...\n');
  
  const contentBase = path.join(process.cwd(), 'src', 'content');
  const b1Path = path.join(contentBase, 'b1niveau', 'vokabular');
  
  const vocabularyLevel = await prisma.vocabularyLevel.findUnique({
    where: { name: 'B1' },
  });
  
  if (!vocabularyLevel) {
    console.log('❌ B1 level not found in database');
    return;
  }
  
  if (!fs.existsSync(b1Path)) {
    console.log('❌ B1 vokabular folder not found');
    return;
  }
  
  const topicFolders = fs.readdirSync(b1Path)
    .filter(f => fs.statSync(path.join(b1Path, f)).isDirectory());
  
  console.log(`Found ${topicFolders.length} topic folders\n`);
  
  // Get max order
  const maxOrderResult = await prisma.vocabularyTopic.aggregate({
    where: { levelId: vocabularyLevel.id },
    _max: { order: true },
  });
  let nextOrder = (maxOrderResult._max.order || 0) + 1;
  
  let totalWords = 0;
  let totalTopics = 0;
  
  for (const topicFolder of topicFolders) {
    const topicPath = path.join(b1Path, topicFolder);
    const topicName = topicFolder.replace(/^\d+-/, '').replace(/-/g, ' ');
    const topicSlug = topicName.toLowerCase().replace(/\s+/g, '-');
    
    const mdFiles = fs.readdirSync(topicPath)
      .filter(f => f.endsWith('.md') && f !== 'index.md');
    
    if (mdFiles.length === 0) continue;
    
    console.log(`📂 ${topicFolder} (${mdFiles.length} files)`);
    
    // Check if topic exists
    let topic = await prisma.vocabularyTopic.findUnique({
      where: {
        levelId_slug: {
          levelId: vocabularyLevel.id,
          slug: topicSlug,
        },
      },
    });
    
    // Create if not exists
    if (!topic) {
      try {
        topic = await prisma.vocabularyTopic.create({
          data: {
            name: topicName,
            displayName: topicName,
            levelId: vocabularyLevel.id,
            slug: topicSlug,
            order: nextOrder++,
          },
        });
        totalTopics++;
        console.log(`   ✅ Created topic: ${topicName}`);
      } catch (error) {
        console.error(`   ❌ Error creating topic:`, (error as Error).message);
        continue;
      }
    }
    
    // Parse all MD files
    let topicWords = 0;
    for (const mdFile of mdFiles) {
      const filePath = path.join(topicPath, mdFile);
      const content = fs.readFileSync(filePath, 'utf-8');
      const words = parseVocabularyTable(content);
      
      console.log(`   📄 ${mdFile}: found ${words.length} words`);
      
      for (const word of words) {
        try {
          await prisma.vocabularyEntry.upsert({
            where: {
              german_vietnamese_levelId_topicId: {
                german: word.german,
                vietnamese: word.vietnamese,
                levelId: vocabularyLevel.id,
                topicId: topic.id,
              },
            },
            update: {
              phonetic: word.phonetic,
              plural: word.plural,
              type: word.type as any,
            },
            create: {
              german: word.german,
              vietnamese: word.vietnamese,
              phonetic: word.phonetic,
              plural: word.plural,
              type: word.type as any,
              levelId: vocabularyLevel.id,
              topicId: topic.id,
            },
          });
          topicWords++;
          totalWords++;
        } catch (error) {
          // Ignore duplicates
        }
      }
    }
    
    console.log(`   ✅ ${topicWords} words imported\n`);
  }
  
  console.log(`✨ Import completed!`);
  console.log(`   📂 New topics created: ${totalTopics}`);
  console.log(`   📝 Total words imported: ${totalWords}`);
}

importB1Vocabulary()
  .then(() => {
    console.log('\n✅ Done!');
    process.exit(0);
  })
  .catch((e) => {
    console.error('\n❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
