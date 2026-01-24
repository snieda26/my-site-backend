import { Injectable, BadRequestException, NotFoundException, Inject } from '@nestjs/common'
import { UpdateAccountDto, ChangePasswordDto } from '../dto/account.dto'
import { ACCOUNTS_REPOSITORY, IAccountsRepository } from '../repositories'
import * as argon2 from 'argon2'

@Injectable()
export class AccountService {
	constructor(
		@Inject(ACCOUNTS_REPOSITORY)
		private readonly accountsRepository: IAccountsRepository
	) {}

	async getProfile(accountId: string) {
		const account = await this.accountsRepository.findById(accountId)

		if (!account) {
			throw new NotFoundException('Account not found')
		}

		return {
			id: account.id,
			email: account.email,
			name: account.name,
			username: account.username,
			avatarUrl: account.avatarUrl,
			emailVerified: account.emailVerified,
			role: account.role,
			createdAt: account.createdAt,
		}
	}

	async updateProfile(accountId: string, dto: UpdateAccountDto) {
		if (dto.username) {
			const existingUsername = await this.accountsRepository.findByUsername(dto.username)
			if (existingUsername && existingUsername.id !== accountId) {
				throw new BadRequestException('Username is already taken')
			}
		}

		const account = await this.accountsRepository.update(accountId, dto)

		if (!account) {
			throw new NotFoundException('Account not found')
		}

		return {
			id: account.id,
			email: account.email,
			name: account.name,
			username: account.username,
			avatarUrl: account.avatarUrl,
			emailVerified: account.emailVerified,
			role: account.role,
		}
	}

	async changePassword(accountId: string, dto: ChangePasswordDto) {
		const account = await this.accountsRepository.findById(accountId)

		if (!account) {
			throw new NotFoundException('Account not found')
		}

		const isPasswordValid = await argon2.verify(account.password, dto.currentPassword)

		if (!isPasswordValid) {
			throw new BadRequestException('Current password is incorrect')
		}

		const hashedPassword = await argon2.hash(dto.newPassword)

		await this.accountsRepository.update(accountId, { password: hashedPassword })

		return { message: 'Password changed successfully' }
	}
}
