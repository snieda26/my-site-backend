import { JwtPayload } from '@core/guards/auth.guard'

declare global {
	namespace Express {
		interface Request {
			account?: JwtPayload
		}
	}
}

export {}
