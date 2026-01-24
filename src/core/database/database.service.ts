import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import * as schema from './schema'

const postgres = require('postgres')

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(DatabaseService.name)
	private client: ReturnType<typeof postgres>
	public db: ReturnType<typeof drizzle<typeof schema>>

	constructor(private readonly config: ConfigService) {
		const connectionString = this.config.get<string>('DATABASE_URL')

		if (!connectionString) {
			throw new Error('DATABASE_URL environment variable is not set')
		}

		const cleanConnectionString = connectionString.split('?')[0]

		this.client = postgres(cleanConnectionString, {
			max: this.config.get<number>('DB_POOL_SIZE', 10),
			idle_timeout: this.config.get<number>('DB_IDLE_TIMEOUT', 20),
			connect_timeout: this.config.get<number>('DB_CONNECT_TIMEOUT', 10),
			onnotice: () => {},
		})

		this.db = drizzle(this.client, {
			schema,
			logger: this.config.get('NODE_ENV') === 'development',
		})

		this.logger.log('Database service initialized')
	}

	async onModuleInit() {
		this.logger.log('Database service ready')
	}

	async onModuleDestroy() {
		if (this.config.get('NODE_ENV') === 'production') {
			try {
				await this.client.end({ timeout: 5 })
				this.logger.log('Database connection closed')
			} catch {
				this.logger.debug('Error closing connection')
			}
		}
	}

	async raw<T = unknown>(query: string, params: unknown[] = []): Promise<T[]> {
		return this.client.unsafe(query, params)
	}

	get transaction() {
		return this.db.transaction.bind(this.db)
	}
}
