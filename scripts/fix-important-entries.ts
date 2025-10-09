#!/usr/bin/env ts-node

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Danh sách các entries quan trọng cần có ví dụ chuẩn
const importantEntries = [
  {
    german: 'die Schwester',
    exampleGerman: 'Meine Schwester studiert Medizin.',
    exampleVietnamese: 'Chị gái tôi học ngành y.',
    plural: 'die Schwestern'
  },
  {
    german: 'Abenteuer erleben',
    exampleGerman: 'Im Dschungel haben wir viele aufregende Abenteuer erlebt.',
    exampleVietnamese: 'Trong rừng rậm, chúng tôi đã trải nghiệm nhiều cuộc phiêu lưu thú vị.',
    plural: null // Không có số nhiều cho verb phrase
  },
  {
    german: 'der Bruder',
    exampleGerman: 'Mein Bruder arbeitet als Ingenieur.',
    exampleVietnamese: 'Anh trai tôi làm việc như một kỹ sư.',
    plural: 'die Brüder'
  },
  {
    german: 'die Mutter',
    exampleGerman: 'Meine Mutter kocht sehr gut.',
    exampleVietnamese: 'Mẹ tôi nấu ăn rất ngon.',
    plural: 'die Mütter'
  },
  {
    german: 'der Vater',
    exampleGerman: 'Mein Vater liest gerne Zeitung.',
    exampleVietnamese: 'Bố tôi thích đọc báo.',
    plural: 'die Väter'
  },
  {
    german: 'das Haus',
    exampleGerman: 'Das Haus ist sehr groß.',
    exampleVietnamese: 'Ngôi nhà rất lớn.',
    plural: 'die Häuser'
  },
  {
    german: 'die Wohnung',
    exampleGerman: 'Die Wohnung hat drei Zimmer.',
    exampleVietnamese: 'Căn hộ có ba phòng.',
    plural: 'die Wohnungen'
  },
  {
    german: 'das Auto',
    exampleGerman: 'Mein Auto ist rot.',
    exampleVietnamese: 'Xe hơi của tôi màu đỏ.',
    plural: 'die Autos'
  },
  {
    german: 'der Freund',
    exampleGerman: 'Mein Freund kommt aus Italien.',
    exampleVietnamese: 'Bạn trai tôi đến từ Ý.',
    plural: 'die Freunde'
  },
  {
    german: 'die Freundin',
    exampleGerman: 'Meine Freundin studiert Kunst.',
    exampleVietnamese: 'Bạn gái tôi học nghệ thuật.',
    plural: 'die Freundinnen'
  }
]

async function fixImportantEntries() {
  try {
    console.log('🎯 Fixing important vocabulary entries with standard examples...\n')
    
    let successCount = 0
    let notFoundCount = 0
    
    for (const entry of importantEntries) {
      try {
        // Tìm entry trong database
        const dbEntry = await prisma.vocabularyEntry.findFirst({
          where: {
            german: entry.german
          }
        })
        
        if (dbEntry) {
          // Cập nhật với ví dụ chuẩn
          const updateData: any = {
            exampleGerman: entry.exampleGerman,
            exampleVietnamese: entry.exampleVietnamese
          }
          
          // Chỉ thêm plural nếu có
          if (entry.plural !== null) {
            updateData.plural = entry.plural
          }
          
          await prisma.vocabularyEntry.update({
            where: { id: dbEntry.id },
            data: updateData
          })
          
          console.log(`✅ ${entry.german}`)
          console.log(`   German: ${entry.exampleGerman}`)
          console.log(`   Vietnamese: ${entry.exampleVietnamese}`)
          if (entry.plural) {
            console.log(`   Plural: ${entry.plural}`)
          }
          console.log('')
          
          successCount++
        } else {
          console.log(`❌ Not found: ${entry.german}`)
          notFoundCount++
        }
      } catch (error) {
        console.log(`❌ Error updating ${entry.german}: ${error}`)
      }
    }
    
    console.log(`📊 Summary:`)
    console.log(`✅ Successfully updated: ${successCount}`)
    console.log(`❌ Not found: ${notFoundCount}`)
    
    // Kiểm tra lại entry "die Schwester"
    console.log('\n🔍 Verifying "die Schwester" entry:')
    const schwesterEntry = await prisma.vocabularyEntry.findFirst({
      where: { german: 'die Schwester' },
      select: {
        german: true,
        vietnamese: true,
        exampleGerman: true,
        exampleVietnamese: true,
        plural: true,
        type: true
      }
    })
    
    if (schwesterEntry) {
      console.log(JSON.stringify(schwesterEntry, null, 2))
    } else {
      console.log('❌ Entry not found!')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

fixImportantEntries()
