import { Module } from '@nestjs/common'
import { IdentityModule } from '@modules/identity/identity.module'

import { CategoriesController } from './controllers/categories.controller'
import { QuestionsController } from './controllers/questions.controller'

import { CategoriesService } from './services/categories.service'
import { QuestionsService } from './services/questions.service'

@Module({
	imports: [IdentityModule],
	controllers: [CategoriesController, QuestionsController],
	providers: [CategoriesService, QuestionsService],
	exports: [QuestionsService, CategoriesService],
})
export class QuestionsModule {}
