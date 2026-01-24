import { Injectable } from '@nestjs/common'
import { RegistrationService } from './registration.service'
import { AuthenticationService } from './authentication.service'
import { EmailVerificationService } from './email-verification.service'
import { RegisterDto, LoginDto } from '../dto/auth.dto'

@Injectable()
export class AuthService {
	constructor(
		private readonly registrationService: RegistrationService,
		private readonly authenticationService: AuthenticationService,
		private readonly emailVerificationService: EmailVerificationService
	) {}

	async register(dto: RegisterDto) {
		return this.registrationService.register(dto)
	}

	async login(dto: LoginDto) {
		return this.authenticationService.login(dto)
	}

	async refreshToken(refreshToken: string) {
		return this.authenticationService.refreshToken(refreshToken)
	}

	async verifyEmail(token: string) {
		return this.emailVerificationService.verify(token)
	}

	async resendVerification(email: string) {
		return this.emailVerificationService.resendVerification(email)
	}
}
