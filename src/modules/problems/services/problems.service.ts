import { Injectable, NotFoundException, ConflictException } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { FilterQueryDto } from '@common/dto/query.dto'
import { createPaginatedResult } from '@common/dto/pagination.dto'
import { CreateProblemDto, UpdateProblemDto, SubmitSolutionDto } from '../dto/problem.dto'

@Injectable()
export class ProblemsService {
	constructor(private readonly db: DatabaseService) {}

	async findAll(query: FilterQueryDto) {
		const { page, limit, search, difficulty, tag, sortBy, sortOrder } = query
		const skip = (page - 1) * limit

		const where: any = {}

		if (search) {
			where.OR = [
				{ title: { contains: search, mode: 'insensitive' } },
				{ description: { contains: search, mode: 'insensitive' } },
			]
		}

		if (difficulty) {
			where.difficulty = difficulty
		}

		if (tag) {
			where.tags = { some: { name: tag } }
		}

		const orderBy: any = {}
		if (sortBy) {
			orderBy[sortBy] = sortOrder
		} else {
			orderBy.createdAt = 'desc'
		}

		const [problems, total] = await Promise.all([
			this.db.problem.findMany({
				where,
				skip,
				take: limit,
				orderBy,
				include: {
					companies: {
						select: { id: true, name: true, logo: true },
					},
					tags: true,
					_count: {
						select: { solved: true },
					},
				},
			}),
			this.db.problem.count({ where }),
		])

		return createPaginatedResult(problems, total, page, limit)
	}

	async findBySlug(slug: string) {
		const problem = await this.db.problem.findUnique({
			where: { slug },
			include: {
				companies: true,
				tags: true,
				_count: {
					select: { solved: true },
				},
			},
		})

		if (!problem) {
			throw new NotFoundException('Problem not found')
		}

		return problem
	}

	async create(dto: CreateProblemDto) {
		const existing = await this.db.problem.findUnique({
			where: { slug: dto.slug },
		})

		if (existing) {
			throw new ConflictException('Problem with this slug already exists')
		}

		const { tags, companyIds, ...data } = dto

		return this.db.problem.create({
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
				companies: companyIds
					? {
							connect: companyIds.map(id => ({ id })),
						}
					: undefined,
			},
			include: {
				companies: true,
				tags: true,
			},
		})
	}

	async update(id: string, dto: UpdateProblemDto) {
		const problem = await this.db.problem.findUnique({
			where: { id },
		})

		if (!problem) {
			throw new NotFoundException('Problem not found')
		}

		if (dto.slug && dto.slug !== problem.slug) {
			const existing = await this.db.problem.findUnique({
				where: { slug: dto.slug },
			})

			if (existing) {
				throw new ConflictException('Problem with this slug already exists')
			}
		}

		const { tags, companyIds, ...data } = dto

		return this.db.problem.update({
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
				companies: companyIds
					? {
							set: [],
							connect: companyIds.map(id => ({ id })),
						}
					: undefined,
			},
			include: {
				companies: true,
				tags: true,
			},
		})
	}

	async delete(id: string) {
		const problem = await this.db.problem.findUnique({
			where: { id },
		})

		if (!problem) {
			throw new NotFoundException('Problem not found')
		}

		await this.db.problem.delete({
			where: { id },
		})

		return { message: 'Problem deleted successfully' }
	}

	async submitSolution(slug: string, accountId: string, dto: SubmitSolutionDto) {
		const problem = await this.db.problem.findUnique({
			where: { slug },
		})

		if (!problem) {
			throw new NotFoundException('Problem not found')
		}

		// For now, just save the submission as "ATTEMPTED"
		// In a real app, you would run the code against test cases
		const solved = await this.db.solvedProblem.upsert({
			where: {
				accountId_problemId: {
					accountId,
					problemId: problem.id,
				},
			},
			create: {
				accountId,
				problemId: problem.id,
				code: dto.code,
				status: 'ATTEMPTED',
			},
			update: {
				code: dto.code,
				solvedAt: new Date(),
			},
		})

		return {
			message: 'Solution submitted successfully',
			status: solved.status,
		}
	}
}
