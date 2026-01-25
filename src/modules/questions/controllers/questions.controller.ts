import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger'
import { Auth } from '@common/decorators/auth.decorator'
import { FilterQueryDto } from '@common/dto/query.dto'
import { QuestionsService } from '../services/questions.service'
import { CreateQuestionDto, UpdateQuestionDto } from '../dto/question.dto'

@ApiTags('Questions')
@Controller('questions')
export class QuestionsController {
	constructor(private readonly questionsService: QuestionsService) {}

	@Get()
	@ApiOperation({ summary: 'Get all questions with filters' })
	@ApiQuery({ name: 'category', required: false, description: 'Filter by category slug' })
	@ApiQuery({ name: 'difficulty', required: false, enum: ['JUNIOR', 'MIDDLE', 'SENIOR'] })
	@ApiQuery({ name: 'search', required: false, description: 'Search in title and content' })
	@ApiResponse({ status: 200, description: 'Questions retrieved successfully' })
	async findAll(@Query() query: FilterQueryDto) {
		return this.questionsService.findAll(query)
	}

	@Get('category/:categorySlug')
	@ApiOperation({ summary: 'Get questions by category' })
	@ApiParam({ name: 'categorySlug', description: 'Category slug' })
	@ApiResponse({ status: 200, description: 'Questions retrieved successfully' })
	async findByCategory(
		@Param('categorySlug') categorySlug: string,
		@Query() query: FilterQueryDto
	) {
		return this.questionsService.findByCategory(categorySlug, query)
	}

	@Get(':slug')
	@ApiOperation({ summary: 'Get question by slug' })
	@ApiParam({ name: 'slug', description: 'Question slug' })
	@ApiResponse({ status: 200, description: 'Question retrieved successfully' })
	@ApiResponse({ status: 404, description: 'Question not found' })
	async findBySlug(@Param('slug') slug: string) {
		return this.questionsService.findBySlug(slug)
	}

	@Post()
	@Auth()
	@ApiOperation({ summary: 'Create a new question (Admin only)' })
	@ApiResponse({ status: 201, description: 'Question created successfully' })
	async create(@Body() dto: CreateQuestionDto) {
		return this.questionsService.create(dto)
	}

	@Patch(':id')
	@Auth()
	@ApiOperation({ summary: 'Update a question (Admin only)' })
	@ApiParam({ name: 'id', description: 'Question ID' })
	@ApiResponse({ status: 200, description: 'Question updated successfully' })
	async update(@Param('id') id: string, @Body() dto: UpdateQuestionDto) {
		return this.questionsService.update(id, dto)
	}

	@Delete(':id')
	@Auth()
	@ApiOperation({ summary: 'Delete a question (Admin only)' })
	@ApiParam({ name: 'id', description: 'Question ID' })
	@ApiResponse({ status: 200, description: 'Question deleted successfully' })
	async delete(@Param('id') id: string) {
		return this.questionsService.delete(id)
	}
}
