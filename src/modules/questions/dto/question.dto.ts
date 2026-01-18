import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import { ApiProperty } from '@nestjs/swagger'

const createQuestionSchema = z.object({
	slug: z.string().min(1).max(200),
	title: z.string().min(1).max(500),
	content: z.string().min(1),
	answer: z.string().min(1),
	difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
	categoryId: z.string().cuid(),
	tags: z.array(z.string()).optional(),
	order: z.number().int().min(0).optional(),
})

export class CreateQuestionDto extends createZodDto(createQuestionSchema) {
	@ApiProperty({ example: 'what-is-closure', description: 'Question slug (URL-friendly)' })
	slug: string

	@ApiProperty({ example: 'What is a closure in JavaScript?', description: 'Question title' })
	title: string

	@ApiProperty({ example: 'Explain what a closure is...', description: 'Question content (markdown)' })
	content: string

	@ApiProperty({ example: 'A closure is a function...', description: 'Question answer (markdown)' })
	answer: string

	@ApiProperty({ enum: ['EASY', 'MEDIUM', 'HARD'], default: 'MEDIUM' })
	difficulty: 'EASY' | 'MEDIUM' | 'HARD'

	@ApiProperty({ example: 'clxxx123', description: 'Category ID' })
	categoryId: string

	@ApiProperty({ example: ['closures', 'functions'], required: false })
	tags?: string[]

	@ApiProperty({ example: 1, description: 'Display order', required: false })
	order?: number
}

const updateQuestionSchema = createQuestionSchema.partial()

export class UpdateQuestionDto extends createZodDto(updateQuestionSchema) {}
