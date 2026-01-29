/**
 * Test API endpoints for problems
 * @usage: ./node_modules/.bin/tsx scripts/test-api.ts
 */

async function testAPI() {
	console.log('🧪 Testing API endpoints...\n')

	try {
		// Test 1: Get all problems
		console.log('1️⃣ Testing GET /api/problems')
		let response = await fetch('http://localhost:4000/api/problems')
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		let data = await response.json()
		console.log(`   ✅ Total problems: ${data.data.length}`)
		console.log(`   📊 Meta: page ${data.meta.page}, total ${data.meta.total}\n`)

		// Test 2: Get JavaScript problems
		console.log('2️⃣ Testing GET /api/problems?category=javascript')
		response = await fetch('http://localhost:4000/api/problems?category=javascript')
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		data = await response.json()
		console.log(`   ✅ JavaScript problems: ${data.data.length}`)
		console.log(`   📝 Sample: ${data.data[0]?.title} (${data.data[0]?.category})\n`)

		// Test 3: Get React problems
		console.log('3️⃣ Testing GET /api/problems?category=react')
		response = await fetch('http://localhost:4000/api/problems?category=react')
		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}
		data = await response.json()
		console.log(`   ✅ React problems: ${data.data.length}`)
		console.log(`   📝 Sample: ${data.data[0]?.title} (${data.data[0]?.category})`)
		
		// List all React problems
		console.log('\n   React Problems List:')
		data.data.forEach((problem: any, index: number) => {
			console.log(`     ${index + 1}. ${problem.title} - ${problem.difficulty}`)
		})

		console.log('\n========================================')
		console.log('✅ All API tests passed!')
		console.log('========================================\n')
	} catch (error) {
		console.error('\n❌ API test failed:', error)
		if (error instanceof Error && error.message.includes('fetch')) {
			console.error('\n💡 Make sure the backend server is running on port 4000')
			console.error('   Run: yarn dev (in backend directory)\n')
		}
		throw error
	}
}

testAPI()
