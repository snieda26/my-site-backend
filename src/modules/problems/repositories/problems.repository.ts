import { Injectable } from '@nestjs/common'
import { eq, and, or, like, desc, asc, sql, SQL } from 'drizzle-orm'
import { DatabaseService } from '@core/database/database.service'
import * as schema from '@core/database/schema'
import { Problem, NewProblem, SolvedProblem } from '@core/database/schema'
import { PaginatedResult } from '@common/interfaces'
import { IProblemsRepository, ISolvedProblemsRepository, ProblemFilters } from './problems.repository.interface'

@Injectable()
export class ProblemsRepository implements IProblemsRepository {
	constructor(private readonly database: DatabaseService) {}

	async findAll(page: number, limit: number, filters?: ProblemFilters): Promise<PaginatedResult<any>> {
		const offset = (page - 1) * limit
		const conditions: SQL[] = []

		if (filters?.search) {
			conditions.push(
				or(
					like(schema.problems.title, `%${filters.search}%`),
					like(schema.problems.description, `%${filters.search}%`)
				)!
			)
		}

		if (filters?.difficulty) {
			conditions.push(eq(schema.problems.difficulty, filters.difficulty as 'EASY' | 'MEDIUM' | 'HARD'))
		}

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined
		const orderByColumn = filters?.sortBy === 'difficulty' ? schema.problems.difficulty : schema.problems.createdAt
		const orderByClause = filters?.sortOrder === 'desc' ? desc(orderByColumn) : asc(orderByColumn)

		const [problems, [{ count }]] = await Promise.all([
			this.database.db
				.select()
				.from(schema.problems)
				.where(whereClause)
				.orderBy(orderByClause)
				.limit(limit)
				.offset(offset),
			this.database.db
				.select({ count: sql<number>`count(*)` })
				.from(schema.problems)
				.where(whereClause),
		])

		// Fetch companies for each problem
		const problemsWithCompanies = await Promise.all(
			problems.map(async (problem) => {
				const companies = await this.database.db
					.select({ id: schema.companies.id, name: schema.companies.name })
					.from(schema.companies)
					.innerJoin(
						schema.problemsToCompanies,
						eq(schema.companies.id, schema.problemsToCompanies.companyId)
					)
					.where(eq(schema.problemsToCompanies.problemId, problem.id))

				return { ...problem, companies }
			})
		)

		const total = Number(count)
		return {
			data: problemsWithCompanies,
			meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
		}
	}

	async findBySlug(slug: string): Promise<any | null> {
		const [problem] = await this.database.db
			.select()
			.from(schema.problems)
			.where(eq(schema.problems.slug, slug))
			.limit(1)

		if (!problem) return null

		// Fetch companies for the problem
		const companies = await this.database.db
			.select({ id: schema.companies.id, name: schema.companies.name })
			.from(schema.companies)
			.innerJoin(
				schema.problemsToCompanies,
				eq(schema.companies.id, schema.problemsToCompanies.companyId)
			)
			.where(eq(schema.problemsToCompanies.problemId, problem.id))

		return { ...problem, companies }
	}

	async findById(id: string): Promise<Problem | null> {
		const [problem] = await this.database.db
			.select()
			.from(schema.problems)
			.where(eq(schema.problems.id, id))
			.limit(1)

		return problem || null
	}

	async create(data: NewProblem): Promise<Problem> {
		const [problem] = await this.database.db
			.insert(schema.problems)
			.values(data)
			.returning()

		return problem
	}

	async update(id: string, data: Partial<Problem>): Promise<Problem | null> {
		const [problem] = await this.database.db
			.update(schema.problems)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(schema.problems.id, id))
			.returning()

		return problem || null
	}

	async delete(id: string): Promise<boolean> {
		const [deleted] = await this.database.db
			.delete(schema.problems)
			.where(eq(schema.problems.id, id))
			.returning()

		return !!deleted
	}
}

@Injectable()
export class SolvedProblemsRepository implements ISolvedProblemsRepository {
	constructor(private readonly database: DatabaseService) {}

	async findByAccountAndProblem(accountId: string, problemId: string): Promise<SolvedProblem | null> {
		const [solved] = await this.database.db
			.select()
			.from(schema.solvedProblems)
			.where(
				and(
					eq(schema.solvedProblems.accountId, accountId),
					eq(schema.solvedProblems.problemId, problemId)
				)
			)
			.limit(1)

		return solved || null
	}

	async create(data: { accountId: string; problemId: string; code: string; status: 'ATTEMPTED' | 'SOLVED' }): Promise<SolvedProblem> {
		const [solved] = await this.database.db
			.insert(schema.solvedProblems)
			.values(data)
			.returning()

		return solved
	}

	async update(id: string, data: Partial<SolvedProblem>): Promise<SolvedProblem | null> {
		const [solved] = await this.database.db
			.update(schema.solvedProblems)
			.set({ ...data, solvedAt: new Date() })
			.where(eq(schema.solvedProblems.id, id))
			.returning()

		return solved || null
	}
}
