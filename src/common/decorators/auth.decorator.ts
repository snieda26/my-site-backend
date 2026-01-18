import { applyDecorators, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger'
import { AuthGuard } from '@core/guards/auth.guard'

export function Auth() {
	return applyDecorators(
		UseGuards(AuthGuard),
		ApiBearerAuth('JWT-auth'),
		ApiUnauthorizedResponse({ description: 'Unauthorized - Invalid or missing token' })
	)
}
