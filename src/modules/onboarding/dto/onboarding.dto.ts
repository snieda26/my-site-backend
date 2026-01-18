// ============================================================================
// TEMPORARY: Onboarding DTOs are kept for type safety but functionality is disabled
// TODO: Re-enable when onboarding feature is ready
// ============================================================================

import { ApiProperty } from '@nestjs/swagger'
import { IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { ExperienceLevel, TargetPosition, LearningGoal } from '@prisma/client'

export class UpdateOnboardingDto {
	@ApiProperty({
		example: 'JUNIOR',
		enum: ExperienceLevel,
		description: 'Experience level',
		required: false,
	})
	@IsOptional()
	@IsEnum(ExperienceLevel)
	experienceLevel?: ExperienceLevel

	@ApiProperty({
		example: 'MIDDLE',
		enum: TargetPosition,
		description: 'Target position',
		required: false,
	})
	@IsOptional()
	@IsEnum(TargetPosition)
	targetPosition?: TargetPosition

	@ApiProperty({
		example: 2,
		description: 'Years of experience',
		required: false,
	})
	@IsOptional()
	@IsInt()
	@Min(0)
	@Max(50)
	yearsOfExperience?: number

	@ApiProperty({
		example: 'JOB_INTERVIEW',
		enum: LearningGoal,
		description: 'Primary learning goal',
		required: false,
	})
	@IsOptional()
	@IsEnum(LearningGoal)
	learningGoal?: LearningGoal

	@ApiProperty({
		example: 10,
		description: 'Weekly hours available for learning',
		required: false,
	})
	@IsOptional()
	@IsInt()
	@Min(1)
	@Max(80)
	weeklyHours?: number

	@ApiProperty({
		example: ['react', 'typescript', 'javascript'],
		description: 'Selected technologies to learn',
		required: false,
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	technologies?: string[]

	@ApiProperty({
		example: ['algorithms', 'system_design'],
		description: 'Focus areas for learning',
		required: false,
	})
	@IsOptional()
	@IsArray()
	@IsString({ each: true })
	focusAreas?: string[]

	@ApiProperty({
		example: 'en',
		description: 'Preferred language',
		required: false,
	})
	@IsOptional()
	@IsString()
	preferredLanguage?: string

	@ApiProperty({
		example: true,
		description: 'Whether onboarding is completed',
		required: false,
	})
	@IsOptional()
	@IsBoolean()
	onboardingCompleted?: boolean
}

export class OnboardingProfileResponseDto {
	@ApiProperty({ example: 'clx01z01z0000qwerty12345' })
	id: string

	@ApiProperty({ example: 'clx01z01z0000qwerty12345' })
	accountId: string

	@ApiProperty({ example: 'JUNIOR', enum: ExperienceLevel })
	experienceLevel: ExperienceLevel

	@ApiProperty({ example: 'MIDDLE', enum: TargetPosition })
	targetPosition: TargetPosition

	@ApiProperty({ example: 2 })
	yearsOfExperience: number | null

	@ApiProperty({ example: 'JOB_INTERVIEW', enum: LearningGoal })
	learningGoal: LearningGoal

	@ApiProperty({ example: 10 })
	weeklyHours: number | null

	@ApiProperty({ example: ['react', 'typescript'] })
	technologies: string[]

	@ApiProperty({ example: ['algorithms'] })
	focusAreas: string[]

	@ApiProperty({ example: 'en' })
	preferredLanguage: string | null

	@ApiProperty({ example: true })
	onboardingCompleted: boolean
}

export class OnboardingOptionsResponseDto {
	@ApiProperty({
		example: [
			{ id: 'react', name: 'React', category: 'frontend' },
			{ id: 'typescript', name: 'TypeScript', category: 'frontend' },
		],
	})
	technologies: Array<{
		id: string
		name: string
		category: string
		description?: string
	}>

	@ApiProperty({
		example: [
			{ id: 'algorithms', name: 'Algorithms & Data Structures', description: 'Master coding challenges' },
		],
	})
	focusAreas: Array<{
		id: string
		name: string
		description?: string
	}>
}
