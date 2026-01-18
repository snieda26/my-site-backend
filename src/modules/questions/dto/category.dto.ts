import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import { ApiProperty } from '@nestjs/swagger'

const createCategorySchema = z.object({
	slug: z.string().min(1).max(100),
	nameEn: z.string().min(1).max(200),
	nameUa: z.string().min(1).max(200),
	description: z.string().max(500).optional(),
	icon: z.string().max(50).optional(),
	color: z.string().max(50).optional(),
	order: z.number().int().min(0).optional(),
})

export class CreateCategoryDto extends createZodDto(createCategorySchema) {
	@ApiProperty({ example: 'javascript', description: 'Category slug (URL-friendly)' })
	slug: string

	@ApiProperty({ example: 'JavaScript', description: 'Category name (English)' })
	nameEn: string

	@ApiProperty({ example: 'JavaScript', description: 'Category name (Ukrainian)' })
	nameUa: string

	@ApiProperty({ example: 'Core JavaScript concepts and interview questions', required: false })
	description?: string

	@ApiProperty({ example: '🟨', description: 'Category icon/emoji', required: false })
	icon?: string

	@ApiProperty({ example: '#F7DF1E', description: 'Category color', required: false })
	color?: string

	@ApiProperty({ example: 1, description: 'Display order', required: false })
	order?: number
}

const updateCategorySchema = createCategorySchema.partial()

export class UpdateCategoryDto extends createZodDto(updateCategorySchema) {}
