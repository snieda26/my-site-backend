import { pgTable, varchar, text, timestamp, pgEnum, index, unique, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'
import { difficultyEnum } from './questions.schema'
import { accounts } from './auth.schema'
import { tags } from './questions.schema'

export const solveStatusEnum = pgEnum('solve_status', ['ATTEMPTED', 'SOLVED'])

export const problems = pgTable('problems', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	slug: varchar('slug', { length: 255 }).unique().notNull(),
	title: varchar('title', { length: 500 }).notNull(),
	titleUa: varchar('title_ua', { length: 500 }),
	description: text('description').notNull(),
	descriptionUa: text('description_ua'),
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

export const companies = pgTable('companies', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	name: varchar('name', { length: 255 }).unique().notNull(),
	logo: varchar('logo', { length: 512 }),
})

export const problemsToCompanies = pgTable('problems_to_companies', {
	problemId: varchar('problem_id', { length: 128 })
		.references(() => problems.id, { onDelete: 'cascade' })
		.notNull(),
	companyId: varchar('company_id', { length: 128 })
		.references(() => companies.id, { onDelete: 'cascade' })
		.notNull(),
}, (table) => ({
	pk: primaryKey({ columns: [table.problemId, table.companyId] }),
}))

export const problemsToTags = pgTable('problems_to_tags', {
	problemId: varchar('problem_id', { length: 128 })
		.references(() => problems.id, { onDelete: 'cascade' })
		.notNull(),
	tagId: varchar('tag_id', { length: 128 })
		.references(() => tags.id, { onDelete: 'cascade' })
		.notNull(),
}, (table) => ({
	pk: primaryKey({ columns: [table.problemId, table.tagId] }),
}))

export const solvedProblems = pgTable('solved_problems', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	accountId: varchar('account_id', { length: 128 })
		.references(() => accounts.id, { onDelete: 'cascade' })
		.notNull(),
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
	tag: one(tags, {
		fields: [problemsToTags.tagId],
		references: [tags.id],
	}),
}))

export const solvedProblemsRelations = relations(solvedProblems, ({ one }) => ({
	problem: one(problems, {
		fields: [solvedProblems.problemId],
		references: [problems.id],
	}),
	account: one(accounts, {
		fields: [solvedProblems.accountId],
		references: [accounts.id],
	}),
}))

export type Problem = typeof problems.$inferSelect
export type NewProblem = typeof problems.$inferInsert
export type Company = typeof companies.$inferSelect
export type NewCompany = typeof companies.$inferInsert
export type SolvedProblem = typeof solvedProblems.$inferSelect
export type NewSolvedProblem = typeof solvedProblems.$inferInsert
