import { Injectable, UnauthorizedException, Inject } from '@nestjs/common'
import { TokenService } from './token.service'
import { LoginDto } from '../dto/auth.dto'
import { ACCOUNTS_REPOSITORY, IAccountsRepository } from '../repositories'
import * as argon2 from 'argon2'

@Injectable()
export class AuthenticationService {
	constructor(
		@Inject(ACCOUNTS_REPOSITORY)
		private readonly accountsRepository: IAccountsRepository,
		private readonly tokenService: TokenService
	) {}

	async login(dto: LoginDto) {
		const account = await this.accountsRepository.findByEmail(dto.email)

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
				username: account.username,
				avatarUrl: account.avatarUrl,
				emailVerified: account.emailVerified,
			},
			...tokens,
		}
	}

	async refreshToken(refreshToken: string) {
		try {
			const payload = await this.tokenService.verifyRefreshToken(refreshToken)
			const account = await this.accountsRepository.findById(payload.accountId)

			if (!account) {
				throw new UnauthorizedException('Account not found')
			}

			return this.tokenService.generateTokenPair({
				accountId: account.id,
				email: account.email,
			})
		} catch {
			throw new UnauthorizedException('Invalid refresh token')
		}
	}

	async logout(): Promise<void> {
		// Token invalidation can be implemented with a blacklist if needed
	}
}
