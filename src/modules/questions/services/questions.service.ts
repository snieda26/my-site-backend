/**
 * Questions Service (Drizzle Implementation)
 * Handles business logic for interview questions
 * @module modules/questions/services
 */

import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { eq, and, or, like, desc, asc, sql, SQL } from 'drizzle-orm'
import * as schema from '@core/database/schema'
import { createPaginatedResult, PaginationDto } from '@common/dto/pagination.dto'
import { FilterQueryDto } from '@common/dto/query.dto'
import { CreateQuestionDto, UpdateQuestionDto } from '../dto/question.dto'

@Injectable()
export class QuestionsService {
	constructor(private readonly database: DatabaseService) {}

	/**
	 * Get all questions with pagination, search, and filters
	 */
	async findAll(query: FilterQueryDto) {
		const { page, limit, search, category, difficulty, sortBy = 'order', sortOrder = 'asc' } = query
		const offset = (page - 1) * limit

		// Побудова умов WHERE
		const conditions: SQL<unknown>[] = []

		// Пошук по заголовкам та контенту
		if (search) {
			const searchCondition = or(
				like(schema.questions.titleEn, `%${search}%`),
				like(schema.questions.titleUa, `%${search}%`),
				like(schema.questions.contentMarkdownEn, `%${search}%`),
				like(schema.questions.contentMarkdownUa, `%${search}%`)
			)
			if (searchCondition) {
				conditions.push(searchCondition)
			}
		}

		// Фільтр по складності
		if (difficulty) {
			conditions.push(eq(schema.questions.difficulty, difficulty))
		}

		// Фільтр по категорії
		if (category) {
			const [cat] = await this.database.db
				.select({ id: schema.categories.id })
				.from(schema.categories)
				.where(eq(schema.categories.slug, category))
				.limit(1)

			if (cat) {
				conditions.push(eq(schema.questions.categoryId, cat.id))
			}
		}

		// Об'єднання умов
		const whereClause = conditions.length > 0 ? and(...conditions) : undefined

		// Визначення сортування
		const orderByColumn = sortBy === 'createdAt' ? schema.questions.createdAt :
			sortBy === 'order' ? schema.questions.order :
			sortBy === 'difficulty' ? schema.questions.difficulty :
			schema.questions.order

		const orderByClause = sortOrder === 'desc' ? desc(orderByColumn) : asc(orderByColumn)

		// Виконання запиту з пагінацією
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

		// Маппінг результатів
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

		return createPaginatedResult(mappedQuestions, Number(count), page, limit)
	}

	/**
	 * Get questions by category
	 */
	async findByCategory(categorySlug: string, query: PaginationDto) {
		const { page, limit } = query
		const offset = (page - 1) * limit

		// Знаходження категорії
		const [category] = await this.database.db
			.select()
			.from(schema.categories)
			.where(eq(schema.categories.slug, categorySlug))
			.limit(1)

		if (!category) {
			throw new NotFoundException('Категорію не знайдено')
		}

		// Отримання питань
		const [questions, [{ count }]] = await Promise.all([
			this.database.db
				.select()
				.from(schema.questions)
				.where(eq(schema.questions.categoryId, category.id))
				.orderBy(asc(schema.questions.order))
				.limit(limit)
				.offset(offset),
			
			this.database.db
				.select({ count: sql<number>`count(*)` })
				.from(schema.questions)
				.where(eq(schema.questions.categoryId, category.id)),
		])

		return createPaginatedResult(questions, Number(count), page, limit)
	}

	/**
	 * Get a single question by slug
	 */
	async findOne(slug: string) {
		const [question] = await this.database.db
			.select()
			.from(schema.questions)
			.leftJoin(schema.categories, eq(schema.questions.categoryId, schema.categories.id))
			.where(eq(schema.questions.slug, slug))
			.limit(1)

		if (!question) {
			throw new NotFoundException('Питання не знайдено')
		}

		return {
			...question.questions,
			category: question.categories ? {
				id: question.categories.id,
				slug: question.categories.slug,
				nameEn: question.categories.nameEn,
				nameUa: question.categories.nameUa,
				color: question.categories.color,
			} : undefined,
		}
	}

	/**
	 * Create a new question
	 */
	async create(dto: CreateQuestionDto) {
		const [question] = await this.database.db
			.insert(schema.questions)
			.values(dto)
			.returning()

		return question
	}

	/**
	 * Update a question
	 */
	async update(id: string, dto: UpdateQuestionDto) {
		const [question] = await this.database.db
			.update(schema.questions)
			.set({
				...dto,
				updatedAt: new Date(),
			})
			.where(eq(schema.questions.id, id))
			.returning()

		if (!question) {
			throw new NotFoundException('Питання не знайдено')
		}

		return question
	}

	/**
	 * Delete a question
	 */
	async remove(id: string) {
		const [deleted] = await this.database.db
			.delete(schema.questions)
			.where(eq(schema.questions.id, id))
			.returning()

		if (!deleted) {
			throw new NotFoundException('Питання не знайдено')
		}

		return { message: 'Питання успішно видалено' }
	}

	/**
	 * Alias for findOne - for backward compatibility
	 */
	async findBySlug(slug: string) {
		return this.findOne(slug)
	}

	/**
	 * Alias for remove - for backward compatibility
	 */
	async delete(id: string) {
		return this.remove(id)
	}
}
