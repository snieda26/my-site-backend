import {
	Injectable,
	BadRequestException,
	UnauthorizedException,
	ConflictException,
} from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { TokenService } from './token.service'
import { MailService } from './mail.service'
import { RegisterDto, LoginDto } from '../dto/auth.dto'
import * as argon2 from 'argon2'
import { eq } from 'drizzle-orm'
import * as schema from '@core/database/schema'

@Injectable()
export class AuthService {
	constructor(
		private readonly database: DatabaseService,
		private readonly tokenService: TokenService,
		private readonly mailService: MailService
	) {}

	async register(dto: RegisterDto) {
		// Перевірка існуючого акаунту
		const [existingAccount] = await this.database.db
			.select()
			.from(schema.accounts)
			.where(eq(schema.accounts.email, dto.email))
			.limit(1)

		if (existingAccount) {
			throw new ConflictException('Email already registered')
		}

		const hashedPassword = await argon2.hash(dto.password)

		// Створення акаунту
		const [account] = await this.database.db
			.insert(schema.accounts)
			.values({
				email: dto.email,
				password: hashedPassword,
				name: dto.name,
			})
			.returning()

		this.mailService.sendVerificationEmail(account.email, account.verifyToken!).catch(error => {
			console.error('Failed to send verification email:', error)
		})

		const tokens = await this.tokenService.generateTokenPair({
			accountId: account.id,
			email: account.email,
		})

		return {
			account: {
				id: account.id,
				email: account.email,
				name: account.name,
				avatarUrl: account.avatarUrl,
				emailVerified: account.emailVerified,
				onboardingCompleted: account.onboardingCompleted,
			},
			...tokens,
		}
	}

	async login(dto: LoginDto) {
		// Знаходження акаунту
		const [account] = await this.database.db
			.select()
			.from(schema.accounts)
			.where(eq(schema.accounts.email, dto.email))
			.limit(1)

		if (!account) {
			throw new UnauthorizedException('Invalid credentials')
		}

		const isPasswordValid = await argon2.verify(account.password, dto.password)

		if (!isPasswordValid) {
			throw new UnauthorizedException('Invalid credentials')
		}

		const tokens = await this.tokenService.generateTokenPair({
			accountId: account.id,
			email: account.email,
		})

		return {
			account: {
				id: account.id,
				email: account.email,
				name: account.name,
				avatarUrl: account.avatarUrl,
				emailVerified: account.emailVerified,
				onboardingCompleted: account.onboardingCompleted,
			},
			...tokens,
		}
	}

	async refreshToken(refreshToken: string) {
		try {
			const payload = await this.tokenService.verifyRefreshToken(refreshToken)

			const [account] = await this.database.db
				.select()
				.from(schema.accounts)
				.where(eq(schema.accounts.id, payload.accountId))
				.limit(1)

			if (!account) {
				throw new UnauthorizedException('Account not found')
			}

			const tokens = await this.tokenService.generateTokenPair({
				accountId: account.id,
				email: account.email,
			})

			return tokens
		} catch (error) {
			throw new UnauthorizedException('Invalid refresh token')
		}
	}

	async verifyEmail(token: string) {
		const [account] = await this.database.db
			.select()
			.from(schema.accounts)
			.where(eq(schema.accounts.verifyToken, token))
			.limit(1)

		if (!account) {
			throw new BadRequestException('Invalid verification token')
		}

		if (account.emailVerified) {
			throw new BadRequestException('Email already verified')
		}

		await this.database.db
			.update(schema.accounts)
			.set({
				emailVerified: true,
				verifyToken: null,
				updatedAt: new Date(),
			})
			.where(eq(schema.accounts.id, account.id))

		return { message: 'Email verified successfully' }
	}
}
