/**
 * Import Questions from Second-Part Folder
 * Parses markdown files, cleans content, translates to Ukrainian, and imports to DB
 * @usage: yarn tsx scripts/import-second-part-questions.ts
 * @usage: yarn tsx scripts/import-second-part-questions.ts --dry-run
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'
import * as schema from '../src/core/database/schema'
import { eq } from 'drizzle-orm'
import * as https from 'https'
import * as querystring from 'querystring'

const postgres = require('postgres')

dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
	throw new Error('DATABASE_URL is not set')
}

const cleanConnectionString = connectionString.split('?')[0]
const client = postgres(cleanConnectionString)
const db = drizzle(client, { schema })

// Path to second-part markdown files
const MARKDOWN_PATH = '/Users/petro/Desktop/rkdwns/second-parrt'

// ============================================
// TRANSLATION FUNCTIONS
// ============================================

async function translateText(text: string, targetLang: string = 'uk'): Promise<string> {
	if (!text || text.trim().length === 0) return text

	return new Promise((resolve) => {
		const params = querystring.stringify({
			client: 'gtx',
			sl: 'en',
			tl: targetLang,
			dt: 't',
			q: text,
		})

		const options = {
			hostname: 'translate.googleapis.com',
			path: `/translate_a/single?${params}`,
			method: 'GET',
			headers: {
				'User-Agent': 'Mozilla/5.0',
			},
		}

		const req = https.request(options, (res) => {
			let data = ''

			res.on('data', (chunk) => {
				data += chunk
			})

			res.on('end', () => {
				try {
					const parsed = JSON.parse(data)
					if (parsed && parsed[0]) {
						const translated = parsed[0].map((item: any) => item[0]).join('')
						resolve(translated)
					} else {
						resolve(text)
					}
				} catch (error) {
					console.error('Parse error:', error)
					resolve(text)
				}
			})
		})

		req.on('error', (error) => {
			console.error('Request error:', error)
			resolve(text)
		})

		req.end()
	})
}

async function translateMarkdown(markdown: string): Promise<string> {
	// Split by code blocks to preserve them
	const codeBlockRegex = /```[\s\S]*?```/g
	const codeBlocks: string[] = []
	
	let textToTranslate = markdown.replace(codeBlockRegex, (match) => {
		const index = codeBlocks.length
		codeBlocks.push(match)
		return `___CODE_BLOCK_${index}___`
	})

	// Split by inline code to preserve it
	const inlineCodeRegex = /`[^`]+`/g
	const inlineCodes: string[] = []
	
	textToTranslate = textToTranslate.replace(inlineCodeRegex, (match) => {
		const index = inlineCodes.length
		inlineCodes.push(match)
		return `___INLINE_CODE_${index}___`
	})

	// Split into chunks
	const chunks = splitIntoChunks(textToTranslate, 4000)
	const translatedChunks: string[] = []

	for (const chunk of chunks) {
		const translated = await translateText(chunk, 'uk')
		translatedChunks.push(translated)
		await new Promise(resolve => setTimeout(resolve, 300))
	}

	let translated = translatedChunks.join('')

	// Restore inline code
	inlineCodes.forEach((code, index) => {
		translated = translated.replace(`___INLINE_CODE_${index}___`, code)
	})

	// Restore code blocks
	codeBlocks.forEach((code, index) => {
		translated = translated.replace(`___CODE_BLOCK_${index}___`, code)
	})

	return translated
}

function splitIntoChunks(text: string, maxLength: number): string[] {
	const chunks: string[] = []
	const paragraphs = text.split('\n\n')
	let currentChunk = ''

	for (const paragraph of paragraphs) {
		if (currentChunk.length + paragraph.length > maxLength) {
			if (currentChunk) {
				chunks.push(currentChunk)
				currentChunk = ''
			}
			if (paragraph.length > maxLength) {
				const sentences = paragraph.split('. ')
				for (const sentence of sentences) {
					if (currentChunk.length + sentence.length > maxLength) {
						if (currentChunk) chunks.push(currentChunk)
						currentChunk = sentence
					} else {
						currentChunk += (currentChunk ? '. ' : '') + sentence
					}
				}
			} else {
				currentChunk = paragraph
			}
		} else {
			currentChunk += (currentChunk ? '\n\n' : '') + paragraph
		}
	}

	if (currentChunk) {
		chunks.push(currentChunk)
	}

	return chunks
}

// ============================================
// PARSING FUNCTIONS
// ============================================

interface ParsedQuestion {
	title: string
	slug: string
	category: string
	content: string
	description: string
}

// Manual title corrections for problematic extractions
const TITLE_CORRECTIONS: Record<string, string> = {
	'Chrome DevTools → Network → Protocol': 'HTTP/2 vs HTTP/3: Protocol Evolution',
	'Run with V8 flags': 'V8 Architecture: From Code to Machine Instructions',
	'SOLID Principles — SOLID принципы': 'SOLID Principles',
	'Atomic Design (Atomic Design)': 'Atomic Design Architecture',
}

/**
 * Extract title from markdown - get the main h1 after [Sign in to mark as read]
 */
function extractTitle(content: string): string {
	const lines = content.split('\n')
	
	let startIndex = 0
	for (let i = 0; i < lines.length; i++) {
		if (lines[i].includes('[Sign in to mark as read]')) {
			startIndex = i + 1
			break
		}
	}
	
	for (let i = startIndex; i < lines.length; i++) {
		const line = lines[i].trim()
		if (line.startsWith('# ') && !line.includes('Hack Frontend')) {
			let title = line.replace(/^#\s+/, '').trim()
			// Remove common suffixes
			title = title
				.replace(/\s*\|\s*.*$/, '')
				.replace(/\s*Frontend Interview Question.*$/i, '')
				.replace(/\s*—\s*SOLID\s*принцип[ыи]$/i, '')
				.replace(/\s*—\s*[а-яА-Я\s]+$/i, '') // Remove Russian suffixes
				.trim()
			
			// Apply manual corrections
			if (TITLE_CORRECTIONS[title]) {
				title = TITLE_CORRECTIONS[title]
			}
			
			return title
		}
	}
	
	// Fallback from first h1
	const firstH1 = lines.find(l => l.trim().startsWith('# '))
	if (firstH1) {
		let title = firstH1.replace(/^#\s+/, '').replace(/\s*\|\s*.*$/, '').trim()
		title = title.replace(/\s*Frontend Interview Question.*$/i, '').trim()
		
		// Apply manual corrections
		if (TITLE_CORRECTIONS[title]) {
			title = TITLE_CORRECTIONS[title]
		}
		
		return title
	}
	
	return 'Untitled'
}

/**
 * Extract and clean main content
 */
function extractMainContent(rawContent: string): string {
	const lines = rawContent.split('\n')
	
	// Find where actual content starts (after [Sign in to mark as read])
	let startIndex = 0
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim()
		if (line.includes('[Sign in to mark as read]')) {
			startIndex = i + 1
			break
		}
	}
	
	// Find where content ends (before [Back] or ### Content)
	let endIndex = lines.length
	for (let i = startIndex; i < lines.length; i++) {
		const line = lines[i].trim()
		if (line.startsWith('[Back]') || line.startsWith('### Content') || line.includes('**[Back to Top]**')) {
			endIndex = i
			break
		}
	}
	
	// Extract content
	let content = lines.slice(startIndex, endIndex).join('\n')
	
	// Remove hackfrontend.com links - replace with localhost
	content = content.replace(/https?:\/\/(www\.)?hackfrontend\.com[^\s\)"]*/g, 'http://localhost:3001')
	
	// Remove navigation links
	content = content.replace(/\[Back\]\([^)]+\)/g, '')
	content = content.replace(/\[Forward\]\([^)]+\)/g, '')
	content = content.replace(/\[🎉[^\]]+\]\([^)]+\)/g, '')
	
	// Remove "Important:" note divs that are just styling
	content = content.replace(/Important:\s*\n\s*\n/g, '**Important:** ')
	
	// Clean up extra whitespace
	content = content.replace(/\n{4,}/g, '\n\n\n').trim()
	
	// Remove leading title if it duplicates
	const titleMatch = content.match(/^#\s+[^\n]+\n+/)
	if (titleMatch) {
		const restOfContent = content.substring(titleMatch[0].length)
		// Check if there's another h2 right after that's the same content
		if (restOfContent.startsWith('## ')) {
			content = restOfContent
		}
	}
	
	return content
}

/**
 * Determine category from Source URL in the file
 */
function determineCategory(filename: string, rawContent: string): string {
	// Extract from Source: URL line
	const urlMatch = rawContent.match(/Source:\s*\[[^\]]+\]\(https?:\/\/[^\/]+\/en\/docs\/([^\/\)]+)/i)
	if (urlMatch) {
		const category = urlMatch[1].toLowerCase()
		
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
	if (lowerFilename.includes('vue') || lowerFilename.includes('ref vs reactive') || 
			lowerFilename.includes('v-model') || lowerFilename.includes('v bind') ||
			lowerFilename.includes('provide inject') || lowerFilename.includes('teleport') ||
			lowerFilename.includes('composables') || lowerFilename.includes('computed methods watchers')) return 'vue'
	if (lowerFilename.includes('angular') || lowerFilename.includes('rxjs') || 
			lowerFilename.includes('ngzone') || lowerFilename.includes('injector')) return 'angular'
	if (lowerFilename.includes('redux')) return 'redux'
	if (lowerFilename.includes('solid') || lowerFilename.includes('dry') || 
			lowerFilename.includes('kiss') || lowerFilename.includes('yagni') ||
			lowerFilename.includes('grasp')) return 'principles'
	if (lowerFilename.includes('fsd') || lowerFilename.includes('atomic') || 
			lowerFilename.includes('module') || lowerFilename.includes('microfrontend') ||
			lowerFilename.includes('mvp and mvc')) return 'architecture'
	if (lowerFilename.includes('singleton') || lowerFilename.includes('observer') ||
			lowerFilename.includes('decorator') || lowerFilename.includes('abstract factory')) return 'patterns'
	
	// General questions - most common fallback for this batch
	return 'general'
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
		.substring(0, 200) // Limit slug length
}

/**
 * Extract description (first meaningful paragraph)
 */
function extractDescription(content: string): string {
	const lines = content.split('\n')
	
	for (let i = 0; i < lines.length; i++) {
		const line = lines[i].trim()
		// Skip headings, empty lines, and short lines
		if (line && !line.startsWith('#') && !line.startsWith('**[') && 
				!line.startsWith('---') && line.length > 30) {
			// Clean up the description
			let desc = line
				.replace(/\*\*/g, '')
				.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links but keep text
				.substring(0, 300)
			return desc
		}
	}
	
	return ''
}

/**
 * Parse a single markdown file
 */
function parseMarkdownFile(filepath: string): ParsedQuestion | null {
	try {
		const filename = path.basename(filepath)
		const rawContent = fs.readFileSync(filepath, 'utf-8')
		
		// Extract main content
		const content = extractMainContent(rawContent)
		
		if (!content || content.length < 100) {
			console.log(`    ⚠️  Skipping ${filename} - content too short (${content.length} chars)`)
			return null
		}
		
		// Extract metadata
		const title = extractTitle(rawContent)
		const slug = createSlug(title)
		const category = determineCategory(filename, rawContent)
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
 * Get unique files (skip duplicates with (1) suffix)
 */
function getUniqueFiles(dir: string): string[] {
	const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'))
	
	// Filter out duplicates (files with "(1)" in name)
	const uniqueFiles = files.filter(f => !f.includes('(1)'))
	
	return uniqueFiles.map(f => path.join(dir, f))
}

// ============================================
// MAIN IMPORT FUNCTION
// ============================================

async function importSecondPartQuestions() {
	const isDryRun = process.argv.includes('--dry-run')
	const skipTranslation = process.argv.includes('--skip-translation')
	
	console.log('🚀 Starting Second-Part Questions Import')
	console.log('========================================\n')
	
	if (isDryRun) {
		console.log('🔍 DRY RUN MODE - No database changes will be made\n')
	}
	if (skipTranslation) {
		console.log('⏭️  SKIP TRANSLATION MODE - Using English for Ukrainian content\n')
	}
	
	try {
		// Get unique markdown files
		const files = getUniqueFiles(MARKDOWN_PATH)
		console.log(`📚 Found ${files.length} unique markdown files\n`)
		
		// Parse all files first
		console.log('📖 Parsing markdown files...\n')
		const parsedQuestions: ParsedQuestion[] = []
		
		for (const file of files) {
			const parsed = parseMarkdownFile(file)
			if (parsed) {
				parsedQuestions.push(parsed)
				console.log(`  ✓ ${path.basename(file)} → ${parsed.title} [${parsed.category}]`)
			}
		}
		
		console.log(`\n✅ Parsed ${parsedQuestions.length} questions\n`)
		
		// Group by category
		const questionsByCategory = parsedQuestions.reduce((acc, q) => {
			if (!acc[q.category]) acc[q.category] = []
			acc[q.category].push(q)
			return acc
		}, {} as Record<string, ParsedQuestion[]>)
		
		// Show category breakdown
		console.log('📊 Category breakdown:')
		for (const [cat, qs] of Object.entries(questionsByCategory)) {
			console.log(`  ${cat}: ${qs.length} questions`)
		}
		console.log()
		
		// Import into database
		console.log('💾 Importing into database...\n')
		let totalImported = 0
		let totalSkipped = 0
		
		for (const [categorySlug, questions] of Object.entries(questionsByCategory)) {
			console.log(`\n📂 Processing ${categorySlug} (${questions.length} questions):`)
			
			// Get category from DB
			let dbCategory: any = null
			
			if (!isDryRun) {
				const [cat] = await db
					.select()
					.from(schema.categories)
					.where(eq(schema.categories.slug, categorySlug))
					.limit(1)
				
				if (!cat) {
					console.error(`  ❌ Category ${categorySlug} not found in database - skipping`)
					continue
				}
				dbCategory = cat
			} else {
				dbCategory = { id: 'dry-run-id', slug: categorySlug }
			}
			
			// Get current max order for this category
			let currentOrder = 0
			if (!isDryRun) {
				const existingQuestions = await db
					.select()
					.from(schema.questions)
					.where(eq(schema.questions.categoryId, dbCategory.id))
				currentOrder = existingQuestions.length
			}
			
			for (const q of questions) {
				try {
					// Check if question already exists
					if (!isDryRun) {
						const [existing] = await db
							.select()
							.from(schema.questions)
							.where(eq(schema.questions.slug, q.slug))
							.limit(1)
						
						if (existing) {
							console.log(`    ⏭️  ${q.slug} (already exists)`)
							totalSkipped++
							continue
						}
					}
					
					// Translate to Ukrainian
					let titleUa = q.title
					let contentUa = q.content
					let descriptionUa = q.description
					
					if (!skipTranslation) {
						console.log(`    🔄 Translating: ${q.title.substring(0, 50)}...`)
						
						titleUa = await translateText(q.title, 'uk')
						await new Promise(resolve => setTimeout(resolve, 200))
						
						descriptionUa = q.description ? await translateText(q.description, 'uk') : ''
						await new Promise(resolve => setTimeout(resolve, 200))
						
						contentUa = await translateMarkdown(q.content)
						await new Promise(resolve => setTimeout(resolve, 500))
					}
					
					currentOrder++
					
					if (!isDryRun) {
						// Insert into database
						await db.insert(schema.questions).values({
							slug: q.slug,
							titleEn: q.title,
							titleUa: titleUa,
							descriptionEn: q.description,
							descriptionUa: descriptionUa,
							contentMarkdownEn: q.content,
							contentMarkdownUa: contentUa,
							categoryId: dbCategory.id,
							order: currentOrder,
							difficulty: 'MEDIUM',
						})
						
						console.log(`    ✅ ${q.slug} (${q.content.length} → ${contentUa.length} chars)`)
					} else {
						console.log(`    [DRY] ${q.slug} would be added`)
					}
					
					totalImported++
					
				} catch (error) {
					console.error(`    ❌ Error importing ${q.slug}:`, error)
				}
			}
		}
		
		console.log(`\n========================================`)
		console.log(`✅ Import complete!`)
		console.log(`   Imported: ${totalImported}`)
		console.log(`   Skipped (existing): ${totalSkipped}`)
		console.log(`========================================\n`)
		
	} catch (error) {
		console.error('❌ Error during import:', error)
		throw error
	} finally {
		await client.end()
	}
}

importSecondPartQuestions()
