import { Injectable, BadRequestException, Inject } from '@nestjs/common'
import { MailService } from './mail.service'
import { ACCOUNTS_REPOSITORY, IAccountsRepository } from '../repositories'

@Injectable()
export class EmailVerificationService {
	constructor(
		@Inject(ACCOUNTS_REPOSITORY)
		private readonly accountsRepository: IAccountsRepository,
		private readonly mailService: MailService
	) {}

	async verify(token: string) {
		const account = await this.accountsRepository.findByVerifyToken(token)

		if (!account) {
			throw new BadRequestException('Invalid verification token')
		}

		if (account.emailVerified) {
			throw new BadRequestException('Email already verified')
		}

		await this.accountsRepository.update(account.id, {
			emailVerified: true,
			verifyToken: null,
		})

		return { message: 'Email verified successfully' }
	}

	async resendVerification(email: string) {
		const account = await this.accountsRepository.findByEmail(email)

		if (!account) {
			throw new BadRequestException('Account not found')
		}

		if (account.emailVerified) {
			throw new BadRequestException('Email already verified')
		}

		if (account.verifyToken) {
			await this.mailService.sendVerificationEmail(account.email, account.verifyToken)
		}

		return { message: 'Verification email sent' }
	}
}
