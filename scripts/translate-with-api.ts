/**
 * Full Ukrainian Translation using Translation API
 * Translates ALL content (titles, descriptions, markdown) to Ukrainian
 * @usage: yarn add @google-cloud/translate
 * @usage: yarn tsx scripts/translate-with-api.ts
 */

import { drizzle } from 'drizzle-orm/postgres-js'
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

// ============================================
// TRANSLATION USING FREE GOOGLE TRANSLATE API
// ============================================

interface TranslationResult {
	translatedText: string
	detectedSourceLanguage?: string
}

/**
 * Translate text using Google Translate (free endpoint)
 */
async function translateText(text: string, targetLang: string = 'uk'): Promise<string> {
	if (!text || text.trim().length === 0) return text

	return new Promise((resolve, reject) => {
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
						resolve(text) // Return original if translation fails
					}
				} catch (error) {
					console.error('Parse error:', error)
					resolve(text)
				}
			})
		})

		req.on('error', (error) => {
			console.error('Request error:', error)
			resolve(text) // Return original on error
		})

		req.end()
	})
}

/**
 * Translate markdown content while preserving code blocks and formatting
 */
async function translateMarkdown(markdown: string): Promise<string> {
	// Split by code blocks to preserve them
	const codeBlockRegex = /```[\s\S]*?```/g
	const codeBlocks: string[] = []
	
	// Replace code blocks with placeholders
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

	// Split into chunks (Google Translate has limits)
	const chunks = splitIntoChunks(textToTranslate, 4000)
	const translatedChunks: string[] = []

	for (const chunk of chunks) {
		const translated = await translateText(chunk, 'uk')
		translatedChunks.push(translated)
		// Rate limiting
		await new Promise(resolve => setTimeout(resolve, 200))
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

/**
 * Split text into chunks
 */
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
				// Split long paragraph by sentences
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

/**
 * Manual translations for technical terms to ensure quality
 */
function improveTranslation(text: string): string {
	// Technical terms that should not be translated or need better translation
	const improvements: Record<string, string> = {
		'промис': 'проміс',
		'промісів': 'промісів',
		'промісами': 'промісами',
		'промісу': 'проміса',
		'змінної': 'змінної',
		'функції': 'функції',
		'об\'єкта': 'об\'єкта',
		'масиву': 'масиву',
		'типу': 'типу',
	}

	let improved = text
	for (const [wrong, correct] of Object.entries(improvements)) {
		improved = improved.replace(new RegExp(wrong, 'g'), correct)
	}

	return improved
}

// ============================================
// MAIN TRANSLATION FUNCTION
// ============================================

async function translateAllQuestionsWithAPI() {
	const isDryRun = process.argv.includes('--dry-run')
	const limit = process.argv.find(arg => arg.startsWith('--limit='))?.split('=')[1]
	
	console.log('🌐 Starting FULL Ukrainian translation with API...')
	if (isDryRun) {
		console.log('🔍 DRY RUN MODE - No database changes will be made')
	}
	if (limit) {
		console.log(`📊 Limiting to ${limit} questions`)
	}
	console.log()

	try {
		// Get all questions
		let questions = await db.select().from(schema.questions)
		
		if (limit) {
			questions = questions.slice(0, parseInt(limit))
		}
		
		console.log(`📚 Translating ${questions.length} questions\n`)

		let translated = 0

		for (let i = 0; i < questions.length; i++) {
			const question = questions[i]
			console.log(`[${i + 1}/${questions.length}] Translating: ${question.slug}`)

			try {
				// Translate title
				const titleUa = await translateText(question.titleEn, 'uk')
				console.log(`  Title: ${titleUa}`)

				// Translate description
				const descriptionUa = question.descriptionEn 
					? await translateText(question.descriptionEn, 'uk')
					: ''

				// Translate full content
				console.log(`  Content: ${question.contentMarkdownEn.length} chars -> translating...`)
				const contentUa = await translateMarkdown(question.contentMarkdownEn)
				
				// Improve translation
				const improvedContentUa = improveTranslation(contentUa)
				const improvedTitleUa = improveTranslation(titleUa)
				const improvedDescUa = improveTranslation(descriptionUa)

				if (!isDryRun) {
					// Update database
					await db
						.update(schema.questions)
						.set({
							titleUa: improvedTitleUa,
							contentMarkdownUa: improvedContentUa,
							descriptionUa: improvedDescUa,
						})
						.where(eq(schema.questions.id, question.id))
				}

				console.log(`  ✓ Translated (${improvedContentUa.length} chars)\n`)
				translated++

				// Rate limiting - wait between translations
				await new Promise(resolve => setTimeout(resolve, 1000))

			} catch (error) {
				console.error(`  ❌ Error translating ${question.slug}:`, error)
			}
		}

		console.log(`\n✅ Translation complete!`)
		console.log(`  Successfully translated: ${translated}/${questions.length}`)

	} catch (error) {
		console.error('❌ Error during translation:', error)
		throw error
	} finally {
		await client.end()
	}
}

translateAllQuestionsWithAPI()
