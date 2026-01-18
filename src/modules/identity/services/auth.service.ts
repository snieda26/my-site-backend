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

@Injectable()
export class AuthService {
	constructor(
		private readonly db: DatabaseService,
		private readonly tokenService: TokenService,
		private readonly mailService: MailService
	) {}

	async register(dto: RegisterDto) {
		const existingAccount = await this.db.account.findUnique({
			where: { email: dto.email },
		})

		if (existingAccount) {
			throw new ConflictException('Email already registered')
		}

		const hashedPassword = await argon2.hash(dto.password)

		const account = await this.db.account.create({
			data: {
				email: dto.email,
				password: hashedPassword,
				name: dto.name,
			},
		})

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
		const account = await this.db.account.findUnique({
			where: { email: dto.email },
		})

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

			const account = await this.db.account.findUnique({
				where: { id: payload.accountId },
			})

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
		const account = await this.db.account.findUnique({
			where: { verifyToken: token },
		})

		if (!account) {
			throw new BadRequestException('Invalid verification token')
		}

		if (account.emailVerified) {
			throw new BadRequestException('Email already verified')
		}

		await this.db.account.update({
			where: { id: account.id },
			data: {
				emailVerified: true,
				verifyToken: null,
			},
		})

		return { message: 'Email verified successfully' }
	}
}
