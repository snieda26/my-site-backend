import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import * as path from 'path'

const prisma = new PrismaClient()

// Path to frontend content
const FRONTEND_CONTENT_PATH = path.join(__dirname, '../../mine-copy/src/content/docs')

// Categories configuration (from frontend _config.ts)
const categories = [
	{ slug: 'html-css', nameEn: 'HTML & CSS', nameUa: 'HTML & CSS', order: 1 },
	{ slug: 'javascript', nameEn: 'JavaScript', nameUa: 'JavaScript', order: 2 },
	{ slug: 'typescript', nameEn: 'TypeScript', nameUa: 'TypeScript', order: 3 },
	{ slug: 'react', nameEn: 'React', nameUa: 'React', order: 4 },
	{ slug: 'vue', nameEn: 'Vue', nameUa: 'Vue', order: 5 },
	{ slug: 'angular', nameEn: 'Angular', nameUa: 'Angular', order: 6 },
	{ slug: 'redux', nameEn: 'Redux', nameUa: 'Redux', order: 7 },
	{ slug: 'general-questions', nameEn: 'General Questions', nameUa: 'Загальні питання', order: 8 },
	{ slug: 'architecture', nameEn: 'Architecture', nameUa: 'Архітектура', order: 9 },
	{ slug: 'principles', nameEn: 'Principles', nameUa: 'Принципи', order: 10 },
	{ slug: 'patterns', nameEn: 'Patterns', nameUa: 'Паттерни', order: 11 },
]

// Frontmatter parser
interface Frontmatter {
	title: string
	description?: string
	section: string
	slug: string
	prev?: string | null
	next?: string | null
}

function parseFrontmatter(fileContent: string): { frontmatter: Frontmatter; content: string } {
	const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
	const match = fileContent.match(frontmatterRegex)

	if (!match) {
		throw new Error('No frontmatter found')
	}

	const [, frontmatterStr, content] = match
	const frontmatter: any = {}

	const lines = frontmatterStr.split('\n')
	for (const line of lines) {
		const colonIndex = line.indexOf(':')
		if (colonIndex === -1) continue

		const key = line.slice(0, colonIndex).trim()
		let value: any = line.slice(colonIndex + 1).trim()

		if (value === 'null' || value === '') {
			value = null
		} else if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1)
		}

		frontmatter[key] = value
	}

	return { frontmatter: frontmatter as Frontmatter, content: content.trim() }
}

// Read markdown files for a specific language
function readMarkdownFile(
	categorySlug: string,
	slug: string,
	language: 'en' | 'ua'
): { frontmatter: Frontmatter; content: string } | null {
	const categoryPath = path.join(FRONTEND_CONTENT_PATH, categorySlug)

	// Try language-specific file first: slug.en.md or slug.ua.md
	const langSpecificFile = path.join(categoryPath, `${slug}.${language}.md`)
	if (fs.existsSync(langSpecificFile)) {
		const fileContent = fs.readFileSync(langSpecificFile, 'utf8')
		return parseFrontmatter(fileContent)
	}

	// Fallback to base file: slug.md (use for both languages)
	const baseFile = path.join(categoryPath, `${slug}.md`)
	if (fs.existsSync(baseFile)) {
		const fileContent = fs.readFileSync(baseFile, 'utf8')
		return parseFrontmatter(fileContent)
	}

	return null
}

// Get all unique question slugs from a category (excluding language suffixes)
function getQuestionSlugs(categorySlug: string): string[] {
	const categoryPath = path.join(FRONTEND_CONTENT_PATH, categorySlug)

	if (!fs.existsSync(categoryPath)) {
		return []
	}

	const files = fs.readdirSync(categoryPath).filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))

	const slugs = new Set<string>()

	for (const file of files) {
		// Remove .md, .mdx extensions and language suffixes (.en, .ua)
		let slug = file.replace(/\.(md|mdx)$/, '')
		// Remove language suffix if present
		slug = slug.replace(/\.(en|ua)$/, '')
		slugs.add(slug)
	}

	return Array.from(slugs)
}

async function seed() {
	console.log('🌱 Starting database seed...\n')

	try {
		// Clear existing data
		console.log('🧹 Clearing existing questions and categories...')
		await prisma.question.deleteMany()
		await prisma.category.deleteMany()
		console.log('✅ Cleared existing data\n')

		// Seed categories
		console.log('📚 Seeding categories...')
		const createdCategories = new Map<string, string>() // slug -> id

		for (const category of categories) {
			const created = await prisma.category.create({
				data: {
					slug: category.slug,
					nameEn: category.nameEn,
					nameUa: category.nameUa,
					order: category.order,
				},
			})
			createdCategories.set(category.slug, created.id)
			console.log(`  ✓ ${category.nameEn} (${category.slug})`)
		}
		console.log(`✅ Created ${createdCategories.size} categories\n`)

		// Seed questions from markdown files
		console.log('📝 Seeding questions from markdown files...')
		let totalQuestions = 0

		for (const category of categories) {
			const questionSlugs = getQuestionSlugs(category.slug)

			if (questionSlugs.length === 0) {
				console.log(`  ⊘ No questions found for ${category.slug}`)
				continue
			}

			console.log(`\n  📂 Processing ${category.slug}:`)

			for (let i = 0; i < questionSlugs.length; i++) {
				const slug = questionSlugs[i]
				const categoryId = createdCategories.get(category.slug)

				if (!categoryId) {
					console.error(`  ❌ Category ID not found for ${category.slug}`)
					continue
				}

				// Read both language versions
				const enDoc = readMarkdownFile(category.slug, slug, 'en')
				const uaDoc = readMarkdownFile(category.slug, slug, 'ua')

				if (!enDoc && !uaDoc) {
					console.error(`    ❌ No markdown files found for ${slug}`)
					continue
				}

				// Use English as primary, fallback to Ukrainian if English not available
				const primaryDoc = enDoc || uaDoc!
				const secondaryDoc = uaDoc || enDoc!

				try {
					await prisma.question.create({
						data: {
							slug: slug,
							titleEn: enDoc?.frontmatter.title || primaryDoc.frontmatter.title,
							titleUa: uaDoc?.frontmatter.title || primaryDoc.frontmatter.title,
							descriptionEn: enDoc?.frontmatter.description,
							descriptionUa: uaDoc?.frontmatter.description || enDoc?.frontmatter.description,
							contentMarkdown: enDoc?.content || primaryDoc.content, // Use English for now
							categoryId: categoryId,
							order: i + 1,
							difficulty: 'MEDIUM',
							prevSlug: primaryDoc.frontmatter.prev,
							nextSlug: primaryDoc.frontmatter.next,
						},
					})

					const langIndicator = enDoc && uaDoc ? '🌐' : enDoc ? '🇬🇧' : '🇺🇦'
					console.log(`    ✓ ${slug} ${langIndicator}`)
					totalQuestions++
				} catch (err) {
					console.error(`    ❌ Error creating question ${slug}:`, err)
				}
			}
		}

		console.log(`\n✅ Successfully seeded ${totalQuestions} questions!\n`)
		console.log('🎉 Database seed completed!')
	} catch (error) {
		console.error('❌ Error during seed:', error)
		throw error
	} finally {
		await prisma.$disconnect()
	}
}

seed()
	.catch((error) => {
		console.error('💥 Fatal error:', error)
		process.exit(1)
	})
