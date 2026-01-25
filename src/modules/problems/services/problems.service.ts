import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common'
import { FilterQueryDto } from '@common/dto/query.dto'
import { CreateProblemDto, UpdateProblemDto, SubmitSolutionDto } from '../dto/problem.dto'
import {
	IProblemsRepository,
	ISolvedProblemsRepository,
	PROBLEMS_REPOSITORY,
	SOLVED_PROBLEMS_REPOSITORY,
} from '../repositories'
import { CodeExecutorService } from './code-executor.service'

@Injectable()
export class ProblemsService {
	constructor(
		@Inject(PROBLEMS_REPOSITORY)
		private readonly problemsRepository: IProblemsRepository,
		@Inject(SOLVED_PROBLEMS_REPOSITORY)
		private readonly solvedProblemsRepository: ISolvedProblemsRepository,
		private readonly codeExecutorService: CodeExecutorService
	) {}

	async findAll(query: FilterQueryDto) {
		const { page, limit, search, difficulty, sortBy, sortOrder } = query
		return this.problemsRepository.findAll(page, limit, { search, difficulty, sortBy, sortOrder })
	}

	async findBySlug(slug: string) {
		const problem = await this.problemsRepository.findBySlug(slug)

		if (!problem) {
			throw new NotFoundException('Problem not found')
		}

		return problem
	}

	async create(dto: CreateProblemDto) {
		const existing = await this.problemsRepository.findBySlug(dto.slug)

		if (existing) {
			throw new ConflictException('Problem with this slug already exists')
		}

		const { tags, companyIds, ...data } = dto
		return this.problemsRepository.create(data)
	}

	async update(id: string, dto: UpdateProblemDto) {
		const problem = await this.problemsRepository.findById(id)

		if (!problem) {
			throw new NotFoundException('Problem not found')
		}

		if (dto.slug && dto.slug !== problem.slug) {
			const existing = await this.problemsRepository.findBySlug(dto.slug)
			if (existing) {
				throw new ConflictException('Problem with this slug already exists')
			}
		}

		const { tags, companyIds, ...data } = dto
		return this.problemsRepository.update(id, data)
	}

	async delete(id: string) {
		const deleted = await this.problemsRepository.delete(id)

		if (!deleted) {
			throw new NotFoundException('Problem not found')
		}

		return { message: 'Problem deleted successfully' }
	}

	async submitSolution(slug: string, accountId: string, dto: SubmitSolutionDto) {
		const problem = await this.problemsRepository.findBySlug(slug)

		if (!problem) {
			throw new NotFoundException('Problem not found')
		}

		const existing = await this.solvedProblemsRepository.findByAccountAndProblem(accountId, problem.id)

		let solved: { status: string }

		if (existing) {
			solved = await this.solvedProblemsRepository.update(existing.id, { code: dto.code }) as { status: string }
		} else {
			solved = await this.solvedProblemsRepository.create({
				accountId,
				problemId: problem.id,
				code: dto.code,
				status: 'ATTEMPTED',
			})
		}

		return {
			message: 'Solution submitted successfully',
			status: solved.status,
		}
	}

	async runCode(slug: string, code: string) {
		const problem = await this.problemsRepository.findBySlug(slug)

		if (!problem) {
			throw new NotFoundException('Problem not found')
		}

		if (!problem.testCases) {
			throw new NotFoundException('No test cases available for this problem')
		}

		const result = await this.codeExecutorService.executeCode(code, problem.testCases)

		return {
			...result,
			totalTests: result.testResults.length,
			passedTests: result.testResults.filter(r => r.passed).length,
		}
	}
}
