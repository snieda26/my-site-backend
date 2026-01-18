export function isDev(): boolean {
	return process.env.NODE_ENV !== 'production'
}

export function isProd(): boolean {
	return process.env.NODE_ENV === 'production'
}

export function getEnvOrThrow(key: string): string {
	const value = process.env[key]
	if (!value) {
		throw new Error(`Environment variable ${key} is not set`)
	}
	return value
}
