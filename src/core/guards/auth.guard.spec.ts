import { Test, TestingModule } from '@nestjs/testing'
import { ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { AuthGuard } from './auth.guard'

describe('AuthGuard', () => {
	let guard: AuthGuard
	let mockJwtService: jest.Mocked<JwtService>
	let mockConfigService: jest.Mocked<ConfigService>

	const createMockExecutionContext = (
		headers: Record<string, string> = {},
		cookies: Record<string, string> = {}
	): ExecutionContext => {
		const mockRequest = {
			headers,
			cookies,
		}

		return {
			switchToHttp: () => ({
				getRequest: () => mockRequest,
			}),
		} as unknown as ExecutionContext
	}

	beforeEach(async () => {
		mockJwtService = {
			verifyAsync: jest.fn(),
		} as unknown as jest.Mocked<JwtService>

		mockConfigService = {
			getOrThrow: jest.fn().mockReturnValue('test-secret'),
		} as unknown as jest.Mocked<ConfigService>

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthGuard,
				{
					provide: JwtService,
					useValue: mockJwtService,
				},
				{
					provide: ConfigService,
					useValue: mockConfigService,
				},
			],
		}).compile()

		guard = module.get<AuthGuard>(AuthGuard)
	})

	it('should throw UnauthorizedException when no token provided', async () => {
		const context = createMockExecutionContext()

		await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException)
	})

	it('should extract token from Authorization header', async () => {
		mockJwtService.verifyAsync.mockResolvedValue({
			accountId: 'test-id',
			email: 'test@example.com',
		})
		const context = createMockExecutionContext({
			authorization: 'Bearer valid-token',
		})

		const result = await guard.canActivate(context)

		expect(result).toBe(true)
		expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('valid-token', {
			secret: 'test-secret',
		})
	})

	it('should extract token from cookie', async () => {
		mockJwtService.verifyAsync.mockResolvedValue({
			accountId: 'test-id',
			email: 'test@example.com',
		})
		const context = createMockExecutionContext({}, { accessToken: 'cookie-token' })

		const result = await guard.canActivate(context)

		expect(result).toBe(true)
		expect(mockJwtService.verifyAsync).toHaveBeenCalledWith('cookie-token', {
			secret: 'test-secret',
		})
	})

	it('should throw UnauthorizedException for invalid token', async () => {
		mockJwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'))
		const context = createMockExecutionContext({
			authorization: 'Bearer invalid-token',
		})

		await expect(guard.canActivate(context)).rejects.toThrow(UnauthorizedException)
	})

	it('should attach account payload to request', async () => {
		const payload = {
			accountId: 'test-id',
			email: 'test@example.com',
		}
		mockJwtService.verifyAsync.mockResolvedValue(payload)
		
		const mockRequest: Record<string, unknown> = {
			headers: { authorization: 'Bearer valid-token' },
			cookies: {},
		}
		
		const context = {
			switchToHttp: () => ({
				getRequest: () => mockRequest,
			}),
		} as unknown as ExecutionContext

		await guard.canActivate(context)

		expect(mockRequest.account).toEqual(payload)
	})
})
