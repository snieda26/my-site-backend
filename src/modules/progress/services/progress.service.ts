/**
 * Progress Service - Drizzle Implementation
 * Tracks user learning progress
 */

import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { PaginationDto, createPaginatedResult } from '@common/dto/pagination.dto'
import { UpdateProgressDto } from '../dto/progress.dto'
import { eq, and, desc, sql } from 'drizzle-orm'
import * as schema from '@core/database/schema'

@Injectable()
export class ProgressService {
	constructor(private readonly database: DatabaseService) {}

	async getOverview(accountId: string) {
		// Get all categories with question counts and progress
		const categories = await this.database.db
			.select({
				id: schema.categories.id,
				slug: schema.categories.slug,
				nameEn: schema.categories.nameEn,
				nameUa: schema.categories.nameUa,
				icon: schema.categories.icon,
				color: schema.categories.color,
			})
			.from(schema.categories)
			.orderBy(schema.categories.order)

		const overview = await Promise.all(
			categories.map(async (category) => {
				// Count total questions
				const [{ totalQuestions }] = await this.database.db
					.select({ totalQuestions: sql<number>`count(*)::int` })
					.from(schema.questions)
					.where(eq(schema.questions.categoryId, category.id))

				// Count completed
				const [{ completedQuestions }] = await this.database.db
					.select({ completedQuestions: sql<number>`count(*)::int` })
					.from(schema.userProgress)
					.where(
						and(
							eq(schema.userProgress.accountId, accountId),
							eq(schema.userProgress.categoryId, category.id),
							eq(schema.userProgress.status, 'COMPLETED')
						)
					)

				// Count in progress
				const [{ inProgressQuestions }] = await this.database.db
					.select({ inProgressQuestions: sql<number>`count(*)::int` })
					.from(schema.userProgress)
					.where(
						and(
							eq(schema.userProgress.accountId, accountId),
							eq(schema.userProgress.categoryId, category.id),
							eq(schema.userProgress.status, 'IN_PROGRESS')
						)
					)

				return {
					...category,
					totalQuestions: Number(totalQuestions),
					completedQuestions: Number(completedQuestions),
					inProgressQuestions: Number(inProgressQuestions),
					progressPercentage: totalQuestions > 0
						? Math.round((Number(completedQuestions) / Number(totalQuestions)) * 100)
						: 0,
				}
			})
		)

		const totalQuestions = overview.reduce((sum, cat) => sum + cat.totalQuestions, 0)
		const totalCompleted = overview.reduce((sum, cat) => sum + cat.completedQuestions, 0)

		return {
			categories: overview,
			summary: {
				totalQuestions,
				totalCompleted,
				overallPercentage: totalQuestions > 0
					? Math.round((totalCompleted / totalQuestions) * 100)
					: 0,
			},
		}
	}

	async getCategoryProgress(accountId: string, categorySlug: string) {
		// Find category
		const [category] = await this.database.db
			.select()
			.from(schema.categories)
			.where(eq(schema.categories.slug, categorySlug))
			.limit(1)

		if (!category) {
			throw new NotFoundException('Category not found')
		}

		// Get all questions for category
		const questions = await this.database.db
			.select()
			.from(schema.questions)
			.where(eq(schema.questions.categoryId, category.id))
			.orderBy(schema.questions.order)

		// Get progress for these questions
		const progressRecords = await this.database.db
			.select()
			.from(schema.userProgress)
			.where(
				and(
					eq(schema.userProgress.accountId, accountId),
					eq(schema.userProgress.categoryId, category.id)
				)
			)

		// Map progress to questions
		const progressMap = new Map(
			progressRecords.map(p => [p.questionId, p.status])
		)

		const questionsWithProgress = questions.map(question => ({
			id: question.id,
			slug: question.slug,
			titleEn: question.titleEn,
			titleUa: question.titleUa,
			difficulty: question.difficulty,
			status: progressMap.get(question.id) || 'NOT_STARTED',
		}))

		const completed = questionsWithProgress.filter(q => q.status === 'COMPLETED').length
		const inProgress = questionsWithProgress.filter(q => q.status === 'IN_PROGRESS').length

		return {
			category: {
				id: category.id,
				slug: category.slug,
				nameEn: category.nameEn,
				nameUa: category.nameUa,
				icon: category.icon,
				color: category.color,
			},
			questions: questionsWithProgress,
			summary: {
				total: questionsWithProgress.length,
				completed,
				inProgress,
				notStarted: questionsWithProgress.length - completed - inProgress,
				progressPercentage: questionsWithProgress.length > 0
					? Math.round((completed / questionsWithProgress.length) * 100)
					: 0,
			},
		}
	}

	async updateProgress(accountId: string, dto: UpdateProgressDto) {
		const [question] = await this.database.db
			.select()
			.from(schema.questions)
			.where(eq(schema.questions.id, dto.questionId))
			.limit(1)

		if (!question) {
			throw new NotFoundException('Question not found')
		}

		// Check if progress exists
		const [existing] = await this.database.db
			.select()
			.from(schema.userProgress)
			.where(
				and(
					eq(schema.userProgress.accountId, accountId),
					eq(schema.userProgress.questionId, dto.questionId)
				)
			)
			.limit(1)

		let progress: typeof schema.userProgress.$inferSelect

		if (existing) {
			[progress] = await this.database.db
				.update(schema.userProgress)
				.set({
					status: dto.status,
					updatedAt: new Date(),
				})
				.where(eq(schema.userProgress.id, existing.id))
				.returning()
		} else {
			[progress] = await this.database.db
				.insert(schema.userProgress)
				.values({
					accountId,
					questionId: dto.questionId,
					categoryId: question.categoryId,
					status: dto.status,
				})
				.returning()
		}

		return progress
	}

	async getCompleted(accountId: string, query: PaginationDto) {
		const { page, limit } = query
		const offset = (page - 1) * limit

		const [completed, [{ count }]] = await Promise.all([
			this.database.db
				.select()
				.from(schema.userProgress)
				.leftJoin(schema.questions, eq(schema.userProgress.questionId, schema.questions.id))
				.leftJoin(schema.categories, eq(schema.questions.categoryId, schema.categories.id))
				.where(
					and(
						eq(schema.userProgress.accountId, accountId),
						eq(schema.userProgress.status, 'COMPLETED')
					)
				)
				.orderBy(desc(schema.userProgress.updatedAt))
				.limit(limit)
				.offset(offset),
			
			this.database.db
				.select({ count: sql<number>`count(*)` })
				.from(schema.userProgress)
				.where(
					and(
						eq(schema.userProgress.accountId, accountId),
						eq(schema.userProgress.status, 'COMPLETED')
					)
				),
		])

		// Map results to questions
		const questions = completed
			.map(({ questions: q, categories: c }) => 
				q ? {
					...q,
					category: c ? {
						id: c.id,
						slug: c.slug,
						nameEn: c.nameEn,
						nameUa: c.nameUa,
						color: c.color,
					} : undefined,
				} : null
			)
			.filter(q => q !== null)

		return createPaginatedResult(questions, Number(count), page, limit)
	}
}
