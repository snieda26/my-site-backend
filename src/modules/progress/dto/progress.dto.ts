import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import { ApiProperty } from '@nestjs/swagger'

const updateProgressSchema = z.object({
	questionId: z.string().cuid(),
	status: z.enum(['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED']),
})

export class UpdateProgressDto extends createZodDto(updateProgressSchema) {
	@ApiProperty({ example: 'clxxx123', description: 'Question ID' })
	questionId: string

	@ApiProperty({ enum: ['NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'] })
	status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
}
