import { Injectable } from '@nestjs/common'
import { eq, and, desc, sql } from 'drizzle-orm'
import { DatabaseService } from '@core/database/database.service'
import * as schema from '@core/database/schema'
import { UserProgress, NewUserProgress, Question, Category } from '@core/database/schema'
import { PaginatedResult } from '@common/interfaces'
import { IProgressRepository, CategoryProgress } from './progress.repository.interface'

@Injectable()
export class ProgressRepository implements IProgressRepository {
	constructor(private readonly database: DatabaseService) {}

	async findByAccountAndQuestion(accountId: string, questionId: string): Promise<UserProgress | null> {
		const [progress] = await this.database.db
			.select()
			.from(schema.userProgress)
			.where(
				and(
					eq(schema.userProgress.accountId, accountId),
					eq(schema.userProgress.questionId, questionId)
				)
			)
			.limit(1)

		return progress || null
	}

	async findByAccountAndCategory(accountId: string, categoryId: string): Promise<UserProgress[]> {
		return this.database.db
			.select()
			.from(schema.userProgress)
			.where(
				and(
					eq(schema.userProgress.accountId, accountId),
					eq(schema.userProgress.categoryId, categoryId)
				)
			)
	}

	async getOverview(accountId: string): Promise<{ categories: CategoryProgress[]; summary: { totalQuestions: number; totalCompleted: number; overallPercentage: number } }> {
		const categories = await this.database.db
			.select({
				id: schema.categories.id,
				slug: schema.categories.slug,
				nameEn: schema.categories.nameEn,
				nameUa: schema.categories.nameUa,
				icon: schema.categories.icon,
				color: schema.categories.color,
			})
			.from(schema.categories)
			.orderBy(schema.categories.order)

		const overview = await Promise.all(
			categories.map(async (category) => {
				const [{ totalQuestions }] = await this.database.db
					.select({ totalQuestions: sql<number>`count(*)::int` })
					.from(schema.questions)
					.where(eq(schema.questions.categoryId, category.id))

				const [{ completedQuestions }] = await this.database.db
					.select({ completedQuestions: sql<number>`count(*)::int` })
					.from(schema.userProgress)
					.where(
						and(
							eq(schema.userProgress.accountId, accountId),
							eq(schema.userProgress.categoryId, category.id),
							eq(schema.userProgress.status, 'COMPLETED')
						)
					)

				const [{ inProgressQuestions }] = await this.database.db
					.select({ inProgressQuestions: sql<number>`count(*)::int` })
					.from(schema.userProgress)
					.where(
						and(
							eq(schema.userProgress.accountId, accountId),
							eq(schema.userProgress.categoryId, category.id),
							eq(schema.userProgress.status, 'IN_PROGRESS')
						)
					)

				return {
					...category,
					totalQuestions: Number(totalQuestions),
					completedQuestions: Number(completedQuestions),
					inProgressQuestions: Number(inProgressQuestions),
					progressPercentage: totalQuestions > 0
						? Math.round((Number(completedQuestions) / Number(totalQuestions)) * 100)
						: 0,
				}
			})
		)

		const totalQuestions = overview.reduce((sum, cat) => sum + cat.totalQuestions, 0)
		const totalCompleted = overview.reduce((sum, cat) => sum + cat.completedQuestions, 0)

		return {
			categories: overview,
			summary: {
				totalQuestions,
				totalCompleted,
				overallPercentage: totalQuestions > 0
					? Math.round((totalCompleted / totalQuestions) * 100)
					: 0,
			},
		}
	}

	async getCompletedQuestions(accountId: string, page: number, limit: number): Promise<PaginatedResult<Question & { category?: Partial<Category> }>> {
		const offset = (page - 1) * limit

		const [completed, [{ count }]] = await Promise.all([
			this.database.db
				.select()
				.from(schema.userProgress)
				.leftJoin(schema.questions, eq(schema.userProgress.questionId, schema.questions.id))
				.leftJoin(schema.categories, eq(schema.questions.categoryId, schema.categories.id))
				.where(
					and(
						eq(schema.userProgress.accountId, accountId),
						eq(schema.userProgress.status, 'COMPLETED')
					)
				)
				.orderBy(desc(schema.userProgress.updatedAt))
				.limit(limit)
				.offset(offset),
			this.database.db
				.select({ count: sql<number>`count(*)` })
				.from(schema.userProgress)
				.where(
					and(
						eq(schema.userProgress.accountId, accountId),
						eq(schema.userProgress.status, 'COMPLETED')
					)
				),
		])

		const questions = completed
			.map(({ questions: q, categories: c }) =>
				q ? {
					...q,
					category: c ? {
						id: c.id,
						slug: c.slug,
						nameEn: c.nameEn,
						nameUa: c.nameUa,
						color: c.color,
					} : undefined,
				} : null
			)
			.filter((q): q is NonNullable<typeof q> => q !== null)

		const total = Number(count)
		return {
			data: questions,
			meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
		}
	}

	async create(data: NewUserProgress): Promise<UserProgress> {
		const [progress] = await this.database.db
			.insert(schema.userProgress)
			.values(data)
			.returning()

		return progress
	}

	async update(id: string, data: Partial<UserProgress>): Promise<UserProgress | null> {
		const [progress] = await this.database.db
			.update(schema.userProgress)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(schema.userProgress.id, id))
			.returning()

		return progress || null
	}
}
