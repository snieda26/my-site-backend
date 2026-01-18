/**
 * Companies Service - Drizzle Implementation
 * Manages company entities
 */

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { PaginationDto, createPaginatedResult } from '@common/dto/pagination.dto'
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/company.dto'
import { eq, asc, sql } from 'drizzle-orm'
import * as schema from '@core/database/schema'

@Injectable()
export class CompaniesService {
	constructor(private readonly database: DatabaseService) {}

	async findAll(query: PaginationDto) {
		const { page, limit } = query
		const offset = (page - 1) * limit

		const [companies, [{ count }]] = await Promise.all([
			this.database.db
				.select({
					id: schema.companies.id,
					name: schema.companies.name,
					logo: schema.companies.logo,
					problemCount: sql<number>`count(${schema.problemsToCompanies.problemId})::int`,
				})
				.from(schema.companies)
				.leftJoin(schema.problemsToCompanies, eq(schema.companies.id, schema.problemsToCompanies.companyId))
				.groupBy(schema.companies.id)
				.orderBy(asc(schema.companies.name))
				.limit(limit)
				.offset(offset),
			
			this.database.db
				.select({ count: sql<number>`count(*)` })
				.from(schema.companies),
		])

		return createPaginatedResult(companies, Number(count), page, limit)
	}

	async create(dto: CreateCompanyDto) {
		const [existing] = await this.database.db
			.select()
			.from(schema.companies)
			.where(eq(schema.companies.name, dto.name))
			.limit(1)

		if (existing) {
			throw new ConflictException('Company with this name already exists')
		}

		const [company] = await this.database.db
			.insert(schema.companies)
			.values(dto)
			.returning()

		return company
	}

	async update(id: string, dto: UpdateCompanyDto) {
		const [company] = await this.database.db
			.select()
			.from(schema.companies)
			.where(eq(schema.companies.id, id))
			.limit(1)

		if (!company) {
			throw new NotFoundException('Company not found')
		}

		if (dto.name && dto.name !== company.name) {
			const [existing] = await this.database.db
				.select()
				.from(schema.companies)
				.where(eq(schema.companies.name, dto.name))
				.limit(1)

			if (existing) {
				throw new ConflictException('Company with this name already exists')
			}
		}

		const [updated] = await this.database.db
			.update(schema.companies)
			.set(dto)
			.where(eq(schema.companies.id, id))
			.returning()

		return updated
	}

	async delete(id: string) {
		const [company] = await this.database.db
			.delete(schema.companies)
			.where(eq(schema.companies.id, id))
			.returning()

		if (!company) {
			throw new NotFoundException('Company not found')
		}

		return { message: 'Company deleted successfully' }
	}
}
