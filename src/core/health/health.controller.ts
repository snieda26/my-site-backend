import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { DatabaseService } from '@core/database/database.service'
import { sql } from 'drizzle-orm'

interface HealthCheckResponse {
	status: 'healthy' | 'unhealthy'
	timestamp: string
	uptime: number
	services: {
		database: 'up' | 'down'
	}
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
	constructor(private readonly database: DatabaseService) {}

	@Get()
	@ApiOperation({ summary: 'Health check' })
	@ApiResponse({ status: 200, description: 'Service is healthy' })
	@ApiResponse({ status: 503, description: 'Service is unhealthy' })
	async check(): Promise<HealthCheckResponse> {
		const dbHealthy = await this.checkDatabase()

		return {
			status: dbHealthy ? 'healthy' : 'unhealthy',
			timestamp: new Date().toISOString(),
			uptime: process.uptime(),
			services: {
				database: dbHealthy ? 'up' : 'down',
			},
		}
	}

	@Get('ready')
	@ApiOperation({ summary: 'Readiness check' })
	@ApiResponse({ status: 200, description: 'Service is ready' })
	async ready() {
		const dbHealthy = await this.checkDatabase()
		
		return {
			status: dbHealthy ? 'ready' : 'not_ready',
			timestamp: new Date().toISOString(),
		}
	}

	@Get('live')
	@ApiOperation({ summary: 'Liveness check' })
	@ApiResponse({ status: 200, description: 'Service is alive' })
	async live() {
		return {
			status: 'alive',
			timestamp: new Date().toISOString(),
		}
	}

	private async checkDatabase(): Promise<boolean> {
		try {
			await this.database.db.execute(sql`SELECT 1`)
			return true
		} catch {
			return false
		}
	}
}
