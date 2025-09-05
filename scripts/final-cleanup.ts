import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function finalCleanup() {
  console.log('🧹 Final cleanup of remaining issues...\n')

  try {
    // 1. Xử lý duplicate "das Auto"
    console.log('🔍 Fixing duplicates...')
    
    const autoEntries = await prisma.vocabularyEntry.findMany({
      where: {
        german: 'das Auto'
      },
      include: {
        level: true,
        topic: true
      }
    })

    if (autoEntries.length > 1) {
      console.log(`Found ${autoEntries.length} duplicate "das Auto" entries:`)
      autoEntries.forEach((entry, index) => {
        console.log(`  ${index + 1}. ID: ${entry.id} | Level: ${entry.level.name} | Topic: ${entry.topic.name}`)
      })

      // Giữ lại entry A1/allgemein (phổ biến hơn), xóa A2/Reisen
      const entryToDelete = autoEntries.find(e => e.level.name === 'A2' && e.topic.name === 'Reisen')
      
      if (entryToDelete) {
        await prisma.vocabularyEntry.delete({
          where: { id: entryToDelete.id }
        })
        console.log(`  ✅ Deleted duplicate: A2/Reisen entry`)
      }
    }

    // 2. Kiểm tra và quyết định về "der Test"
    console.log('\n🔍 Checking test content...')
    
    const testEntry = await prisma.vocabularyEntry.findFirst({
      where: {
        german: 'der Test'
      },
      include: {
        level: true,
        topic: true
      }
    })

    if (testEntry) {
      console.log(`Found "der Test" entry:`)
      console.log(`  German: "${testEntry.german}"`)
      console.log(`  Vietnamese: "${testEntry.vietnamese}"`)
      console.log(`  Level: ${testEntry.level.name} | Topic: ${testEntry.topic.name}`)
      
      // "der Test" là từ hợp lệ trong tiếng Đức (bài kiểm tra), nên chúng ta giữ lại
      console.log(`  ℹ️  "der Test" is a valid German word (test/exam), keeping it.`)
    }

    // 3. Kiểm tra và làm sạch các entries có nội dung không rõ ràng
    console.log('\n🔍 Final quality check...')
    
    const suspiciousEntries = await prisma.vocabularyEntry.findMany({
      where: {
        OR: [
          { vietnamese: { contains: 'chưa' } },
          { vietnamese: { contains: 'undefined' } },
          { vietnamese: { contains: '???' } },
          { vietnamese: { equals: '' } },
          { german: { equals: '' } }
        ]
      }
    })

    if (suspiciousEntries.length > 0) {
      console.log(`Found ${suspiciousEntries.length} suspicious entries for review:`)
      suspiciousEntries.forEach((entry, index) => {
        console.log(`  ${index + 1}. "${entry.german}" → "${entry.vietnamese}"`)
      })
    } else {
      console.log('  ✅ No suspicious entries found')
    }

    // 4. Final statistics
    console.log('\n📊 Final statistics after cleanup:')
    
    const totalEntries = await prisma.vocabularyEntry.count()
    console.log(`  Total entries: ${totalEntries}`)

    const statsByType = await prisma.vocabularyEntry.groupBy({
      by: ['type'],
      _count: { id: true }
    })

    console.log('  By type:')
    statsByType.forEach(stat => {
      console.log(`    ${stat.type}: ${stat._count.id}`)
    })

    // Kiểm tra noun gender coverage
    const totalNouns = await prisma.vocabularyEntry.count({
      where: { type: 'NOMEN' }
    })

    const nounsWithGender = await prisma.vocabularyEntry.count({
      where: {
        type: 'NOMEN',
        OR: [
          { german: { startsWith: 'der ' } },
          { german: { startsWith: 'die ' } },
          { german: { startsWith: 'das ' } },
          { german: { startsWith: 'Der ' } },
          { german: { startsWith: 'Die ' } },
          { german: { startsWith: 'Das ' } }
        ]
      }
    })

    console.log(`  Noun gender coverage: ${nounsWithGender}/${totalNouns} (${((nounsWithGender / totalNouns) * 100).toFixed(1)}%)`)

    console.log('\n✅ Database cleanup completed!')
    console.log('   Status: Ready for production use')

  } catch (error) {
    console.error('❌ Error during cleanup:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Chạy cleanup
finalCleanup()
