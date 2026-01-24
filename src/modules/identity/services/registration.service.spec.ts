jest.mock('@paralleldrive/cuid2', () => ({
	createId: jest.fn(() => 'mock-cuid'),
}))

import { Test, TestingModule } from '@nestjs/testing'
import { ConflictException } from '@nestjs/common'
import { RegistrationService } from './registration.service'
import { TokenService } from './token.service'
import { MailService } from './mail.service'
import { ACCOUNTS_REPOSITORY, IAccountsRepository } from '../repositories'

describe('RegistrationService', () => {
	let service: RegistrationService
	let mockAccountsRepository: jest.Mocked<IAccountsRepository>
	let mockTokenService: jest.Mocked<TokenService>
	let mockMailService: jest.Mocked<MailService>

	const mockAccount = {
		id: 'test-id',
		email: 'test@example.com',
		password: 'hashed-password',
		name: 'Test User',
		username: null,
		avatarUrl: null,
		emailVerified: false,
		verifyToken: 'verify-token',
		role: 'USER' as const,
		createdAt: new Date(),
		updatedAt: new Date(),
	}

	const validRegisterDto = {
		email: 'test@example.com',
		password: 'password123',
		confirmPassword: 'password123',
		name: 'Test User',
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

		mockMailService = {
			sendVerificationEmail: jest.fn(),
			sendPasswordResetEmail: jest.fn(),
		} as unknown as jest.Mocked<MailService>

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RegistrationService,
				{
					provide: ACCOUNTS_REPOSITORY,
					useValue: mockAccountsRepository,
				},
				{
					provide: TokenService,
					useValue: mockTokenService,
				},
				{
					provide: MailService,
					useValue: mockMailService,
				},
			],
		}).compile()

		service = module.get<RegistrationService>(RegistrationService)
	})

	describe('register', () => {
		it('should throw ConflictException if email already exists', async () => {
			mockAccountsRepository.findByEmail.mockResolvedValue(mockAccount)

			await expect(service.register(validRegisterDto)).rejects.toThrow(ConflictException)
		})

		it('should create account and return tokens for new email', async () => {
			mockAccountsRepository.findByEmail.mockResolvedValue(null)
			mockAccountsRepository.create.mockResolvedValue(mockAccount)
			mockTokenService.generateTokenPair.mockResolvedValue({
				accessToken: 'access-token',
				refreshToken: 'refresh-token',
			})
			mockMailService.sendVerificationEmail.mockResolvedValue()

			const result = await service.register(validRegisterDto)

			expect(result.account.email).toBe('test@example.com')
			expect(result.accessToken).toBe('access-token')
			expect(result.refreshToken).toBe('refresh-token')
			expect(mockAccountsRepository.create).toHaveBeenCalled()
		})

		it('should send verification email after registration', async () => {
			mockAccountsRepository.findByEmail.mockResolvedValue(null)
			mockAccountsRepository.create.mockResolvedValue(mockAccount)
			mockTokenService.generateTokenPair.mockResolvedValue({
				accessToken: 'access-token',
				refreshToken: 'refresh-token',
			})
			mockMailService.sendVerificationEmail.mockResolvedValue()

			await service.register(validRegisterDto)

			expect(mockMailService.sendVerificationEmail).toHaveBeenCalledWith(
				'test@example.com',
				'verify-token'
			)
		})
	})
})
