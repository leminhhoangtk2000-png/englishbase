import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateEnergiepolitiker() {
  try {
    console.log('Updating Energiepolitiker entry...');
    
    const updated = await prisma.vocabularyEntry.update({
      where: {
        id: 'cmf4xzj4j0017bm80ga8bukol'
      },
      data: {
        vietnamese: 'nhà chính trị năng lượng',
        phonetic: '/eˈneʁɡiːpoliˌtiːkɐ/',
        plural: 'die Energiepolitiker',
        exampleGerman: 'Der Energiepolitiker diskutiert über erneuerbare Energien.',
        exampleVietnamese: 'Nhà chính trị năng lượng thảo luận về năng lượng tái tạo.'
      }
    });
    
    console.log('Updated successfully:', updated);
    
  } catch (error) {
    console.error('Error updating entry:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateEnergiepolitiker();
