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
  const tableRegex = /\|.*?\|.*?\|.*?\|.*?\|.*?\|\n\|---\|---\|---\|---\|---\|\n((?:\|.*?\|\n)+)/g;
  let match;
  
  while ((match = tableRegex.exec(content)) !== null) {
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
  
  return words;
}

async function importVocabulary() {
  console.log('🚀 Starting vocabulary import...\n');
  
  const contentBase = path.join(process.cwd(), 'src', 'content');
  const levels = [
    { dir: 'a1niveau', level: 'A1', order: 1 },
    { dir: 'a2niveau', level: 'A2', order: 2 },
    { dir: 'b1niveau', level: 'B1', order: 3 },
    { dir: 'b2niveau', level: 'B2', order: 4 },
  ];
  
  let totalWords = 0;
  let totalTopics = 0;
  
  for (const { dir, level, order } of levels) {
    console.log(`\n📚 Processing ${level}...`);
    
    // Create/get level
    const vocabularyLevel = await prisma.vocabularyLevel.upsert({
      where: { name: level },
      update: {},
      create: {
        name: level,
        displayName: level,
        description: `${level} Level`,
        order,
      },
    });
    
    const vokabularPath = path.join(contentBase, dir, 'vokabular');
    const vokabularThemaPath = path.join(contentBase, dir, 'vokabular-thema');
    
    // Collect all topic folders from both directories
    const allTopicFolders: string[] = [];
    
    if (fs.existsSync(vokabularPath)) {
      const folders = fs.readdirSync(vokabularPath)
        .filter(f => fs.statSync(path.join(vokabularPath, f)).isDirectory())
        .map(f => ({ folder: f, basePath: vokabularPath }));
      allTopicFolders.push(...folders.map(f => path.join(f.basePath, f.folder)));
    }
    
    if (fs.existsSync(vokabularThemaPath)) {
      const folders = fs.readdirSync(vokabularThemaPath)
        .filter(f => fs.statSync(path.join(vokabularThemaPath, f)).isDirectory())
        .map(f => ({ folder: f, basePath: vokabularThemaPath }));
      allTopicFolders.push(...folders.map(f => path.join(f.basePath, f.folder)));
    }
    
    if (allTopicFolders.length === 0) {
      console.log(`   ⚠️  No topic folders found`);
      continue;
    }
    
    console.log(`   Found ${allTopicFolders.length} topic folders (vokabular + vokabular-thema)`);
    
    let topicCount = 1;
    for (const topicPath of allTopicFolders) {
      const topicFolder = path.basename(topicPath);
      const topicName = topicFolder.replace(/^\d+-/, '').replace(/-/g, ' ');
      const topicSlug = topicName.toLowerCase().replace(/\s+/g, '-');
      
      // Get all .md files in topic folder
      const mdFiles = fs.readdirSync(topicPath)
        .filter(f => f.endsWith('.md') && f !== 'index.md');
      
      if (mdFiles.length === 0) continue;
      
      console.log(`   📂 ${topicFolder} (${mdFiles.length} files)`);
      
      // Create/get topic
      let topic;
      try {
        topic = await prisma.vocabularyTopic.findUnique({
          where: {
            levelId_slug: {
              levelId: vocabularyLevel.id,
              slug: topicSlug,
            },
          },
        });
        
        if (!topic) {
          topic = await prisma.vocabularyTopic.create({
            data: {
              name: topicName,
              displayName: topicName,
              levelId: vocabularyLevel.id,
              slug: topicSlug,
              order: topicCount++,
            },
          });
          totalTopics++;
        }
      } catch (error) {
        console.error(`      ❌ Error creating topic:`, (error as Error).message);
        continue;
      }
      
      // Parse all MD files in this topic
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
            // Ignore duplicate errors
          }
        }
      }
      
      console.log(`      ✅ ${topicWords} words imported`);
    }
  }
  
  console.log(`\n✨ Import completed!`);
  console.log(`   📂 Topics created: ${totalTopics}`);
  console.log(`   📝 Words imported: ${totalWords}`);
}

importVocabulary()
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
