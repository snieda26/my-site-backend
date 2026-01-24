import { Injectable } from '@nestjs/common'
import { eq, asc, sql } from 'drizzle-orm'
import { DatabaseService } from '@core/database/database.service'
import * as schema from '@core/database/schema'
import { Company, NewCompany } from '@core/database/schema'
import { PaginatedResult } from '@common/interfaces'
import { ICompaniesRepository } from './problems.repository.interface'

@Injectable()
export class CompaniesRepository implements ICompaniesRepository {
	constructor(private readonly database: DatabaseService) {}

	async findAll(page: number, limit: number): Promise<PaginatedResult<Company & { problemCount: number }>> {
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

		const total = Number(count)
		return {
			data: companies,
			meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
		}
	}

	async findById(id: string): Promise<Company | null> {
		const [company] = await this.database.db
			.select()
			.from(schema.companies)
			.where(eq(schema.companies.id, id))
			.limit(1)

		return company || null
	}

	async findByName(name: string): Promise<Company | null> {
		const [company] = await this.database.db
			.select()
			.from(schema.companies)
			.where(eq(schema.companies.name, name))
			.limit(1)

		return company || null
	}

	async create(data: NewCompany): Promise<Company> {
		const [company] = await this.database.db
			.insert(schema.companies)
			.values(data)
			.returning()

		return company
	}

	async update(id: string, data: Partial<Company>): Promise<Company | null> {
		const [company] = await this.database.db
			.update(schema.companies)
			.set(data)
			.where(eq(schema.companies.id, id))
			.returning()

		return company || null
	}

	async delete(id: string): Promise<boolean> {
		const [deleted] = await this.database.db
			.delete(schema.companies)
			.where(eq(schema.companies.id, id))
			.returning()

		return !!deleted
	}
}
