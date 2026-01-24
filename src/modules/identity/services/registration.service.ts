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

	async register(dto: RegisterDto) {
		const existingAccount = await this.accountsRepository.findByEmail(dto.email)

		if (existingAccount) {
			throw new ConflictException('Email already registered')
		}

		const hashedPassword = await argon2.hash(dto.password)

		const account = await this.accountsRepository.create({
			email: dto.email,
			password: hashedPassword,
			name: dto.name,
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
				avatarUrl: account.avatarUrl,
				emailVerified: account.emailVerified,
			},
			...tokens,
		}
	}
}
