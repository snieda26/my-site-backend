import { pgTable, varchar, timestamp, pgEnum, index, unique } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import { accounts } from './auth.schema'
import { categories, questions } from './questions.schema'
import { problems } from './problems.schema'

export const progressStatusEnum = pgEnum('progress_status', [
	'NOT_STARTED',
	'IN_PROGRESS',
	'COMPLETED',
])

export const userProgress = pgTable('user_progress', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	accountId: varchar('account_id', { length: 128 })
		.references(() => accounts.id, { onDelete: 'cascade' })
		.notNull(),
	categoryId: varchar('category_id', { length: 128 })
		.references(() => categories.id, { onDelete: 'cascade' }),
	questionId: varchar('question_id', { length: 128 })
		.references(() => questions.id, { onDelete: 'cascade' }),
	status: progressStatusEnum('status').default('NOT_STARTED').notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
	accountQuestionUnique: unique('user_progress_account_question_unique')
		.on(table.accountId, table.questionId),
	accountIdIdx: index('user_progress_account_id_idx').on(table.accountId),
	categoryIdIdx: index('user_progress_category_id_idx').on(table.categoryId),
}))

export const bookmarks = pgTable('bookmarks', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	accountId: varchar('account_id', { length: 128 })
		.references(() => accounts.id, { onDelete: 'cascade' })
		.notNull(),
	questionId: varchar('question_id', { length: 128 })
		.references(() => questions.id, { onDelete: 'cascade' }),
	problemId: varchar('problem_id', { length: 128 })
		.references(() => problems.id, { onDelete: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
	accountQuestionUnique: unique('bookmarks_account_question_unique')
		.on(table.accountId, table.questionId),
	accountProblemUnique: unique('bookmarks_account_problem_unique')
		.on(table.accountId, table.problemId),
	accountIdIdx: index('bookmarks_account_id_idx').on(table.accountId),
}))

export const userProgressRelations = relations(userProgress, ({ one }) => ({
	account: one(accounts, {
		fields: [userProgress.accountId],
		references: [accounts.id],
	}),
	category: one(categories, {
		fields: [userProgress.categoryId],
		references: [categories.id],
	}),
	question: one(questions, {
		fields: [userProgress.questionId],
		references: [questions.id],
	}),
}))

export const bookmarksRelations = relations(bookmarks, ({ one }) => ({
	account: one(accounts, {
		fields: [bookmarks.accountId],
		references: [accounts.id],
	}),
	question: one(questions, {
		fields: [bookmarks.questionId],
		references: [questions.id],
	}),
	problem: one(problems, {
		fields: [bookmarks.problemId],
		references: [problems.id],
	}),
}))

export type UserProgress = typeof userProgress.$inferSelect
export type NewUserProgress = typeof userProgress.$inferInsert
export type Bookmark = typeof bookmarks.$inferSelect
export type NewBookmark = typeof bookmarks.$inferInsert
