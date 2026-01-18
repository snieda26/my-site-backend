/**
 * Database Module
 * Provides database service to the entire application
 * @module core/database
 */

import { Global, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseService } from './database.service'

/**
 * DatabaseModule
 * Global module that provides DatabaseService
 * Import this in AppModule to make database available everywhere
 */
@Global()
@Module({
	imports: [ConfigModule],
	providers: [DatabaseService],
	exports: [DatabaseService],
})
export class DatabaseModule {}
