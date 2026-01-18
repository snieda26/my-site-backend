import { ConfigService } from '@nestjs/config'
import { GoogleRecaptchaModuleOptions } from '@nestlab/google-recaptcha'

export const recaptchaConfig = (config: ConfigService): GoogleRecaptchaModuleOptions => ({
	secretKey: config.get('RECAPTCHA_SECRET_KEY') || 'test-secret-key',
	response: req => req.body?.recaptchaToken,
	skipIf: () => config.get('NODE_ENV') !== 'production',
})
