import { createZodDto } from 'nestjs-zod'
import { z } from 'zod'
import { PaginationSchema } from './pagination.dto'

export const SearchQuerySchema = PaginationSchema.extend({
	search: z.string().optional(),
	sortBy: z.string().optional(),
	sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export class SearchQueryDto extends createZodDto(SearchQuerySchema) {}

export const FilterQuerySchema = SearchQuerySchema.extend({
	category: z.string().optional(),
	difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
	tag: z.string().optional(),
})

export class FilterQueryDto extends createZodDto(FilterQuerySchema) {}
