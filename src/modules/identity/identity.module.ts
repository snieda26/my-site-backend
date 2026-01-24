import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'

import { jwtConfig } from '@core/config/jwt.config'

import { AuthController } from './controllers/auth.controller'
import { AccountController } from './controllers/account.controller'

import {
	AuthService,
	RegistrationService,
	AuthenticationService,
	EmailVerificationService,
	TokenService,
	AccountService,
	MailService,
} from './services'

import { AccountsRepository, ACCOUNTS_REPOSITORY } from './repositories'

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: jwtConfig,
		}),
	],
	controllers: [AuthController, AccountController],
	providers: [
		AuthService,
		RegistrationService,
		AuthenticationService,
		EmailVerificationService,
		TokenService,
		AccountService,
		MailService,
		{
			provide: ACCOUNTS_REPOSITORY,
			useClass: AccountsRepository,
		},
	],
	exports: [JwtModule, TokenService, AccountService, AuthService, ACCOUNTS_REPOSITORY],
})
export class IdentityModule {}
