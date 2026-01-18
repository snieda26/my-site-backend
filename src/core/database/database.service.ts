/**
 * Database Service
 * Provides Drizzle ORM instance and database operations
 * @module core/database
 */

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

/**
 * DatabaseService
 * Singleton service for database access across the application
 * 
 * @example
 * ```typescript
 * constructor(private readonly db: DatabaseService) {}
 * 
 * async getUsers() {
 *   return this.db.query.accounts.findMany()
 * }
 * ```
 */
@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(DatabaseService.name)
	private client: postgres.Sql
	public db: ReturnType<typeof drizzle<typeof schema>>

	constructor(private readonly configService: ConfigService) {
		const connectionString = this.configService.get<string>('DATABASE_URL')

		if (!connectionString) {
			throw new Error('DATABASE_URL environment variable is not set')
		}

		// Remove ?schema=public parameter (not supported by postgres.js)
		const cleanConnectionString = connectionString.split('?')[0]

		// Create PostgreSQL connection
		this.client = postgres(cleanConnectionString, {
			max: 10, // Maximum pool size
			idle_timeout: 20,
			connect_timeout: 10,
		})

		// Initialize Drizzle with schema
		this.db = drizzle(this.client, {
			schema,
			logger: process.env.NODE_ENV === 'development',
		})

		this.logger.log('Database connection initialized')
	}

	async onModuleInit() {
		try {
			// Test connection
			await this.client`SELECT 1`
			this.logger.log('Database connection verified')
		} catch (error) {
			this.logger.error('Failed to connect to database', error)
			throw error
		}
	}

	async onModuleDestroy() {
		await this.client.end()
		this.logger.log('Database connection closed')
	}

	/**
	 * Execute raw SQL query
	 * Use sparingly - prefer type-safe query builder
	 */
	async raw<T = any>(query: string, params: any[] = []): Promise<T[]> {
		return this.client.unsafe(query, params)
	}

	/**
	 * Start a transaction
	 * @example
	 * ```typescript
	 * await this.database.transaction(async (tx) => {
	 *   await tx.insert(accounts).values(newAccount)
	 *   await tx.insert(userProfiles).values(newProfile)
	 * })
	 * ```
	 */
	get transaction() {
		return this.db.transaction.bind(this.db)
	}
}
