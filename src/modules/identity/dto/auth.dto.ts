import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import { ApiProperty } from '@nestjs/swagger'

const registerSchema = z
	.object({
		email: z.string().email('Invalid email address'),
		password: z
			.string()
			.min(8, 'Password must be at least 8 characters')
			.max(100, 'Password must not exceed 100 characters'),
		confirmPassword: z.string(),
		name: z.string().min(1, 'Name is required').max(100).optional(),
		recaptchaToken: z.string().min(1, 'reCAPTCHA verification required').optional(),
	})
	.refine(data => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword'],
	})

export class RegisterDto extends createZodDto(registerSchema) {
	@ApiProperty({ example: 'user@example.com', description: 'User email address' })
	email: string

	@ApiProperty({ example: 'SecurePass123!', description: 'User password (min 8 characters)' })
	password: string

	@ApiProperty({ example: 'SecurePass123!', description: 'Password confirmation' })
	confirmPassword: string

	@ApiProperty({ example: 'John Doe', description: 'User display name', required: false })
	name?: string

	@ApiProperty({ example: 'recaptcha_token_here', description: 'reCAPTCHA verification token', required: false })
	recaptchaToken?: string
}

const loginSchema = z.object({
	email: z.string().email('Invalid email address'),
	password: z.string().min(1, 'Password is required'),
	recaptchaToken: z.string().min(1, 'reCAPTCHA verification required').optional(),
})

export class LoginDto extends createZodDto(loginSchema) {
	@ApiProperty({ example: 'user@example.com', description: 'User email address' })
	email: string

	@ApiProperty({ example: 'SecurePass123!', description: 'User password' })
	password: string

	@ApiProperty({ example: 'recaptcha_token_here', description: 'reCAPTCHA verification token', required: false })
	recaptchaToken?: string
}

const refreshTokenSchema = z.object({
	refreshToken: z.string().min(1, 'Refresh token is required'),
})

export class RefreshTokenDto extends createZodDto(refreshTokenSchema) {
	@ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Refresh token' })
	refreshToken: string
}
