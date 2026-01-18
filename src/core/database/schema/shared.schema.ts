/**
 * Shared Schema Exports
 * Re-exports enums and types used across multiple schemas
 * @module database/schema/shared
 */

// Re-export commonly used enums
export { difficultyEnum } from './questions.schema'
export { solveStatusEnum } from './problems.schema'
export { progressStatusEnum } from './progress.schema'
export {
	roleEnum,
	experienceLevelEnum,
	targetPositionEnum,
	learningGoalEnum,
} from './auth.schema'

// Re-export commonly used types
export type { Account, NewAccount, UserProfile, NewUserProfile } from './auth.schema'
export type { Category, NewCategory, Question, NewQuestion, Tag, NewTag } from './questions.schema'
export type { Problem, NewProblem, Company, NewCompany, SolvedProblem, NewSolvedProblem } from './problems.schema'
export type { UserProgress, NewUserProgress, Bookmark, NewBookmark } from './progress.schema'
