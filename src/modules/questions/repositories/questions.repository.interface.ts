import { Question, NewQuestion, Category, NewCategory } from '@core/database/schema'
import { PaginatedResult } from '@common/interfaces'

export interface QuestionFilters {
	search?: string
	category?: string
	difficulty?: string
	sortBy?: string
	sortOrder?: 'asc' | 'desc'
}

export interface IQuestionsRepository {
	findAll(page: number, limit: number, filters?: QuestionFilters): Promise<PaginatedResult<Question & { category?: Partial<Category> }>>
	findBySlug(slug: string): Promise<Question | null>
	findById(id: string): Promise<Question | null>
	findByCategory(categoryId: string, page: number, limit: number): Promise<PaginatedResult<Question>>
	create(data: NewQuestion): Promise<Question>
	update(id: string, data: Partial<Question>): Promise<Question | null>
	delete(id: string): Promise<boolean>
}

export interface ICategoriesRepository {
	findAll(page: number, limit: number): Promise<PaginatedResult<Category & { questionCount: number }>>
	findBySlug(slug: string): Promise<Category | null>
	findById(id: string): Promise<Category | null>
	create(data: NewCategory): Promise<Category>
	update(id: string, data: Partial<Category>): Promise<Category | null>
	delete(id: string): Promise<boolean>
}

export const QUESTIONS_REPOSITORY = Symbol('QUESTIONS_REPOSITORY')
export const CATEGORIES_REPOSITORY = Symbol('CATEGORIES_REPOSITORY')
