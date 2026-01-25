import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger'
import { Auth } from '@common/decorators/auth.decorator'
import { CurrentAccount } from '@common/decorators/current-account.decorator'
import { FilterQueryDto } from '@common/dto/query.dto'
import { ProblemsService } from '../services/problems.service'
import { CreateProblemDto, UpdateProblemDto, SubmitSolutionDto } from '../dto/problem.dto'

@ApiTags('Problems')
@Controller('problems')
export class ProblemsController {
	constructor(private readonly problemsService: ProblemsService) {}

	@Get()
	@ApiOperation({ summary: 'Get all problems with filters' })
	@ApiQuery({ name: 'difficulty', required: false, enum: ['EASY', 'MEDIUM', 'HARD'] })
	@ApiQuery({ name: 'tag', required: false, description: 'Filter by tag' })
	@ApiQuery({ name: 'search', required: false, description: 'Search in title and description' })
	@ApiResponse({ status: 200, description: 'Problems retrieved successfully' })
	async findAll(@Query() query: FilterQueryDto) {
		return this.problemsService.findAll(query)
	}

	@Get(':slug')
	@ApiOperation({ summary: 'Get problem by slug' })
	@ApiParam({ name: 'slug', description: 'Problem slug' })
	@ApiResponse({ status: 200, description: 'Problem retrieved successfully' })
	@ApiResponse({ status: 404, description: 'Problem not found' })
	async findBySlug(@Param('slug') slug: string) {
		return this.problemsService.findBySlug(slug)
	}

	@Post()
	@Auth()
	@ApiOperation({ summary: 'Create a new problem (Admin only)' })
	@ApiResponse({ status: 201, description: 'Problem created successfully' })
	async create(@Body() dto: CreateProblemDto) {
		return this.problemsService.create(dto)
	}

	@Patch(':id')
	@Auth()
	@ApiOperation({ summary: 'Update a problem (Admin only)' })
	@ApiParam({ name: 'id', description: 'Problem ID' })
	@ApiResponse({ status: 200, description: 'Problem updated successfully' })
	async update(@Param('id') id: string, @Body() dto: UpdateProblemDto) {
		return this.problemsService.update(id, dto)
	}

	@Delete(':id')
	@Auth()
	@ApiOperation({ summary: 'Delete a problem (Admin only)' })
	@ApiParam({ name: 'id', description: 'Problem ID' })
	@ApiResponse({ status: 200, description: 'Problem deleted successfully' })
	async delete(@Param('id') id: string) {
		return this.problemsService.delete(id)
	}

	@Post(':slug/submit')
	@Auth()
	@ApiOperation({ summary: 'Submit a solution for a problem' })
	@ApiParam({ name: 'slug', description: 'Problem slug' })
	@ApiResponse({ status: 200, description: 'Solution submitted successfully' })
	async submitSolution(
		@Param('slug') slug: string,
		@CurrentAccount('accountId') accountId: string,
		@Body() dto: SubmitSolutionDto
	) {
		return this.problemsService.submitSolution(slug, accountId, dto)
	}

	@Post(':slug/run')
	@ApiOperation({ summary: 'Run code against test cases (no auth required)' })
	@ApiParam({ name: 'slug', description: 'Problem slug' })
	@ApiResponse({ status: 200, description: 'Code executed successfully' })
	async runCode(@Param('slug') slug: string, @Body() dto: { code: string }) {
		return this.problemsService.runCode(slug, dto.code)
	}
}
