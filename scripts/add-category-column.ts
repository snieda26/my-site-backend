/**
 * Add category column to problems table
 * @usage: ./node_modules/.bin/tsx scripts/add-category-column.ts
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

async function addCategoryColumn() {
	console.log('🔧 Adding category column to problems table...\n')

	try {
		// Create enum type
		console.log('📝 Creating problem_category enum...')
		await db.execute(sql`
			DO $$ BEGIN
				CREATE TYPE problem_category AS ENUM ('javascript', 'react', 'typescript', 'other');
			EXCEPTION
				WHEN duplicate_object THEN null;
			END $$;
		`)
		console.log('✅ Enum created or already exists\n')

		// Add column
		console.log('📝 Adding category column...')
		await db.execute(sql`
			ALTER TABLE problems 
			ADD COLUMN IF NOT EXISTS category problem_category DEFAULT 'javascript' NOT NULL;
		`)
		console.log('✅ Column added\n')

		// Create index
		console.log('📝 Creating index on category...')
		await db.execute(sql`
			CREATE INDEX IF NOT EXISTS problems_category_idx ON problems(category);
		`)
		console.log('✅ Index created\n')

		// Update existing problems
		console.log('📝 Updating existing problems to javascript category...')
		await db.execute(sql`
			UPDATE problems SET category = 'javascript' WHERE category IS NULL;
		`)
		console.log('✅ Existing problems updated\n')

		console.log('========================================')
		console.log('✅ Migration completed successfully!')
		console.log('========================================\n')
	} catch (error) {
		console.error('❌ Migration error:', error)
		throw error
	} finally {
		await client.end()
	}
}

addCategoryColumn()
