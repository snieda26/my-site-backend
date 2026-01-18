import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'

interface TokenPayload {
	accountId: string
	email: string
}

@Injectable()
export class TokenService {
	constructor(
		private readonly jwt: JwtService,
		private readonly config: ConfigService
	) {}

	async generateTokenPair(payload: TokenPayload) {
		const [accessToken, refreshToken] = await Promise.all([
			this.generateAccessToken(payload),
			this.generateRefreshToken(payload),
		])

		return { accessToken, refreshToken }
	}

	async generateAccessToken(payload: TokenPayload): Promise<string> {
		return this.jwt.signAsync(payload, {
			secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
			expiresIn: '15m',
		})
	}

	async generateRefreshToken(payload: TokenPayload): Promise<string> {
		return this.jwt.signAsync(payload, {
			secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
			expiresIn: '7d',
		})
	}

	async verifyAccessToken(token: string): Promise<TokenPayload> {
		return this.jwt.verifyAsync(token, {
			secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
		})
	}

	async verifyRefreshToken(token: string): Promise<TokenPayload> {
		return this.jwt.verifyAsync(token, {
			secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
		})
	}
}
