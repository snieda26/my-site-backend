import { Controller, Get, Patch, Body } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger'
import { Auth } from '@common/decorators/auth.decorator'
import { CurrentAccount } from '@common/decorators/current-account.decorator'
import { AccountService } from '../services/account.service'
import { UpdateAccountDto, ChangePasswordDto } from '../dto/account.dto'

@ApiTags('Account')
@Controller('account')
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@Get('profile')
	@Auth()
	@ApiOperation({ summary: 'Get current user profile' })
	@ApiResponse({ status: 200, description: 'Profile retrieved successfully' })
	async getProfile(@CurrentAccount('accountId') accountId: string) {
		return this.accountService.getProfile(accountId)
	}

	@Patch('profile')
	@Auth()
	@ApiOperation({ summary: 'Update user profile' })
	@ApiBody({ type: UpdateAccountDto })
	@ApiResponse({ status: 200, description: 'Profile updated successfully' })
	async updateProfile(
		@CurrentAccount('accountId') accountId: string,
		@Body() dto: UpdateAccountDto
	) {
		return this.accountService.updateProfile(accountId, dto)
	}

	@Patch('password')
	@Auth()
	@ApiOperation({ summary: 'Change user password' })
	@ApiBody({ type: ChangePasswordDto })
	@ApiResponse({ status: 200, description: 'Password changed successfully' })
	@ApiResponse({ status: 400, description: 'Invalid current password' })
	async changePassword(
		@CurrentAccount('accountId') accountId: string,
		@Body() dto: ChangePasswordDto
	) {
		return this.accountService.changePassword(accountId, dto)
	}
}
