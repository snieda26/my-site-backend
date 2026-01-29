/**
 * Verify problems in database
 * @usage: ./node_modules/.bin/tsx scripts/verify-problems.ts
 */

import { drizzle } from 'drizzle-orm/postgres-js'
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

async function verifyProblems() {
	console.log('🔍 Verifying problems in database...\n')

	try {
		// Get all problems
		const allProblems = await db
			.select()
			.from(schema.problems)

		console.log(`📊 Total problems: ${allProblems.length}\n`)

		// Group by category
		const byCategory = allProblems.reduce((acc, problem) => {
			const category = problem.category || 'unknown'
			if (!acc[category]) {
				acc[category] = []
			}
			acc[category].push(problem)
			return acc
		}, {} as Record<string, typeof allProblems>)

		console.log('📂 Problems by category:')
		for (const [category, problems] of Object.entries(byCategory)) {
			console.log(`\n  ${category.toUpperCase()}: ${problems.length} problems`)
			problems.forEach(p => {
				console.log(`    - ${p.title} (${p.slug})`)
			})
		}

		console.log('\n========================================')
		console.log('✅ Verification complete!')
		console.log('========================================\n')
	} catch (error) {
		console.error('❌ Verification error:', error)
		throw error
	} finally {
		await client.end()
	}
}

verifyProblems()
