/**
 * User Progress & Bookmarks Schema
 * Tracks learning progress and saved items
 * @module database/schema/progress
 */

import { pgTable, varchar, timestamp, pgEnum, index, unique } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'

// ============================================
// ENUMS
// ============================================

export const progressStatusEnum = pgEnum('progress_status', [
	'NOT_STARTED',
	'IN_PROGRESS',
	'COMPLETED',
])

// ============================================
// TABLES
// ============================================

/**
 * User Progress Table
 * Tracks completion status of questions
 */
export const userProgress = pgTable('user_progress', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	
	accountId: varchar('account_id', { length: 128 }).notNull(),
	categoryId: varchar('category_id', { length: 128 }),
	questionId: varchar('question_id', { length: 128 }),
	
	status: progressStatusEnum('status').default('NOT_STARTED').notNull(),
	
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
	accountQuestionUnique: unique('user_progress_account_question_unique')
		.on(table.accountId, table.questionId),
	accountIdIdx: index('user_progress_account_id_idx').on(table.accountId),
	categoryIdIdx: index('user_progress_category_id_idx').on(table.categoryId),
}))

/**
 * Bookmarks Table
 * User-saved questions and problems
 */
export const bookmarks = pgTable('bookmarks', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	
	accountId: varchar('account_id', { length: 128 }).notNull(),
	questionId: varchar('question_id', { length: 128 }),
	problemId: varchar('problem_id', { length: 128 }),
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
	accountQuestionUnique: unique('bookmarks_account_question_unique')
		.on(table.accountId, table.questionId),
	accountProblemUnique: unique('bookmarks_account_problem_unique')
		.on(table.accountId, table.problemId),
	accountIdIdx: index('bookmarks_account_id_idx').on(table.accountId),
}))

// ============================================
// RELATIONS
// ============================================

export const userProgressRelations = relations(userProgress, ({ one }) => ({
	// Relations will be defined when all schemas are imported
}))

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
	// Relations will be defined when all schemas are imported
}))

// ============================================
// TYPES
// ============================================

export type UserProgress = typeof userProgress.$inferSelect
export type NewUserProgress = typeof userProgress.$inferInsert

export type Bookmark = typeof bookmarks.$inferSelect
export type NewBookmark = typeof bookmarks.$inferInsert
