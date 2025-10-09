import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testSearch() {
  console.log('Testing fühlen search...');
  
  const result = await prisma.vocabularyEntry.findMany({
    where: {
      german: { contains: 'fühlen', mode: 'insensitive' }
    },
    include: {
      level: true,
      topic: true
    },
    take: 3
  });
  
  console.log(`Found ${result.length} entries:`);
  result.forEach((entry, index) => {
    console.log(`\n${index + 1}. ${entry.german}`);
    console.log(`   Vietnamese: ${entry.vietnamese}`);
    console.log(`   Level: ${entry.level?.name || 'NO LEVEL'}`);
    console.log(`   Type: ${entry.type}`);
    console.log(`   Phonetic: ${entry.phonetic}`);
  });
}

testSearch().then(() => {
  process.exit(0);
}).catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
