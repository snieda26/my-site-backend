import { pgTable, varchar, text, boolean, timestamp, pgEnum, integer, index, unique } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'

export const roleEnum = pgEnum('role', ['USER', 'ADMIN'])

export const experienceLevelEnum = pgEnum('experience_level', [
	'BEGINNER',
	'JUNIOR',
	'MIDDLE',
	'SENIOR',
	'LEAD',
])

export const targetPositionEnum = pgEnum('target_position', [
	'JUNIOR',
	'MIDDLE',
	'SENIOR',
	'LEAD',
])

export const learningGoalEnum = pgEnum('learning_goal', [
	'JOB_INTERVIEW',
	'SKILL_IMPROVEMENT',
	'CAREER_GROWTH',
	'KNOWLEDGE_REFRESH',
	'CERTIFICATION',
])

export const accounts = pgTable('accounts', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	email: varchar('email', { length: 255 }).unique().notNull(),
	password: varchar('password', { length: 255 }).notNull(),
	name: varchar('name', { length: 255 }),
	username: varchar('username', { length: 50 }).unique(),
	avatarUrl: varchar('avatar_url', { length: 512 }),
	emailVerified: boolean('email_verified').default(false).notNull(),
	verifyToken: varchar('verify_token', { length: 128 }).unique(),
	role: roleEnum('role').default('USER').notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
	emailIdx: index('accounts_email_idx').on(table.email),
	usernameIdx: index('accounts_username_idx').on(table.username),
}))

export const userProfiles = pgTable('user_profiles', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	accountId: varchar('account_id', { length: 128 })
		.references(() => accounts.id, { onDelete: 'cascade' })
		.unique()
		.notNull(),
	experienceLevel: experienceLevelEnum('experience_level').default('JUNIOR').notNull(),
	targetPosition: targetPositionEnum('target_position').default('MIDDLE').notNull(),
	yearsOfExperience: integer('years_of_experience'),
	learningGoal: learningGoalEnum('learning_goal').default('JOB_INTERVIEW').notNull(),
	weeklyHours: integer('weekly_hours'),
	technologies: text('technologies').array().default([]).notNull(),
	focusAreas: text('focus_areas').array().default([]).notNull(),
	preferredLanguage: varchar('preferred_language', { length: 10 }),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
	accountIdIdx: index('user_profiles_account_id_idx').on(table.accountId),
}))

export const accountsRelations = relations(accounts, ({ one }) => ({
	profile: one(userProfiles, {
		fields: [accounts.id],
		references: [userProfiles.accountId],
	}),
}))

export const userProfilesRelations = relations(userProfiles, ({ one }) => ({
	account: one(accounts, {
		fields: [userProfiles.accountId],
		references: [accounts.id],
	}),
}))

export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert
export type UserProfile = typeof userProfiles.$inferSelect
export type NewUserProfile = typeof userProfiles.$inferInsert
