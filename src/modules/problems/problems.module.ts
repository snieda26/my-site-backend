import { Module } from '@nestjs/common'
import { IdentityModule } from '@modules/identity/identity.module'

import { ProblemsController } from './controllers/problems.controller'
import { CompaniesController } from './controllers/companies.controller'

import { ProblemsService } from './services/problems.service'
import { CompaniesService } from './services/companies.service'

@Module({
	imports: [IdentityModule],
	controllers: [ProblemsController, CompaniesController],
	providers: [ProblemsService, CompaniesService],
	exports: [ProblemsService],
})
export class ProblemsModule {}
