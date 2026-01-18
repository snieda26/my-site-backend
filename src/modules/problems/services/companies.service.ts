import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { PaginationDto, createPaginatedResult } from '@common/dto/pagination.dto'
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/company.dto'

@Injectable()
export class CompaniesService {
	constructor(private readonly db: DatabaseService) {}

	async findAll(query: PaginationDto) {
		const { page, limit } = query
		const skip = (page - 1) * limit

		const [companies, total] = await Promise.all([
			this.db.company.findMany({
				skip,
				take: limit,
				orderBy: { name: 'asc' },
				include: {
					_count: {
						select: { problems: true },
					},
				},
			}),
			this.db.company.count(),
		])

		return createPaginatedResult(companies, total, page, limit)
	}

	async create(dto: CreateCompanyDto) {
		const existing = await this.db.company.findUnique({
			where: { name: dto.name },
		})

		if (existing) {
			throw new ConflictException('Company with this name already exists')
		}

		return this.db.company.create({
			data: dto,
		})
	}

	async update(id: string, dto: UpdateCompanyDto) {
		const company = await this.db.company.findUnique({
			where: { id },
		})

		if (!company) {
			throw new NotFoundException('Company not found')
		}

		if (dto.name && dto.name !== company.name) {
			const existing = await this.db.company.findUnique({
				where: { name: dto.name },
			})

			if (existing) {
				throw new ConflictException('Company with this name already exists')
			}
		}

		return this.db.company.update({
			where: { id },
			data: dto,
		})
	}

	async delete(id: string) {
		const company = await this.db.company.findUnique({
			where: { id },
		})

		if (!company) {
			throw new NotFoundException('Company not found')
		}

		await this.db.company.delete({
			where: { id },
		})

		return { message: 'Company deleted successfully' }
	}
}
