/**
 * Database Service
 * Provides Drizzle ORM instance and database operations
 * @module core/database
 */

import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import { sql } from 'drizzle-orm'
import * as schema from './schema'

// Import postgres using require for CommonJS compatibility
const postgres = require('postgres')

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
	private client: any
	public db: ReturnType<typeof drizzle<typeof schema>>

	constructor(private readonly configService: ConfigService) {
		const connectionString = this.configService.get<string>('DATABASE_URL')

		if (!connectionString) {
			throw new Error('DATABASE_URL environment variable is not set')
		}

		// Remove ?schema=public parameter (not supported by postgres.js)
		const cleanConnectionString = connectionString.split('?')[0]

		// Create PostgreSQL connection with better error handling
		this.client = postgres(cleanConnectionString, {
			max: 10, // Maximum pool size
			idle_timeout: 20,
			connect_timeout: 10,
			onnotice: () => {}, // Suppress notices
		})

		// Initialize Drizzle with schema
		this.db = drizzle(this.client, {
			schema,
			logger: process.env.NODE_ENV === 'development',
		})

		this.logger.log('Database service initialized')
	}

	async onModuleInit() {
		// Connection will be established lazily on first query
		this.logger.log('✅ Database service ready')
	}

	async onModuleDestroy() {
		// Don't close connection during hot reload in development
		// The postgres client is shared across reloads via require()
		// Closing it breaks the new instance
		if (process.env.NODE_ENV === 'production') {
			try {
				await this.client.end({ timeout: 5 })
				this.logger.log('Database connection closed')
			} catch (error) {
				this.logger.debug('Error closing connection')
			}
		} else {
			this.logger.debug('Keeping connection open for hot reload')
		}
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
