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
		const { page, limit, search, difficulty, category, sortBy, sortOrder } = query
		return this.problemsRepository.findAll(page, limit, { search, difficulty, category, sortBy, sortOrder })
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
		console.log('submitSolution - Received DTO:', {
			slug,
			accountId,
			codeLength: dto.code?.length,
			status: dto.status,
			checkedRequirements: dto.checkedRequirements,
		})

		const problem = await this.problemsRepository.findBySlug(slug)

		if (!problem) {
			throw new NotFoundException('Problem not found')
		}

		const existing = await this.solvedProblemsRepository.findByAccountAndProblem(accountId, problem.id)

		let solved: { status: string }

		if (existing) {
			const updateData: any = { 
				code: dto.code,
				status: dto.status 
			}
			if (dto.checkedRequirements !== undefined) {
				updateData.checkedRequirements = dto.checkedRequirements
				console.log('Updating with checkedRequirements:', dto.checkedRequirements)
			}
			solved = await this.solvedProblemsRepository.update(existing.id, updateData) as { status: string }
		} else {
			const createData = {
				accountId,
				problemId: problem.id,
				code: dto.code,
				status: dto.status || 'ATTEMPTED',
				checkedRequirements: dto.checkedRequirements || '[]',
			}
			console.log('Creating new submission with checkedRequirements:', createData.checkedRequirements)
			solved = await this.solvedProblemsRepository.create(createData)
		}

		return {
			message: 'Solution submitted successfully',
			status: solved.status,
		}
	}

	async getSolvedProblems(accountId: string) {
		const solved = await this.solvedProblemsRepository.findByAccount(accountId)
		
		return {
			solved: solved.map(s => ({
				problemId: s.problemId,
				status: s.status,
				solvedAt: s.solvedAt,
			})),
		}
	}

	async getUserSubmission(slug: string, accountId: string) {
		const submission = await this.solvedProblemsRepository.findByAccountAndProblemSlug(accountId, slug)
		
		if (!submission) {
			return null
		}

		const result = {
			code: submission.code,
			status: submission.status,
			checkedRequirements: submission.checkedRequirements || '[]',
			solvedAt: submission.solvedAt,
		}
		
		console.log('getUserSubmission - Returning:', {
			hasCode: !!result.code,
			status: result.status,
			checkedRequirements: result.checkedRequirements,
		})

		return result
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
