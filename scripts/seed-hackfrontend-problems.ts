/**
 * Seed HackFrontend Coding Problems
 * @usage: ./node_modules/.bin/tsx scripts/seed-hackfrontend-problems.ts
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import * as dotenv from 'dotenv'
import * as schema from '../src/core/database/schema'
import { eq } from 'drizzle-orm'

const postgres = require('postgres')

dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
	throw new Error('DATABASE_URL is not set')
}

const cleanConnectionString = connectionString.split('?')[0]
const client = postgres(cleanConnectionString)
const db = drizzle(client, { schema })

const hackfrontendProblems = [
	{
		slug: 'k-most-frequent-elements',
		title: 'K Most Frequent Elements',
		titleUa: 'K Найчастіших Елементів',
		description: 'Given an array of integers `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order. The time complexity must be better than O(n log n).',
		descriptionUa: 'Дано масив цілих чисел `nums` та ціле число `k`, поверніть `k` найчастіших елементів. Ви можете повернути відповідь у будь-якому порядку. Часова складність повинна бути кращою за O(n log n).',
		difficulty: 'MEDIUM' as const,
		starterCode: `function topKFrequent(nums, k) {
  // Write your code here
  
}`,
		solution: `function topKFrequent(nums, k) {
  const freqMap = new Map();
  
  // Count frequencies
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }
  
  // Sort by frequency and get top k
  return Array.from(freqMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([num]) => num);
}`,
		testCases: JSON.stringify([
			{ input: { nums: [1, 1, 1, 2, 2, 3], k: 2 }, expected: [1, 2] },
			{ input: { nums: [1], k: 1 }, expected: [1] },
			{ input: { nums: [4, 1, -1, 2, -1, 2, 3], k: 2 }, expected: [-1, 2] },
		]),
		companies: ['EPAM', 'SoftServe', 'GlobalLogic'],
	},
	{
		slug: 'extract-nodes-by-type',
		title: 'Extract Nodes by Type',
		titleUa: 'Витягнути Вузли за Типом',
		description: 'Write a function `extractNodesByType(root, type)` that takes a DOM tree root and node type, and returns all nodes of that type in a flat array.',
		descriptionUa: 'Напишіть функцію `extractNodesByType(root, type)`, яка приймає корінь DOM дерева та тип вузла, і повертає всі вузли цього типу в плоскому масиві.',
		difficulty: 'MEDIUM' as const,
		starterCode: `function extractNodesByType(root, type) {
  // Write your code here
  
}`,
		solution: `function extractNodesByType(root, type) {
  const result = [];
  
  function traverse(node) {
    if (!node) return;
    
    if (node.tagName && node.tagName.toLowerCase() === type.toLowerCase()) {
      result.push(node);
    }
    
    for (const child of node.children || []) {
      traverse(child);
    }
  }
  
  traverse(root);
  return result;
}`,
		testCases: JSON.stringify([
			{ 
				input: { 
					root: { tagName: 'div', children: [{ tagName: 'span' }, { tagName: 'p' }] }, 
					type: 'span' 
				}, 
				expected: 1 // number of span elements
			},
		]),
		companies: ['EPAM', 'Luxoft', 'Grammarly'],
	},
	{
		slug: 'reverse-polish-notation',
		title: 'Reverse Polish Notation Calculator',
		titleUa: 'Калькулятор Зворотної Польської Нотації',
		description: 'Evaluate the value of an arithmetic expression in Reverse Polish Notation. Valid operators are `+`, `-`, `*`, and `/`. Each operand may be an integer or another expression.',
		descriptionUa: 'Обчисліть значення арифметичного виразу в Зворотній Польській Нотації. Допустимі оператори: `+`, `-`, `*`, `/`. Кожен операнд може бути цілим числом або іншим виразом.',
		difficulty: 'MEDIUM' as const,
		starterCode: `function evalRPN(tokens) {
  // Write your code here
  
}`,
		solution: `function evalRPN(tokens) {
  const stack = [];
  
  for (const token of tokens) {
    if (['+', '-', '*', '/'].includes(token)) {
      const b = stack.pop();
      const a = stack.pop();
      
      switch(token) {
        case '+': stack.push(a + b); break;
        case '-': stack.push(a - b); break;
        case '*': stack.push(a * b); break;
        case '/': stack.push(Math.trunc(a / b)); break;
      }
    } else {
      stack.push(Number(token));
    }
  }
  
  return stack[0];
}`,
		testCases: JSON.stringify([
			{ input: { tokens: ['2', '1', '+', '3', '*'] }, expected: 9 },
			{ input: { tokens: ['4', '13', '5', '/', '+'] }, expected: 6 },
			{ input: { tokens: ['10', '6', '9', '3', '+', '-11', '*', '/', '*', '17', '+', '5', '+'] }, expected: 22 },
		]),
		companies: ['N-iX', 'Ciklum'],
	},
	{
		slug: 'capitalize-words',
		title: 'Capitalize Words in String',
		titleUa: 'Зробити Великими Перші Літери Слів',
		description: 'Write a function `capitalizeWords(str)` that capitalizes the first letter of each word in a string.',
		descriptionUa: 'Напишіть функцію `capitalizeWords(str)`, яка робить великою першу літеру кожного слова в рядку.',
		difficulty: 'EASY' as const,
		starterCode: `function capitalizeWords(str) {
  // Write your code here
  
}`,
		solution: `function capitalizeWords(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}`,
		testCases: JSON.stringify([
			{ input: { str: 'hello world' }, expected: 'Hello World' },
			{ input: { str: 'javascript is awesome' }, expected: 'Javascript Is Awesome' },
			{ input: { str: 'a b c' }, expected: 'A B C' },
		]),
		companies: ['GlobalLogic', 'Luxoft'],
	},
	{
		slug: 'concatenate-strings-from-objects',
		title: 'Concatenate Strings from Objects',
		titleUa: 'Об\'єднати Рядки з Об\'єктів',
		description: 'Given an array of objects, where each object has a `name` property, write a function that returns a single string with all names concatenated, separated by commas.',
		descriptionUa: 'Дано масив об\'єктів, де кожен об\'єкт має властивість `name`, напишіть функцію, яка повертає один рядок з усіма іменами, з\'єднаними комами.',
		difficulty: 'EASY' as const,
		starterCode: `function concatenateNames(arr) {
  // Write your code here
  
}`,
		solution: `function concatenateNames(arr) {
  return arr.map(obj => obj.name).join(', ');
}`,
		testCases: JSON.stringify([
			{ 
				input: { arr: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }] }, 
				expected: 'Alice, Bob, Charlie' 
			},
			{ input: { arr: [{ name: 'John' }] }, expected: 'John' },
			{ input: { arr: [] }, expected: '' },
		]),
		companies: ['SoftServe', 'Ciklum'],
	},
	{
		slug: 'find-indices-for-sum',
		title: 'Find Indices of Elements for Sum',
		titleUa: 'Знайти Індекси Елементів для Суми',
		description: 'Given an array of numbers and a target sum, return the indices of two numbers that add up to the target. You may assume exactly one solution exists.',
		descriptionUa: 'Дано масив чисел та цільову суму, поверніть індекси двох чисел, які в сумі дають цільове значення. Можна припустити, що існує рівно одне рішення.',
		difficulty: 'EASY' as const,
		starterCode: `function twoSumIndices(nums, target) {
  // Write your code here
  
}`,
		solution: `function twoSumIndices(nums, target) {
  const map = new Map();
  
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  
  return [];
}`,
		testCases: JSON.stringify([
			{ input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
			{ input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
			{ input: { nums: [3, 3], target: 6 }, expected: [0, 1] },
		]),
		companies: ['Grammarly'],
	},
	{
		slug: 'find-deepest-max-element',
		title: 'Find Deepest Maximum Element',
		titleUa: 'Знайти Найглибший Максимальний Елемент',
		description: 'Given a nested array structure, find the maximum element value and return its depth level (0-indexed from the root).',
		descriptionUa: 'Дано вкладену структуру масиву, знайдіть максимальне значення елемента та поверніть його рівень глибини (з індексацією від 0 від кореня).',
		difficulty: 'MEDIUM' as const,
		starterCode: `function findDeepestMax(arr) {
  // Write your code here
  // Return { value: maxValue, depth: depthLevel }
}`,
		solution: `function findDeepestMax(arr) {
  let maxValue = -Infinity;
  let maxDepth = 0;
  
  function traverse(arr, depth) {
    for (const item of arr) {
      if (Array.isArray(item)) {
        traverse(item, depth + 1);
      } else if (typeof item === 'number') {
        if (item > maxValue || (item === maxValue && depth > maxDepth)) {
          maxValue = item;
          maxDepth = depth;
        }
      }
    }
  }
  
  traverse(arr, 0);
  return { value: maxValue, depth: maxDepth };
}`,
		testCases: JSON.stringify([
			{ input: { arr: [1, [2, [3, 4], 5]] }, expected: { value: 5, depth: 1 } },
			{ input: { arr: [1, 2, 3] }, expected: { value: 3, depth: 0 } },
		]),
		companies: ['N-iX', 'Luxoft'],
	},
	{
		slug: 'find-strings-with-substring',
		title: 'Find Strings with Substring',
		titleUa: 'Знайти Рядки з Підрядком',
		description: 'Given an array of strings and a substring, return all strings that contain the substring.',
		descriptionUa: 'Дано масив рядків та підрядок, поверніть всі рядки, які містять цей підрядок.',
		difficulty: 'EASY' as const,
		starterCode: `function findStringsWithSubstring(arr, substring) {
  // Write your code here
  
}`,
		solution: `function findStringsWithSubstring(arr, substring) {
  return arr.filter(str => str.includes(substring));
}`,
		testCases: JSON.stringify([
			{ 
				input: { arr: ['hello', 'world', 'help', 'hi'], substring: 'he' }, 
				expected: ['hello', 'help'] 
			},
			{ input: { arr: ['test', 'best', 'rest'], substring: 'est' }, expected: ['test', 'best', 'rest'] },
			{ input: { arr: ['abc', 'def'], substring: 'xyz' }, expected: [] },
		]),
		companies: ['EPAM'],
	},
	{
		slug: 'get-value-by-path',
		title: 'Get Value from Object by Path',
		titleUa: 'Отримати Значення з Об\'єкта за Шляхом',
		description: 'Write a function `getValueByPath(obj, path)` that takes an object and a path string (e.g., "a.b.c") and returns the value at that path.',
		descriptionUa: 'Напишіть функцію `getValueByPath(obj, path)`, яка приймає об\'єкт та рядок шляху (наприклад, "a.b.c") і повертає значення за цим шляхом.',
		difficulty: 'MEDIUM' as const,
		starterCode: `function getValueByPath(obj, path) {
  // Write your code here
  
}`,
		solution: `function getValueByPath(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}`,
		testCases: JSON.stringify([
			{ 
				input: { obj: { a: { b: { c: 42 } } }, path: 'a.b.c' }, 
				expected: 42 
			},
			{ input: { obj: { x: 10 }, path: 'x' }, expected: 10 },
			{ input: { obj: { a: { b: 1 } }, path: 'a.b.c' }, expected: undefined },
		]),
		companies: ['SoftServe'],
	},
]

async function seedProblems() {
	console.log('🌱 Starting to seed HackFrontend problems...\n')

	try {
		// First, delete the sample problems
		console.log('🗑️  Removing sample problems...')
		await db.delete(schema.problems)
		console.log('✅ Sample problems removed\n')

		let addedCount = 0

		for (const problemData of hackfrontendProblems) {
			console.log(`📝 Processing: ${problemData.title}`)

			// Insert problem
			const [problem] = await db
				.insert(schema.problems)
				.values({
					slug: problemData.slug,
					title: problemData.title,
					titleUa: problemData.titleUa,
					description: problemData.description,
					descriptionUa: problemData.descriptionUa,
					difficulty: problemData.difficulty,
					starterCode: problemData.starterCode,
					solution: problemData.solution,
					testCases: problemData.testCases,
				})
				.returning()

			console.log(`  ✅ Added problem: ${problem.slug}`)

			// Add companies
			for (const companyName of problemData.companies) {
				// Get or create company
				let [company] = await db
					.select()
					.from(schema.companies)
					.where(eq(schema.companies.name, companyName))
					.limit(1)

				if (!company) {
					;[company] = await db
						.insert(schema.companies)
						.values({ name: companyName })
						.returning()
					console.log(`    🏢 Created company: ${companyName}`)
				}

				// Link problem to company
				await db
					.insert(schema.problemsToCompanies)
					.values({
						problemId: problem.id,
						companyId: company.id,
					})
					.onConflictDoNothing()
			}

			addedCount++
			console.log()
		}

		console.log('========================================')
		console.log('✅ Seeding complete!')
		console.log(`   Added: ${addedCount} HackFrontend problems`)
		console.log('========================================\n')
	} catch (error) {
		console.error('❌ Error during seeding:', error)
		throw error
	} finally {
		await client.end()
	}
}

seedProblems()
