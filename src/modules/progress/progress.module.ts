import { Module } from '@nestjs/common'
import { IdentityModule } from '@modules/identity/identity.module'
import { QuestionsModule } from '@modules/questions/questions.module'
import { ProblemsModule } from '@modules/problems/problems.module'

import { ProgressController } from './controllers/progress.controller'
import { BookmarksController } from './controllers/bookmarks.controller'

import { ProgressService } from './services/progress.service'
import { BookmarksService } from './services/bookmarks.service'

import {
	ProgressRepository,
	BookmarksRepository,
	PROGRESS_REPOSITORY,
	BOOKMARKS_REPOSITORY,
} from './repositories'

@Module({
	imports: [IdentityModule, QuestionsModule, ProblemsModule],
	controllers: [ProgressController, BookmarksController],
	providers: [
		ProgressService,
		BookmarksService,
		{
			provide: PROGRESS_REPOSITORY,
			useClass: ProgressRepository,
		},
		{
			provide: BOOKMARKS_REPOSITORY,
			useClass: BookmarksRepository,
		},
	],
	exports: [ProgressService, BookmarksService],
})
export class ProgressModule {}
