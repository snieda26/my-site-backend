import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger'
import { Auth } from '@common/decorators/auth.decorator'
import { CurrentAccount } from '@common/decorators/current-account.decorator'
import { PaginationDto } from '@common/dto/pagination.dto'
import { ProgressService } from '../services/progress.service'
import { UpdateProgressDto } from '../dto/progress.dto'

@ApiTags('Progress')
@Controller('progress')
export class ProgressController {
	constructor(private readonly progressService: ProgressService) {}

	@Get()
	@Auth()
	@ApiOperation({ summary: 'Get user progress overview' })
	@ApiResponse({ status: 200, description: 'Progress retrieved successfully' })
	async getProgress(@CurrentAccount('accountId') accountId: string) {
		return this.progressService.getOverview(accountId)
	}

	@Get('category/:categorySlug')
	@Auth()
	@ApiOperation({ summary: 'Get user progress for a specific category' })
	@ApiParam({ name: 'categorySlug', description: 'Category slug' })
	@ApiResponse({ status: 200, description: 'Category progress retrieved successfully' })
	async getCategoryProgress(
		@CurrentAccount('accountId') accountId: string,
		@Param('categorySlug') categorySlug: string
	) {
		return this.progressService.getCategoryProgress(accountId, categorySlug)
	}

	@Post('update')
	@Auth()
	@ApiOperation({ summary: 'Update progress for a question' })
	@ApiResponse({ status: 200, description: 'Progress updated successfully' })
	async updateProgress(
		@CurrentAccount('accountId') accountId: string,
		@Body() dto: UpdateProgressDto
	) {
		return this.progressService.updateProgress(accountId, dto)
	}

	@Get('completed')
	@Auth()
	@ApiOperation({ summary: 'Get all completed questions' })
	@ApiQuery({ name: 'category', required: false, description: 'Filter by category slug' })
	@ApiResponse({ status: 200, description: 'Completed questions retrieved successfully' })
	async getCompleted(
		@CurrentAccount('accountId') accountId: string,
		@Query() query: PaginationDto
	) {
		return this.progressService.getCompleted(accountId, query)
	}
}
