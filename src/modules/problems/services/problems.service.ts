/**
 * Problems Service - Drizzle Implementation
 * Manages coding problems and solutions
 */

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { FilterQueryDto } from '@common/dto/query.dto'
import { createPaginatedResult } from '@common/dto/pagination.dto'
import { CreateProblemDto, UpdateProblemDto, SubmitSolutionDto } from '../dto/problem.dto'
import { eq, and, or, like, desc, asc, sql, SQL } from 'drizzle-orm'
import * as schema from '@core/database/schema'

@Injectable()
export class ProblemsService {
	constructor(private readonly database: DatabaseService) {}

	async findAll(query: FilterQueryDto) {
		const { page, limit, search, difficulty, sortBy = 'createdAt', sortOrder = 'desc' } = query
		const offset = (page - 1) * limit

		// Build WHERE conditions
		const conditions: SQL[] = []

		if (search) {
			conditions.push(
				or(
					like(schema.problems.title, `%${search}%`),
					like(schema.problems.description, `%${search}%`)
				)!
			)
		}

		if (difficulty) {
			conditions.push(eq(schema.problems.difficulty, difficulty))
		}

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined

		// Determine sorting
		const orderByColumn = sortBy === 'createdAt' ? schema.problems.createdAt :
			sortBy === 'difficulty' ? schema.problems.difficulty :
			schema.problems.createdAt

		const orderByClause = sortOrder === 'desc' ? desc(orderByColumn) : asc(orderByColumn)

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

		return createPaginatedResult(problems, Number(count), page, limit)
	}

	async findBySlug(slug: string) {
		const [problem] = await this.database.db
			.select()
			.from(schema.problems)
			.where(eq(schema.problems.slug, slug))
			.limit(1)

		if (!problem) {
			throw new NotFoundException('Problem not found')
		}

		return problem
	}

	async create(dto: CreateProblemDto) {
		const [existing] = await this.database.db
			.select()
			.from(schema.problems)
			.where(eq(schema.problems.slug, dto.slug))
			.limit(1)

		if (existing) {
			throw new ConflictException('Problem with this slug already exists')
		}

		const { tags, companyIds, ...data } = dto

		// Use transaction for complex insert
		const [problem] = await this.database.db
			.insert(schema.problems)
			.values(data)
			.returning()

		return problem
	}

	async update(id: string, dto: UpdateProblemDto) {
		const [problem] = await this.database.db
			.select()
			.from(schema.problems)
			.where(eq(schema.problems.id, id))
			.limit(1)

		if (!problem) {
			throw new NotFoundException('Problem not found')
		}

		if (dto.slug && dto.slug !== problem.slug) {
			const [existing] = await this.database.db
				.select()
				.from(schema.problems)
				.where(eq(schema.problems.slug, dto.slug))
				.limit(1)

			if (existing) {
				throw new ConflictException('Problem with this slug already exists')
			}
		}

		const { tags, companyIds, ...data } = dto

		const [updated] = await this.database.db
			.update(schema.problems)
			.set({
				...data,
				updatedAt: new Date(),
			})
			.where(eq(schema.problems.id, id))
			.returning()

		return updated
	}

	async delete(id: string) {
		const [deleted] = await this.database.db
			.delete(schema.problems)
			.where(eq(schema.problems.id, id))
			.returning()

		if (!deleted) {
			throw new NotFoundException('Problem not found')
		}

		return { message: 'Problem deleted successfully' }
	}

	async submitSolution(slug: string, accountId: string, dto: SubmitSolutionDto) {
		const [problem] = await this.database.db
			.select()
			.from(schema.problems)
			.where(eq(schema.problems.slug, slug))
			.limit(1)

		if (!problem) {
			throw new NotFoundException('Problem not found')
		}

		// Check if solution exists
		const [existing] = await this.database.db
			.select()
			.from(schema.solvedProblems)
			.where(
				and(
					eq(schema.solvedProblems.accountId, accountId),
					eq(schema.solvedProblems.problemId, problem.id)
				)
			)
			.limit(1)

		let solved: typeof schema.solvedProblems.$inferSelect

		if (existing) {
			// Update existing solution
			[solved] = await this.database.db
				.update(schema.solvedProblems)
				.set({
					code: dto.code,
					solvedAt: new Date(),
				})
				.where(eq(schema.solvedProblems.id, existing.id))
				.returning()
		} else {
			// Create new solution
			[solved] = await this.database.db
				.insert(schema.solvedProblems)
				.values({
					accountId,
					problemId: problem.id,
					code: dto.code,
					status: 'ATTEMPTED',
				})
				.returning()
		}

		return {
			message: 'Solution submitted successfully',
			status: solved.status,
		}
	}
}
