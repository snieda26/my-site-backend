import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import { ApiProperty } from '@nestjs/swagger'

const createQuestionSchema = z.object({
	slug: z.string().min(1).max(200),
	titleEn: z.string().min(1).max(500),
	titleUa: z.string().min(1).max(500),
	descriptionEn: z.string().optional(),
	descriptionUa: z.string().optional(),
	contentMarkdownEn: z.string().min(1),
	contentMarkdownUa: z.string().min(1),
	difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
	categoryId: z.string().cuid(),
	tags: z.array(z.string()).optional(),
	order: z.number().int().min(0).optional(),
	prevSlug: z.string().optional().nullable(),
	nextSlug: z.string().optional().nullable(),
})

export class CreateQuestionDto extends createZodDto(createQuestionSchema) {
	@ApiProperty({ example: 'what-is-closure', description: 'Question slug (URL-friendly)' })
	slug: string

	@ApiProperty({ example: 'What is a closure in JavaScript?', description: 'Question title (English)' })
	titleEn: string

	@ApiProperty({ example: 'Що таке замикання в JavaScript?', description: 'Question title (Ukrainian)' })
	titleUa: string

	@ApiProperty({ example: 'Learn about closures...', required: false })
	descriptionEn?: string

	@ApiProperty({ example: 'Дізнайтесь про замикання...', required: false })
	descriptionUa?: string

	@ApiProperty({ example: '## What is a closure?\n\nA closure is...', description: 'Question markdown content (English)' })
	contentMarkdownEn: string

	@ApiProperty({ example: '## Що таке замикання?\n\nЗамикання - це...', description: 'Question markdown content (Ukrainian)' })
	contentMarkdownUa: string

	@ApiProperty({ enum: ['EASY', 'MEDIUM', 'HARD'], default: 'MEDIUM' })
	difficulty: 'EASY' | 'MEDIUM' | 'HARD'

	@ApiProperty({ example: 'clxxx123', description: 'Category ID' })
	categoryId: string

	@ApiProperty({ example: ['closures', 'functions'], required: false })
	tags?: string[]

	@ApiProperty({ example: 1, description: 'Display order', required: false })
	order?: number

	@ApiProperty({ example: 'previous-question-slug', required: false })
	prevSlug?: string | null

	@ApiProperty({ example: 'next-question-slug', required: false })
	nextSlug?: string | null
}

const updateQuestionSchema = createQuestionSchema.partial()

export class UpdateQuestionDto extends createZodDto(updateQuestionSchema) {}
