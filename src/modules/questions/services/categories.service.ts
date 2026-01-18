import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { PaginationDto, createPaginatedResult } from '@common/dto/pagination.dto'
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto'

@Injectable()
export class CategoriesService {
	constructor(private readonly db: DatabaseService) {}

	async findAll(query: PaginationDto) {
		const { page, limit } = query
		const skip = (page - 1) * limit

		const [categories, total] = await Promise.all([
			this.db.category.findMany({
				skip,
				take: limit,
				orderBy: { order: 'asc' },
				include: {
					_count: {
						select: { questions: true },
					},
				},
			}),
			this.db.category.count(),
		])

		return createPaginatedResult(categories, total, page, limit)
	}

	async findBySlug(slug: string) {
		const category = await this.db.category.findUnique({
			where: { slug },
			include: {
				_count: {
					select: { questions: true },
				},
			},
		})

		if (!category) {
			throw new NotFoundException('Category not found')
		}

		return category
	}

	async create(dto: CreateCategoryDto) {
		const existing = await this.db.category.findUnique({
			where: { slug: dto.slug },
		})

		if (existing) {
			throw new ConflictException('Category with this slug already exists')
		}

		return this.db.category.create({
			data: dto,
		})
	}

	async update(id: string, dto: UpdateCategoryDto) {
		const category = await this.db.category.findUnique({
			where: { id },
		})

		if (!category) {
			throw new NotFoundException('Category not found')
		}

		if (dto.slug && dto.slug !== category.slug) {
			const existing = await this.db.category.findUnique({
				where: { slug: dto.slug },
			})

			if (existing) {
				throw new ConflictException('Category with this slug already exists')
			}
		}

		return this.db.category.update({
			where: { id },
			data: dto,
		})
	}

	async delete(id: string) {
		const category = await this.db.category.findUnique({
			where: { id },
		})

		if (!category) {
			throw new NotFoundException('Category not found')
		}

		await this.db.category.delete({
			where: { id },
		})

		return { message: 'Category deleted successfully' }
	}
}
