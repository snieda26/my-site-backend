import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { UpdateAccountDto, ChangePasswordDto } from '../dto/account.dto'
import * as argon2 from 'argon2'

@Injectable()
export class AccountService {
	constructor(private readonly db: DatabaseService) {}

	async getProfile(accountId: string) {
		const account = await this.db.account.findUnique({
			where: { id: accountId },
			select: {
				id: true,
				email: true,
				name: true,
				avatarUrl: true,
				emailVerified: true,
				role: true,
				createdAt: true,
			},
		})

		if (!account) {
			throw new NotFoundException('Account not found')
		}

		return account
	}

	async updateProfile(accountId: string, dto: UpdateAccountDto) {
		const account = await this.db.account.update({
			where: { id: accountId },
			data: dto,
			select: {
				id: true,
				email: true,
				name: true,
				avatarUrl: true,
				emailVerified: true,
				role: true,
			},
		})

		return account
	}

	async changePassword(accountId: string, dto: ChangePasswordDto) {
		const account = await this.db.account.findUnique({
			where: { id: accountId },
		})

		if (!account) {
			throw new NotFoundException('Account not found')
		}

		const isPasswordValid = await argon2.verify(account.password, dto.currentPassword)

		if (!isPasswordValid) {
			throw new BadRequestException('Current password is incorrect')
		}

		const hashedPassword = await argon2.hash(dto.newPassword)

		await this.db.account.update({
			where: { id: accountId },
			data: { password: hashedPassword },
		})

		return { message: 'Password changed successfully' }
	}
}
