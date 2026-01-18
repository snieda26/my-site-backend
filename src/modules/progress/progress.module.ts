import { Module } from '@nestjs/common'
import { IdentityModule } from '@modules/identity/identity.module'

import { ProgressController } from './controllers/progress.controller'
import { BookmarksController } from './controllers/bookmarks.controller'

import { ProgressService } from './services/progress.service'
import { BookmarksService } from './services/bookmarks.service'

@Module({
	imports: [IdentityModule],
	controllers: [ProgressController, BookmarksController],
	providers: [ProgressService, BookmarksService],
	exports: [ProgressService, BookmarksService],
})
export class ProgressModule {}
