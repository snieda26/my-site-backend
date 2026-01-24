import { z } from 'zod'

const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
	PORT: z.string().transform(Number).default('4200'),
	DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
	JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 characters'),
	JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 characters'),
	JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
	JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),
	FRONTEND_URL: z.string().url().optional(),
	MAILGUN_API_KEY: z.string().optional(),
	MAILGUN_DOMAIN: z.string().optional(),
	RECAPTCHA_SECRET_KEY: z.string().optional(),
	DB_POOL_SIZE: z.string().transform(Number).default('10'),
	DB_IDLE_TIMEOUT: z.string().transform(Number).default('20'),
	DB_CONNECT_TIMEOUT: z.string().transform(Number).default('10'),
})

export type EnvConfig = z.infer<typeof envSchema>

export function validateEnv(): EnvConfig {
	const result = envSchema.safeParse(process.env)

	if (!result.success) {
		console.error('❌ Invalid environment variables:')
		console.error(result.error.format())
		process.exit(1)
	}

	return result.data
}
