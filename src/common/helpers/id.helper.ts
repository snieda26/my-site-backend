import { randomBytes } from 'crypto'

export function generateId(): string {
	// Generate a cuid-like ID without external dependency
	const timestamp = Date.now().toString(36)
	const random = randomBytes(8).toString('hex')
	return `${timestamp}${random}`
}

export function generateSlug(text: string): string {
	return text
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '')
}
