import { Module } from '@nestjs/common'
import { IdentityModule } from '@modules/identity/identity.module'

import { ProblemsController } from './controllers/problems.controller'
import { CompaniesController } from './controllers/companies.controller'

import { ProblemsService } from './services/problems.service'
import { CompaniesService } from './services/companies.service'
import { CodeExecutorService } from './services/code-executor.service'

import {
	ProblemsRepository,
	SolvedProblemsRepository,
	CompaniesRepository,
	PROBLEMS_REPOSITORY,
	SOLVED_PROBLEMS_REPOSITORY,
	COMPANIES_REPOSITORY,
} from './repositories'

@Module({
	imports: [IdentityModule],
	controllers: [ProblemsController, CompaniesController],
	providers: [
		ProblemsService,
		CompaniesService,
		CodeExecutorService,
		{
			provide: PROBLEMS_REPOSITORY,
			useClass: ProblemsRepository,
		},
		{
			provide: SOLVED_PROBLEMS_REPOSITORY,
			useClass: SolvedProblemsRepository,
		},
		{
			provide: COMPANIES_REPOSITORY,
			useClass: CompaniesRepository,
		},
	],
	exports: [ProblemsService, PROBLEMS_REPOSITORY],
})
export class ProblemsModule {}
