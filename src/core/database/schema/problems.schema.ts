/**
 * Coding Problems Schema
 * Defines coding challenges, companies, and solutions
 * @module database/schema/problems
 */

import { pgTable, varchar, text, timestamp, pgEnum, index, unique } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import { difficultyEnum } from './questions.schema'

// ============================================
// ENUMS
// ============================================

export const solveStatusEnum = pgEnum('solve_status', ['ATTEMPTED', 'SOLVED'])

// ============================================
// TABLES
// ============================================

/**
 * Problems Table
 * Coding challenges with test cases
 */
export const problems = pgTable('problems', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	
	slug: varchar('slug', { length: 255 }).unique().notNull(),
	title: varchar('title', { length: 500 }).notNull(),
	description: text('description').notNull(),
	
	difficulty: difficultyEnum('difficulty').default('MEDIUM').notNull(),
	
	starterCode: text('starter_code').notNull(),
	solution: text('solution').notNull(),
	testCases: text('test_cases').notNull(),
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
	slugIdx: index('problems_slug_idx').on(table.slug),
	difficultyIdx: index('problems_difficulty_idx').on(table.difficulty),
}))

/**
 * Companies Table
 * Companies that ask specific problems
 */
export const companies = pgTable('companies', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	
	name: varchar('name', { length: 255 }).unique().notNull(),
	logo: varchar('logo', { length: 512 }),
})

/**
 * Problem-Company Join Table
 * Many-to-many relationship between problems and companies
 */
export const problemsToCompanies = pgTable('problems_to_companies', {
	problemId: varchar('problem_id', { length: 128 })
		.references(() => problems.id, { onDelete: 'cascade' })
		.notNull(),
	
	companyId: varchar('company_id', { length: 128 })
		.references(() => companies.id, { onDelete: 'cascade' })
		.notNull(),
}, (table) => ({
	pk: index('problems_to_companies_pk').on(table.problemId, table.companyId),
}))

/**
 * Problem-Tag Join Table
 * Many-to-many relationship between problems and tags
 */
export const problemsToTags = pgTable('problems_to_tags', {
	problemId: varchar('problem_id', { length: 128 })
		.references(() => problems.id, { onDelete: 'cascade' })
		.notNull(),
	
	tagId: varchar('tag_id', { length: 128 }).notNull(),
}, (table) => ({
	pk: index('problems_to_tags_pk').on(table.problemId, table.tagId),
}))

/**
 * Solved Problems Table
 * Tracks user solutions to problems
 */
export const solvedProblems = pgTable('solved_problems', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	
	accountId: varchar('account_id', { length: 128 }).notNull(),
	
	problemId: varchar('problem_id', { length: 128 })
		.references(() => problems.id, { onDelete: 'cascade' })
		.notNull(),
	
	code: text('code').notNull(),
	status: solveStatusEnum('status').default('ATTEMPTED').notNull(),
	
	solvedAt: timestamp('solved_at').defaultNow().notNull(),
}, (table) => ({
	accountProblemUnique: unique('solved_problems_account_problem_unique')
		.on(table.accountId, table.problemId),
	accountIdIdx: index('solved_problems_account_id_idx').on(table.accountId),
	problemIdIdx: index('solved_problems_problem_id_idx').on(table.problemId),
}))

// ============================================
// RELATIONS
// ============================================

export const problemsRelations = relations(problems, ({ many }) => ({
	problemsToCompanies: many(problemsToCompanies),
	problemsToTags: many(problemsToTags),
	solvedBy: many(solvedProblems),
}))

export const companiesRelations = relations(companies, ({ many }) => ({
	problemsToCompanies: many(problemsToCompanies),
}))

export const problemsToCompaniesRelations = relations(problemsToCompanies, ({ one }) => ({
	problem: one(problems, {
		fields: [problemsToCompanies.problemId],
		references: [problems.id],
	}),
	company: one(companies, {
		fields: [problemsToCompanies.companyId],
		references: [companies.id],
	}),
}))

export const problemsToTagsRelations = relations(problemsToTags, ({ one }) => ({
	problem: one(problems, {
		fields: [problemsToTags.problemId],
		references: [problems.id],
	}),
}))

export const solvedProblemsRelations = relations(solvedProblems, ({ one }) => ({
	problem: one(problems, {
		fields: [solvedProblems.problemId],
		references: [problems.id],
	}),
}))

// ============================================
// TYPES
// ============================================

export type Problem = typeof problems.$inferSelect
export type NewProblem = typeof problems.$inferInsert

export type Company = typeof companies.$inferSelect
export type NewCompany = typeof companies.$inferInsert

export type SolvedProblem = typeof solvedProblems.$inferSelect
export type NewSolvedProblem = typeof solvedProblems.$inferInsert
