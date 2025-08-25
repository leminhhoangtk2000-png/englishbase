import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // Import vocabulary data
    await seedVocabulary()

    console.log('✅ Seeding completed!')
}

async function seedVocabulary() {
    console.log('📚 Seeding vocabulary data...')

    // Read vocabulary files
    const dataDir = path.join(process.cwd(), 'src/data')
    const vocabularyFiles = [
        'vocabulary-body-comprehensive-b1.json',
        'vocabulary-complete-all-b1.json',
        'vocabulary-comprehensive-all-b1.json',
        'vocabulary-extended-all-b1.json',
        'vocabulary-verbs-adjectives-b1.json',
        'vocabulary-wohnen.json'
    ]

    for (const fileName of vocabularyFiles) {
        const filePath = path.join(dataDir, fileName)

        if (fs.existsSync(filePath)) {
            console.log(`📖 Processing ${fileName}...`)

            const fileContent = fs.readFileSync(filePath, 'utf-8')
            const vocabularyData = JSON.parse(fileContent)

            for (const item of vocabularyData) {
                try {
                    // Map vocabulary type
                    let type = 'OTHER'
                    if (item.type) {
                        switch (item.type.toLowerCase()) {
                            case 'nomen':
                            case 'noun':
                                type = 'NOMEN'
                                break
                            case 'verb':
                                type = 'VERB'
                                break
                            case 'adjektiv':
                            case 'adjective':
                                type = 'ADJEKTIV'
                                break
                            case 'adverb':
                                type = 'ADVERB'
                                break
                            default:
                                type = 'OTHER'
                        }
                    }

                    // Map language level
                    let level = 'A1'
                    if (item.level) {
                        level = item.level.toUpperCase()
                    }

                    // Determine category from filename
                    let category = fileName.replace('vocabulary-', '').replace('.json', '')
                    if (fileName.includes('b1')) {
                        category = 'b1-complete'
                    }

                    await prisma.vocabularyEntry.upsert({
                        where: {
                            german_vietnamese: {
                                german: item.german,
                                vietnamese: item.vietnamese
                            }
                        },
                        update: {},
                        create: {
                            german: item.german,
                            vietnamese: item.vietnamese,
                            phonetic: item.phonetic || null,
                            plural: item.plural || null,
                            type: type as any,
                            level: level as any,
                            exampleGerman: item.exampleGerman || null,
                            exampleVietnamese: item.exampleVietnamese || null,
                            category: category,
                            difficulty: 1,
                            frequency: 0
                        }
                    })
                } catch (error) {
                    console.error(`Error processing item ${item.german}:`, error)
                }
            }

            console.log(`✅ Completed ${fileName}`)
        } else {
            console.log(`⚠️  File not found: ${fileName}`)
        }
    }

    console.log('📚 Vocabulary seeding completed!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
