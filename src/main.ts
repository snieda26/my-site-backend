import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as cookieParser from 'cookie-parser'
import helmet from 'helmet'
import { ZodValidationPipe } from 'nestjs-zod'
import { AppModule } from './app.module'
import { DatabaseService } from '@core/database/database.service'
import { HttpExceptionFilter } from '@common/filters/http-exception.filter'

async function bootstrap() {
	const app = await NestFactory.create<NestExpressApplication>(AppModule)

	const config = app.get(ConfigService)
	const db = app.get(DatabaseService)

	app.enableShutdownHooks()
	db.onModuleDestroy()

	app.useGlobalPipes(new ZodValidationPipe())
	app.useGlobalFilters(new HttpExceptionFilter())

	app.setGlobalPrefix('api')

	const isDev = config.get('NODE_ENV') !== 'production'
	app.use(
		helmet({
			contentSecurityPolicy: isDev ? false : undefined,
			crossOriginResourcePolicy: { policy: 'cross-origin' },
		})
	)
	app.use(cookieParser())

	// Allow all origins for now (development)
	app.enableCors({
		origin: true,
		credentials: true,
		methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
		allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
		exposedHeaders: ['Set-Cookie'],
	})

	app.disable('x-powered-by')

	// Swagger API Documentation Setup
	const swaggerConfig = new DocumentBuilder()
		.setTitle('ITLead API')
		.setDescription('Interview preparation platform backend API documentation')
		.setVersion('1.0')
		.addBearerAuth(
			{
				type: 'http',
				scheme: 'bearer',
				bearerFormat: 'JWT',
				name: 'JWT',
				description: 'Enter JWT token',
				in: 'header',
			},
			'JWT-auth'
		)
		.addCookieAuth('refreshToken', {
			type: 'apiKey',
			in: 'cookie',
			name: 'refreshToken',
		})
		.addTag('Authentication', 'User authentication and authorization')
		.addTag('Account', 'User account management')
		.addTag('Categories', 'Question categories management')
		.addTag('Questions', 'Interview questions management')
		.addTag('Problems', 'Coding problems management')
		.addTag('Progress', 'User progress tracking')
		.addTag('Bookmarks', 'User bookmarks management')
		.build()

	const document = SwaggerModule.createDocument(app, swaggerConfig)
	SwaggerModule.setup('api/docs', app, document, {
		swaggerOptions: {
			persistAuthorization: true,
			tagsSorter: 'alpha',
			operationsSorter: 'alpha',
			defaultModelsExpandDepth: -1,
		},
		customSiteTitle: 'ITLead API Documentation',
	})

	const port = config.get('PORT') || 4200
	await app.listen(port)

	console.log(`🚀 Server running on http://localhost:${port}`)
	console.log(`📚 API Documentation available at http://localhost:${port}/api/docs`)
}

bootstrap()
