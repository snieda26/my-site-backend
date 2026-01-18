import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import { ApiProperty } from '@nestjs/swagger'

const createBookmarkSchema = z.object({
	questionId: z.string().cuid().optional(),
	problemId: z.string().cuid().optional(),
}).refine(data => data.questionId || data.problemId, {
	message: 'Either questionId or problemId must be provided',
})

export class CreateBookmarkDto extends createZodDto(createBookmarkSchema) {
	@ApiProperty({ example: 'clxxx123', description: 'Question ID', required: false })
	questionId?: string

	@ApiProperty({ example: 'clxxx456', description: 'Problem ID', required: false })
	problemId?: string
}
