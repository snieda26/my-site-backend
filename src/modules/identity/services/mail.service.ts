import { Injectable, Logger } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MailService {
	private readonly logger = new Logger(MailService.name)

	constructor(private readonly config: ConfigService) {}

	async sendVerificationEmail(email: string, token: string): Promise<void> {
		const frontendUrl = this.config.get('FRONTEND_URL') || 'http://localhost:3002'
		const verificationUrl = `${frontendUrl}/auth/verify?token=${token}`

		// In development, just log the verification URL
		if (this.config.get('NODE_ENV') !== 'production') {
			this.logger.log(`Verification email for ${email}: ${verificationUrl}`)
			return
		}

		// TODO: Implement actual email sending with Mailgun or other provider
		// For now, just log in production too
		this.logger.log(`Would send verification email to ${email}`)
	}

	async sendPasswordResetEmail(email: string, token: string): Promise<void> {
		const frontendUrl = this.config.get('FRONTEND_URL') || 'http://localhost:3002'
		const resetUrl = `${frontendUrl}/auth/reset-password?token=${token}`

		if (this.config.get('NODE_ENV') !== 'production') {
			this.logger.log(`Password reset email for ${email}: ${resetUrl}`)
			return
		}

		this.logger.log(`Would send password reset email to ${email}`)
	}
}
