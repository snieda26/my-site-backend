/**
 * Drizzle Kit Configuration
 * Defines database connection and migration settings
 * @see https://orm.drizzle.team/kit-docs/conf
 */

import type { Config } from 'drizzle-kit'
import * as dotenv from 'dotenv'

dotenv.config()

// Remove schema parameter from DATABASE_URL for Drizzle
const databaseUrl = process.env.DATABASE_URL?.split('?')[0]

export default {
	schema: './src/core/database/schema/index.ts',
	out: './drizzle',
	dialect: 'postgresql',
	dbCredentials: {
		url: databaseUrl!,
	},
	verbose: true,
	strict: true,
} satisfies Config
