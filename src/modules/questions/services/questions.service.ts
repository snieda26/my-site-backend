import { Injectable, NotFoundException, Inject } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { DatabaseService } from '@core/database/database.service'
import * as schema from '@core/database/schema'
import { FilterQueryDto } from '@common/dto/query.dto'
import { PaginationDto } from '@common/dto/pagination.dto'
import { CreateQuestionDto, UpdateQuestionDto } from '../dto/question.dto'
import { IQuestionsRepository, ICategoriesRepository, QUESTIONS_REPOSITORY, CATEGORIES_REPOSITORY } from '../repositories'

@Injectable()
export class QuestionsService {
	constructor(
		@Inject(QUESTIONS_REPOSITORY)
		private readonly questionsRepository: IQuestionsRepository,
		@Inject(CATEGORIES_REPOSITORY)
		private readonly categoriesRepository: ICategoriesRepository,
		private readonly database: DatabaseService
	) {}

	async findAll(query: FilterQueryDto) {
		const { page, limit, search, category, difficulty, sortBy, sortOrder } = query
		return this.questionsRepository.findAll(page, limit, { search, category, difficulty, sortBy, sortOrder })
	}

	async findByCategory(categorySlug: string, query: PaginationDto) {
		const { page, limit } = query
		const category = await this.categoriesRepository.findBySlug(categorySlug)

		if (!category) {
			throw new NotFoundException('Category not found')
		}

		return this.questionsRepository.findByCategory(category.id, page, limit)
	}

	async findOne(slug: string) {
		const question = await this.questionsRepository.findBySlug(slug)

		if (!question) {
			throw new NotFoundException('Question not found')
		}

		let prevCategorySlug: string | null = null
		let nextCategorySlug: string | null = null

		if (question.prevSlug) {
			const [prevQuestion] = await this.database.db
				.select({ categorySlug: schema.categories.slug })
				.from(schema.questions)
				.leftJoin(schema.categories, eq(schema.questions.categoryId, schema.categories.id))
				.where(eq(schema.questions.slug, question.prevSlug))
				.limit(1)

			prevCategorySlug = prevQuestion?.categorySlug || null
		}

		if (question.nextSlug) {
			const [nextQuestion] = await this.database.db
				.select({ categorySlug: schema.categories.slug })
				.from(schema.questions)
				.leftJoin(schema.categories, eq(schema.questions.categoryId, schema.categories.id))
				.where(eq(schema.questions.slug, question.nextSlug))
				.limit(1)

			nextCategorySlug = nextQuestion?.categorySlug || null
		}

		const category = await this.categoriesRepository.findById(question.categoryId)

		return {
			...question,
			prevCategorySlug,
			nextCategorySlug,
			category: category ? {
				id: category.id,
				slug: category.slug,
				nameEn: category.nameEn,
				nameUa: category.nameUa,
				color: category.color,
			} : undefined,
		}
	}

	async create(dto: CreateQuestionDto) {
		return this.questionsRepository.create(dto)
	}

	async update(id: string, dto: UpdateQuestionDto) {
		const question = await this.questionsRepository.update(id, dto)

		if (!question) {
			throw new NotFoundException('Question not found')
		}

		return question
	}

	async remove(id: string) {
		const deleted = await this.questionsRepository.delete(id)

		if (!deleted) {
			throw new NotFoundException('Question not found')
		}

		return { message: 'Question deleted successfully' }
	}

	async findBySlug(slug: string) {
		return this.findOne(slug)
	}

	async delete(id: string) {
		return this.remove(id)
	}
}
