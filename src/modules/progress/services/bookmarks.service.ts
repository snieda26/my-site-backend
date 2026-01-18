import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { PaginationDto, createPaginatedResult } from '@common/dto/pagination.dto'
import { CreateBookmarkDto } from '../dto/bookmark.dto'

@Injectable()
export class BookmarksService {
	constructor(private readonly db: DatabaseService) {}

	async findAll(accountId: string, query: PaginationDto) {
		const { page, limit } = query
		const skip = (page - 1) * limit

		const [bookmarks, total] = await Promise.all([
			this.db.bookmark.findMany({
				where: { accountId },
				skip,
				take: limit,
				include: {
					question: {
						include: {
							category: {
								select: { id: true, slug: true, nameEn: true, nameUa: true, color: true },
							},
						},
					},
					problem: {
						include: {
							companies: {
								select: { id: true, name: true },
							},
						},
					},
				},
				orderBy: { createdAt: 'desc' },
			}),
			this.db.bookmark.count({ where: { accountId } }),
		])

		return createPaginatedResult(bookmarks, total, page, limit)
	}

	async getQuestionBookmarks(accountId: string, query: PaginationDto) {
		const { page, limit } = query
		const skip = (page - 1) * limit

		const [bookmarks, total] = await Promise.all([
			this.db.bookmark.findMany({
				where: {
					accountId,
					questionId: { not: null },
				},
				skip,
				take: limit,
				include: {
					question: {
						include: {
							category: {
								select: { id: true, slug: true, nameEn: true, nameUa: true, color: true },
							},
						},
					},
				},
				orderBy: { createdAt: 'desc' },
			}),
			this.db.bookmark.count({
				where: {
					accountId,
					questionId: { not: null },
				},
			}),
		])

		return createPaginatedResult(
			bookmarks.map(b => b.question).filter(q => q !== null),
			total,
			page,
			limit
		)
	}

	async getProblemBookmarks(accountId: string, query: PaginationDto) {
		const { page, limit } = query
		const skip = (page - 1) * limit

		const [bookmarks, total] = await Promise.all([
			this.db.bookmark.findMany({
				where: {
					accountId,
					problemId: { not: null },
				},
				skip,
				take: limit,
				include: {
					problem: {
						include: {
							companies: {
								select: { id: true, name: true },
							},
						},
					},
				},
				orderBy: { createdAt: 'desc' },
			}),
			this.db.bookmark.count({
				where: {
					accountId,
					problemId: { not: null },
				},
			}),
		])

		return createPaginatedResult(
			bookmarks.map(b => b.problem),
			total,
			page,
			limit
		)
	}

	async create(accountId: string, dto: CreateBookmarkDto) {
		// Check if already bookmarked
		if (dto.questionId) {
			const existing = await this.db.bookmark.findUnique({
				where: {
					accountId_questionId: {
						accountId,
						questionId: dto.questionId,
					},
				},
			})

			if (existing) {
				throw new ConflictException('Question already bookmarked')
			}

			const question = await this.db.question.findUnique({
				where: { id: dto.questionId },
			})

			if (!question) {
				throw new NotFoundException('Question not found')
			}
		}

		if (dto.problemId) {
			const existing = await this.db.bookmark.findUnique({
				where: {
					accountId_problemId: {
						accountId,
						problemId: dto.problemId,
					},
				},
			})

			if (existing) {
				throw new ConflictException('Problem already bookmarked')
			}

			const problem = await this.db.problem.findUnique({
				where: { id: dto.problemId },
			})

			if (!problem) {
				throw new NotFoundException('Problem not found')
			}
		}

		return this.db.bookmark.create({
			data: {
				accountId,
				questionId: dto.questionId,
				problemId: dto.problemId,
			},
			include: {
				question: true,
				problem: true,
			},
		})
	}

	async delete(accountId: string, id: string) {
		const bookmark = await this.db.bookmark.findFirst({
			where: {
				id,
				accountId,
			},
		})

		if (!bookmark) {
			throw new NotFoundException('Bookmark not found')
		}

		await this.db.bookmark.delete({
			where: { id },
		})

		return { message: 'Bookmark deleted successfully' }
	}
}
