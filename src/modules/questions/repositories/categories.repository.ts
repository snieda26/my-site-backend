import { Injectable } from '@nestjs/common'
import { eq, sql } from 'drizzle-orm'
import { DatabaseService } from '@core/database/database.service'
import * as schema from '@core/database/schema'
import { Category, NewCategory } from '@core/database/schema'
import { PaginatedResult } from '@common/interfaces'
import { ICategoriesRepository } from './questions.repository.interface'

@Injectable()
export class CategoriesRepository implements ICategoriesRepository {
	constructor(private readonly database: DatabaseService) {}

	async findAll(page: number, limit: number): Promise<PaginatedResult<Category & { questionCount: number }>> {
		const offset = (page - 1) * limit

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

		const total = Number(count)
		return {
			data: categories,
			meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
		}
	}

	async findBySlug(slug: string): Promise<Category | null> {
		const [category] = await this.database.db
			.select()
			.from(schema.categories)
			.where(eq(schema.categories.slug, slug))
			.limit(1)

		return category || null
	}

	async findById(id: string): Promise<Category | null> {
		const [category] = await this.database.db
			.select()
			.from(schema.categories)
			.where(eq(schema.categories.id, id))
			.limit(1)

		return category || null
	}

	async create(data: NewCategory): Promise<Category> {
		const [category] = await this.database.db
			.insert(schema.categories)
			.values(data)
			.returning()

		return category
	}

	async update(id: string, data: Partial<Category>): Promise<Category | null> {
		const [category] = await this.database.db
			.update(schema.categories)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(schema.categories.id, id))
			.returning()

		return category || null
	}

	async delete(id: string): Promise<boolean> {
		const [deleted] = await this.database.db
			.delete(schema.categories)
			.where(eq(schema.categories.id, id))
			.returning()

		return !!deleted
	}
}
