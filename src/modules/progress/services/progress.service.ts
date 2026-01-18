import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { PaginationDto, createPaginatedResult } from '@common/dto/pagination.dto'
import { UpdateProgressDto } from '../dto/progress.dto'

@Injectable()
export class ProgressService {
	constructor(private readonly db: DatabaseService) {}

	async getOverview(accountId: string) {
		const categories = await this.db.category.findMany({
			include: {
				_count: {
					select: { questions: true },
				},
				progress: {
					where: { accountId },
				},
			},
		})

		const overview = categories.map(category => {
			const totalQuestions = category._count.questions
			const completedQuestions = category.progress.filter(
				p => p.status === 'COMPLETED'
			).length
			const inProgressQuestions = category.progress.filter(
				p => p.status === 'IN_PROGRESS'
			).length

			return {
				id: category.id,
				slug: category.slug,
				name: category.name,
				icon: category.icon,
				color: category.color,
				totalQuestions,
				completedQuestions,
				inProgressQuestions,
				progressPercentage: totalQuestions > 0
					? Math.round((completedQuestions / totalQuestions) * 100)
					: 0,
			}
		})

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

	async getCategoryProgress(accountId: string, categorySlug: string) {
		const category = await this.db.category.findUnique({
			where: { slug: categorySlug },
			include: {
				questions: {
					include: {
						progress: {
							where: { accountId },
						},
					},
					orderBy: { order: 'asc' },
				},
			},
		})

		if (!category) {
			throw new NotFoundException('Category not found')
		}

		const questionsWithProgress = category.questions.map(question => ({
			id: question.id,
			slug: question.slug,
			title: question.title,
			difficulty: question.difficulty,
			status: question.progress[0]?.status || 'NOT_STARTED',
		}))

		const completed = questionsWithProgress.filter(q => q.status === 'COMPLETED').length
		const inProgress = questionsWithProgress.filter(q => q.status === 'IN_PROGRESS').length

		return {
			category: {
				id: category.id,
				slug: category.slug,
				name: category.name,
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
		const question = await this.db.question.findUnique({
			where: { id: dto.questionId },
		})

		if (!question) {
			throw new NotFoundException('Question not found')
		}

		const progress = await this.db.userProgress.upsert({
			where: {
				accountId_questionId: {
					accountId,
					questionId: dto.questionId,
				},
			},
			create: {
				accountId,
				questionId: dto.questionId,
				categoryId: question.categoryId,
				status: dto.status,
			},
			update: {
				status: dto.status,
			},
		})

		return progress
	}

	async getCompleted(accountId: string, query: PaginationDto) {
		const { page, limit } = query
		const skip = (page - 1) * limit

		const [completed, total] = await Promise.all([
			this.db.userProgress.findMany({
				where: {
					accountId,
					status: 'COMPLETED',
				},
				skip,
				take: limit,
				include: {
					question: {
						include: {
							category: {
								select: { id: true, slug: true, name: true, color: true },
							},
						},
					},
				},
				orderBy: { updatedAt: 'desc' },
			}),
			this.db.userProgress.count({
				where: {
					accountId,
					status: 'COMPLETED',
				},
			}),
		])

		return createPaginatedResult(
			completed.map(p => p.question),
			total,
			page,
			limit
		)
	}
}
