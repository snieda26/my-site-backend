import { Injectable } from '@nestjs/common'
import { eq, and, or, like, desc, asc, sql, SQL } from 'drizzle-orm'
import { DatabaseService } from '@core/database/database.service'
import * as schema from '@core/database/schema'
import { Question, NewQuestion, Category } from '@core/database/schema'
import { PaginatedResult } from '@common/interfaces'
import { IQuestionsRepository, QuestionFilters } from './questions.repository.interface'

@Injectable()
export class QuestionsRepository implements IQuestionsRepository {
	constructor(private readonly database: DatabaseService) {}

	async findAll(
		page: number,
		limit: number,
		filters?: QuestionFilters
	): Promise<PaginatedResult<Question & { category?: Partial<Category> }>> {
		const offset = (page - 1) * limit
		const conditions: SQL<unknown>[] = []

		if (filters?.search) {
			const searchCondition = or(
				like(schema.questions.titleEn, `%${filters.search}%`),
				like(schema.questions.titleUa, `%${filters.search}%`),
				like(schema.questions.contentMarkdownEn, `%${filters.search}%`),
				like(schema.questions.contentMarkdownUa, `%${filters.search}%`)
			)
			if (searchCondition) conditions.push(searchCondition)
		}

		if (filters?.difficulty) {
			conditions.push(eq(schema.questions.difficulty, filters.difficulty as 'JUNIOR' | 'MIDDLE' | 'SENIOR'))
		}

		if (filters?.category) {
			const [cat] = await this.database.db
				.select({ id: schema.categories.id })
				.from(schema.categories)
				.where(eq(schema.categories.slug, filters.category))
				.limit(1)

			if (cat) conditions.push(eq(schema.questions.categoryId, cat.id))
		}

		const whereClause = conditions.length > 0 ? and(...conditions) : undefined
		const orderByColumn = filters?.sortBy === 'createdAt' ? schema.questions.createdAt :
			filters?.sortBy === 'difficulty' ? schema.questions.difficulty :
			schema.questions.order
		const orderByClause = filters?.sortOrder === 'desc' ? desc(orderByColumn) : asc(orderByColumn)

		const [questions, [{ count }]] = await Promise.all([
			this.database.db
				.select()
				.from(schema.questions)
				.leftJoin(schema.categories, eq(schema.questions.categoryId, schema.categories.id))
				.where(whereClause)
				.orderBy(orderByClause)
				.limit(limit)
				.offset(offset),
			this.database.db
				.select({ count: sql<number>`count(*)` })
				.from(schema.questions)
				.where(whereClause),
		])

		const mappedQuestions = questions.map(({ questions: q, categories: c }) => ({
			...q,
			category: c ? {
				id: c.id,
				slug: c.slug,
				nameEn: c.nameEn,
				nameUa: c.nameUa,
				color: c.color,
			} : undefined,
		}))

		const total = Number(count)
		return {
			data: mappedQuestions,
			meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
		}
	}

	async findBySlug(slug: string): Promise<Question | null> {
		const [question] = await this.database.db
			.select()
			.from(schema.questions)
			.where(eq(schema.questions.slug, slug))
			.limit(1)

		return question || null
	}

	async findById(id: string): Promise<Question | null> {
		const [question] = await this.database.db
			.select()
			.from(schema.questions)
			.where(eq(schema.questions.id, id))
			.limit(1)

		return question || null
	}

	async findByCategory(categoryId: string, page: number, limit: number): Promise<PaginatedResult<Question>> {
		const offset = (page - 1) * limit

		const [questions, [{ count }]] = await Promise.all([
			this.database.db
				.select()
				.from(schema.questions)
				.where(eq(schema.questions.categoryId, categoryId))
				.orderBy(asc(schema.questions.order))
				.limit(limit)
				.offset(offset),
			this.database.db
				.select({ count: sql<number>`count(*)` })
				.from(schema.questions)
				.where(eq(schema.questions.categoryId, categoryId)),
		])

		const total = Number(count)
		return {
			data: questions,
			meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
		}
	}

	async create(data: NewQuestion): Promise<Question> {
		const [question] = await this.database.db
			.insert(schema.questions)
			.values(data)
			.returning()

		return question
	}

	async update(id: string, data: Partial<Question>): Promise<Question | null> {
		const [question] = await this.database.db
			.update(schema.questions)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(schema.questions.id, id))
			.returning()

		return question || null
	}

	async delete(id: string): Promise<boolean> {
		const [deleted] = await this.database.db
			.delete(schema.questions)
			.where(eq(schema.questions.id, id))
			.returning()

		return !!deleted
	}
}
