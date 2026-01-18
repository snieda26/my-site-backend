import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import { ApiProperty } from '@nestjs/swagger'

const createProblemSchema = z.object({
	slug: z.string().min(1).max(200),
	title: z.string().min(1).max(500),
	description: z.string().min(1),
	difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).default('MEDIUM'),
	starterCode: z.string().min(1),
	solution: z.string().min(1),
	testCases: z.string().min(1),
	tags: z.array(z.string()).optional(),
	companyIds: z.array(z.string()).optional(),
})

export class CreateProblemDto extends createZodDto(createProblemSchema) {
	@ApiProperty({ example: 'implement-usestate', description: 'Problem slug (URL-friendly)' })
	slug: string

	@ApiProperty({ example: 'Implement useState hook', description: 'Problem title' })
	title: string

	@ApiProperty({ example: 'Create a custom useState hook...', description: 'Problem description (markdown)' })
	description: string

	@ApiProperty({ enum: ['EASY', 'MEDIUM', 'HARD'], default: 'MEDIUM' })
	difficulty: 'EASY' | 'MEDIUM' | 'HARD'

	@ApiProperty({ example: 'function useState(initialValue) {\n  // Your code here\n}' })
	starterCode: string

	@ApiProperty({ example: 'function useState(initialValue) {\n  let state = initialValue;\n  ...\n}' })
	solution: string

	@ApiProperty({ example: '[\n  { "input": [0], "expected": [0, "function"] }\n]' })
	testCases: string

	@ApiProperty({ example: ['hooks', 'react'], required: false })
	tags?: string[]

	@ApiProperty({ example: ['companyId1', 'companyId2'], required: false })
	companyIds?: string[]
}

const updateProblemSchema = createProblemSchema.partial()

export class UpdateProblemDto extends createZodDto(updateProblemSchema) {}

const submitSolutionSchema = z.object({
	code: z.string().min(1),
})

export class SubmitSolutionDto extends createZodDto(submitSolutionSchema) {
	@ApiProperty({ example: 'function useState(initialValue) { ... }', description: 'User solution code' })
	code: string
}
