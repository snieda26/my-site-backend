import { Account, NewAccount } from '@core/database/schema'

export interface IAccountsRepository {
	findById(id: string): Promise<Account | null>
	findByEmail(email: string): Promise<Account | null>
	findByUsername(username: string): Promise<Account | null>
	findByVerifyToken(token: string): Promise<Account | null>
	create(data: NewAccount): Promise<Account>
	update(id: string, data: Partial<Account>): Promise<Account | null>
	delete(id: string): Promise<boolean>
}

export const ACCOUNTS_REPOSITORY = Symbol('ACCOUNTS_REPOSITORY')
