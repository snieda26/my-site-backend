import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common'
import { PaginationDto } from '@common/dto/pagination.dto'
import { CreateBookmarkDto } from '../dto/bookmark.dto'
import { IBookmarksRepository, BOOKMARKS_REPOSITORY } from '../repositories'
import { IQuestionsRepository, QUESTIONS_REPOSITORY } from '@modules/questions/repositories'
import { IProblemsRepository, PROBLEMS_REPOSITORY } from '@modules/problems/repositories'

@Injectable()
export class BookmarksService {
	constructor(
		@Inject(BOOKMARKS_REPOSITORY)
		private readonly bookmarksRepository: IBookmarksRepository,
		@Inject(QUESTIONS_REPOSITORY)
		private readonly questionsRepository: IQuestionsRepository,
		@Inject(PROBLEMS_REPOSITORY)
		private readonly problemsRepository: IProblemsRepository
	) {}

	async findAll(accountId: string, query: PaginationDto) {
		const { page, limit } = query
		return this.bookmarksRepository.findAll(accountId, page, limit)
	}

	async getQuestionBookmarks(accountId: string, query: PaginationDto) {
		const { page, limit } = query
		return this.bookmarksRepository.findQuestionBookmarks(accountId, page, limit)
	}

	async getProblemBookmarks(accountId: string, query: PaginationDto) {
		const { page, limit } = query
		return this.bookmarksRepository.findProblemBookmarks(accountId, page, limit)
	}

	async create(accountId: string, dto: CreateBookmarkDto) {
		if (dto.questionId) {
			const existing = await this.bookmarksRepository.findByAccountAndQuestion(accountId, dto.questionId)
			if (existing) {
				throw new ConflictException('Question already bookmarked')
			}

			const question = await this.questionsRepository.findById(dto.questionId)
			if (!question) {
				throw new NotFoundException('Question not found')
			}
		}

		if (dto.problemId) {
			const existing = await this.bookmarksRepository.findByAccountAndProblem(accountId, dto.problemId)
			if (existing) {
				throw new ConflictException('Problem already bookmarked')
			}

			const problem = await this.problemsRepository.findById(dto.problemId)
			if (!problem) {
				throw new NotFoundException('Problem not found')
			}
		}

		return this.bookmarksRepository.create({
			accountId,
			questionId: dto.questionId || null,
			problemId: dto.problemId || null,
		})
	}

	async delete(accountId: string, id: string) {
		const deleted = await this.bookmarksRepository.delete(accountId, id)

		if (!deleted) {
			throw new NotFoundException('Bookmark not found')
		}

		return { message: 'Bookmark deleted successfully' }
	}
}
