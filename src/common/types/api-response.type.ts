export interface ApiResponse<T = unknown> {
	success: boolean
	data?: T
	message?: string
}

export interface MessageResponse {
	message: string
}

export function createSuccessResponse<T>(data: T): ApiResponse<T> {
	return { success: true, data }
}

export function createMessageResponse(message: string): MessageResponse {
	return { message }
}
