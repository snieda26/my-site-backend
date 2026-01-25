import { Injectable } from '@nestjs/common'
import { VM } from 'vm2'

interface TestCase {
	input: Record<string, any>
	expected: any
}

interface ExecutionResult {
	success: boolean
	testResults: Array<{
		passed: boolean
		input: Record<string, any>
		expected: any
		actual: any
		error?: string
	}>
	output: string
	error?: string
}

@Injectable()
export class CodeExecutorService {
	/**
	 * Execute user code against test cases
	 */
	async executeCode(code: string, testCasesJson: string): Promise<ExecutionResult> {
		try {
			const testCases: TestCase[] = JSON.parse(testCasesJson)
			const testResults: ExecutionResult['testResults'] = []
			let output = ''

			// Extract the function name from the code
			let functionName: string | null = null
			
			// Try regular function declaration
			const funcMatch = code.match(/function\s+(\w+)\s*\(/)
			if (funcMatch) {
				functionName = funcMatch[1]
			} else {
				// Try arrow function or const function
				const constMatch = code.match(/(?:const|let|var)\s+(\w+)\s*=/)
				if (constMatch) {
					functionName = constMatch[1]
				}
			}
			
			if (!functionName) {
				throw new Error('No function found in code. Make sure to define a function like: function myFunction() { }')
			}

			for (const testCase of testCases) {
				try {
					// Create isolated VM for each test
					const vm = new VM({
						timeout: 5000, // 5 second timeout
						sandbox: {
							console: {
								log: (...args: any[]) => {
									output += args.map(a => JSON.stringify(a)).join(' ') + '\\n'
								},
							},
						},
					})

					// Prepare the complete code to run
					const args = Object.values(testCase.input)
					const argsString = args.map(arg => JSON.stringify(arg)).join(', ')
					
					const fullCode = `
						${code}
						${functionName}(${argsString})
					`

					// Execute the function
					const actual = vm.run(fullCode)

					// Compare result
					const passed = this.deepEqual(actual, testCase.expected)

					testResults.push({
						passed,
						input: testCase.input,
						expected: testCase.expected,
						actual,
					})
				} catch (error) {
					// Detailed error message for debugging
					const errorMsg = error instanceof Error 
						? `VM Error: ${error.message}` 
						: 'Unknown VM error'
					
					testResults.push({
						passed: false,
						input: testCase.input,
						expected: testCase.expected,
						actual: null,
						error: errorMsg,
					})
				}
			}

			const allPassed = testResults.every(r => r.passed)

			return {
				success: allPassed,
				testResults,
				output: output || 'No console output',
			}
		} catch (error) {
			return {
				success: false,
				testResults: [],
				output: '',
				error: error instanceof Error ? error.message : 'Execution failed',
			}
		}
	}

	/**
	 * Deep equality check for comparing results
	 */
	private deepEqual(a: any, b: any): boolean {
		if (a === b) return true

		if (a == null || b == null) return a === b

		if (typeof a !== typeof b) return false

		if (Array.isArray(a) && Array.isArray(b)) {
			if (a.length !== b.length) return false

			// Sort arrays for comparison (order doesn't matter for some problems)
			const sortedA = [...a].sort()
			const sortedB = [...b].sort()

			return sortedA.every((item, i) => this.deepEqual(item, sortedB[i]))
		}

		if (typeof a === 'object') {
			const keysA = Object.keys(a)
			const keysB = Object.keys(b)

			if (keysA.length !== keysB.length) return false

			return keysA.every(key => this.deepEqual(a[key], b[key]))
		}

		return false
	}
}
