import { UserProgress, NewUserProgress, Bookmark, NewBookmark, Category, Question } from '@core/database/schema'
import { PaginatedResult } from '@common/interfaces'

export interface CategoryProgress {
	id: string
	slug: string
	nameEn: string
	nameUa: string
	icon: string | null
	color: string | null
	totalQuestions: number
	completedQuestions: number
	inProgressQuestions: number
	progressPercentage: number
}

export interface IProgressRepository {
	findByAccountAndQuestion(accountId: string, questionId: string): Promise<UserProgress | null>
	findByAccountAndCategory(accountId: string, categoryId: string): Promise<UserProgress[]>
	getOverview(accountId: string): Promise<{ categories: CategoryProgress[]; summary: { totalQuestions: number; totalCompleted: number; overallPercentage: number } }>
	getCompletedQuestions(accountId: string, page: number, limit: number): Promise<PaginatedResult<Question & { category?: Partial<Category> }>>
	create(data: NewUserProgress): Promise<UserProgress>
	update(id: string, data: Partial<UserProgress>): Promise<UserProgress | null>
}

export interface IBookmarksRepository {
	findAll(accountId: string, page: number, limit: number): Promise<PaginatedResult<Bookmark>>
	findQuestionBookmarks(accountId: string, page: number, limit: number): Promise<PaginatedResult<Question & { category?: Partial<Category> }>>
	findProblemBookmarks(accountId: string, page: number, limit: number): Promise<PaginatedResult<unknown>>
	findByAccountAndQuestion(accountId: string, questionId: string): Promise<Bookmark | null>
	findByAccountAndProblem(accountId: string, problemId: string): Promise<Bookmark | null>
	create(data: NewBookmark): Promise<Bookmark>
	delete(accountId: string, id: string): Promise<boolean>
}

export const PROGRESS_REPOSITORY = Symbol('PROGRESS_REPOSITORY')
export const BOOKMARKS_REPOSITORY = Symbol('BOOKMARKS_REPOSITORY')
