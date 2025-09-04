import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

interface DuplicateIssue {
  word: string
  entries: any[]
}

interface FieldIssue {
  id: string
  german: string
  vietnamese: string
  issue: string
}

interface SuspiciousIssue {
  id: string
  german: string
  vietnamese: string
  pattern: string
}

interface NounIssue {
  id: string
  german: string
  vietnamese: string
}

async function detailedVocabularyAudit() {
  console.log('🔍 Detailed vocabulary audit...\n')

  try {
    // 1. Kiểm tra tất cả entries
    const allEntries = await prisma.vocabularyEntry.findMany({
      include: {
        level: true,
        topic: true
      }
    })

    console.log(`📊 Total entries: ${allEntries.length}\n`)

    // 2. Phân tích chi tiết
    const issues = {
      duplicates: [] as DuplicateIssue[],
      emptyFields: [] as FieldIssue[],
      suspiciousContent: [] as SuspiciousIssue[],
      misformattedNouns: [] as NounIssue[],
      otherIssues: [] as FieldIssue[]
    }

    // Tìm duplicates
    const germanWords = new Map()
    allEntries.forEach(entry => {
      const key = entry.german.toLowerCase().trim()
      if (germanWords.has(key)) {
        issues.duplicates.push({
          word: entry.german,
          entries: [germanWords.get(key), entry]
        })
      } else {
        germanWords.set(key, entry)
      }
    })

    // Kiểm tra từng entry
    allEntries.forEach(entry => {
      // Empty fields
      if (!entry.vietnamese || entry.vietnamese.trim().length < 2) {
        issues.emptyFields.push({
          id: entry.id,
          german: entry.german,
          vietnamese: entry.vietnamese,
          issue: 'Vietnamese too short'
        })
      }

      if (!entry.german || entry.german.trim().length < 2) {
        issues.emptyFields.push({
          id: entry.id,
          german: entry.german,
          vietnamese: entry.vietnamese,
          issue: 'German too short'
        })
      }

      // Suspicious content
      const suspiciousPatterns = [
        'test', 'example', 'demo', 'sample', 'lorem',
        'xxx', '###', 'temp', 'placeholder'
      ]

      suspiciousPatterns.forEach(pattern => {
        if (entry.german.toLowerCase().includes(pattern) || 
            entry.vietnamese.toLowerCase().includes(pattern)) {
          issues.suspiciousContent.push({
            id: entry.id,
            german: entry.german,
            vietnamese: entry.vietnamese,
            pattern: pattern
          })
        }
      })

      // Misformatted nouns
      if (entry.type === 'NOMEN') {
        const german = entry.german.trim()
        if (!german.startsWith('der ') && 
            !german.startsWith('die ') && 
            !german.startsWith('das ') &&
            !german.startsWith('Der ') && 
            !german.startsWith('Die ') && 
            !german.startsWith('Das ')) {
          issues.misformattedNouns.push({
            id: entry.id,
            german: entry.german,
            vietnamese: entry.vietnamese
          })
        }
      }

      // Other issues
      if (entry.vietnamese.includes('http') || entry.german.includes('http')) {
        issues.otherIssues.push({
          id: entry.id,
          german: entry.german,
          vietnamese: entry.vietnamese,
          issue: 'Contains URL'
        })
      }
    })

    // 3. Report findings
    console.log('📋 AUDIT RESULTS:\n')

    if (issues.duplicates.length > 0) {
      console.log(`❌ DUPLICATES (${issues.duplicates.length}):`)
      issues.duplicates.forEach((dup, index) => {
        console.log(`  ${index + 1}. "${dup.word}"`)
        dup.entries.forEach(entry => {
          console.log(`     - ID: ${entry.id} | Level: ${entry.level.name} | Topic: ${entry.topic.name}`)
        })
      })
      console.log('')
    }

    if (issues.emptyFields.length > 0) {
      console.log(`❌ EMPTY FIELDS (${issues.emptyFields.length}):`)
      issues.emptyFields.forEach((item, index) => {
        console.log(`  ${index + 1}. ID: ${item.id} | "${item.german}" → "${item.vietnamese}" | ${item.issue}`)
      })
      console.log('')
    }

    if (issues.suspiciousContent.length > 0) {
      console.log(`⚠️  SUSPICIOUS CONTENT (${issues.suspiciousContent.length}):`)
      issues.suspiciousContent.forEach((item, index) => {
        console.log(`  ${index + 1}. "${item.german}" → "${item.vietnamese}" | Pattern: ${item.pattern}`)
      })
      console.log('')
    }

    if (issues.misformattedNouns.length > 0) {
      console.log(`⚠️  MISFORMATTED NOUNS (${issues.misformattedNouns.length}):`)
      issues.misformattedNouns.forEach((item, index) => {
        console.log(`  ${index + 1}. "${item.german}" → "${item.vietnamese}"`)
      })
      console.log('')
    }

    if (issues.otherIssues.length > 0) {
      console.log(`⚠️  OTHER ISSUES (${issues.otherIssues.length}):`)
      issues.otherIssues.forEach((item, index) => {
        console.log(`  ${index + 1}. "${item.german}" → "${item.vietnamese}" | ${item.issue}`)
      })
      console.log('')
    }

    // 4. Statistics by type and level
    console.log('📊 STATISTICS:\n')

    const statsByType = await prisma.vocabularyEntry.groupBy({
      by: ['type'],
      _count: { id: true }
    })

    console.log('By Type:')
    statsByType.forEach(stat => {
      console.log(`  ${stat.type}: ${stat._count.id}`)
    })

    const statsByLevel = await prisma.vocabularyEntry.groupBy({
      by: ['levelId'],
      _count: { id: true }
    })

    console.log('\nBy Level:')
    for (const stat of statsByLevel) {
      const level = await prisma.vocabularyLevel.findUnique({
        where: { id: stat.levelId }
      })
      console.log(`  ${level?.name || 'Unknown'}: ${stat._count.id}`)
    }

    // 5. Quality score
    const totalIssues = issues.duplicates.length + issues.emptyFields.length + 
                       issues.suspiciousContent.length + issues.misformattedNouns.length + 
                       issues.otherIssues.length
    
    const qualityScore = Math.max(0, 100 - (totalIssues / allEntries.length) * 100)
    
    console.log(`\n🎯 QUALITY SCORE: ${qualityScore.toFixed(1)}%`)
    console.log(`   Total issues: ${totalIssues}/${allEntries.length} entries`)

    if (qualityScore >= 95) {
      console.log('   Status: ✅ EXCELLENT')
    } else if (qualityScore >= 85) {
      console.log('   Status: ✅ GOOD')
    } else if (qualityScore >= 70) {
      console.log('   Status: ⚠️  NEEDS IMPROVEMENT')
    } else {
      console.log('   Status: ❌ POOR - URGENT CLEANUP NEEDED')
    }

  } catch (error) {
    console.error('❌ Error during audit:', error)
  } finally {
    await prisma.$disconnect()
  }
}

// Chạy audit
detailedVocabularyAudit()
