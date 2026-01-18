// ============================================================================
// TEMPORARY: Onboarding service is disabled but kept for potential future use
// TODO: Re-enable when onboarding feature is ready
// ============================================================================

/**
 * Onboarding Service - Drizzle Implementation
 * Manages user onboarding profile
 */

import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { UpdateOnboardingDto, OnboardingOptionsResponseDto } from '../dto/onboarding.dto'
import { eq } from 'drizzle-orm'
import * as schema from '@core/database/schema'

@Injectable()
export class OnboardingService {
	constructor(private readonly database: DatabaseService) {}

	async getOnboardingProfile(accountId: string) {
		// Check if account exists
		const [account] = await this.database.db
			.select()
			.from(schema.accounts)
			.where(eq(schema.accounts.id, accountId))
			.limit(1)

		if (!account) {
			throw new NotFoundException('Account not found')
		}

		// Get profile
		const [profile] = await this.database.db
			.select()
			.from(schema.userProfiles)
			.where(eq(schema.userProfiles.accountId, accountId))
			.limit(1)

		// If profile doesn't exist, create one
		if (!profile) {
			const [newProfile] = await this.database.db
				.insert(schema.userProfiles)
				.values({ accountId })
				.returning()

			return {
				...newProfile,
				onboardingCompleted: account.onboardingCompleted,
			}
		}

		return {
			...profile,
			onboardingCompleted: account.onboardingCompleted,
		}
	}

	async updateOnboardingProfile(accountId: string, dto: UpdateOnboardingDto) {
		// Check if profile exists
		const [profile] = await this.database.db
			.select()
			.from(schema.userProfiles)
			.where(eq(schema.userProfiles.accountId, accountId))
			.limit(1)

		let updatedProfile: typeof schema.userProfiles.$inferSelect

		if (!profile) {
			// Create profile
			[updatedProfile] = await this.database.db
				.insert(schema.userProfiles)
				.values({
					accountId,
					experienceLevel: dto.experienceLevel,
					targetPosition: dto.targetPosition,
					yearsOfExperience: dto.yearsOfExperience,
					learningGoal: dto.learningGoal,
					weeklyHours: dto.weeklyHours,
					technologies: dto.technologies,
					focusAreas: dto.focusAreas,
					preferredLanguage: dto.preferredLanguage,
				})
				.returning()
		} else {
			// Update profile
			[updatedProfile] = await this.database.db
				.update(schema.userProfiles)
				.set({
					experienceLevel: dto.experienceLevel,
					targetPosition: dto.targetPosition,
					yearsOfExperience: dto.yearsOfExperience,
					learningGoal: dto.learningGoal,
					weeklyHours: dto.weeklyHours,
					technologies: dto.technologies,
					focusAreas: dto.focusAreas,
					preferredLanguage: dto.preferredLanguage,
					updatedAt: new Date(),
				})
				.where(eq(schema.userProfiles.accountId, accountId))
				.returning()
		}

		// Update onboarding status if provided
		if (dto.onboardingCompleted !== undefined) {
			await this.database.db
				.update(schema.accounts)
				.set({
					onboardingCompleted: dto.onboardingCompleted,
					updatedAt: new Date(),
				})
				.where(eq(schema.accounts.id, accountId))
		}

		const [account] = await this.database.db
			.select()
			.from(schema.accounts)
			.where(eq(schema.accounts.id, accountId))
			.limit(1)

		return {
			...updatedProfile,
			onboardingCompleted: account?.onboardingCompleted ?? false,
		}
	}

	getOnboardingOptions(): OnboardingOptionsResponseDto {
		// Return static options (could be moved to database later)
		return {
			technologies: [
				{ id: 'html_css', name: 'HTML & CSS', category: 'frontend' },
				{ id: 'javascript', name: 'JavaScript', category: 'frontend' },
				{ id: 'typescript', name: 'TypeScript', category: 'frontend' },
				{ id: 'react', name: 'React', category: 'frontend' },
				{ id: 'vue', name: 'Vue.js', category: 'frontend' },
				{ id: 'angular', name: 'Angular', category: 'frontend' },
				{ id: 'nextjs', name: 'Next.js', category: 'frontend' },
				{ id: 'nodejs', name: 'Node.js', category: 'backend' },
				{ id: 'python', name: 'Python', category: 'backend' },
				{ id: 'java', name: 'Java', category: 'backend' },
				{ id: 'go', name: 'Go', category: 'backend' },
				{ id: 'rust', name: 'Rust', category: 'backend' },
				{ id: 'sql', name: 'SQL', category: 'database' },
				{ id: 'mongodb', name: 'MongoDB', category: 'database' },
				{ id: 'graphql', name: 'GraphQL', category: 'api' },
				{ id: 'docker', name: 'Docker', category: 'devops' },
				{ id: 'kubernetes', name: 'Kubernetes', category: 'devops' },
				{ id: 'aws', name: 'AWS', category: 'cloud' },
				{ id: 'git', name: 'Git', category: 'tools' },
			],
			focusAreas: [
				{
					id: 'algorithms',
					name: 'Algorithms & Data Structures',
					description: 'Master coding challenges and optimize solutions',
				},
				{
					id: 'system_design',
					name: 'System Design',
					description: 'Design scalable and reliable systems',
				},
				{
					id: 'coding_challenges',
					name: 'Coding Challenges',
					description: 'Practice problem-solving with real interview questions',
				},
				{
					id: 'theoretical_knowledge',
					name: 'Theoretical Knowledge',
					description: 'Deep dive into CS fundamentals',
				},
				{
					id: 'practical_projects',
					name: 'Practical Projects',
					description: 'Build real-world applications',
				},
				{
					id: 'soft_skills',
					name: 'Soft Skills',
					description: 'Improve communication and teamwork',
				},
			],
		}
	}
}
