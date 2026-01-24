/**
 * Import Questions Script
 * Reads markdown files from rkdwns folder and imports them into the database
 * @usage: yarn ts-node scripts/import-questions.ts
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as schema from '../src/core/database/schema'
import { eq } from 'drizzle-orm'

const postgres = require('postgres')

dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
	throw new Error('DATABASE_URL is not set')
}

const cleanConnectionString = connectionString.split('?')[0]
const client = postgres(cleanConnectionString)
const db = drizzle(client, { schema })

// Path to markdown files
const MARKDOWN_PATH = '/Users/petro/Desktop/rkdwns'

// Category mapping based on file content
const CATEGORY_MAPPING: Record<string, string> = {
	'html': 'html-css',
	'css': 'html-css',
	'javascript': 'javascript',
	'typescript': 'typescript',
	'react': 'react',
	'vue': 'vue',
	'angular': 'angular',
	'redux': 'redux',
}

// ============================================
// HELPER FUNCTIONS
// ============================================

interface ParsedQuestion {
	title: string
	slug: string
	category: string
	content: string
	description: string
}

/**
 * Extract title from markdown content
 */
function extractTitle(content: string): string {
	// Try to find the main h1 after all the navigation
	const lines = content.split('\n')
	
	// Find the line with "**[Sign in to mark as read]**" or similar marker
	let startIndex = 0
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].includes('[Sign in to mark as read]') || lines[i].includes('# What is') || lines[i].includes('# How') || lines[i].includes('# Difference')) {
			startIndex = i
			break
		}
	}
	
	// Find first h1 after the marker
	for (let i = startIndex; i < lines.length; i++) {
		const line = lines[i].trim()
		if (line.startsWith('# ') && !line.includes('Hack Frontend')) {
			let title = line.replace(/^#\s+/, '').trim()
			// Remove common suffixes
			title = title
				.replace(/\s*\|\s*.*$/, '')
				.replace(/\s*Frontend Interview Question.*$/i, '')
				.replace(/\s*in JavaScript\?$/i, ' in JavaScript?')
				.replace(/\s*in TypeScript\?$/i, ' in TypeScript?')
				.replace(/\s*in React\?$/i, ' in React?')
				.trim()
			return title
		}
	}
	
	// Fallback: extract from filename or first h1
	const firstH1 = lines.find(l => l.trim().startsWith('# '))
	if (firstH1) {
		let title = firstH1.replace(/^#\s+/, '').replace(/\s*\|\s*.*$/, '').trim()
		title = title
			.replace(/\s*Frontend Interview Question.*$/i, '')
			.replace(/\s*in JavaScript\?$/i, ' in JavaScript?')
			.replace(/\s*in TypeScript\?$/i, ' in TypeScript?')
			.replace(/\s*in React\?$/i, ' in React?')
			.trim()
		return title
	}
	
	return 'Untitled'
}

/**
 * Extract main content (remove navigation and footer)
 */
function extractMainContent(rawContent: string): string {
	const lines = rawContent.split('\n')
	
	// Find where actual content starts
	let startIndex = 0
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim()
		// Look for the marker that indicates content start
		if (line.includes('[Sign in to mark as read]')) {
			startIndex = i + 1
			break
		}
		// Alternative: look for the main h1 title
		if (i > 200 && line.startsWith('# ') && !line.includes('Hack Frontend')) {
			startIndex = i
			break
		}
	}
	
	// Find where content ends (before footer)
	let endIndex = lines.length
	for (let i = startIndex; i < lines.length; i++) {
		const line = lines[i].trim()
		if (line.startsWith('[Back]') || line.includes('### Content') || line.includes('Back to Top')) {
			endIndex = i
			break
		}
	}
	
	// Extract and clean content
	let content = lines.slice(startIndex, endIndex).join('\n')
	
	// Remove hackfrontend.com links
	content = content.replace(/https?:\/\/(www\.)?hackfrontend\.com/g, 'http://localhost:3001')
	
	// Remove unnecessary links
	content = content.replace(/\[Back\]\([^)]+\)/g, '')
	content = content.replace(/\[Forward\]\([^)]+\)/g, '')
	content = content.replace(/\[🎉[^\]]+\]\([^)]+\)/g, '')
	
	// Clean up extra whitespace
	content = content.replace(/\n{3,}/g, '\n\n').trim()
	
	return content
}

/**
 * Determine category from file content
 * Extracts category from the Source URL in the file header
 */
function determineCategory(filename: string, rawContent: string): string {
	// Extract from Source URL: https://www.hackfrontend.com/en/docs/typescript/any-vs-unknown
	const urlMatch = rawContent.match(/Source:\s*\[([^\]]+)\]\(https?:\/\/[^\/]+\/en\/docs\/([^\/]+)/i)
	if (urlMatch) {
		const category = urlMatch[2].toLowerCase()
		
		// Map to our category slugs
		if (category === 'javascript') return 'javascript'
		if (category === 'typescript') return 'typescript'
		if (category === 'react') return 'react'
		if (category === 'vue') return 'vue'
		if (category === 'angular') return 'angular'
		if (category === 'redux') return 'redux'
		if (category === 'html-and-css' || category === 'html' || category === 'css') return 'html-css'
		if (category === 'general-questions' || category === 'general') return 'general'
		if (category === 'architecture') return 'architecture'
		if (category === 'principles') return 'principles'
		if (category === 'patterns') return 'patterns'
	}
	
	// Check filename as fallback
	const lowerFilename = filename.toLowerCase()
	if (lowerFilename.includes('react-')) return 'react'
	if (lowerFilename.includes('-ts-') || lowerFilename.includes('typescript')) return 'typescript'
	if (lowerFilename.includes('css-') || lowerFilename.includes('html-')) return 'html-css'
	if (lowerFilename.includes('vue-')) return 'vue'
	if (lowerFilename.includes('angular-')) return 'angular'
	if (lowerFilename.includes('redux-')) return 'redux'
	
	// Default to javascript
	return 'javascript'
}

/**
 * Create slug from title
 */
function createSlug(title: string): string {
	return title
		.toLowerCase()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
		.replace(/^-+|-+$/g, '')
}

/**
 * Extract description (first paragraph)
 */
function extractDescription(content: string): string {
	const lines = content.split('\n')
	
	// Skip the title and find first meaningful paragraph
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim()
		if (line && !line.startsWith('#') && !line.startsWith('**') && line.length > 20) {
			return line.substring(0, 200)
		}
	}
	
	return ''
}

/**
 * Parse markdown file
 */
function parseMarkdownFile(filepath: string): ParsedQuestion | null {
	try {
		const filename = path.basename(filepath)
		const rawContent = fs.readFileSync(filepath, 'utf-8')
		
		// Extract main content
		const content = extractMainContent(rawContent)
		
		if (!content || content.length < 50) {
			console.log(`    ⚠️  Skipping ${filename} - content too short`)
			return null
		}
		
		// Extract metadata (pass rawContent for category detection before extraction)
		const title = extractTitle(rawContent)
		const slug = createSlug(title)
		const category = determineCategory(filename, rawContent)  // Use raw content for breadcrumb
		const description = extractDescription(content)
		
		return {
			title,
			slug,
			category,
			content,
			description,
		}
	} catch (error) {
		console.error(`    ❌ Error parsing ${filepath}:`, error)
		return null
	}
}

/**
 * Translate to Ukrainian
 * Uses a comprehensive dictionary for titles and common terms
 */
function translateToUkrainian(text: string, title: string): { titleUa: string; contentUa: string; descriptionUa: string } {
	// Comprehensive title translations
	const titleTranslations: Record<string, string> = {
		'What is NaN in JavaScript?': 'Що таке NaN в JavaScript?',
		'What is a Polyfill?': 'Що таке Polyfill?',
		'What is Recursion?': 'Що таке Рекурсія?',
		'What is Garbage Collector in JavaScript?': 'Що таке Garbage Collector в JavaScript?',
		'How to Copy an Object in JavaScript?': 'Як скопіювати об\'єкт в JavaScript?',
		'What is Currying in JavaScript?': 'Що таке Каррінг в JavaScript?',
		'What is OOP in JavaScript?': 'Що таке ООП в JavaScript?',
		'Differences Between var, let and const': 'Різниця між var, let та const',
		'Event Loop': 'Event Loop (Цикл подій)',
		'Call, Apply and Bind': 'Call, Apply та Bind',
		'Set, Map, WeakSet and WeakMap': 'Set, Map, WeakSet та WeakMap',
		'IIFE (Immediately Invoked Function Expression)': 'IIFE (Негайно викликана функція)',
		'Boxing and Unboxing in JavaScript': 'Боксинг та Анбоксинг в JavaScript',
		'Difference Between event.target and event.currentTarget': 'Різниця між event.target та event.currentTarget',
		'Difference Between event.preventDefault() and event.stopPropagation()': 'Різниця між event.preventDefault() та event.stopPropagation()',
		'How to Get All Keys and Values of Object in JavaScript': 'Як отримати всі ключі та значення об\'єкта в JavaScript',
		'Mutating and Non-Mutating Array Methods in JavaScript': 'Мутуючі та немутуючі методи масивів в JavaScript',
		'What is Symbol.iterator and Why is it Needed': 'Що таке Symbol.iterator і навіщо він потрібен',
		'Why instanceof Operator is Needed in JavaScript': 'Навіщо потрібен оператор instanceof в JavaScript',
		// TypeScript
		'TypeScript Pros and Cons': 'Переваги та недоліки TypeScript',
		'What is Generic': 'Що таке Generic',
		'What is Union': 'Що таке Union',
		'infer Keyword': 'Ключове слово infer',
		'What Does implements Do?': 'Що робить implements?',
		'Partial': 'Partial (Часткове)',
		'Pick': 'Pick (Вибрати)',
		'Extract': 'Extract (Витягти)',
		'ReturnType': 'ReturnType (Тип повернення)',
		'Awaited': 'Awaited (Очікуване)',
		// React
		'How useState Works in React?': 'Як працює useState в React?',
		'How useEffect Works in React?': 'Як працює useEffect в React?',
		'How useRef Works in React?': 'Як працює useRef в React?',
		'Why useImperativeHandle is Needed in React': 'Навіщо потрібен useImperativeHandle в React',
		'How useCallback Works and Why is it Needed': 'Як працює useCallback і навіщо він потрібен',
		'What is React.memo and Why is it Needed': 'Що таке React.memo і навіщо він потрібен',
		'Rules for Using Hooks in React': 'Правила використання хуків в React',
		'Component Rendering Order and Hook Calling in React': 'Порядок рендерингу компонентів та виклику хуків в React',
		'What is Prop Drilling and How to Avoid it': 'Що таке Prop Drilling і як його уникнути',
		'Reconciliation in React': 'Reconciliation (Узгодження) в React',
		'Synthetic Events in React': 'Синтетичні події в React',
		'React.StrictMode': 'React.StrictMode (Строгий режим)',
		// CSS
		'Difference Between px, rem and em': 'Різниця між px, rem та em',
		'How to Hide Element': 'Як приховати елемент',
		'Media Query': 'Media Query (Медіазапити)',
		'Aspect Ratio': 'Aspect Ratio (Співвідношення сторін)',
		'CSS Animation': 'CSS анімація',
		'CSS Box Sizing': 'CSS Box Sizing',
		'CSS Selector': 'CSS селектори',
		'Difference Between Flexbox and Grid': 'Різниця між Flexbox та Grid',
		'Clearing Floats': 'Очищення флоатів',
		'CSS in JS': 'CSS в JS',
		'Meta Tags': 'Мета-теги',
		'Why Transform Instead of Top/Left': 'Чому Transform замість Top/Left',
		'Difference Between strong and b': 'Різниця між strong та b',
	}
	
	const titleUa = titleTranslations[title] || title
	
	// Basic content translations (common terms)
	let contentUa = text
		.replace(/\*\*Important:\*\*/g, '**Важливо:**')
		.replace(/\*\*Note:\*\*/g, '**Примітка:**')
		.replace(/\*\*Example:\*\*/g, '**Приклад:**')
		.replace(/## Example/g, '## Приклад')
		.replace(/## Conclusion/g, '## Висновок')
		.replace(/## When /g, '## Коли ')
		.replace(/## How /g, '## Як ')
		.replace(/## What /g, '## Що ')
	
	// Extract description from Ukrainian content
	const descriptionUa = extractDescription(contentUa)
	
	return { titleUa, contentUa, descriptionUa }
}

// ============================================
// MAIN IMPORT FUNCTION
// ============================================

async function importQuestions() {
	const isDryRun = process.argv.includes('--dry-run')
	
	console.log('🌱 Starting question import...')
	if (isDryRun) {
		console.log('🔍 DRY RUN MODE - No database changes will be made\n')
	} else {
		console.log()
	}
	
	try {
		// Read all markdown files
		const files = fs.readdirSync(MARKDOWN_PATH)
			.filter(f => f.endsWith('.md'))
			.map(f => path.join(MARKDOWN_PATH, f))
		
		console.log(`📚 Found ${files.length} markdown files\n`)
		
		// Clear existing questions
		if (!isDryRun) {
			console.log('🧹 Clearing existing questions...')
			await db.delete(schema.questions)
			console.log('  ✅ Questions cleared\n')
		}
		
		// Parse all files
		console.log('📖 Parsing markdown files...\n')
		const parsedQuestions: ParsedQuestion[] = []
		
		for (const file of files) {
			const parsed = parseMarkdownFile(file)
			if (parsed) {
				parsedQuestions.push(parsed)
				console.log(`  ✓ ${path.basename(file)} → ${parsed.title}`)
			}
		}
		
		console.log(`\n✅ Parsed ${parsedQuestions.length} questions\n`)
		
		// Group by category
		const questionsByCategory = parsedQuestions.reduce((acc, q) => {
			if (!acc[q.category]) acc[q.category] = []
			acc[q.category].push(q)
			return acc
		}, {} as Record<string, ParsedQuestion[]>)
		
		// Import into database
		console.log('💾 Importing into database...\n')
		let totalImported = 0
		
		for (const [categorySlug, questions] of Object.entries(questionsByCategory)) {
			console.log(`  📂 ${categorySlug}:`)
			
			// Get category ID
			let dbCategory: any = null
			
			if (!isDryRun) {
				const [cat] = await db
					.select()
					.from(schema.categories)
					.where(eq(schema.categories.slug, categorySlug))
					.limit(1)
				
				if (!cat) {
					console.error(`    ❌ Category ${categorySlug} not found in database`)
					continue
				}
				dbCategory = cat
			} else {
				dbCategory = { id: 'dry-run-id', slug: categorySlug }
			}
			
			for (let i = 0; i < questions.length; i++) {
				const q = questions[i]
				
				// Translate to Ukrainian
				const { titleUa, contentUa, descriptionUa } = translateToUkrainian(q.content, q.title)
				
				try {
					if (!isDryRun) {
						// Check if question already exists
						const [existing] = await db
							.select()
							.from(schema.questions)
							.where(eq(schema.questions.slug, q.slug))
							.limit(1)
						
						if (existing) {
							// Update existing
							await db
								.update(schema.questions)
								.set({
									titleEn: q.title,
									titleUa: titleUa,
									descriptionEn: q.description,
									descriptionUa: descriptionUa,
									contentMarkdownEn: q.content,
									contentMarkdownUa: contentUa,
									categoryId: dbCategory.id,
									order: i + 1,
								})
								.where(eq(schema.questions.slug, q.slug))
							
							console.log(`    ↻ ${q.slug} (${q.content.length} chars)`)
						} else {
							// Insert new
							await db.insert(schema.questions).values({
								slug: q.slug,
								titleEn: q.title,
								titleUa: titleUa,
								descriptionEn: q.description,
								descriptionUa: descriptionUa,
								contentMarkdownEn: q.content,
								contentMarkdownUa: contentUa,
								categoryId: dbCategory.id,
								order: i + 1,
								difficulty: 'MEDIUM',
							})
							
							console.log(`    ✓ ${q.slug} (${q.content.length} chars)`)
						}
					} else {
						// Dry run - just log
						console.log(`    [DRY] ${q.slug} (${q.content.length} chars)`)
					}
					
					totalImported++
				} catch (error) {
					console.error(`    ❌ Error importing ${q.slug}:`, error)
				}
			}
			console.log()
		}
		
		console.log(`✅ Successfully imported ${totalImported} questions!\n`)
		console.log('🎉 Import complete!')
		
	} catch (error) {
		console.error('❌ Error during import:', error)
		throw error
	} finally {
		await client.end()
	}
}

importQuestions()
