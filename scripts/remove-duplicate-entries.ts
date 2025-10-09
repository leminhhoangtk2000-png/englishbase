import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function removeDuplicateEntries() {
  console.log('🔍 Tìm kiếm entries trùng lặp...');
  
  // Tìm tất cả entries
  const allEntries = await prisma.vocabularyEntry.findMany({
    include: {
      level: true,
      topic: true
    },
    orderBy: {
      createdAt: 'asc' // Giữ entry cũ nhất
    }
  });

  console.log(`Tổng số entries: ${allEntries.length}`);

  // Group entries theo key (german + vietnamese + example)
  const groupedEntries = new Map<string, typeof allEntries>();

  for (const entry of allEntries) {
    const key = `${entry.german.trim().toLowerCase()}|${entry.vietnamese.trim().toLowerCase()}|${entry.exampleGerman?.trim().toLowerCase() || ''}|${entry.exampleVietnamese?.trim().toLowerCase() || ''}`;
    
    if (!groupedEntries.has(key)) {
      groupedEntries.set(key, []);
    }
    groupedEntries.get(key)!.push(entry);
  }

  // Tìm duplicates
  let duplicateCount = 0;
  let entriesToDelete: string[] = [];

  for (const [key, entries] of groupedEntries) {
    if (entries.length > 1) {
      console.log(`\n📋 Tìm thấy ${entries.length} entries trùng lặp:`);
      console.log(`Key: ${key}`);
      
      // Giữ entry đầu tiên (oldest), xóa các entry còn lại
      const [keepEntry, ...deleteEntries] = entries;
      
      console.log(`✅ Giữ lại: ID ${keepEntry.id} (${keepEntry.createdAt})`);
      
      for (const deleteEntry of deleteEntries) {
        console.log(`❌ Xóa: ID ${deleteEntry.id} (${deleteEntry.createdAt})`);
        entriesToDelete.push(deleteEntry.id);
        duplicateCount++;
      }
    }
  }

  if (entriesToDelete.length === 0) {
    console.log('\n✅ Không tìm thấy entries trùng lặp hoàn toàn!');
    return;
  }

  console.log(`\n🗑️  Sẽ xóa ${entriesToDelete.length} entries trùng lặp...`);

  // Xóa duplicates
  const deleteResult = await prisma.vocabularyEntry.deleteMany({
    where: {
      id: {
        in: entriesToDelete
      }
    }
  });

  console.log(`✅ Đã xóa ${deleteResult.count} entries trùng lặp!`);

  // Kiểm tra lại
  const finalCount = await prisma.vocabularyEntry.count();
  console.log(`📊 Số entries còn lại: ${finalCount}`);
  console.log(`📉 Đã giảm ${allEntries.length - finalCount} entries`);
}

async function main() {
  try {
    await removeDuplicateEntries();
  } catch (error) {
    console.error('❌ Lỗi:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
