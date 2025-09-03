import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function exportVocabulary() {
    console.log('🔄 Exporting vocabulary data...')

    try {
        // Export vocabulary entries with related data
        const vocabularyEntries = await prisma.vocabularyEntry.findMany({
            include: {
                level: true,
                topic: true
            }
        })

        // Export vocabulary levels
        const vocabularyLevels = await prisma.vocabularyLevel.findMany({
            include: {
                topics: true
            }
        })

        // Export vocabulary topics
        const vocabularyTopics = await prisma.vocabularyTopic.findMany({
            include: {
                level: true
            }
        })

        // Export user vocabulary (saved words)
        const userVocabulary = await prisma.userVocabulary.findMany()

        // Create export data structure
        const exportData = {
            exportedAt: new Date().toISOString(),
            version: '1.0',
            data: {
                vocabularyEntries,
                vocabularyLevels,
                vocabularyTopics,
                userVocabulary
            },
            stats: {
                totalVocabularyEntries: vocabularyEntries.length,
                totalLevels: vocabularyLevels.length,
                totalTopics: vocabularyTopics.length,
                totalUserVocabulary: userVocabulary.length
            }
        }

        // Create backup directory if it doesn't exist
        const backupDir = path.join(process.cwd(), 'backup')
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir, { recursive: true })
        }

        // Write to JSON file with timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const filename = `vocabulary-backup-${timestamp}.json`
        const filepath = path.join(backupDir, filename)

        fs.writeFileSync(filepath, JSON.stringify(exportData, null, 2), 'utf8')

        console.log('✅ Vocabulary export completed!')
        console.log(`📁 File saved: ${filepath}`)
        console.log(`📊 Statistics:`)
        console.log(`   - Vocabulary entries: ${exportData.stats.totalVocabularyEntries}`)
        console.log(`   - Levels: ${exportData.stats.totalLevels}`)
        console.log(`   - Topics: ${exportData.stats.totalTopics}`)
        console.log(`   - User vocabulary: ${exportData.stats.totalUserVocabulary}`)

        // Also create a simple vocabulary-only export for easier sharing
        const simpleVocabData = vocabularyEntries.map(entry => ({
            german: entry.german,
            vietnamese: entry.vietnamese,
            phonetic: entry.phonetic,
            plural: entry.plural,
            type: entry.type,
            exampleGerman: entry.exampleGerman,
            exampleVietnamese: entry.exampleVietnamese,
            level: entry.level.name,
            topic: entry.topic.name,
            difficulty: entry.difficulty,
            tags: entry.tags
        }))

        const simpleFilename = `vocabulary-simple-${timestamp}.json`
        const simpleFilepath = path.join(backupDir, simpleFilename)
        fs.writeFileSync(simpleFilepath, JSON.stringify(simpleVocabData, null, 2), 'utf8')

        console.log(`📄 Simple vocabulary file: ${simpleFilepath}`)

        return { success: true, filepath, simpleFilepath, stats: exportData.stats }

    } catch (error) {
        console.error('❌ Error exporting vocabulary:', error)
        return { success: false, error }
    } finally {
        await prisma.$disconnect()
    }
}

// Run export
exportVocabulary()
    .then((result) => {
        if (result.success) {
            console.log('\n🎉 Export completed successfully!')
            process.exit(0)
        } else {
            console.error('\n💥 Export failed:', result.error)
            process.exit(1)
        }
    })
    .catch((error) => {
        console.error('\n💥 Unexpected error:', error)
        process.exit(1)
    })
