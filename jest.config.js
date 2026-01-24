module.exports = {
	moduleFileExtensions: ['js', 'json', 'ts'],
	rootDir: 'src',
	testRegex: '.*\\.spec\\.ts$',
	transform: {
		'^.+\\.(t|j)s$': 'ts-jest',
	},
	collectCoverageFrom: ['**/*.(t|j)s', '!**/*.d.ts', '!**/index.ts'],
	coverageDirectory: '../coverage',
	testEnvironment: 'node',
	moduleNameMapper: {
		'^@/(.*)$': '<rootDir>/$1',
		'^@core/(.*)$': '<rootDir>/core/$1',
		'^@common/(.*)$': '<rootDir>/common/$1',
		'^@modules/(.*)$': '<rootDir>/modules/$1',
	},
	transformIgnorePatterns: [
		'node_modules/(?!(@paralleldrive/cuid2)/)',
	],
}
