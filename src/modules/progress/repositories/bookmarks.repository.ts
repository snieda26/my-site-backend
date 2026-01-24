import { Injectable } from '@nestjs/common'
import { eq, and, desc, isNotNull, sql } from 'drizzle-orm'
import { DatabaseService } from '@core/database/database.service'
import * as schema from '@core/database/schema'
import { Bookmark, NewBookmark, Question, Category, Problem } from '@core/database/schema'
import { PaginatedResult } from '@common/interfaces'
import { IBookmarksRepository } from './progress.repository.interface'

@Injectable()
export class BookmarksRepository implements IBookmarksRepository {
	constructor(private readonly database: DatabaseService) {}

	async findAll(accountId: string, page: number, limit: number): Promise<PaginatedResult<Bookmark>> {
		const offset = (page - 1) * limit

		const [bookmarks, [{ count }]] = await Promise.all([
			this.database.db
				.select()
				.from(schema.bookmarks)
				.where(eq(schema.bookmarks.accountId, accountId))
				.orderBy(desc(schema.bookmarks.createdAt))
				.limit(limit)
				.offset(offset),
			this.database.db
				.select({ count: sql<number>`count(*)` })
				.from(schema.bookmarks)
				.where(eq(schema.bookmarks.accountId, accountId)),
		])

		const total = Number(count)
		return {
			data: bookmarks,
			meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
		}
	}

	async findQuestionBookmarks(accountId: string, page: number, limit: number): Promise<PaginatedResult<Question & { category?: Partial<Category> }>> {
		const offset = (page - 1) * limit

		const [bookmarks, [{ count }]] = await Promise.all([
			this.database.db
				.select()
				.from(schema.bookmarks)
				.leftJoin(schema.questions, eq(schema.bookmarks.questionId, schema.questions.id))
				.leftJoin(schema.categories, eq(schema.questions.categoryId, schema.categories.id))
				.where(
					and(
						eq(schema.bookmarks.accountId, accountId),
						isNotNull(schema.bookmarks.questionId)
					)
				)
				.orderBy(desc(schema.bookmarks.createdAt))
				.limit(limit)
				.offset(offset),
			this.database.db
				.select({ count: sql<number>`count(*)` })
				.from(schema.bookmarks)
				.where(
					and(
						eq(schema.bookmarks.accountId, accountId),
						isNotNull(schema.bookmarks.questionId)
					)
				),
		])

		const questions = bookmarks
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

	async findProblemBookmarks(accountId: string, page: number, limit: number): Promise<PaginatedResult<Problem>> {
		const offset = (page - 1) * limit

		const [bookmarks, [{ count }]] = await Promise.all([
			this.database.db
				.select()
				.from(schema.bookmarks)
				.leftJoin(schema.problems, eq(schema.bookmarks.problemId, schema.problems.id))
				.where(
					and(
						eq(schema.bookmarks.accountId, accountId),
						isNotNull(schema.bookmarks.problemId)
					)
				)
				.orderBy(desc(schema.bookmarks.createdAt))
				.limit(limit)
				.offset(offset),
			this.database.db
				.select({ count: sql<number>`count(*)` })
				.from(schema.bookmarks)
				.where(
					and(
						eq(schema.bookmarks.accountId, accountId),
						isNotNull(schema.bookmarks.problemId)
					)
				),
		])

		const problems = bookmarks
			.map(({ problems: p }) => p)
			.filter((p): p is NonNullable<typeof p> => p !== null)

		const total = Number(count)
		return {
			data: problems,
			meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
		}
	}

	async findByAccountAndQuestion(accountId: string, questionId: string): Promise<Bookmark | null> {
		const [bookmark] = await this.database.db
			.select()
			.from(schema.bookmarks)
			.where(
				and(
					eq(schema.bookmarks.accountId, accountId),
					eq(schema.bookmarks.questionId, questionId)
				)
			)
			.limit(1)

		return bookmark || null
	}

	async findByAccountAndProblem(accountId: string, problemId: string): Promise<Bookmark | null> {
		const [bookmark] = await this.database.db
			.select()
			.from(schema.bookmarks)
			.where(
				and(
					eq(schema.bookmarks.accountId, accountId),
					eq(schema.bookmarks.problemId, problemId)
				)
			)
			.limit(1)

		return bookmark || null
	}

	async create(data: NewBookmark): Promise<Bookmark> {
		const [bookmark] = await this.database.db
			.insert(schema.bookmarks)
			.values(data)
			.returning()

		return bookmark
	}

	async delete(accountId: string, id: string): Promise<boolean> {
		const [deleted] = await this.database.db
			.delete(schema.bookmarks)
			.where(
				and(
					eq(schema.bookmarks.id, id),
					eq(schema.bookmarks.accountId, accountId)
				)
			)
			.returning()

		return !!deleted
	}
}
