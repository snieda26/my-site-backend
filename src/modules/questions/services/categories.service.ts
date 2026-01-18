/**
 * Categories Service (Drizzle Implementation)
 * Handles business logic for question categories
 * @module modules/questions/services
 */

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { eq, sql } from 'drizzle-orm'
import * as schema from '@core/database/schema'
import { createPaginatedResult, PaginationDto } from '@common/dto/pagination.dto'
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto'

@Injectable()
export class CategoriesService {
	constructor(private readonly database: DatabaseService) {}

	/**
	 * Get all categories with question counts
	 */
	async findAll(query: PaginationDto) {
		const { page, limit } = query
		const offset = (page - 1) * limit

		// Запит з підрахунком питань
		const [categories, [{ count }]] = await Promise.all([
			this.database.db
				.select({
					id: schema.categories.id,
					slug: schema.categories.slug,
					nameEn: schema.categories.nameEn,
					nameUa: schema.categories.nameUa,
					description: schema.categories.description,
					icon: schema.categories.icon,
					color: schema.categories.color,
					order: schema.categories.order,
					createdAt: schema.categories.createdAt,
					updatedAt: schema.categories.updatedAt,
					questionCount: sql<number>`count(${schema.questions.id})::int`,
				})
				.from(schema.categories)
				.leftJoin(schema.questions, eq(schema.categories.id, schema.questions.categoryId))
				.groupBy(schema.categories.id)
				.orderBy(schema.categories.order)
				.limit(limit)
				.offset(offset),
			
			this.database.db
				.select({ count: sql<number>`count(*)` })
				.from(schema.categories),
		])

		return createPaginatedResult(categories, Number(count), page, limit)
	}

	/**
	 * Get a single category by slug with its questions
	 */
	async findOne(slug: string) {
		const [category] = await this.database.db
			.select()
			.from(schema.categories)
			.where(eq(schema.categories.slug, slug))
			.limit(1)

		if (!category) {
			throw new NotFoundException('Категорію не знайдено')
		}

		return category
	}

	/**
	 * Create a new category
	 */
	async create(dto: CreateCategoryDto) {
		// Перевірка на унікальність slug
		const [existing] = await this.database.db
			.select()
			.from(schema.categories)
			.where(eq(schema.categories.slug, dto.slug))
			.limit(1)

		if (existing) {
			throw new ConflictException('Категорія з таким slug вже існує')
		}

		const [category] = await this.database.db
			.insert(schema.categories)
			.values(dto)
			.returning()

		return category
	}

	/**
	 * Update a category
	 */
	async update(id: string, dto: UpdateCategoryDto) {
		const [category] = await this.database.db
			.update(schema.categories)
			.set({
				...dto,
				updatedAt: new Date(),
			})
			.where(eq(schema.categories.id, id))
			.returning()

		if (!category) {
			throw new NotFoundException('Категорію не знайдено')
		}

		return category
	}

	/**
	 * Delete a category
	 */
	async remove(id: string) {
		const [deleted] = await this.database.db
			.delete(schema.categories)
			.where(eq(schema.categories.id, id))
			.returning()

		if (!deleted) {
			throw new NotFoundException('Категорію не знайдено')
		}

		return { message: 'Категорію успішно видалено' }
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
