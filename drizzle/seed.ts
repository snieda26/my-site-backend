import { drizzle } from 'drizzle-orm/postgres-js'
import * as argon2 from 'argon2'
import * as dotenv from 'dotenv'
import * as schema from '../src/core/database/schema'

const postgres = require('postgres')

dotenv.config({ path: '.env' })

let connectionString = process.env.DATABASE_URL

if (!connectionString) {
	throw new Error('DATABASE_URL is not set')
}

connectionString = connectionString.split('?')[0]

console.log(`📡 Connecting to database: ${connectionString.replace(/\/\/.*@/, '//***@')}`)

const client = postgres(connectionString)
const db = drizzle(client, { schema })

async function seed() {
	console.log('🌱 Starting seed process...\n')

	try {
		console.log('👤 Creating admin account...')
		
		const hashedPassword = await argon2.hash('Admin123!')
		
		await db
			.insert(schema.accounts)
			.values({
				email: 'admin@itlead.com',
				password: hashedPassword,
				name: 'Admin',
				emailVerified: true,
				role: 'ADMIN',
				createdAt: new Date(),
				updatedAt: new Date(),
			})
			.onConflictDoNothing()
		
		console.log('  ✅ Admin: admin@itlead.com\n')

		console.log('📚 Creating categories...')
		
		const categoriesData = [
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

		for (const cat of categoriesData) {
			await db
				.insert(schema.categories)
				.values(cat)
				.onConflictDoNothing()
			
			console.log(`  ✓ ${cat.nameEn} (${cat.slug})`)
		}
		
		console.log(`  ✅ Created ${categoriesData.length} categories\n`)

		console.log('🏢 Creating companies...')
		
		const companiesData = [
			{ name: 'EPAM' },
			{ name: 'SoftServe' },
			{ name: 'GlobalLogic' },
			{ name: 'Luxoft' },
			{ name: 'Ciklum' },
			{ name: 'N-iX' },
			{ name: 'Grammarly' },
		]

		for (const company of companiesData) {
			await db
				.insert(schema.companies)
				.values(company)
				.onConflictDoNothing()
			
			console.log(`  ✓ ${company.name}`)
		}
		
		console.log(`  ✅ Created ${companiesData.length} companies\n`)

		console.log('🎉 Seed completed successfully!')

	} catch (error) {
		console.error('❌ Seed error:', error)
		throw error
	} finally {
		await client.end()
	}
}

seed().catch((error) => {
	console.error('Fatal error:', error)
	process.exit(1)
})
