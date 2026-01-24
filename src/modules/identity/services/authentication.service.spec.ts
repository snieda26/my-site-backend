import { Test, TestingModule } from '@nestjs/testing'
import { UnauthorizedException } from '@nestjs/common'
import { AuthenticationService } from './authentication.service'
import { TokenService } from './token.service'
import { ACCOUNTS_REPOSITORY, IAccountsRepository } from '../repositories'
import * as argon2 from 'argon2'

jest.mock('@paralleldrive/cuid2', () => ({
	createId: jest.fn(() => 'mock-cuid'),
}))

describe('AuthenticationService', () => {
	let service: AuthenticationService
	let mockAccountsRepository: jest.Mocked<IAccountsRepository>
	let mockTokenService: jest.Mocked<TokenService>

	const mockAccount = {
		id: 'test-id',
		email: 'test@example.com',
		password: 'hashed-password',
		name: 'Test User',
		username: 'testuser',
		avatarUrl: null,
		emailVerified: true,
		verifyToken: null,
		role: 'USER' as const,
		createdAt: new Date(),
		updatedAt: new Date(),
	}

	beforeEach(async () => {
		mockAccountsRepository = {
			findById: jest.fn(),
			findByEmail: jest.fn(),
			findByUsername: jest.fn(),
			findByVerifyToken: jest.fn(),
			create: jest.fn(),
			update: jest.fn(),
			delete: jest.fn(),
		}

		mockTokenService = {
			generateTokenPair: jest.fn(),
			generateAccessToken: jest.fn(),
			generateRefreshToken: jest.fn(),
			verifyAccessToken: jest.fn(),
			verifyRefreshToken: jest.fn(),
		} as unknown as jest.Mocked<TokenService>

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				AuthenticationService,
				{
					provide: ACCOUNTS_REPOSITORY,
					useValue: mockAccountsRepository,
				},
				{
					provide: TokenService,
					useValue: mockTokenService,
				},
			],
		}).compile()

		service = module.get<AuthenticationService>(AuthenticationService)
	})

	describe('login', () => {
		it('should throw UnauthorizedException for invalid email', async () => {
			mockAccountsRepository.findByEmail.mockResolvedValue(null)

			await expect(
				service.login({ email: 'invalid@example.com', password: 'password' })
			).rejects.toThrow(UnauthorizedException)
		})

		it('should throw UnauthorizedException for invalid password', async () => {
			const hashedPassword = await argon2.hash('correct-password')
			mockAccountsRepository.findByEmail.mockResolvedValue({
				...mockAccount,
				password: hashedPassword,
			})

			await expect(
				service.login({ email: 'test@example.com', password: 'wrong-password' })
			).rejects.toThrow(UnauthorizedException)
		})

		it('should return account and tokens for valid credentials', async () => {
			const hashedPassword = await argon2.hash('correct-password')
			mockAccountsRepository.findByEmail.mockResolvedValue({
				...mockAccount,
				password: hashedPassword,
			})
			mockTokenService.generateTokenPair.mockResolvedValue({
				accessToken: 'access-token',
				refreshToken: 'refresh-token',
			})

			const result = await service.login({
				email: 'test@example.com',
				password: 'correct-password',
			})

			expect(result.account.email).toBe('test@example.com')
			expect(result.accessToken).toBe('access-token')
			expect(result.refreshToken).toBe('refresh-token')
		})
	})

	describe('refreshToken', () => {
		it('should throw UnauthorizedException for invalid refresh token', async () => {
			mockTokenService.verifyRefreshToken.mockRejectedValue(new Error('Invalid token'))

			await expect(service.refreshToken('invalid-token')).rejects.toThrow(UnauthorizedException)
		})

		it('should throw UnauthorizedException if account not found', async () => {
			mockTokenService.verifyRefreshToken.mockResolvedValue({
				accountId: 'non-existent',
				email: 'test@example.com',
			})
			mockAccountsRepository.findById.mockResolvedValue(null)

			await expect(service.refreshToken('valid-token')).rejects.toThrow(UnauthorizedException)
		})

		it('should return new tokens for valid refresh token', async () => {
			mockTokenService.verifyRefreshToken.mockResolvedValue({
				accountId: mockAccount.id,
				email: mockAccount.email,
			})
			mockAccountsRepository.findById.mockResolvedValue(mockAccount)
			mockTokenService.generateTokenPair.mockResolvedValue({
				accessToken: 'new-access-token',
				refreshToken: 'new-refresh-token',
			})

			const result = await service.refreshToken('valid-token')

			expect(result.accessToken).toBe('new-access-token')
			expect(result.refreshToken).toBe('new-refresh-token')
		})
	})
})
