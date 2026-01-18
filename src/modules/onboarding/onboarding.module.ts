// ============================================================================
// TEMPORARY: Onboarding module is disabled - routes are commented out
// TODO: Re-enable when onboarding feature is ready
// ============================================================================

import { Module } from '@nestjs/common'
import { IdentityModule } from '@modules/identity/identity.module'
import { OnboardingService } from './services/onboarding.service'
// TEMPORARILY COMMENTED OUT - Controller disabled
// import { OnboardingController } from './controllers/onboarding.controller'

@Module({
	imports: [IdentityModule],
	providers: [OnboardingService],
	// TEMPORARILY COMMENTED OUT - Controller routes disabled
	// controllers: [OnboardingController],
	controllers: [],
	exports: [OnboardingService],
})
export class OnboardingModule {}
