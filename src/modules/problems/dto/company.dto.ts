import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import { ApiProperty } from '@nestjs/swagger'

const createCompanySchema = z.object({
	name: z.string().min(1).max(100),
	logo: z.string().url().optional(),
})

export class CreateCompanyDto extends createZodDto(createCompanySchema) {
	@ApiProperty({ example: 'EPAM', description: 'Company name' })
	name: string

	@ApiProperty({ example: 'https://example.com/logo.png', description: 'Company logo URL', required: false })
	logo?: string
}

const updateCompanySchema = createCompanySchema.partial()

export class UpdateCompanyDto extends createZodDto(updateCompanySchema) {}
