export interface FindAllOptions {
	page?: number
	limit?: number
	orderBy?: string
	orderDirection?: 'asc' | 'desc'
}

export interface PaginatedResult<T> {
	data: T[]
	meta: {
		page: number
		limit: number
		total: number
		totalPages: number
	}
}

export interface IBaseRepository<T, CreateDto, UpdateDto> {
	findAll(options?: FindAllOptions): Promise<T[]>
	findById(id: string): Promise<T | null>
	create(data: CreateDto): Promise<T>
	update(id: string, data: UpdateDto): Promise<T | null>
	delete(id: string): Promise<boolean>
}
