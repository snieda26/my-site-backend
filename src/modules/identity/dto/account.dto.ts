import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import { ApiProperty } from '@nestjs/swagger'

const updateAccountSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	avatarUrl: z.string().url().optional().nullable(),
})

export class UpdateAccountDto extends createZodDto(updateAccountSchema) {
	@ApiProperty({ example: 'John Doe', description: 'User display name', required: false })
	name?: string

	@ApiProperty({ example: 'https://example.com/avatar.png', description: 'Avatar URL', required: false })
	avatarUrl?: string | null
}

const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, 'Current password is required'),
		newPassword: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(100, 'Password must not exceed 100 characters'),
		confirmPassword: z.string(),
	})
	.refine(data => data.newPassword === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

export class ChangePasswordDto extends createZodDto(changePasswordSchema) {
	@ApiProperty({ example: 'OldPass123!', description: 'Current password' })
	currentPassword: string

	@ApiProperty({ example: 'NewPass123!', description: 'New password (min 8 characters)' })
	newPassword: string

	@ApiProperty({ example: 'NewPass123!', description: 'New password confirmation' })
	confirmPassword: string
}
