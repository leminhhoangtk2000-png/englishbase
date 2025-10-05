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
  };
  return typeMap[typeVi] || 'NOMEN';
}

function parseVocabularyTable(content: string): VocabWord[] {
  const words: VocabWord[] = [];
  
  // Format 5 columns: word | plural | type | phonetic | meaning
  const tableRegex5 = /\|.*?\|.*?\|.*?\|.*?\|.*?\|\n\|---\|---\|---\|---\|---\|\n((?:\|.*?\|\n)+)/g;
  let match;
  
  while ((match = tableRegex5.exec(content)) !== null) {
    const rows = match[1].trim().split('\n');
    
    for (const row of rows) {
      const cells = row.split('|').map(c => c.trim()).filter(c => c);
      
      if (cells.length >= 5) {
        const german = cells[0].replace(/\*\*/g, '').trim();
        const plural = cells[1] !== '-' ? cells[1].trim() : undefined;
        const type = cells[2].trim();
        const phonetic = cells[3] !== '-' ? cells[3].replace(/[\[\]]/g, '').trim() : undefined;
        const vietnamese = cells[4].trim();
        
        if (german && vietnamese) {
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
  }
  
  // Format 4 columns: word | type | phonetic | meaning (no plural)
  const tableRegex4 = /\|.*?\|.*?\|.*?\|.*?\|\n\|---\|---\|---\|---\|\n((?:\|.*?\|\n)+)/g;
  
  while ((match = tableRegex4.exec(content)) !== null) {
    const rows = match[1].trim().split('\n');
    
    for (const row of rows) {
      const cells = row.split('|').map(c => c.trim()).filter(c => c);
      
      if (cells.length === 4) {
        const german = cells[0].replace(/\*\*/g, '').trim();
        const type = cells[1].trim();
        const phonetic = cells[2] !== '-' ? cells[2].replace(/[\[\]]/g, '').trim() : undefined;
        const vietnamese = cells[3].trim();
        
        if (german && vietnamese) {
          // Check if not already added from 5-column format
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
    }
  }
  
  return words;
}

async function importVokabularThema() {
  console.log('🚀 Importing from vokabular-thema folders...\n');
  
  const contentBase = path.join(process.cwd(), 'src', 'content');
  const levels = [
    { dir: 'a1niveau', level: 'A1' },
    { dir: 'a2niveau', level: 'A2' },
    { dir: 'b1niveau', level: 'B1' },
    { dir: 'b2niveau', level: 'B2' },
  ];
  
  let totalWords = 0;
  let totalTopics = 0;
  
  for (const { dir, level } of levels) {
    console.log(`\n📚 Processing ${level} vokabular-thema...`);
    
    const vocabularyLevel = await prisma.vocabularyLevel.findUnique({
      where: { name: level },
    });
    
    if (!vocabularyLevel) {
      console.log(`   ⚠️  Level ${level} not found in database`);
      continue;
    }
    
    const vokabularThemaPath = path.join(contentBase, dir, 'vokabular-thema');
    
    if (!fs.existsSync(vokabularThemaPath)) {
      console.log(`   ℹ️  No vokabular-thema folder`);
      continue;
    }
    
    const topicFolders = fs.readdirSync(vokabularThemaPath)
      .filter(f => fs.statSync(path.join(vokabularThemaPath, f)).isDirectory());
    
    console.log(`   Found ${topicFolders.length} topic folders`);
    
    // Get max order for this level
    const maxOrderResult = await prisma.vocabularyTopic.aggregate({
      where: { levelId: vocabularyLevel.id },
      _max: { order: true },
    });
    let nextOrder = (maxOrderResult._max.order || 0) + 1;
    
    for (const topicFolder of topicFolders) {
      const topicPath = path.join(vokabularThemaPath, topicFolder);
      const topicName = topicFolder.replace(/^\d+-/, '').replace(/-/g, ' ');
      const topicSlug = topicName.toLowerCase().replace(/\s+/g, '-');
      
      const mdFiles = fs.readdirSync(topicPath)
        .filter(f => f.endsWith('.md') && f !== 'index.md');
      
      if (mdFiles.length === 0) continue;
      
      console.log(`   📂 ${topicFolder} (${mdFiles.length} files)`);
      
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
          console.log(`      ✅ Created topic: ${topicName}`);
        } catch (error) {
          console.error(`      ❌ Error creating topic:`, (error as Error).message);
          continue;
        }
      }
      
      // Parse all MD files and import words
      let topicWords = 0;
      for (const mdFile of mdFiles) {
        const filePath = path.join(topicPath, mdFile);
        const content = fs.readFileSync(filePath, 'utf-8');
        const words = parseVocabularyTable(content);
        
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
      
      console.log(`      📝 ${topicWords} words imported`);
    }
  }
  
  console.log(`\n✨ Import completed!`);
  console.log(`   📂 New topics created: ${totalTopics}`);
  console.log(`   📝 Total words imported: ${totalWords}`);
}

importVokabularThema()
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
