import { Injectable, ConflictException, Inject } from '@nestjs/common'
import { TokenService } from './token.service'
import { MailService } from './mail.service'
import { RegisterDto } from '../dto/auth.dto'
import { ACCOUNTS_REPOSITORY, IAccountsRepository } from '../repositories'
import * as argon2 from 'argon2'

@Injectable()
export class RegistrationService {
	constructor(
		@Inject(ACCOUNTS_REPOSITORY)
		private readonly accountsRepository: IAccountsRepository,
		private readonly tokenService: TokenService,
		private readonly mailService: MailService
	) {}

	/**
	 * Generates a unique username from the user's name
	 * Format: firstname_lastname_randomdigits (e.g., john_doe_1234)
	 */
	private async generateUniqueUsername(name?: string): Promise<string> {
		let baseUsername = 'user'

		if (name) {
			// Convert name to lowercase, remove special characters, and replace spaces with underscores
			baseUsername = name
				.toLowerCase()
				.replace(/[^a-z0-9\s]/g, '')
				.replace(/\s+/g, '_')
				.trim()
		}

		// Limit base username to 30 characters to leave room for suffix
		if (baseUsername.length > 30) {
			baseUsername = baseUsername.substring(0, 30)
		}

		// Try to find a unique username by appending random digits
		let username = baseUsername
		let attempts = 0
		const maxAttempts = 10

		while (attempts < maxAttempts) {
			const existingUser = await this.accountsRepository.findByUsername(username)

			if (!existingUser) {
				return username
			}

			// Generate a random 4-digit suffix
			const suffix = Math.floor(1000 + Math.random() * 9000)
			username = `${baseUsername}_${suffix}`
			attempts++
		}

		// If we still haven't found a unique username after max attempts, use timestamp
		const timestamp = Date.now().toString().slice(-6)
		return `${baseUsername}_${timestamp}`
	}

	async register(dto: RegisterDto) {
		const existingAccount = await this.accountsRepository.findByEmail(dto.email)

		if (existingAccount) {
			throw new ConflictException('Email already registered')
		}

		const hashedPassword = await argon2.hash(dto.password)

		// Generate a unique username
		const username = await this.generateUniqueUsername(dto.name)

		const account = await this.accountsRepository.create({
			email: dto.email,
			password: hashedPassword,
			name: dto.name,
			username,
		})

		this.mailService.sendVerificationEmail(account.email, account.verifyToken!).catch(() => {})

		const tokens = await this.tokenService.generateTokenPair({
			accountId: account.id,
			email: account.email,
		})

		return {
			account: {
				id: account.id,
				email: account.email,
				name: account.name,
				username: account.username,
				avatarUrl: account.avatarUrl,
				emailVerified: account.emailVerified,
			},
			...tokens,
		}
	}
}
