import { Problem, NewProblem, Company, NewCompany, SolvedProblem } from '@core/database/schema'
import { PaginatedResult } from '@common/interfaces'

export interface ProblemFilters {
	search?: string
	difficulty?: string
	sortBy?: string
	sortOrder?: 'asc' | 'desc'
}

export interface IProblemsRepository {
	findAll(page: number, limit: number, filters?: ProblemFilters): Promise<PaginatedResult<Problem>>
	findBySlug(slug: string): Promise<Problem | null>
	findById(id: string): Promise<Problem | null>
	create(data: NewProblem): Promise<Problem>
	update(id: string, data: Partial<Problem>): Promise<Problem | null>
	delete(id: string): Promise<boolean>
}

export interface ISolvedProblemsRepository {
	findByAccountAndProblem(accountId: string, problemId: string): Promise<SolvedProblem | null>
	findByAccount(accountId: string): Promise<SolvedProblem[]>
	findByAccountAndProblemSlug(accountId: string, slug: string): Promise<SolvedProblem | null>
	create(data: { accountId: string; problemId: string; code: string; status: 'ATTEMPTED' | 'SOLVED' }): Promise<SolvedProblem>
	update(id: string, data: Partial<SolvedProblem>): Promise<SolvedProblem | null>
}

export interface ICompaniesRepository {
	findAll(page: number, limit: number): Promise<PaginatedResult<Company & { problemCount: number }>>
	findById(id: string): Promise<Company | null>
	findByName(name: string): Promise<Company | null>
	create(data: NewCompany): Promise<Company>
	update(id: string, data: Partial<Company>): Promise<Company | null>
	delete(id: string): Promise<boolean>
}

export const PROBLEMS_REPOSITORY = Symbol('PROBLEMS_REPOSITORY')
export const SOLVED_PROBLEMS_REPOSITORY = Symbol('SOLVED_PROBLEMS_REPOSITORY')
export const COMPANIES_REPOSITORY = Symbol('COMPANIES_REPOSITORY')
