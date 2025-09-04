import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function cleanVocabularyData() {
  console.log('🧹 Starting vocabulary data cleanup...\n')

  try {
    // 1. Lấy tất cả vocabulary entries với relations
    const allEntries = await prisma.vocabularyEntry.findMany({
      include: {
        level: true,
        topic: true
      }
    })

    console.log(`📊 Total entries found: ${allEntries.length}\n`)

    // 2. Tìm các entry có vấn đề
    const problematicEntries = []

    for (const entry of allEntries) {
      const issues = []

      // Kiểm tra nghĩa "chưa xác định"
      if (entry.vietnamese && (
        entry.vietnamese.toLowerCase().includes('chưa xác định') ||
        entry.vietnamese.toLowerCase().includes('undefined') ||
        entry.vietnamese.toLowerCase().includes('không xác định') ||
        entry.vietnamese.toLowerCase().includes('???') ||
        entry.vietnamese.toLowerCase().includes('chưa rõ') ||
        entry.vietnamese.toLowerCase().includes('không rõ') ||
        entry.vietnamese.trim() === '' ||
        entry.vietnamese.trim() === '-' ||
        entry.vietnamese.trim() === '?'
      )) {
        issues.push('❌ Nghĩa chưa xác định')
      }

      // Kiểm tra danh từ không có giới từ
      if (entry.type === 'NOMEN' && entry.german) {
        const germanText = entry.german.toLowerCase().trim()
        if (!germanText.startsWith('der ') && 
            !germanText.startsWith('die ') && 
            !germanText.startsWith('das ')) {
          issues.push('❌ Danh từ không có giới từ')
        }
      }

      // Kiểm tra German text trống hoặc không hợp lệ
      if (!entry.german || entry.german.trim() === '' || entry.german.trim() === '-' || entry.german.trim() === '?') {
        issues.push('❌ Từ tiếng Đức trống/không hợp lệ')
      }

      // Kiểm tra Vietnamese text trống hoặc không hợp lệ
      if (!entry.vietnamese || entry.vietnamese.trim() === '' || entry.vietnamese.trim() === '-') {
        issues.push('❌ Nghĩa tiếng Việt trống')
      }

      // Kiểm tra các từ có nội dung không rõ ràng
      if (entry.german && (
        entry.german.toLowerCase().includes('unknown') ||
        entry.german.toLowerCase().includes('undefined') ||
        entry.german.toLowerCase().includes('???')
      )) {
        issues.push('❌ Từ tiếng Đức không rõ ràng')
      }

      if (issues.length > 0) {
        problematicEntries.push({
          id: entry.id,
          german: entry.german,
          vietnamese: entry.vietnamese,
          type: entry.type,
          level: entry.level.name,
          topic: entry.topic.name,
          issues: issues
        })
      }
    }

    console.log(`🔍 Found ${problematicEntries.length} problematic entries:\n`)

    // 3. Hiển thị danh sách các entry có vấn đề
    problematicEntries.forEach((entry, index) => {
      console.log(`${index + 1}. ID: ${entry.id}`)
      console.log(`   German: "${entry.german}"`)
      console.log(`   Vietnamese: "${entry.vietnamese}"`)
      console.log(`   Type: ${entry.type}`)
      console.log(`   Level: ${entry.level} | Topic: ${entry.topic}`)
      console.log(`   Issues: ${entry.issues.join(', ')}`)
      console.log('')
    })

    // 4. Xóa các entry có vấn đề
    if (problematicEntries.length > 0) {
      console.log('🗑️  Deleting problematic entries...')
      
      const idsToDelete = problematicEntries.map(entry => entry.id)
      
      const deleteResult = await prisma.vocabularyEntry.deleteMany({
        where: {
          id: {
            in: idsToDelete
          }
        }
      })

      console.log(`✅ Deleted ${deleteResult.count} entries`)
    } else {
      console.log('✅ No problematic entries found!')
    }

    // 5. Thống kê sau khi cleanup
    const remainingEntries = await prisma.vocabularyEntry.count()
    console.log(`\n📊 Final statistics:`)
    console.log(`   - Remaining entries: ${remainingEntries}`)
    console.log(`   - Deleted entries: ${allEntries.length - remainingEntries}`)

    // 6. Kiểm tra danh từ có gender
    const nounsWithGender = await prisma.vocabularyEntry.count({
      where: {
        type: 'NOMEN',
        OR: [
          { german: { startsWith: 'der ' } },
          { german: { startsWith: 'die ' } },
          { german: { startsWith: 'das ' } }
        ]
      }
    })

    const totalNouns = await prisma.vocabularyEntry.count({
      where: {
        type: 'NOMEN'
      }
    })

    console.log(`   - Nouns with gender: ${nounsWithGender}/${totalNouns}`)

    // 7. Hiển thị thống kê theo loại từ
    console.log(`\n📈 Vocabulary by type:`)
    const typeStats = await prisma.vocabularyEntry.groupBy({
      by: ['type'],
      _count: {
        id: true
      }
    })

    typeStats.forEach(stat => {
      console.log(`   - ${stat.type}: ${stat._count.id}`)
    })

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Chạy cleanup
cleanVocabularyData()
