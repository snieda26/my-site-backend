import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ServeStaticModule } from '@nestjs/serve-static'
import { GoogleRecaptchaModule } from '@nestlab/google-recaptcha'
import { join } from 'path'

import { DatabaseModule } from '@core/database/database.module'
import { HealthModule } from '@core/health'
import { LoggingModule } from '@core/logging'
import { recaptchaConfig } from '@core/config/recaptcha.config'

import { IdentityModule } from '@modules/identity/identity.module'
import { QuestionsModule } from '@modules/questions/questions.module'
import { ProblemsModule } from '@modules/problems/problems.module'
import { ProgressModule } from '@modules/progress/progress.module'

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: '.env',
		}),
		ServeStaticModule.forRoot({
			rootPath: join(process.cwd(), 'storage'),
			serveRoot: '/storage',
		}),
		GoogleRecaptchaModule.forRootAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: recaptchaConfig,
		}),
		DatabaseModule,
		LoggingModule,
		HealthModule,
		IdentityModule,
		QuestionsModule,
		ProblemsModule,
		ProgressModule,
	],
})
export class AppModule {}
