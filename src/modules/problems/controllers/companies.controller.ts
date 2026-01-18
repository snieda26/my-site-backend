import { Controller, Get, Post, Patch, Delete, Body, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger'
import { Auth } from '@common/decorators/auth.decorator'
import { PaginationDto } from '@common/dto/pagination.dto'
import { CompaniesService } from '../services/companies.service'
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/company.dto'

@ApiTags('Companies')
@Controller('companies')
export class CompaniesController {
	constructor(private readonly companiesService: CompaniesService) {}

	@Get()
	@ApiOperation({ summary: 'Get all companies' })
	@ApiResponse({ status: 200, description: 'Companies retrieved successfully' })
	async findAll(@Query() query: PaginationDto) {
		return this.companiesService.findAll(query)
	}

	@Post()
	@Auth()
	@ApiOperation({ summary: 'Create a new company (Admin only)' })
	@ApiResponse({ status: 201, description: 'Company created successfully' })
	async create(@Body() dto: CreateCompanyDto) {
		return this.companiesService.create(dto)
	}

	@Patch(':id')
	@Auth()
	@ApiOperation({ summary: 'Update a company (Admin only)' })
	@ApiParam({ name: 'id', description: 'Company ID' })
	@ApiResponse({ status: 200, description: 'Company updated successfully' })
	async update(@Param('id') id: string, @Body() dto: UpdateCompanyDto) {
		return this.companiesService.update(id, dto)
	}

	@Delete(':id')
	@Auth()
	@ApiOperation({ summary: 'Delete a company (Admin only)' })
	@ApiParam({ name: 'id', description: 'Company ID' })
	@ApiResponse({ status: 200, description: 'Company deleted successfully' })
	async delete(@Param('id') id: string) {
		return this.companiesService.delete(id)
	}
}
