/**
 * Drizzle Database Seeding Script
 * Seeds the database with initial data
 * @usage: yarn db:seed
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import * as argon2 from 'argon2'
import * as dotenv from 'dotenv'
import * as schema from '../src/core/database/schema'
import { eq } from 'drizzle-orm'

// Import postgres using require for CommonJS compatibility
const postgres = require('postgres')

// Load environment variables
dotenv.config({ path: '.env' })

let connectionString = process.env.DATABASE_URL

if (!connectionString) {
	throw new Error('DATABASE_URL не встановлено')
}

// Remove everything after ? (query parameters not supported by postgres.js)
connectionString = connectionString.split('?')[0]

console.log(`📡 Connecting to database: ${connectionString.replace(/\/\/.*@/, '//***@')}`)

// Створення підключення
const client = postgres(connectionString)
const db = drizzle(client, { schema })

/**
 * Main Seed Function
 * Populate database with initial data
 */
async function seed() {
	console.log('🌱 Початок seed процесу...\n')

	try {
		// ============================================
		// 1. ADMIN ACCOUNT
		// ============================================
		console.log('👤 Створення адміністратора...')
		
		const hashedPassword = await argon2.hash('Admin123!')
		
		await db
			.insert(schema.accounts)
			.values({
				email: 'admin@itlead.com',
				password: hashedPassword,
				name: 'Admin',
				emailVerified: true,
				role: 'ADMIN',
				onboardingCompleted: true,
			})
			.onConflictDoNothing()
		
		console.log('  ✅ Адміністратор: admin@itlead.com\n')

		// ============================================
		// 2. CATEGORIES
		// ============================================
		console.log('📚 Створення категорій...')
		
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
		
		console.log(`  ✅ Створено ${categoriesData.length} категорій\n`)

		// ============================================
		// 3. COMPANIES
		// ============================================
		console.log('🏢 Створення компаній...')
		
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
		
		console.log(`  ✅ Створено ${companiesData.length} компаній\n`)

		console.log('🎉 Seed завершено успішно!')
		console.log('\n📝 Для додавання питань запустіть:')
		console.log('   yarn ts-node drizzle/seed-questions.ts')

	} catch (error) {
		console.error('❌ Помилка seed:', error)
		throw error
	} finally {
		await client.end()
	}
}

// Run seed
seed().catch((error) => {
	console.error('Фатальна помилка:', error)
	process.exit(1)
})
