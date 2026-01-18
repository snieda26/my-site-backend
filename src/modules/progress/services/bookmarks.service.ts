/**
 * Bookmarks Service - Drizzle Implementation
 * Manages user bookmarks for questions and problems
 */

import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { PaginationDto, createPaginatedResult } from '@common/dto/pagination.dto'
import { CreateBookmarkDto } from '../dto/bookmark.dto'
import { eq, and, desc, isNotNull, sql } from 'drizzle-orm'
import * as schema from '@core/database/schema'

@Injectable()
export class BookmarksService {
	constructor(private readonly database: DatabaseService) {}

	async findAll(accountId: string, query: PaginationDto) {
		const { page, limit } = query
		const offset = (page - 1) * limit

		const [bookmarks, [{ count }]] = await Promise.all([
			this.database.db
				.select()
				.from(schema.bookmarks)
				.leftJoin(schema.questions, eq(schema.bookmarks.questionId, schema.questions.id))
				.leftJoin(schema.categories, eq(schema.questions.categoryId, schema.categories.id))
				.leftJoin(schema.problems, eq(schema.bookmarks.problemId, schema.problems.id))
				.where(eq(schema.bookmarks.accountId, accountId))
				.orderBy(desc(schema.bookmarks.createdAt))
				.limit(limit)
				.offset(offset),
			
			this.database.db
				.select({ count: sql<number>`count(*)` })
				.from(schema.bookmarks)
				.where(eq(schema.bookmarks.accountId, accountId)),
		])

		return createPaginatedResult(bookmarks, Number(count), page, limit)
	}

	async getQuestionBookmarks(accountId: string, query: PaginationDto) {
		const { page, limit } = query
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
			.filter(q => q !== null)

		return createPaginatedResult(questions, Number(count), page, limit)
	}

	async getProblemBookmarks(accountId: string, query: PaginationDto) {
		const { page, limit } = query
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
			.filter(p => p !== null)

		return createPaginatedResult(problems, Number(count), page, limit)
	}

	async create(accountId: string, dto: CreateBookmarkDto) {
		// Validate question if provided
		if (dto.questionId) {
			const [existing] = await this.database.db
				.select()
				.from(schema.bookmarks)
				.where(
					and(
						eq(schema.bookmarks.accountId, accountId),
						eq(schema.bookmarks.questionId, dto.questionId)
					)
				)
				.limit(1)

			if (existing) {
				throw new ConflictException('Question already bookmarked')
			}

			const [question] = await this.database.db
				.select()
				.from(schema.questions)
				.where(eq(schema.questions.id, dto.questionId))
				.limit(1)

			if (!question) {
				throw new NotFoundException('Question not found')
			}
		}

		// Validate problem if provided
		if (dto.problemId) {
			const [existing] = await this.database.db
				.select()
				.from(schema.bookmarks)
				.where(
					and(
						eq(schema.bookmarks.accountId, accountId),
						eq(schema.bookmarks.problemId, dto.problemId)
					)
				)
				.limit(1)

			if (existing) {
				throw new ConflictException('Problem already bookmarked')
			}

			const [problem] = await this.database.db
				.select()
				.from(schema.problems)
				.where(eq(schema.problems.id, dto.problemId))
				.limit(1)

			if (!problem) {
				throw new NotFoundException('Problem not found')
			}
		}

		const [bookmark] = await this.database.db
			.insert(schema.bookmarks)
			.values({
				accountId,
				questionId: dto.questionId || null,
				problemId: dto.problemId || null,
			})
			.returning()

		return bookmark
	}

	async delete(accountId: string, id: string) {
		const [bookmark] = await this.database.db
			.delete(schema.bookmarks)
			.where(
				and(
					eq(schema.bookmarks.id, id),
					eq(schema.bookmarks.accountId, accountId)
				)
			)
			.returning()

		if (!bookmark) {
			throw new NotFoundException('Bookmark not found')
		}

		return { message: 'Bookmark deleted successfully' }
	}
}
