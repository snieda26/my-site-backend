/**
 * Account Service - Drizzle Implementation
 * Manages user account operations
 */

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common'
import { DatabaseService } from '@core/database/database.service'
import { UpdateAccountDto, ChangePasswordDto } from '../dto/account.dto'
import * as argon2 from 'argon2'
import { eq } from 'drizzle-orm'
import * as schema from '@core/database/schema'

@Injectable()
export class AccountService {
	constructor(private readonly database: DatabaseService) {}

	async getProfile(accountId: string) {
		const [account] = await this.database.db
			.select({
				id: schema.accounts.id,
				email: schema.accounts.email,
				name: schema.accounts.name,
				avatarUrl: schema.accounts.avatarUrl,
				emailVerified: schema.accounts.emailVerified,
				role: schema.accounts.role,
				createdAt: schema.accounts.createdAt,
			})
			.from(schema.accounts)
			.where(eq(schema.accounts.id, accountId))
			.limit(1)

		if (!account) {
			throw new NotFoundException('Account not found')
		}

		return account
	}

	async updateProfile(accountId: string, dto: UpdateAccountDto) {
		const [account] = await this.database.db
			.update(schema.accounts)
			.set({
				...dto,
				updatedAt: new Date(),
			})
			.where(eq(schema.accounts.id, accountId))
			.returning({
				id: schema.accounts.id,
				email: schema.accounts.email,
				name: schema.accounts.name,
				avatarUrl: schema.accounts.avatarUrl,
				emailVerified: schema.accounts.emailVerified,
				role: schema.accounts.role,
			})

		if (!account) {
			throw new NotFoundException('Account not found')
		}

		return account
	}

	async changePassword(accountId: string, dto: ChangePasswordDto) {
		const [account] = await this.database.db
			.select()
			.from(schema.accounts)
			.where(eq(schema.accounts.id, accountId))
			.limit(1)

		if (!account) {
			throw new NotFoundException('Account not found')
		}

		const isPasswordValid = await argon2.verify(account.password, dto.currentPassword)

		if (!isPasswordValid) {
			throw new BadRequestException('Current password is incorrect')
		}

		const hashedPassword = await argon2.hash(dto.newPassword)

		await this.database.db
			.update(schema.accounts)
			.set({ 
				password: hashedPassword,
				updatedAt: new Date(),
			})
			.where(eq(schema.accounts.id, accountId))

		return { message: 'Password changed successfully' }
	}
}
