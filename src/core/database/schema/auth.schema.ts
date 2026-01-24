/**
 * Authentication & Identity Schema
 * Defines user accounts, profiles, and authentication-related tables
 * @module database/schema/auth
 */

import { pgTable, varchar, text, boolean, timestamp, pgEnum, integer, index, unique } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'
import { createId } from '@paralleldrive/cuid2'

// ============================================
// ENUMS
// ============================================

export const roleEnum = pgEnum('role', ['USER', 'ADMIN'])

export const experienceLevelEnum = pgEnum('experience_level', [
	'BEGINNER', // No commercial experience
	'JUNIOR',   // 0-1 years
	'MIDDLE',   // 1-3 years
	'SENIOR',   // 3+ years
	'LEAD',     // Team Lead / Architect
])

export const targetPositionEnum = pgEnum('target_position', [
	'JUNIOR',
	'MIDDLE',
	'SENIOR',
	'LEAD',
])

export const learningGoalEnum = pgEnum('learning_goal', [
	'JOB_INTERVIEW',      // Preparing for job interview
	'SKILL_IMPROVEMENT',  // Improving existing skills
	'CAREER_GROWTH',      // Growing to next level
	'KNOWLEDGE_REFRESH',  // Refreshing existing knowledge
	'CERTIFICATION',      // Preparing for certification
])

// ============================================
// TABLES
// ============================================

/**
 * User Accounts Table
 * Core authentication and user identity
 */
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
	onboardingCompleted: boolean('onboarding_completed').default(false).notNull(),
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
	emailIdx: index('accounts_email_idx').on(table.email),
	usernameIdx: index('accounts_username_idx').on(table.username),
}))

/**
 * User Profiles Table
 * Extended user preferences and onboarding data
 */
export const userProfiles = pgTable('user_profiles', {
	id: varchar('id', { length: 128 })
		.$defaultFn(() => createId())
		.primaryKey(),
	
	accountId: varchar('account_id', { length: 128 })
		.references(() => accounts.id, { onDelete: 'cascade' })
		.unique()
		.notNull(),
	
	// Experience & Target
	experienceLevel: experienceLevelEnum('experience_level').default('JUNIOR').notNull(),
	targetPosition: targetPositionEnum('target_position').default('MIDDLE').notNull(),
	yearsOfExperience: integer('years_of_experience'),
	
	// Learning preferences
	learningGoal: learningGoalEnum('learning_goal').default('JOB_INTERVIEW').notNull(),
	weeklyHours: integer('weekly_hours'), // Hours per week available for learning
	
	// Technologies to learn (JSON array of slugs)
	technologies: text('technologies').array().default([]).notNull(),
	
	// Focus areas (JSON array)
	focusAreas: text('focus_areas').array().default([]).notNull(),
	
	// Additional preferences
	preferredLanguage: varchar('preferred_language', { length: 10 }), // "en" or "ua"
	
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
	accountIdIdx: index('user_profiles_account_id_idx').on(table.accountId),
}))

// ============================================
// RELATIONS
// ============================================

export const accountsRelations = relations(accounts, ({ one, many }) => ({
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

// ============================================
// TYPES
// ============================================

export type Account = typeof accounts.$inferSelect
export type NewAccount = typeof accounts.$inferInsert

export type UserProfile = typeof userProfiles.$inferSelect
export type NewUserProfile = typeof userProfiles.$inferInsert
