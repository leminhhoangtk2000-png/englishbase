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

                    // Get or create the vocabulary level
                    const vocabularyLevel = await prisma.vocabularyLevel.upsert({
                        where: { name: level },
                        update: {},
                        create: {
                            name: level,
                            displayName: `Level ${level}`,
                            description: `German language level ${level}`,
                            order: level === 'A1' ? 1 : level === 'A2' ? 2 : level === 'B1' ? 3 : level === 'B2' ? 4 : level === 'C1' ? 5 : 6
                        }
                    })

                    // Get or create the vocabulary topic
                    const vocabularyTopic = await prisma.vocabularyTopic.upsert({
                        where: { 
                            levelId_slug: {
                                levelId: vocabularyLevel.id,
                                slug: category
                            }
                        },
                        update: {},
                        create: {
                            name: category,
                            displayName: category.charAt(0).toUpperCase() + category.slice(1),
                            description: `Vocabulary topic: ${category}`,
                            levelId: vocabularyLevel.id,
                            slug: category,
                            order: 1
                        }
                    })

                    await prisma.vocabularyEntry.upsert({
                        where: {
                            german_vietnamese_levelId_topicId: {
                                german: item.german,
                                vietnamese: item.vietnamese,
                                levelId: vocabularyLevel.id,
                                topicId: vocabularyTopic.id
                            }
                        },
                        update: {},
                        create: {
                            german: item.german,
                            vietnamese: item.vietnamese,
                            phonetic: item.phonetic || null,
                            plural: item.plural || null,
                            type: type as any,
                            levelId: vocabularyLevel.id,
                            topicId: vocabularyTopic.id,
                            exampleGerman: item.exampleGerman || null,
                            exampleVietnamese: item.exampleVietnamese || null,
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
