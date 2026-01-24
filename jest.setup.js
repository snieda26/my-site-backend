// Global test setup
jest.setTimeout(10000)

// Suppress console.log in tests unless DEBUG is set
if (!process.env.DEBUG) {
	global.console = {
		...console,
		log: jest.fn(),
		debug: jest.fn(),
		info: jest.fn(),
	}
}
