import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { FilterQueryDto } from '@common/dto/query.dto'
import { createPaginatedResult } from '@common/dto/pagination.dto'
import { CreateQuestionDto, UpdateQuestionDto } from '../dto/question.dto'

@Injectable()
export class QuestionsService {
	constructor(private readonly db: DatabaseService) {}

	async findAll(query: FilterQueryDto) {
		const { page, limit, search, category, difficulty, sortBy, sortOrder } = query
		const skip = (page - 1) * limit

		const where: any = {}

		if (search) {
			where.OR = [
				{ titleEn: { contains: search, mode: 'insensitive' } },
				{ titleUa: { contains: search, mode: 'insensitive' } },
				{ contentMarkdown: { contains: search, mode: 'insensitive' } },
			]
		}

		if (category) {
			where.category = { slug: category }
		}

		if (difficulty) {
			where.difficulty = difficulty
		}

		const orderBy: any = {}
		if (sortBy) {
			orderBy[sortBy] = sortOrder
		} else {
			orderBy.order = 'asc'
		}

		const [questions, total] = await Promise.all([
			this.db.question.findMany({
				where,
				skip,
				take: limit,
				orderBy,
				include: {
					category: {
						select: { id: true, slug: true, nameEn: true, nameUa: true, color: true },
					},
					tags: true,
				},
			}),
			this.db.question.count({ where }),
		])

		return createPaginatedResult(questions, total, page, limit)
	}

	async findByCategory(categorySlug: string, query: FilterQueryDto) {
		const { page, limit, difficulty, sortBy, sortOrder } = query
		const skip = (page - 1) * limit

		const category = await this.db.category.findUnique({
			where: { slug: categorySlug },
		})

		if (!category) {
			throw new NotFoundException('Category not found')
		}

		const where: any = { categoryId: category.id }

		if (difficulty) {
			where.difficulty = difficulty
		}

		const orderBy: any = {}
		if (sortBy) {
			orderBy[sortBy] = sortOrder
		} else {
			orderBy.order = 'asc'
		}

		const [questions, total] = await Promise.all([
			this.db.question.findMany({
				where,
				skip,
				take: limit,
				orderBy,
				include: {
					category: {
						select: { id: true, slug: true, nameEn: true, nameUa: true, color: true },
					},
					tags: true,
				},
			}),
			this.db.question.count({ where }),
		])

		return createPaginatedResult(questions, total, page, limit)
	}

	async findBySlug(slug: string) {
		const question = await this.db.question.findUnique({
			where: { slug },
			include: {
				category: true,
				tags: true,
			},
		})

		if (!question) {
			throw new NotFoundException('Question not found')
		}

		return question
	}

	async create(dto: CreateQuestionDto) {
		const existing = await this.db.question.findUnique({
			where: { slug: dto.slug },
		})

		if (existing) {
			throw new ConflictException('Question with this slug already exists')
		}

		const { tags, ...data } = dto

		return this.db.question.create({
			data: {
				...data,
				tags: tags
					? {
							connectOrCreate: tags.map(tag => ({
								where: { name: tag },
								create: { name: tag },
							})),
						}
					: undefined,
			},
			include: {
				category: true,
				tags: true,
			},
		})
	}

	async update(id: string, dto: UpdateQuestionDto) {
		const question = await this.db.question.findUnique({
			where: { id },
		})

		if (!question) {
			throw new NotFoundException('Question not found')
		}

		if (dto.slug && dto.slug !== question.slug) {
			const existing = await this.db.question.findUnique({
				where: { slug: dto.slug },
			})

			if (existing) {
				throw new ConflictException('Question with this slug already exists')
			}
		}

		const { tags, ...data } = dto

		return this.db.question.update({
			where: { id },
			data: {
				...data,
				tags: tags
					? {
							set: [],
							connectOrCreate: tags.map(tag => ({
								where: { name: tag },
								create: { name: tag },
							})),
						}
					: undefined,
			},
			include: {
				category: true,
				tags: true,
			},
		})
	}

	async delete(id: string) {
		const question = await this.db.question.findUnique({
			where: { id },
		})

		if (!question) {
			throw new NotFoundException('Question not found')
		}

		await this.db.question.delete({
			where: { id },
		})

		return { message: 'Question deleted successfully' }
	}
}
