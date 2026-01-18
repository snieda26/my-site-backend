/**
 * Questions Seeding Script (Drizzle)
 * Seeds interview questions from markdown files
 * @usage: yarn ts-node drizzle/seed-questions.ts
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as schema from '../src/core/database/schema'
import { eq } from 'drizzle-orm'

// Import postgres using require for CommonJS compatibility
const postgres = require('postgres')

dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
	throw new Error('DATABASE_URL не встановлено')
}

// Remove ?schema=public parameter (not supported by postgres.js)
const cleanConnectionString = connectionString.split('?')[0]

const client = postgres(cleanConnectionString)
const db = drizzle(client, { schema })

// Шлях до контенту frontend
const FRONTEND_CONTENT_PATH = path.join(__dirname, '../../mine-copy/src/content/docs')

// Конфігурація категорій
const categoriesConfig = [
	{ slug: 'html-css', nameEn: 'HTML & CSS', nameUa: 'HTML & CSS', order: 1 },
	{ slug: 'javascript', nameEn: 'JavaScript', nameUa: 'JavaScript', order: 2 },
	{ slug: 'typescript', nameEn: 'TypeScript', nameUa: 'TypeScript', order: 3 },
	{ slug: 'react', nameEn: 'React', nameUa: 'React', order: 4 },
	{ slug: 'vue', nameEn: 'Vue', nameUa: 'Vue', order: 5 },
	{ slug: 'angular', nameEn: 'Angular', nameUa: 'Angular', order: 6 },
	{ slug: 'redux', nameEn: 'Redux', nameUa: 'Redux', order: 7 },
	{ slug: 'general', nameEn: 'General Questions', nameUa: 'Загальні питання', order: 8 },
	{ slug: 'architecture', nameEn: 'Architecture', nameUa: 'Архітектура', order: 9 },
	{ slug: 'principles', nameEn: 'Principles', nameUa: 'Принципи', order: 10 },
	{ slug: 'patterns', nameEn: 'Patterns', nameUa: 'Паттерни', order: 11 },
]

// ============================================
// HELPER FUNCTIONS
// ============================================

interface Frontmatter {
	title: string
	description?: string
	section: string
	slug: string
	prev?: string | null
	next?: string | null
}

/**
 * Парсинг YAML frontmatter з markdown
 */
function parseFrontmatter(fileContent: string): { frontmatter: Frontmatter; content: string } {
	const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
	const match = fileContent.match(frontmatterRegex)

	if (!match) {
		throw new Error('Frontmatter не знайдено')
	}

	const [, frontmatterStr, content] = match
	const frontmatter: any = {}

	const lines = frontmatterStr.split('\n')
	for (const line of lines) {
		const colonIndex = line.indexOf(':')
		if (colonIndex === -1) continue

		const key = line.substring(0, colonIndex).trim()
		let value: any = line.substring(colonIndex + 1).trim()

		// Обробка null
		if (value === 'null') value = null
		// Видалення лапок
		else if (value.startsWith('"') && value.endsWith('"')) {
			value = value.slice(1, -1)
		} else if (value.startsWith("'") && value.endsWith("'")) {
			value = value.slice(1, -1)
		}

		frontmatter[key] = value
	}

	return { frontmatter: frontmatter as Frontmatter, content: content.trim() }
}

/**
 * Читання markdown файлу
 */
function readMarkdownFile(
	categorySlug: string,
	questionSlug: string,
	lang?: 'en' | 'ua'
): { frontmatter: Frontmatter; content: string } | null {
	const categoryPath = path.join(FRONTEND_CONTENT_PATH, categorySlug)
	
	if (!fs.existsSync(categoryPath)) {
		return null
	}

	// Спроба знайти файл з мовою
	const langSuffix = lang ? `.${lang}` : ''
	const filePath = path.join(categoryPath, `${questionSlug}${langSuffix}.md`)

	if (!fs.existsSync(filePath)) {
		// Fallback на файл без суфіксу
		const fallbackPath = path.join(categoryPath, `${questionSlug}.md`)
		if (!fs.existsSync(fallbackPath)) {
			return null
		}
		const fileContent = fs.readFileSync(fallbackPath, 'utf-8')
		return parseFrontmatter(fileContent)
	}

	const fileContent = fs.readFileSync(filePath, 'utf-8')
	return parseFrontmatter(fileContent)
}

/**
 * Отримання списку slugs питань для категорії
 */
function getQuestionSlugs(categorySlug: string): string[] {
	const categoryPath = path.join(FRONTEND_CONTENT_PATH, categorySlug)
	
	if (!fs.existsSync(categoryPath)) {
		return []
	}

	const files = fs.readdirSync(categoryPath)
	const slugs = new Set<string>()

	for (const file of files) {
		if (file.endsWith('.md')) {
			// Видалення .md, .en.md, .ua.md для отримання базового slug
			const slug = file
				.replace(/\.(en|ua)\.md$/, '')
				.replace(/\.md$/, '')
			slugs.add(slug)
		}
	}

	return Array.from(slugs)
}

// ============================================
// SEED QUESTIONS
// ============================================

async function seedQuestions() {
	console.log('🌱 Початок seed питань...\n')

	try {
		// Очистка існуючих питань
		console.log('🧹 Очищення існуючих питань...')
		await db.delete(schema.questions)
		console.log('  ✅ Питання очищено\n')

		console.log('📝 Імпорт питань з markdown файлів...\n')

		let totalQuestions = 0

		for (const category of categoriesConfig) {
			const questionSlugs = getQuestionSlugs(category.slug)

			if (questionSlugs.length === 0) {
				console.log(`  ⊘ Немає питань для ${category.slug}`)
				continue
			}

			console.log(`  📂 Обробка ${category.nameEn}:`)

			// Отримання ID категорії
			const [dbCategory] = await db
				.select()
				.from(schema.categories)
				.where(eq(schema.categories.slug, category.slug))
				.limit(1)

			if (!dbCategory) {
				console.error(`    ❌ Категорію ${category.slug} не знайдено в БД`)
				continue
			}

			for (let i = 0; i < questionSlugs.length; i++) {
				const slug = questionSlugs[i]

				// Читання англійської та української версій
				const enDoc = readMarkdownFile(category.slug, slug, 'en') || readMarkdownFile(category.slug, slug)
				const uaDoc = readMarkdownFile(category.slug, slug, 'ua')

				if (!enDoc) {
					console.error(`    ❌ Файл не знайдено: ${slug}`)
					continue
				}

				try {
					await db.insert(schema.questions).values({
						slug: slug,
						titleEn: enDoc.frontmatter.title,
						titleUa: uaDoc?.frontmatter.title || enDoc.frontmatter.title,
						descriptionEn: enDoc.frontmatter.description,
						descriptionUa: uaDoc?.frontmatter.description || enDoc.frontmatter.description,
						contentMarkdownEn: enDoc.content,
						contentMarkdownUa: uaDoc?.content || enDoc.content,
						categoryId: dbCategory.id,
						order: i + 1,
						difficulty: 'MEDIUM',
						prevSlug: enDoc.frontmatter.prev,
						nextSlug: enDoc.frontmatter.next,
					})

					const langIndicator = uaDoc ? '🌐' : '🇬🇧'
					console.log(`    ✓ ${slug} ${langIndicator}`)
					totalQuestions++
				} catch (error) {
					console.error(`    ❌ Помилка створення ${slug}:`, error)
				}
			}
			console.log()
		}

		console.log(`✅ Успішно створено ${totalQuestions} питань!\n`)
		console.log('🎉 Seed питань завершено!')

	} catch (error) {
		console.error('❌ Помилка seed питань:', error)
		throw error
	} finally {
		await client.end()
	}
}

seedQuestions()
