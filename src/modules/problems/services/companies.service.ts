import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common'
import { PaginationDto } from '@common/dto/pagination.dto'
import { CreateCompanyDto, UpdateCompanyDto } from '../dto/company.dto'
import { ICompaniesRepository, COMPANIES_REPOSITORY } from '../repositories'

@Injectable()
export class CompaniesService {
	constructor(
		@Inject(COMPANIES_REPOSITORY)
		private readonly companiesRepository: ICompaniesRepository
	) {}

	async findAll(query: PaginationDto) {
		const { page, limit } = query
		return this.companiesRepository.findAll(page, limit)
	}

	async create(dto: CreateCompanyDto) {
		const existing = await this.companiesRepository.findByName(dto.name)

		if (existing) {
			throw new ConflictException('Company with this name already exists')
		}

		return this.companiesRepository.create(dto)
	}

	async update(id: string, dto: UpdateCompanyDto) {
		const company = await this.companiesRepository.findById(id)

		if (!company) {
			throw new NotFoundException('Company not found')
		}

		if (dto.name && dto.name !== company.name) {
			const existing = await this.companiesRepository.findByName(dto.name)
			if (existing) {
				throw new ConflictException('Company with this name already exists')
			}
		}

		return this.companiesRepository.update(id, dto)
	}

	async delete(id: string) {
		const deleted = await this.companiesRepository.delete(id)

		if (!deleted) {
			throw new NotFoundException('Company not found')
		}

		return { message: 'Company deleted successfully' }
	}
}
