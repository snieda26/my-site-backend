import { Injectable, NotFoundException, Inject } from '@nestjs/common'
import { PaginationDto } from '@common/dto/pagination.dto'
import { UpdateProgressDto } from '../dto/progress.dto'
import { IProgressRepository, PROGRESS_REPOSITORY } from '../repositories'
import { ICategoriesRepository, IQuestionsRepository, CATEGORIES_REPOSITORY, QUESTIONS_REPOSITORY } from '@modules/questions/repositories'

@Injectable()
export class ProgressService {
	constructor(
		@Inject(PROGRESS_REPOSITORY)
		private readonly progressRepository: IProgressRepository,
		@Inject(CATEGORIES_REPOSITORY)
		private readonly categoriesRepository: ICategoriesRepository,
		@Inject(QUESTIONS_REPOSITORY)
		private readonly questionsRepository: IQuestionsRepository
	) {}

	async getOverview(accountId: string) {
		return this.progressRepository.getOverview(accountId)
	}

	async getCategoryProgress(accountId: string, categorySlug: string) {
		const category = await this.categoriesRepository.findBySlug(categorySlug)

		if (!category) {
			throw new NotFoundException('Category not found')
		}

		const questionsResult = await this.questionsRepository.findByCategory(category.id, 1, 1000)
		const progressRecords = await this.progressRepository.findByAccountAndCategory(accountId, category.id)

		const progressMap = new Map(
			progressRecords.map(p => [p.questionId, p.status])
		)

		const questionsWithProgress = questionsResult.data.map(question => ({
			id: question.id,
			slug: question.slug,
			titleEn: question.titleEn,
			titleUa: question.titleUa,
			difficulty: question.difficulty,
			status: progressMap.get(question.id) || 'NOT_STARTED',
		}))

		const completed = questionsWithProgress.filter(q => q.status === 'COMPLETED').length
		const inProgress = questionsWithProgress.filter(q => q.status === 'IN_PROGRESS').length

		return {
			category: {
				id: category.id,
				slug: category.slug,
				nameEn: category.nameEn,
				nameUa: category.nameUa,
				icon: category.icon,
				color: category.color,
			},
			questions: questionsWithProgress,
			summary: {
				total: questionsWithProgress.length,
				completed,
				inProgress,
				notStarted: questionsWithProgress.length - completed - inProgress,
				progressPercentage: questionsWithProgress.length > 0
					? Math.round((completed / questionsWithProgress.length) * 100)
					: 0,
			},
		}
	}

	async updateProgress(accountId: string, dto: UpdateProgressDto) {
		const question = await this.questionsRepository.findById(dto.questionId)

		if (!question) {
			throw new NotFoundException('Question not found')
		}

		const existing = await this.progressRepository.findByAccountAndQuestion(accountId, dto.questionId)

		if (existing) {
			return this.progressRepository.update(existing.id, { status: dto.status })
		}

		return this.progressRepository.create({
			accountId,
			questionId: dto.questionId,
			categoryId: question.categoryId,
			status: dto.status,
		})
	}

	async getCompleted(accountId: string, query: PaginationDto) {
		const { page, limit } = query
		return this.progressRepository.getCompletedQuestions(accountId, page, limit)
	}
}
