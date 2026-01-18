import { Body, Controller, Get, Patch } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Auth } from '@common/decorators/auth.decorator'
import { CurrentAccount } from '@common/decorators/current-account.decorator'
import { OnboardingService } from '../services/onboarding.service'
import {
	OnboardingOptionsResponseDto,
	OnboardingProfileResponseDto,
	UpdateOnboardingDto,
} from '../dto/onboarding.dto'

@ApiTags('Onboarding')
@Controller('onboarding')
export class OnboardingController {
	constructor(private readonly onboardingService: OnboardingService) {}

	@Get('profile')
	@Auth()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Get user onboarding profile' })
	@ApiResponse({ status: 200, type: OnboardingProfileResponseDto })
	async getProfile(@CurrentAccount('accountId') accountId: string): Promise<OnboardingProfileResponseDto> {
		return this.onboardingService.getOnboardingProfile(accountId) as Promise<OnboardingProfileResponseDto>
	}

	@Patch('profile')
	@Auth()
	@ApiBearerAuth()
	@ApiOperation({ summary: 'Update user onboarding profile' })
	@ApiResponse({ status: 200, type: OnboardingProfileResponseDto })
	async updateProfile(
		@CurrentAccount('accountId') accountId: string,
		@Body() dto: UpdateOnboardingDto
	): Promise<OnboardingProfileResponseDto> {
		return this.onboardingService.updateOnboardingProfile(
			accountId,
			dto
		) as Promise<OnboardingProfileResponseDto>
	}

	@Get('options')
	@ApiOperation({ summary: 'Get available onboarding options (technologies, focus areas)' })
	@ApiResponse({ status: 200, type: OnboardingOptionsResponseDto })
	getOptions(): OnboardingOptionsResponseDto {
		return this.onboardingService.getOnboardingOptions()
	}
}
