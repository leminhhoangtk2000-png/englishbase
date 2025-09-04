import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateRevolutioniert() {
  try {
    console.log('Updating revolutioniert entry...');
    
    const updated = await prisma.vocabularyEntry.update({
      where: {
        id: 'cmf4y7f9z001xbm808439zugp'
      },
      data: {
        vietnamese: 'cách mạng hóa',
        phonetic: '/ʁevoˌluʦjoˈniːɐt/',
        type: 'VERB',
        exampleGerman: 'Künstliche Intelligenz hat die Industrie revolutioniert.',
        exampleVietnamese: 'Trí tuệ nhân tạo đã cách mạng hóa ngành công nghiệp.'
      }
    });
    
    console.log('Updated successfully:', updated);
    
  } catch (error) {
    console.error('Error updating entry:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateRevolutioniert();
