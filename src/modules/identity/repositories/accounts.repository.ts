import { Injectable } from '@nestjs/common'
import { eq } from 'drizzle-orm'
import { DatabaseService } from '@core/database/database.service'
import * as schema from '@core/database/schema'
import { Account, NewAccount } from '@core/database/schema'
import { IAccountsRepository } from './accounts.repository.interface'

@Injectable()
export class AccountsRepository implements IAccountsRepository {
	constructor(private readonly database: DatabaseService) {}

	async findById(id: string): Promise<Account | null> {
		const [account] = await this.database.db
			.select()
			.from(schema.accounts)
			.where(eq(schema.accounts.id, id))
			.limit(1)

		return account || null
	}

	async findByEmail(email: string): Promise<Account | null> {
		const [account] = await this.database.db
			.select()
			.from(schema.accounts)
			.where(eq(schema.accounts.email, email))
			.limit(1)

		return account || null
	}

	async findByUsername(username: string): Promise<Account | null> {
		const [account] = await this.database.db
			.select()
			.from(schema.accounts)
			.where(eq(schema.accounts.username, username))
			.limit(1)

		return account || null
	}

	async findByVerifyToken(token: string): Promise<Account | null> {
		const [account] = await this.database.db
			.select()
			.from(schema.accounts)
			.where(eq(schema.accounts.verifyToken, token))
			.limit(1)

		return account || null
	}

	async create(data: NewAccount): Promise<Account> {
		const [account] = await this.database.db
			.insert(schema.accounts)
			.values(data)
			.returning()

		return account
	}

	async update(id: string, data: Partial<Account>): Promise<Account | null> {
		const [account] = await this.database.db
			.update(schema.accounts)
			.set({ ...data, updatedAt: new Date() })
			.where(eq(schema.accounts.id, id))
			.returning()

		return account || null
	}

	async delete(id: string): Promise<boolean> {
		const [deleted] = await this.database.db
			.delete(schema.accounts)
			.where(eq(schema.accounts.id, id))
			.returning()

		return !!deleted
	}
}
