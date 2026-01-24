import { Module } from '@nestjs/common'
import { IdentityModule } from '@modules/identity/identity.module'

import { CategoriesController } from './controllers/categories.controller'
import { QuestionsController } from './controllers/questions.controller'

import { CategoriesService } from './services/categories.service'
import { QuestionsService } from './services/questions.service'

import {
	QuestionsRepository,
	CategoriesRepository,
	QUESTIONS_REPOSITORY,
	CATEGORIES_REPOSITORY,
} from './repositories'

@Module({
	imports: [IdentityModule],
	controllers: [CategoriesController, QuestionsController],
	providers: [
		CategoriesService,
		QuestionsService,
		{
			provide: QUESTIONS_REPOSITORY,
			useClass: QuestionsRepository,
		},
		{
			provide: CATEGORIES_REPOSITORY,
			useClass: CategoriesRepository,
		},
	],
	exports: [QuestionsService, CategoriesService, QUESTIONS_REPOSITORY, CATEGORIES_REPOSITORY],
})
export class QuestionsModule {}
