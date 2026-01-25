/**
 * Seed Sample Problems for Testing
 * @usage: yarn tsx scripts/seed-sample-problems.ts
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

const sampleProblems = [
	{
		slug: 'two-sum',
		title: 'Two Sum',
		description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
		difficulty: 'JUNIOR' as const,
		starterCode: `function twoSum(nums, target) {
  // Write your code here
  
}`,
		solution: `function twoSum(nums, target) {
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
		companies: ['Google', 'Amazon', 'Microsoft'],
	},
	{
		slug: 'reverse-string',
		title: 'Reverse String',
		description: 'Write a function that reverses a string. The input string is given as an array of characters. You must do this by modifying the input array in-place with O(1) extra memory.',
		difficulty: 'JUNIOR' as const,
		starterCode: `function reverseString(s) {
  // Write your code here
  
}`,
		solution: `function reverseString(s) {
  let left = 0;
  let right = s.length - 1;
  
  while (left < right) {
    [s[left], s[right]] = [s[right], s[left]];
    left++;
    right--;
  }
  
  return s;
}`,
		testCases: JSON.stringify([
			{ input: { s: ['h', 'e', 'l', 'l', 'o'] }, expected: ['o', 'l', 'l', 'e', 'h'] },
			{ input: { s: ['H', 'a', 'n', 'n', 'a', 'h'] }, expected: ['h', 'a', 'n', 'n', 'a', 'H'] },
		]),
		companies: ['Facebook', 'Apple'],
	},
	{
		slug: 'valid-parentheses',
		title: 'Valid Parentheses',
		description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. An input string is valid if: 1) Open brackets must be closed by the same type of brackets. 2) Open brackets must be closed in the correct order.',
		difficulty: 'MIDDLE' as const,
		starterCode: `function isValid(s) {
  // Write your code here
  
}`,
		solution: `function isValid(s) {
  const stack = [];
  const pairs = {
    '(': ')',
    '{': '}',
    '[': ']'
  };
  
  for (let char of s) {
    if (pairs[char]) {
      stack.push(char);
    } else {
      const top = stack.pop();
      if (pairs[top] !== char) {
        return false;
      }
    }
  }
  
  return stack.length === 0;
}`,
		testCases: JSON.stringify([
			{ input: { s: '()' }, expected: true },
			{ input: { s: '()[]{}' }, expected: true },
			{ input: { s: '(]' }, expected: false },
			{ input: { s: '([)]' }, expected: false },
		]),
		companies: ['Google', 'Amazon', 'Microsoft', 'Facebook'],
	},
	{
		slug: 'fibonacci-number',
		title: 'Fibonacci Number',
		description: 'The Fibonacci numbers form a sequence, where each number is the sum of the two preceding ones, starting from 0 and 1. Given `n`, calculate `F(n)`. F(0) = 0, F(1) = 1, F(n) = F(n - 1) + F(n - 2), for n > 1.',
		difficulty: 'JUNIOR' as const,
		starterCode: `function fib(n) {
  // Write your code here
  
}`,
		solution: `function fib(n) {
  if (n <= 1) return n;
  
  let prev = 0;
  let curr = 1;
  
  for (let i = 2; i <= n; i++) {
    const temp = curr;
    curr = prev + curr;
    prev = temp;
  }
  
  return curr;
}`,
		testCases: JSON.stringify([
			{ input: { n: 2 }, expected: 1 },
			{ input: { n: 3 }, expected: 2 },
			{ input: { n: 4 }, expected: 3 },
			{ input: { n: 10 }, expected: 55 },
		]),
		companies: ['Amazon', 'Apple'],
	},
	{
		slug: 'group-anagrams',
		title: 'Group Anagrams',
		description: 'Given an array of strings `strs`, group the anagrams together. You can return the answer in any order. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase.',
		difficulty: 'MIDDLE' as const,
		starterCode: `function groupAnagrams(strs) {
  // Write your code here
  
}`,
		solution: `function groupAnagrams(strs) {
  const map = new Map();
  
  for (let str of strs) {
    const sorted = str.split('').sort().join('');
    
    if (!map.has(sorted)) {
      map.set(sorted, []);
    }
    
    map.get(sorted).push(str);
  }
  
  return Array.from(map.values());
}`,
		testCases: JSON.stringify([
			{ input: { strs: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'] }, expected: [['bat'], ['nat', 'tan'], ['ate', 'eat', 'tea']] },
			{ input: { strs: [''] }, expected: [['']] },
			{ input: { strs: ['a'] }, expected: [['a']] },
		]),
		companies: ['Amazon', 'Facebook', 'Google'],
	},
]

async function seedProblems() {
	console.log('🌱 Starting to seed sample problems...\n')

	try {
		let addedCount = 0
		let skippedCount = 0

		for (const problemData of sampleProblems) {
			console.log(`📝 Processing: ${problemData.title}`)

			// Check if problem already exists
			const [existing] = await db
				.select()
				.from(schema.problems)
				.where(eq(schema.problems.slug, problemData.slug))
				.limit(1)

			if (existing) {
				console.log(`  ⏭️  Already exists, skipping...`)
				skippedCount++
				continue
			}

			// Insert problem
			const [problem] = await db
				.insert(schema.problems)
				.values({
					slug: problemData.slug,
					title: problemData.title,
					description: problemData.description,
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
		console.log(`   Added: ${addedCount}`)
		console.log(`   Skipped: ${skippedCount}`)
		console.log('========================================\n')
	} catch (error) {
		console.error('❌ Error during seeding:', error)
		throw error
	} finally {
		await client.end()
	}
}

seedProblems()
