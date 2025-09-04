import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateEnergiepolitik() {
  try {
    console.log('Updating Energiepolitik entry...');
    
    const updated = await prisma.vocabularyEntry.update({
      where: {
        id: 'cmf4xuezl000nbm80s5cj8rah'
      },
      data: {
        vietnamese: 'chính sách năng lượng',
        phonetic: '/eˈneʁɡiːpoliˌtiːk/',
        exampleGerman: 'Die Energiepolitik ist sehr wichtig für die Zukunft.',
        exampleVietnamese: 'Chính sách năng lượng rất quan trọng cho tương lai.'
      }
    });
    
    console.log('Updated successfully:', updated);
    
  } catch (error) {
    console.error('Error updating entry:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateEnergiepolitik();
