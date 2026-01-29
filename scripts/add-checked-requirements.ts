/**
 * Add checked_requirements column to solved_problems table
 * @usage: ./node_modules/.bin/tsx scripts/add-checked-requirements.ts
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import * as dotenv from 'dotenv'
import { sql } from 'drizzle-orm'

const postgres = require('postgres')

dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
	throw new Error('DATABASE_URL is not set')
}

const cleanConnectionString = connectionString.split('?')[0]
const client = postgres(cleanConnectionString)
const db = drizzle(client)

async function addCheckedRequirements() {
	console.log('🔄 Adding checked_requirements column...\n')

	try {
		// Add column
		await db.execute(sql`
			ALTER TABLE solved_problems 
			ADD COLUMN IF NOT EXISTS checked_requirements text DEFAULT '[]'
		`)
		console.log('✅ Added checked_requirements column')

		console.log('\n========================================')
		console.log('✅ Migration complete!')
		console.log('========================================\n')
	} catch (error) {
		console.error('❌ Error:', error)
		throw error
	} finally {
		await client.end()
	}
}

addCheckedRequirements()
