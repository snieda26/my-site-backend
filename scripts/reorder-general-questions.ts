/**
 * Reorder General Questions to match original hackfrontend order
 * @usage: yarn tsx scripts/reorder-general-questions.ts
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import * as dotenv from 'dotenv'
import * as schema from '../src/core/database/schema'
import { eq, asc } from 'drizzle-orm'

const postgres = require('postgres')

dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
	throw new Error('DATABASE_URL is not set')
}

const cleanConnectionString = connectionString.split('?')[0]
const client = postgres(cleanConnectionString)
const db = drizzle(client, { schema })

// Original order from hackfrontend.com navigation
const GENERAL_QUESTIONS_ORDER = [
	'what-is-the-difference-between-authorization-and-authentication',
	'what-is-cors-and-how-does-it-work',
	'how-http-works-and-what-an-http-request-consists-of',
	'how-https-works-and-difference-from-http',
	'http-status-codes',
	'owasp-browser-vulnerabilities',
	'modern-browser-architecture-processes-and-threads',
	'how-browser-works-when-entering-request-and-rendering-stages',
	'parsing-pipeline-from-bytes-to-dom-and-cssom',
	'when-reflow-and-repaint-occur-in-browser',
	'what-is-rest-and-rest-principles-rest-api',
	'ways-to-optimize-applications',
	'what-is-webpack',
	'immutability-and-mutability-in-javascript',
	'what-is-shadow-dom-in-web-development',
	'what-are-cookies-and-how-to-work-with-them',
	'how-to-debug-application-and-find-memory-leaks',
	'browser-storage-cookie-localstorage-sessionstorage-and-indexeddb',
	'server-sent-events-polling-and-long-polling-what-they-are-and-when-to-use',
	'what-is-progressive-rendering-in-web-development',
	'csr-ssr-ssg-isr-difference-between-rendering-strategies',
	'what-is-service-worker',
	'what-are-web-workers',
	'what-is-critical-rendering-path-crp-in-browser',
	'v8-architecture-from-code-to-machine-instructions',
	'http2-vs-http3-protocol-evolution',
	'resource-loading-strategies-preload-prefetch-modulepreload',
	'what-is-cdn-and-why-is-it-needed',
	'types-of-frontend-testing',
	'what-is-three-way-handshake',
]

async function reorderGeneralQuestions() {
	console.log('🔄 Reordering General Questions...\n')

	try {
		// Get general category
		const [generalCategory] = await db
			.select()
			.from(schema.categories)
			.where(eq(schema.categories.slug, 'general'))
			.limit(1)

		if (!generalCategory) {
			throw new Error('General category not found')
		}

		console.log(`Found category: ${generalCategory.nameEn}\n`)

		// Update order for each question
		for (let i = 0; i < GENERAL_QUESTIONS_ORDER.length; i++) {
			const slug = GENERAL_QUESTIONS_ORDER[i]
			const newOrder = i + 1

			const result = await db
				.update(schema.questions)
				.set({ order: newOrder, updatedAt: new Date() })
				.where(eq(schema.questions.slug, slug))
				.returning()

			if (result.length > 0) {
				console.log(`  ${newOrder}. ${result[0].titleEn.substring(0, 60)}...`)
			} else {
				console.log(`  ⚠️ Not found: ${slug}`)
			}
		}

		console.log('\n✅ Reordering complete!')
		console.log('Now running navigation fix...\n')

	} catch (error) {
		console.error('❌ Error:', error)
		throw error
	} finally {
		await client.end()
	}
}

reorderGeneralQuestions()
