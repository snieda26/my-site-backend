/**
 * Fix All Problems - Update solutions and test cases
 * @usage: ./node_modules/.bin/tsx scripts/fix-all-problems.ts
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

const fixedProblems = [
	{
		slug: 'k-most-frequent-elements',
		title: 'K Most Frequent Elements',
		titleUa: 'K Найчастіших Елементів',
		description: 'Given an array of integers `nums` and an integer `k`, return the `k` most frequent elements. You may return the answer in any order.',
		descriptionUa: 'Дано масив цілих чисел `nums` та ціле число `k`, поверніть `k` найчастіших елементів. Ви можете повернути відповідь у будь-якому порядку.',
		difficulty: 'MIDDLE' as const,
		starterCode: `function topKFrequent(nums, k) {
  
}`,
		solution: `function topKFrequent(nums, k) {
  const freqMap = new Map();
  for (const num of nums) {
    freqMap.set(num, (freqMap.get(num) || 0) + 1);
  }
  return Array.from(freqMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, k)
    .map(([num]) => num);
}`,
		testCases: JSON.stringify([
			{ input: { nums: [1, 1, 1, 2, 2, 3], k: 2 }, expected: [1, 2] },
			{ input: { nums: [1], k: 1 }, expected: [1] },
			{ input: { nums: [4, 1, -1, 2, -1, 2, 3], k: 2 }, expected: [-1, 2] },
			{ input: { nums: [1, 2, 3, 4, 5], k: 3 }, expected: [1, 2, 3] },
			{ input: { nums: [5, 5, 5, 5, 1, 1, 1, 2, 2, 3], k: 1 }, expected: [5] },
			{ input: { nums: [7, 7, 7, 8, 8, 9], k: 3 }, expected: [7, 8, 9] },
			{ input: { nums: [1, 1, 2, 2, 3, 3], k: 2 }, expected: [1, 2] },
		]),
		companies: ['EPAM', 'SoftServe', 'GlobalLogic'],
	},
	{
		slug: 'extract-nodes-by-type',
		title: 'Extract Nodes by Type',
		titleUa: 'Витягнути Вузли за Типом',
		description: `Write a function \`extractNodesByType(root, type)\` that takes a DOM tree root and node type, and returns all nodes of that type in a flat array.

Each node has a \`tagName\` property and optionally a \`children\` array containing child nodes.

**Example:**
\`\`\`
Input: root = { tagName: "div", children: [{ tagName: "span" }, { tagName: "p" }] }, type = "span"
Output: [{ tagName: "span" }]
\`\`\``,
		descriptionUa: `Напишіть функцію \`extractNodesByType(root, type)\`, яка приймає корінь DOM дерева та тип вузла, і повертає всі вузли цього типу в плоскому масиві.

Кожен вузол має властивість \`tagName\` та опціонально масив \`children\`, що містить дочірні вузли.`,
		difficulty: 'MIDDLE' as const,
		starterCode: `function extractNodesByType(root, type) {
  
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
				expected: [{ tagName: 'span' }]
			},
			{ 
				input: { 
					root: { tagName: 'div', children: [] }, 
					type: 'span' 
				}, 
				expected: []
			},
			{ 
				input: { 
					root: { tagName: 'span', children: [{ tagName: 'span' }] }, 
					type: 'span' 
				}, 
				expected: [{ tagName: 'span', children: [{ tagName: 'span' }] }, { tagName: 'span' }]
			},
			{ 
				input: { 
					root: { tagName: 'div', children: [{ tagName: 'p', children: [{ tagName: 'span' }] }, { tagName: 'span' }] }, 
					type: 'span' 
				}, 
				expected: [{ tagName: 'span' }, { tagName: 'span' }]
			},
			{ 
				input: { 
					root: { tagName: 'DIV', children: [{ tagName: 'SPAN' }] }, 
					type: 'span' 
				}, 
				expected: [{ tagName: 'SPAN' }]
			},
			{ 
				input: { 
					root: { tagName: 'ul', children: [{ tagName: 'li' }, { tagName: 'li' }, { tagName: 'li' }] }, 
					type: 'li' 
				}, 
				expected: [{ tagName: 'li' }, { tagName: 'li' }, { tagName: 'li' }]
			},
		]),
		companies: ['EPAM', 'Luxoft', 'Grammarly'],
	},
	{
		slug: 'reverse-polish-notation',
		title: 'Reverse Polish Notation Calculator',
		titleUa: 'Калькулятор Зворотної Польської Нотації',
		description: `Evaluate the value of an arithmetic expression in Reverse Polish Notation.

Valid operators are \`+\`, \`-\`, \`*\`, and \`/\`. Each operand may be an integer or another expression.

Division should truncate toward zero.

**Example:**
\`\`\`
Input: tokens = ["2", "1", "+", "3", "*"]
Output: 9
Explanation: ((2 + 1) * 3) = 9
\`\`\``,
		descriptionUa: `Обчисліть значення арифметичного виразу в Зворотній Польській Нотації.

Допустимі оператори: \`+\`, \`-\`, \`*\`, \`/\`. Кожен операнд може бути цілим числом або іншим виразом.

Ділення повинно округлятися до нуля.`,
		difficulty: 'MIDDLE' as const,
		starterCode: `function evalRPN(tokens) {
  
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
			{ input: { tokens: ['3', '4', '+'] }, expected: 7 },
			{ input: { tokens: ['5', '3', '-'] }, expected: 2 },
			{ input: { tokens: ['6', '2', '*'] }, expected: 12 },
			{ input: { tokens: ['8', '4', '/'] }, expected: 2 },
			{ input: { tokens: ['7', '2', '/'] }, expected: 3 },
			{ input: { tokens: ['-7', '2', '/'] }, expected: -3 },
			{ input: { tokens: ['5'] }, expected: 5 },
		]),
		companies: ['N-iX', 'Ciklum'],
	},
	{
		slug: 'capitalize-words',
		title: 'Capitalize Words in String',
		titleUa: 'Зробити Великими Перші Літери Слів',
		description: `Write a function \`capitalizeWords(str)\` that capitalizes the first letter of each word in a string.

Words are separated by spaces. The rest of the letters should be lowercase.

**Example:**
\`\`\`
Input: "hello world"
Output: "Hello World"
\`\`\``,
		descriptionUa: `Напишіть функцію \`capitalizeWords(str)\`, яка робить великою першу літеру кожного слова в рядку.

Слова розділені пробілами. Решта літер мають бути малими.`,
		difficulty: 'JUNIOR' as const,
		starterCode: `function capitalizeWords(str) {
  
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
			{ input: { str: 'HELLO WORLD' }, expected: 'Hello World' },
			{ input: { str: 'hELLO wORLD' }, expected: 'Hello World' },
			{ input: { str: 'test' }, expected: 'Test' },
			{ input: { str: '' }, expected: '' },
			{ input: { str: 'one two three four five' }, expected: 'One Two Three Four Five' },
		]),
		companies: ['GlobalLogic', 'Luxoft'],
	},
	{
		slug: 'concatenate-strings-from-objects',
		title: 'Concatenate Strings from Objects',
		titleUa: 'Об\'єднати Рядки з Об\'єктів',
		description: `Given an array of objects, where each object has a \`name\` property, write a function that returns a single string with all names concatenated, separated by commas and a space.

**Example:**
\`\`\`
Input: [{ name: "Alice" }, { name: "Bob" }]
Output: "Alice, Bob"
\`\`\``,
		descriptionUa: `Дано масив об\'єктів, де кожен об\'єкт має властивість \`name\`, напишіть функцію, яка повертає один рядок з усіма іменами, з\'єднаними комами та пробілом.`,
		difficulty: 'JUNIOR' as const,
		starterCode: `function concatenateNames(arr) {
  
}`,
		solution: `function concatenateNames(arr) {
  return arr.map(obj => obj.name).join(', ');
}`,
		testCases: JSON.stringify([
			{ input: { arr: [{ name: 'Alice' }, { name: 'Bob' }, { name: 'Charlie' }] }, expected: 'Alice, Bob, Charlie' },
			{ input: { arr: [{ name: 'John' }] }, expected: 'John' },
			{ input: { arr: [] }, expected: '' },
			{ input: { arr: [{ name: 'A' }, { name: 'B' }] }, expected: 'A, B' },
			{ input: { arr: [{ name: 'Test' }, { name: 'User' }, { name: 'Name' }, { name: 'Here' }] }, expected: 'Test, User, Name, Here' },
			{ input: { arr: [{ name: '' }, { name: 'Bob' }] }, expected: ', Bob' },
			{ input: { arr: [{ name: 'Single' }] }, expected: 'Single' },
		]),
		companies: ['SoftServe', 'Ciklum'],
	},
	{
		slug: 'find-indices-for-sum',
		title: 'Find Indices of Elements for Sum',
		titleUa: 'Знайти Індекси Елементів для Суми',
		description: `Given an array of numbers and a target sum, return the indices of two numbers that add up to the target.

You may assume exactly one solution exists, and you may not use the same element twice.

**Example:**
\`\`\`
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9
\`\`\``,
		descriptionUa: `Дано масив чисел та цільову суму, поверніть індекси двох чисел, які в сумі дають цільове значення.

Можна припустити, що існує рівно одне рішення, і ви не можете використовувати один елемент двічі.`,
		difficulty: 'JUNIOR' as const,
		starterCode: `function twoSumIndices(nums, target) {
  
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
			{ input: { nums: [1, 5, 3, 8], target: 9 }, expected: [0, 3] },
			{ input: { nums: [0, 4, 3, 0], target: 0 }, expected: [0, 3] },
			{ input: { nums: [-1, -2, -3, -4, -5], target: -8 }, expected: [2, 4] },
			{ input: { nums: [1, 2, 3, 4, 5, 6], target: 11 }, expected: [4, 5] },
			{ input: { nums: [10, 20, 30], target: 50 }, expected: [1, 2] },
		]),
		companies: ['Grammarly'],
	},
	{
		slug: 'find-deepest-max-element',
		title: 'Find Deepest Maximum Element',
		titleUa: 'Знайти Найглибший Максимальний Елемент',
		description: `Given a nested array structure, find the maximum element value and return an object with its value and depth level.

Depth is 0-indexed from the root array. If the same maximum appears at multiple depths, return the deepest one.

**Example:**
\`\`\`
Input: [1, [2, [3, 4], 5]]
Output: { value: 5, depth: 1 }
\`\`\``,
		descriptionUa: `Дано вкладену структуру масиву, знайдіть максимальне значення елемента та поверніть об\'єкт з його значенням та рівнем глибини.

Глибина індексується з 0 від кореневого масиву. Якщо однаковий максимум з\'являється на різних глибинах, повертайте найглибший.`,
		difficulty: 'MIDDLE' as const,
		starterCode: `function findDeepestMax(arr) {
  
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
			{ input: { arr: [[[[10]]]] }, expected: { value: 10, depth: 3 } },
			{ input: { arr: [5, [5, [5]]] }, expected: { value: 5, depth: 2 } },
			{ input: { arr: [1, [2], [[3]], [[[4]]]] }, expected: { value: 4, depth: 3 } },
			{ input: { arr: [-1, [-2, [-3]]] }, expected: { value: -1, depth: 0 } },
			{ input: { arr: [10, [20, [30, [40]]]] }, expected: { value: 40, depth: 3 } },
			{ input: { arr: [100] }, expected: { value: 100, depth: 0 } },
		]),
		companies: ['N-iX', 'Luxoft'],
	},
	{
		slug: 'find-strings-with-substring',
		title: 'Find Strings with Substring',
		titleUa: 'Знайти Рядки з Підрядком',
		description: `Given an array of strings and a substring, return all strings that contain the substring.

The search should be case-sensitive.

**Example:**
\`\`\`
Input: arr = ["hello", "world", "help"], substring = "hel"
Output: ["hello", "help"]
\`\`\``,
		descriptionUa: `Дано масив рядків та підрядок, поверніть всі рядки, які містять цей підрядок.

Пошук має бути чутливим до регістру.`,
		difficulty: 'JUNIOR' as const,
		starterCode: `function findStringsWithSubstring(arr, substring) {
  
}`,
		solution: `function findStringsWithSubstring(arr, substring) {
  return arr.filter(str => str.includes(substring));
}`,
		testCases: JSON.stringify([
			{ input: { arr: ['hello', 'world', 'help', 'hi'], substring: 'he' }, expected: ['hello', 'help'] },
			{ input: { arr: ['test', 'best', 'rest'], substring: 'est' }, expected: ['test', 'best', 'rest'] },
			{ input: { arr: ['abc', 'def'], substring: 'xyz' }, expected: [] },
			{ input: { arr: ['JavaScript', 'Java', 'Python'], substring: 'Java' }, expected: ['JavaScript', 'Java'] },
			{ input: { arr: ['aaa', 'bbb', 'ccc'], substring: 'a' }, expected: ['aaa'] },
			{ input: { arr: [], substring: 'test' }, expected: [] },
			{ input: { arr: ['one', 'two', 'three'], substring: 'o' }, expected: ['one', 'two'] },
			{ input: { arr: ['HELLO', 'hello'], substring: 'hello' }, expected: ['hello'] },
		]),
		companies: ['EPAM'],
	},
	{
		slug: 'get-value-by-path',
		title: 'Get Value from Object by Path',
		titleUa: 'Отримати Значення з Об\'єкта за Шляхом',
		description: `Write a function \`getValueByPath(obj, path)\` that takes an object and a path string (e.g., "a.b.c") and returns the value at that path.

If the path doesn't exist, return \`undefined\`.

**Example:**
\`\`\`
Input: obj = { a: { b: { c: 42 } } }, path = "a.b.c"
Output: 42
\`\`\``,
		descriptionUa: `Напишіть функцію \`getValueByPath(obj, path)\`, яка приймає об\'єкт та рядок шляху (наприклад, "a.b.c") і повертає значення за цим шляхом.

Якщо шлях не існує, поверніть \`undefined\`.`,
		difficulty: 'MIDDLE' as const,
		starterCode: `function getValueByPath(obj, path) {
  
}`,
		solution: `function getValueByPath(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}`,
		testCases: JSON.stringify([
			{ input: { obj: { a: { b: { c: 42 } } }, path: 'a.b.c' }, expected: 42 },
			{ input: { obj: { x: 10 }, path: 'x' }, expected: 10 },
			{ input: { obj: { a: { b: 1 } }, path: 'a.b.c' }, expected: undefined },
			{ input: { obj: { a: { b: { c: { d: 'deep' } } } }, path: 'a.b.c.d' }, expected: 'deep' },
			{ input: { obj: {}, path: 'a' }, expected: undefined },
			{ input: { obj: { arr: [1, 2, 3] }, path: 'arr' }, expected: [1, 2, 3] },
			{ input: { obj: { a: null }, path: 'a.b' }, expected: undefined },
			{ input: { obj: { user: { name: 'John', age: 30 } }, path: 'user.name' }, expected: 'John' },
		]),
		companies: ['SoftServe'],
	},
	{
		slug: 'two-sum',
		title: 'Two Sum',
		titleUa: 'Сума Двох',
		description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

**Example:**
\`\`\`
Input: nums = [2, 7, 11, 15], target = 9
Output: [0, 1]
Explanation: nums[0] + nums[1] = 2 + 7 = 9
\`\`\``,
		descriptionUa: `Дано масив цілих чисел \`nums\` та ціле число \`target\`, поверніть індекси двох чисел, які в сумі дають \`target\`.

Можна припустити, що кожен вхід має рівно одне рішення, і ви не можете використовувати один елемент двічі.`,
		difficulty: 'JUNIOR' as const,
		starterCode: `function twoSum(nums, target) {
  
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
			{ input: { nums: [1, 2, 3, 4, 5], target: 9 }, expected: [3, 4] },
			{ input: { nums: [0, 4, 3, 0], target: 0 }, expected: [0, 3] },
			{ input: { nums: [-1, -2, -3, -4, -5], target: -8 }, expected: [2, 4] },
			{ input: { nums: [1, 5, 1, 5], target: 10 }, expected: [1, 3] },
		]),
		companies: ['Google', 'Amazon', 'Microsoft'],
	},
	{
		slug: 'reverse-string',
		title: 'Reverse String',
		titleUa: 'Перевернути Рядок',
		description: `Write a function that reverses a string. The input string is given as an array of characters.

You must do this by modifying the input array in-place.

**Example:**
\`\`\`
Input: s = ["h", "e", "l", "l", "o"]
Output: ["o", "l", "l", "e", "h"]
\`\`\``,
		descriptionUa: `Напишіть функцію, яка перевертає рядок. Вхідний рядок надано як масив символів.

Ви повинні модифікувати вхідний масив на місці.`,
		difficulty: 'JUNIOR' as const,
		starterCode: `function reverseString(s) {
  
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
			{ input: { s: ['a'] }, expected: ['a'] },
			{ input: { s: ['a', 'b'] }, expected: ['b', 'a'] },
			{ input: { s: ['1', '2', '3', '4', '5'] }, expected: ['5', '4', '3', '2', '1'] },
			{ input: { s: ['A', 'B', 'C'] }, expected: ['C', 'B', 'A'] },
			{ input: { s: ['x', 'y', 'z', 'w'] }, expected: ['w', 'z', 'y', 'x'] },
		]),
		companies: ['Facebook', 'Apple'],
	},
	{
		slug: 'valid-parentheses',
		title: 'Valid Parentheses',
		titleUa: 'Валідні Дужки',
		description: `Given a string \`s\` containing just the characters \`(\`, \`)\`, \`{\`, \`}\`, \`[\` and \`]\`, determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.

**Example:**
\`\`\`
Input: s = "()[]{}"
Output: true
\`\`\``,
		descriptionUa: `Дано рядок \`s\`, що містить лише символи \`(\`, \`)\`, \`{\`, \`}\`, \`[\` та \`]\`, визначте, чи є вхідний рядок валідним.

Вхідний рядок валідний, якщо:
1. Відкриті дужки закриваються дужками того ж типу.
2. Відкриті дужки закриваються в правильному порядку.
3. Кожна закрита дужка має відповідну відкриту дужку того ж типу.`,
		difficulty: 'MIDDLE' as const,
		starterCode: `function isValid(s) {
  
}`,
		solution: `function isValid(s) {
  const stack = [];
  const pairs = { '(': ')', '{': '}', '[': ']' };
  for (const char of s) {
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
			{ input: { s: '{[]}' }, expected: true },
			{ input: { s: '' }, expected: true },
			{ input: { s: '((()))' }, expected: true },
			{ input: { s: '((' }, expected: false },
			{ input: { s: '))' }, expected: false },
			{ input: { s: '([{}])' }, expected: true },
		]),
		companies: ['Google', 'Amazon', 'Microsoft', 'Facebook'],
	},
	{
		slug: 'fibonacci-number',
		title: 'Fibonacci Number',
		titleUa: 'Число Фібоначчі',
		description: `The Fibonacci numbers form a sequence, where each number is the sum of the two preceding ones, starting from 0 and 1.

Given \`n\`, calculate \`F(n)\`.

- F(0) = 0
- F(1) = 1
- F(n) = F(n - 1) + F(n - 2), for n > 1

**Example:**
\`\`\`
Input: n = 4
Output: 3
Explanation: F(4) = F(3) + F(2) = 2 + 1 = 3
\`\`\``,
		descriptionUa: `Числа Фібоначчі утворюють послідовність, де кожне число є сумою двох попередніх, починаючи з 0 та 1.

Дано \`n\`, обчисліть \`F(n)\`.`,
		difficulty: 'JUNIOR' as const,
		starterCode: `function fib(n) {
  
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
			{ input: { n: 0 }, expected: 0 },
			{ input: { n: 1 }, expected: 1 },
			{ input: { n: 2 }, expected: 1 },
			{ input: { n: 3 }, expected: 2 },
			{ input: { n: 4 }, expected: 3 },
			{ input: { n: 5 }, expected: 5 },
			{ input: { n: 6 }, expected: 8 },
			{ input: { n: 10 }, expected: 55 },
			{ input: { n: 15 }, expected: 610 },
			{ input: { n: 20 }, expected: 6765 },
		]),
		companies: ['Amazon', 'Apple'],
	},
	{
		slug: 'group-anagrams',
		title: 'Group Anagrams',
		titleUa: 'Групування Анаграм',
		description: `Given an array of strings \`strs\`, group the anagrams together. You can return the answer in any order.

An Anagram is a word formed by rearranging the letters of a different word, using all the original letters exactly once.

**Example:**
\`\`\`
Input: strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
Output: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]]
\`\`\``,
		descriptionUa: `Дано масив рядків \`strs\`, згрупуйте анаграми разом. Ви можете повернути відповідь у будь-якому порядку.

Анаграма — це слово, утворене перестановкою літер іншого слова, використовуючи всі оригінальні літери рівно один раз.`,
		difficulty: 'MIDDLE' as const,
		starterCode: `function groupAnagrams(strs) {
  
}`,
		solution: `function groupAnagrams(strs) {
  const map = new Map();
  for (const str of strs) {
    const sorted = str.split('').sort().join('');
    if (!map.has(sorted)) {
      map.set(sorted, []);
    }
    map.get(sorted).push(str);
  }
  return Array.from(map.values());
}`,
		testCases: JSON.stringify([
			{ input: { strs: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'] }, expected: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']] },
			{ input: { strs: [''] }, expected: [['']] },
			{ input: { strs: ['a'] }, expected: [['a']] },
			{ input: { strs: ['ab', 'ba'] }, expected: [['ab', 'ba']] },
			{ input: { strs: ['abc', 'cba', 'bca', 'xyz'] }, expected: [['abc', 'cba', 'bca'], ['xyz']] },
			{ input: { strs: ['listen', 'silent', 'enlist'] }, expected: [['listen', 'silent', 'enlist']] },
			{ input: { strs: ['a', 'b', 'c'] }, expected: [['a'], ['b'], ['c']] },
		]),
		companies: ['Amazon', 'Facebook', 'Google'],
	},
	{
		slug: 'flatten-array',
		title: 'Flatten Nested Array',
		titleUa: 'Розгорнути Вкладений Масив',
		description: `Write a function that flattens a nested array to a single level.

**Example:**
\`\`\`
Input: [1, [2, [3, 4], 5], 6]
Output: [1, 2, 3, 4, 5, 6]
\`\`\``,
		descriptionUa: `Напишіть функцію, яка розгортає вкладений масив до одного рівня.`,
		difficulty: 'MIDDLE' as const,
		starterCode: `function flattenArray(arr) {
  
}`,
		solution: `function flattenArray(arr) {
  const result = [];
  function flatten(item) {
    if (Array.isArray(item)) {
      for (const el of item) {
        flatten(el);
      }
    } else {
      result.push(item);
    }
  }
  flatten(arr);
  return result;
}`,
		testCases: JSON.stringify([
			{ input: { arr: [1, [2, [3, 4], 5], 6] }, expected: [1, 2, 3, 4, 5, 6] },
			{ input: { arr: [1, 2, 3] }, expected: [1, 2, 3] },
			{ input: { arr: [[[[1]]]] }, expected: [1] },
			{ input: { arr: [] }, expected: [] },
			{ input: { arr: [1, [2], [[3]], [[[4]]]] }, expected: [1, 2, 3, 4] },
			{ input: { arr: ['a', ['b', ['c']]] }, expected: ['a', 'b', 'c'] },
			{ input: { arr: [[1, 2], [3, 4], [5, 6]] }, expected: [1, 2, 3, 4, 5, 6] },
			{ input: { arr: [1] }, expected: [1] },
		]),
		companies: ['EPAM', 'GlobalLogic'],
	},
	{
		slug: 'merge-sorted-arrays',
		title: 'Merge Two Sorted Arrays',
		titleUa: 'Об\'єднати Два Відсортованих Масиви',
		description: `Given two sorted arrays \`nums1\` and \`nums2\`, merge them into a single sorted array.

**Example:**
\`\`\`
Input: nums1 = [1, 3, 5], nums2 = [2, 4, 6]
Output: [1, 2, 3, 4, 5, 6]
\`\`\``,
		descriptionUa: `Дано два відсортованих масиви \`nums1\` та \`nums2\`, об\'єднайте їх в один відсортований масив.`,
		difficulty: 'JUNIOR' as const,
		starterCode: `function mergeSortedArrays(nums1, nums2) {
  
}`,
		solution: `function mergeSortedArrays(nums1, nums2) {
  const result = [];
  let i = 0, j = 0;
  while (i < nums1.length && j < nums2.length) {
    if (nums1[i] <= nums2[j]) {
      result.push(nums1[i++]);
    } else {
      result.push(nums2[j++]);
    }
  }
  while (i < nums1.length) result.push(nums1[i++]);
  while (j < nums2.length) result.push(nums2[j++]);
  return result;
}`,
		testCases: JSON.stringify([
			{ input: { nums1: [1, 3, 5], nums2: [2, 4, 6] }, expected: [1, 2, 3, 4, 5, 6] },
			{ input: { nums1: [1, 2, 3], nums2: [4, 5, 6] }, expected: [1, 2, 3, 4, 5, 6] },
			{ input: { nums1: [], nums2: [1, 2, 3] }, expected: [1, 2, 3] },
			{ input: { nums1: [1, 2, 3], nums2: [] }, expected: [1, 2, 3] },
			{ input: { nums1: [], nums2: [] }, expected: [] },
			{ input: { nums1: [1], nums2: [2] }, expected: [1, 2] },
			{ input: { nums1: [1, 1, 1], nums2: [2, 2, 2] }, expected: [1, 1, 1, 2, 2, 2] },
			{ input: { nums1: [-5, 0, 5], nums2: [-3, 0, 3] }, expected: [-5, -3, 0, 0, 3, 5] },
		]),
		companies: ['Google', 'Facebook'],
	},
	{
		slug: 'count-unique-values',
		title: 'Count Unique Values',
		titleUa: 'Підрахувати Унікальні Значення',
		description: `Write a function that counts the number of unique values in a sorted array.

**Example:**
\`\`\`
Input: [1, 1, 1, 2, 3, 3, 4, 5, 5, 5]
Output: 5
\`\`\``,
		descriptionUa: `Напишіть функцію, яка підраховує кількість унікальних значень у відсортованому масиві.`,
		difficulty: 'JUNIOR' as const,
		starterCode: `function countUniqueValues(arr) {
  
}`,
		solution: `function countUniqueValues(arr) {
  if (arr.length === 0) return 0;
  let count = 1;
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== arr[i - 1]) {
      count++;
    }
  }
  return count;
}`,
		testCases: JSON.stringify([
			{ input: { arr: [1, 1, 1, 2, 3, 3, 4, 5, 5, 5] }, expected: 5 },
			{ input: { arr: [1, 2, 3, 4, 5] }, expected: 5 },
			{ input: { arr: [1, 1, 1, 1, 1] }, expected: 1 },
			{ input: { arr: [] }, expected: 0 },
			{ input: { arr: [-2, -1, 0, 1, 2] }, expected: 5 },
			{ input: { arr: [1] }, expected: 1 },
			{ input: { arr: [1, 1] }, expected: 1 },
			{ input: { arr: [1, 2] }, expected: 2 },
		]),
		companies: ['SoftServe', 'Ciklum'],
	},
	{
		slug: 'max-subarray-sum',
		title: 'Maximum Subarray Sum',
		titleUa: 'Максимальна Сума Підмасиву',
		description: `Given an array of integers and a number \`n\`, find the maximum sum of \`n\` consecutive elements in the array.

**Example:**
\`\`\`
Input: arr = [1, 2, 5, 2, 8, 1, 5], n = 2
Output: 10
Explanation: 2 + 8 = 10
\`\`\``,
		descriptionUa: `Дано масив цілих чисел та число \`n\`, знайдіть максимальну суму \`n\` послідовних елементів у масиві.`,
		difficulty: 'MIDDLE' as const,
		starterCode: `function maxSubarraySum(arr, n) {
  
}`,
		solution: `function maxSubarraySum(arr, n) {
  if (arr.length < n) return null;
  let maxSum = 0;
  for (let i = 0; i < n; i++) {
    maxSum += arr[i];
  }
  let currentSum = maxSum;
  for (let i = n; i < arr.length; i++) {
    currentSum = currentSum - arr[i - n] + arr[i];
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
		testCases: JSON.stringify([
			{ input: { arr: [1, 2, 5, 2, 8, 1, 5], n: 2 }, expected: 10 },
			{ input: { arr: [1, 2, 5, 2, 8, 1, 5], n: 4 }, expected: 17 },
			{ input: { arr: [4, 2, 1, 6], n: 1 }, expected: 6 },
			{ input: { arr: [4, 2, 1, 6, 2], n: 4 }, expected: 13 },
			{ input: { arr: [], n: 4 }, expected: null },
			{ input: { arr: [1, 2, 3], n: 5 }, expected: null },
			{ input: { arr: [100, 200, 300, 400], n: 2 }, expected: 700 },
			{ input: { arr: [-1, -2, -3, -4], n: 2 }, expected: -3 },
		]),
		companies: ['N-iX', 'Luxoft'],
	},
	{
		slug: 'is-palindrome',
		title: 'Valid Palindrome',
		titleUa: 'Валідний Паліндром',
		description: `Given a string, determine if it is a palindrome, considering only alphanumeric characters and ignoring cases.

**Example:**
\`\`\`
Input: "A man, a plan, a canal: Panama"
Output: true
\`\`\``,
		descriptionUa: `Дано рядок, визначте, чи є він паліндромом, враховуючи лише буквено-цифрові символи та ігноруючи регістр.`,
		difficulty: 'JUNIOR' as const,
		starterCode: `function isPalindrome(s) {
  
}`,
		solution: `function isPalindrome(s) {
  const cleaned = s.toLowerCase().replace(/[^a-z0-9]/g, '');
  let left = 0;
  let right = cleaned.length - 1;
  while (left < right) {
    if (cleaned[left] !== cleaned[right]) {
      return false;
    }
    left++;
    right--;
  }
  return true;
}`,
		testCases: JSON.stringify([
			{ input: { s: 'A man, a plan, a canal: Panama' }, expected: true },
			{ input: { s: 'race a car' }, expected: false },
			{ input: { s: '' }, expected: true },
			{ input: { s: ' ' }, expected: true },
			{ input: { s: 'a' }, expected: true },
			{ input: { s: 'ab' }, expected: false },
			{ input: { s: 'aba' }, expected: true },
			{ input: { s: 'Was it a car or a cat I saw?' }, expected: true },
			{ input: { s: '12321' }, expected: true },
			{ input: { s: '12345' }, expected: false },
		]),
		companies: ['Facebook', 'Microsoft'],
	},
]

async function fixProblems() {
	console.log('🔧 Starting to fix all problems...\n')

	try {
		for (const problemData of fixedProblems) {
			console.log(`📝 Processing: ${problemData.title}`)

			const [existing] = await db
				.select()
				.from(schema.problems)
				.where(eq(schema.problems.slug, problemData.slug))
				.limit(1)

			if (existing) {
				await db
					.update(schema.problems)
					.set({
						title: problemData.title,
						titleUa: problemData.titleUa,
						description: problemData.description,
						descriptionUa: problemData.descriptionUa,
						difficulty: problemData.difficulty,
						starterCode: problemData.starterCode,
						solution: problemData.solution,
						testCases: problemData.testCases,
					})
					.where(eq(schema.problems.slug, problemData.slug))
				console.log(`  ✅ Updated: ${problemData.slug}`)
			} else {
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

				console.log(`  ✅ Created: ${problem.slug}`)

				if (problemData.companies) {
					for (const companyName of problemData.companies) {
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
						}

						await db
							.insert(schema.problemsToCompanies)
							.values({
								problemId: problem.id,
								companyId: company.id,
							})
							.onConflictDoNothing()
					}
				}
			}
		}

		console.log('\n========================================')
		console.log('✅ All problems fixed!')
		console.log(`   Total: ${fixedProblems.length} problems`)
		console.log('========================================\n')
	} catch (error) {
		console.error('❌ Error:', error)
		throw error
	} finally {
		await client.end()
	}
}

fixProblems()
