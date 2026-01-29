import { pgTable, varchar, text, integer, timestamp, pgEnum, index, primaryKey } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'

export const difficultyEnum = pgEnum('difficulty', ['JUNIOR', 'MIDDLE', 'SENIOR'])

export const categories = pgTable('categories', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	slug: varchar('slug', { length: 255 }).unique().notNull(),
	nameEn: varchar('name_en', { length: 255 }).notNull(),
	nameUa: varchar('name_ua', { length: 255 }).notNull(),
	description: text('description'),
	icon: varchar('icon', { length: 50 }),
	color: varchar('color', { length: 50 }),
	order: integer('order').default(0).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
	slugIdx: index('categories_slug_idx').on(table.slug),
}))

export const questions = pgTable('questions', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	slug: varchar('slug', { length: 255 }).unique().notNull(),
	titleEn: varchar('title_en', { length: 500 }).notNull(),
	titleUa: varchar('title_ua', { length: 500 }).notNull(),
	descriptionEn: text('description_en'),
	descriptionUa: text('description_ua'),
	contentMarkdownEn: text('content_markdown_en').notNull(),
	contentMarkdownUa: text('content_markdown_ua').notNull(),
	shortAnswerEn: text('short_answer_en'),
	shortAnswerUa: text('short_answer_ua'),
	difficulty: difficultyEnum('difficulty').default('MIDDLE').notNull(),
	order: integer('order').default(0).notNull(),
	prevSlug: varchar('prev_slug', { length: 255 }),
	nextSlug: varchar('next_slug', { length: 255 }),
	prevCategorySlug: varchar('prev_category_slug', { length: 255 }),
	nextCategorySlug: varchar('next_category_slug', { length: 255 }),
	categoryId: varchar('category_id', { length: 128 })
		.references(() => categories.id, { onDelete: 'cascade' })
		.notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
	categoryIdIdx: index('questions_category_id_idx').on(table.categoryId),
	slugIdx: index('questions_slug_idx').on(table.slug),
	difficultyIdx: index('questions_difficulty_idx').on(table.difficulty),
}))

export const tags = pgTable('tags', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	name: varchar('name', { length: 100 }).unique().notNull(),
})

export const questionsToTags = pgTable('questions_to_tags', {
	questionId: varchar('question_id', { length: 128 })
		.references(() => questions.id, { onDelete: 'cascade' })
		.notNull(),
	tagId: varchar('tag_id', { length: 128 })
		.references(() => tags.id, { onDelete: 'cascade' })
		.notNull(),
}, (table) => ({
	pk: primaryKey({ columns: [table.questionId, table.tagId] }),
}))

export const categoriesRelations = relations(categories, ({ many }) => ({
	questions: many(questions),
}))

export const questionsRelations = relations(questions, ({ one, many }) => ({
	category: one(categories, {
		fields: [questions.categoryId],
		references: [categories.id],
	}),
	tagsToQuestions: many(questionsToTags),
}))

export const tagsRelations = relations(tags, ({ many }) => ({
	questionsToTags: many(questionsToTags),
}))

export const questionsToTagsRelations = relations(questionsToTags, ({ one }) => ({
	question: one(questions, {
		fields: [questionsToTags.questionId],
		references: [questions.id],
	}),
	tag: one(tags, {
		fields: [questionsToTags.tagId],
		references: [tags.id],
	}),
}))

export type Category = typeof categories.$inferSelect
export type NewCategory = typeof categories.$inferInsert
export type Question = typeof questions.$inferSelect
export type NewQuestion = typeof questions.$inferInsert
export type Tag = typeof tags.$inferSelect
export type NewTag = typeof tags.$inferInsert
