import { Module } from '@nestjs/common'
import { IdentityModule } from '@modules/identity/identity.module'
import { OnboardingService } from './services/onboarding.service'
import { OnboardingController } from './controllers/onboarding.controller'

@Module({
	imports: [IdentityModule],
	providers: [OnboardingService],
	controllers: [OnboardingController],
	exports: [OnboardingService],
})
export class OnboardingModule {}
