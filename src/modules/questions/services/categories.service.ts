import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common'
import { PaginationDto } from '@common/dto/pagination.dto'
import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto'
import { ICategoriesRepository, CATEGORIES_REPOSITORY } from '../repositories'

@Injectable()
export class CategoriesService {
	constructor(
		@Inject(CATEGORIES_REPOSITORY)
		private readonly categoriesRepository: ICategoriesRepository
	) {}

	async findAll(query: PaginationDto) {
		const { page, limit } = query
		return this.categoriesRepository.findAll(page, limit)
	}

	async findOne(slug: string) {
		const category = await this.categoriesRepository.findBySlug(slug)

		if (!category) {
			throw new NotFoundException('Category not found')
		}

		return category
	}

	async create(dto: CreateCategoryDto) {
		const existing = await this.categoriesRepository.findBySlug(dto.slug)

		if (existing) {
			throw new ConflictException('Category with this slug already exists')
		}

		return this.categoriesRepository.create(dto)
	}

	async update(id: string, dto: UpdateCategoryDto) {
		const category = await this.categoriesRepository.update(id, dto)

		if (!category) {
			throw new NotFoundException('Category not found')
		}

		return category
	}

	async remove(id: string) {
		const deleted = await this.categoriesRepository.delete(id)

		if (!deleted) {
			throw new NotFoundException('Category not found')
		}

		return { message: 'Category deleted successfully' }
	}

	async findBySlug(slug: string) {
		return this.findOne(slug)
	}

	async delete(id: string) {
		return this.remove(id)
	}
}
