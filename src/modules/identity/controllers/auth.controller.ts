import { Controller, Post, Body, Res, HttpCode, HttpStatus, Get, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiQuery, ApiCookieAuth } from '@nestjs/swagger'
import { Response } from 'express'
import { Recaptcha } from '@nestlab/google-recaptcha'
import { AuthService } from '../services/auth.service'
import { RegisterDto, LoginDto, RefreshTokenDto } from '../dto/auth.dto'

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('register')
	@ApiOperation({ summary: 'Register a new user account' })
	@ApiBody({ type: RegisterDto })
	@ApiResponse({ status: 201, description: 'User successfully registered' })
	@ApiResponse({ status: 400, description: 'Invalid input data' })
	@ApiResponse({ status: 409, description: 'Email already exists' })
	@Recaptcha({ response: req => req.body.recaptchaToken })
	async register(@Body() dto: RegisterDto, @Res({ passthrough: true }) res: Response) {
		const result = await this.authService.register(dto)

		this.setRefreshTokenCookie(res, result.refreshToken)

		return {
			account: result.account,
			accessToken: result.accessToken,
		}
	}

	@Post('login')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Login with email and password' })
	@ApiBody({ type: LoginDto })
	@ApiResponse({ status: 200, description: 'Login successful' })
	@ApiResponse({ status: 401, description: 'Invalid credentials' })
	@Recaptcha({ response: req => req.body.recaptchaToken })
	async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
		const result = await this.authService.login(dto)

		this.setRefreshTokenCookie(res, result.refreshToken)

		return {
			account: result.account,
			accessToken: result.accessToken,
		}
	}

	@Post('refresh')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Refresh access token using refresh token' })
	@ApiBody({ type: RefreshTokenDto })
	@ApiCookieAuth('refreshToken')
	@ApiResponse({ status: 200, description: 'Token refreshed successfully' })
	@ApiResponse({ status: 401, description: 'Invalid or expired refresh token' })
	async refreshToken(@Body() dto: RefreshTokenDto, @Res({ passthrough: true }) res: Response) {
		const result = await this.authService.refreshToken(dto.refreshToken)

		this.setRefreshTokenCookie(res, result.refreshToken)

		return {
			accessToken: result.accessToken,
		}
	}

	@Post('logout')
	@HttpCode(HttpStatus.OK)
	@ApiOperation({ summary: 'Logout user and clear refresh token cookie' })
	@ApiCookieAuth('refreshToken')
	@ApiResponse({ status: 200, description: 'Logged out successfully' })
	async logout(@Res({ passthrough: true }) res: Response) {
		res.clearCookie('refreshToken', {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
		})

		return { message: 'Logged out successfully' }
	}

	@Get('verify')
	@ApiOperation({ summary: 'Verify email address with token' })
	@ApiQuery({ name: 'token', description: 'Email verification token', type: String })
	@ApiResponse({ status: 200, description: 'Email verified successfully' })
	@ApiResponse({ status: 400, description: 'Invalid or expired token' })
	async verifyEmail(@Query('token') token: string) {
		return this.authService.verifyEmail(token)
	}

	private setRefreshTokenCookie(res: Response, refreshToken: string): void {
		res.cookie('refreshToken', refreshToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			sameSite: 'strict',
			maxAge: 7 * 24 * 60 * 60 * 1000,
		})
	}
}
