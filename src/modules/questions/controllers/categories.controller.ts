import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger'
import { Auth } from '@common/decorators/auth.decorator'
import { PaginationDto } from '@common/dto/pagination.dto'
import { CategoriesService } from '../services/categories.service'
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto'

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
	constructor(private readonly categoriesService: CategoriesService) {}

	@Get()
	@ApiOperation({ summary: 'Get all categories' })
	@ApiResponse({ status: 200, description: 'Categories retrieved successfully' })
	async findAll(@Query() query: PaginationDto) {
		return this.categoriesService.findAll(query)
	}

	@Get(':slug')
	@ApiOperation({ summary: 'Get category by slug' })
	@ApiParam({ name: 'slug', description: 'Category slug' })
	@ApiResponse({ status: 200, description: 'Category retrieved successfully' })
	@ApiResponse({ status: 404, description: 'Category not found' })
	async findBySlug(@Param('slug') slug: string) {
		return this.categoriesService.findBySlug(slug)
	}

	@Post()
	@Auth()
	@ApiOperation({ summary: 'Create a new category (Admin only)' })
	@ApiResponse({ status: 201, description: 'Category created successfully' })
	async create(@Body() dto: CreateCategoryDto) {
		return this.categoriesService.create(dto)
	}

	@Patch(':id')
	@Auth()
	@ApiOperation({ summary: 'Update a category (Admin only)' })
	@ApiParam({ name: 'id', description: 'Category ID' })
	@ApiResponse({ status: 200, description: 'Category updated successfully' })
	async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
		return this.categoriesService.update(id, dto)
	}

	@Delete(':id')
	@Auth()
	@ApiOperation({ summary: 'Delete a category (Admin only)' })
	@ApiParam({ name: 'id', description: 'Category ID' })
	@ApiResponse({ status: 200, description: 'Category deleted successfully' })
	async delete(@Param('id') id: string) {
		return this.categoriesService.delete(id)
	}
}
