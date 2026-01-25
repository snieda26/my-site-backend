import { drizzle } from 'drizzle-orm/postgres-js'
import * as dotenv from 'dotenv'
import * as schema from '../src/core/database/schema'
import { asc, eq } from 'drizzle-orm'

const postgres = require('postgres')

dotenv.config({ path: '.env' })

let connectionString = process.env.DATABASE_URL

if (!connectionString) {
	throw new Error('DATABASE_URL is not set')
}

connectionString = connectionString.split('?')[0]

console.log(`📡 Connecting to database...`)

const client = postgres(connectionString)
const db = drizzle(client, { schema })

async function fixQuestionNavigation() {
	console.log('🔧 Fixing question navigation links...\n')

	try {
		const categories = await db
			.select()
			.from(schema.categories)
			.orderBy(asc(schema.categories.order))

		console.log(`Found ${categories.length} categories\n`)

		for (const category of categories) {
			console.log(`📂 Processing category: ${category.nameEn} (${category.slug})`)

			const questions = await db
				.select()
				.from(schema.questions)
				.where(eq(schema.questions.categoryId, category.id))
				.orderBy(asc(schema.questions.order))

			console.log(`  Found ${questions.length} questions`)

			for (let i = 0; i < questions.length; i++) {
				const current = questions[i]
				const prev = i > 0 ? questions[i - 1] : null
				const next = i < questions.length - 1 ? questions[i + 1] : null

				const prevSlug = prev?.slug || null
				const nextSlug = next?.slug || null

				await db
					.update(schema.questions)
					.set({
						prevSlug,
						nextSlug,
						updatedAt: new Date(),
					})
					.where(eq(schema.questions.id, current.id))

				console.log(`  ✓ ${current.titleEn.substring(0, 50)}... [prev: ${prevSlug || 'none'}, next: ${nextSlug || 'none'}]`)
			}

			console.log(`  ✅ Updated ${questions.length} questions in ${category.nameEn}\n`)
		}

		console.log('🎉 Navigation links fixed successfully!')

	} catch (error) {
		console.error('❌ Error:', error)
		throw error
	} finally {
		await client.end()
	}
}

fixQuestionNavigation().catch((error) => {
	console.error('Fatal error:', error)
	process.exit(1)
})
