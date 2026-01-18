// ============================================================================
// TEMPORARY: Onboarding service is disabled but kept for potential future use
// TODO: Re-enable when onboarding feature is ready
// ============================================================================

import { Injectable, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { UpdateOnboardingDto, OnboardingOptionsResponseDto } from '../dto/onboarding.dto'

@Injectable()
export class OnboardingService {
	constructor(private readonly db: DatabaseService) {}

	async getOnboardingProfile(accountId: string) {
		// First check if account exists
		const account = await this.db.account.findUnique({
			where: { id: accountId },
			include: { profile: true },
		})

		if (!account) {
			throw new NotFoundException('Account not found')
		}

		// If profile doesn't exist, create one
		if (!account.profile) {
			const profile = await this.db.userProfile.create({
				data: {
					accountId,
				},
			})

			return {
				...profile,
				onboardingCompleted: account.onboardingCompleted,
			}
		}

		return {
			...account.profile,
			onboardingCompleted: account.onboardingCompleted,
		}
	}

	async updateOnboardingProfile(accountId: string, dto: UpdateOnboardingDto) {
		// First check if profile exists
		let profile = await this.db.userProfile.findUnique({
			where: { accountId },
		})

		// Create profile if it doesn't exist
		if (!profile) {
			profile = await this.db.userProfile.create({
				data: {
					accountId,
				},
			})
		}

		// Update profile
		const updatedProfile = await this.db.userProfile.update({
			where: { accountId },
			data: {
				experienceLevel: dto.experienceLevel,
				targetPosition: dto.targetPosition,
				yearsOfExperience: dto.yearsOfExperience,
				learningGoal: dto.learningGoal,
				weeklyHours: dto.weeklyHours,
				technologies: dto.technologies,
				focusAreas: dto.focusAreas,
				preferredLanguage: dto.preferredLanguage,
			},
		})

		// Update onboarding status on account if provided
		if (dto.onboardingCompleted !== undefined) {
			await this.db.account.update({
				where: { id: accountId },
				data: {
					onboardingCompleted: dto.onboardingCompleted,
				},
			})
		}

		const account = await this.db.account.findUnique({
			where: { id: accountId },
		})

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
