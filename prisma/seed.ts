import { PrismaClient } from '@prisma/client'
import * as argon2 from 'argon2'

const prisma = new PrismaClient()

async function main() {
	console.log('🌱 Starting seed...')

	// Create admin account
	const hashedPassword = await argon2.hash('Admin123!')
	
	const admin = await prisma.account.upsert({
		where: { email: 'admin@itlead.com' },
		update: {},
		create: {
			email: 'admin@itlead.com',
			password: hashedPassword,
			name: 'Admin',
			emailVerified: true,
			role: 'ADMIN',
		},
	})

	console.log('✅ Admin account created:', admin.email)

	// Create categories
	const categories = await Promise.all([
		prisma.category.upsert({
			where: { slug: 'javascript' },
			update: {},
			create: {
				slug: 'javascript',
				nameEn: 'JavaScript',
				nameUa: 'JavaScript',
				description: 'Core JavaScript concepts, ES6+, async programming, and more',
				icon: '🟨',
				color: '#F7DF1E',
				order: 1,
			},
		}),
		prisma.category.upsert({
			where: { slug: 'html-and-css' },
			update: {},
			create: {
				slug: 'html-and-css',
				nameEn: 'HTML & CSS',
				nameUa: 'HTML & CSS',
				description: 'Web fundamentals, layouts, responsive design, and accessibility',
				icon: '🎨',
				color: '#E34F26',
				order: 2,
			},
		}),
		prisma.category.upsert({
			where: { slug: 'typescript' },
			update: {},
			create: {
				slug: 'typescript',
				nameEn: 'TypeScript',
				nameUa: 'TypeScript',
				description: 'Type system, generics, utility types, and best practices',
				icon: '💙',
				color: '#3178C6',
				order: 3,
			},
		}),
		prisma.category.upsert({
			where: { slug: 'react' },
			update: {},
			create: {
				slug: 'react',
				nameEn: 'React',
				nameUa: 'React',
				description: 'Components, hooks, state management, and React ecosystem',
				icon: '⚛️',
				color: '#61DAFB',
				order: 4,
			},
		}),
		prisma.category.upsert({
			where: { slug: 'vue' },
			update: {},
			create: {
				slug: 'vue',
				nameEn: 'Vue.js',
				nameUa: 'Vue.js',
				description: 'Vue 3, Composition API, Vuex, and Vue Router',
				icon: '💚',
				color: '#4FC08D',
				order: 5,
			},
		}),
		prisma.category.upsert({
			where: { slug: 'angular' },
			update: {},
			create: {
				slug: 'angular',
				nameEn: 'Angular',
				nameUa: 'Angular',
				description: 'Components, services, RxJS, and Angular ecosystem',
				icon: '🔴',
				color: '#DD0031',
				order: 6,
			},
		}),
		prisma.category.upsert({
			where: { slug: 'redux' },
			update: {},
			create: {
				slug: 'redux',
				nameEn: 'Redux',
				nameUa: 'Redux',
				description: 'State management with Redux, Redux Toolkit, and middleware',
				icon: '🟣',
				color: '#764ABC',
				order: 7,
			},
		}),
		prisma.category.upsert({
			where: { slug: 'general' },
			update: {},
			create: {
				slug: 'general',
				nameEn: 'General Questions',
				nameUa: 'Загальні питання',
				description: 'Browser APIs, HTTP, security, and web fundamentals',
				icon: '🌐',
				color: '#6B7280',
				order: 8,
			},
		}),
		prisma.category.upsert({
			where: { slug: 'architecture' },
			update: {},
			create: {
				slug: 'architecture',
				nameEn: 'Architecture',
				nameUa: 'Архітектура',
				description: 'Design patterns, SOLID principles, and system design',
				icon: '🏗️',
				color: '#8B5CF6',
				order: 9,
			},
		}),
		prisma.category.upsert({
			where: { slug: 'principles' },
			update: {},
			create: {
				slug: 'principles',
				nameEn: 'Principles',
				nameUa: 'Принципи',
				description: 'SOLID, DRY, KISS, and other programming principles',
				icon: '📐',
				color: '#F59E0B',
				order: 10,
			},
		}),
		prisma.category.upsert({
			where: { slug: 'patterns' },
			update: {},
			create: {
				slug: 'patterns',
				nameEn: 'Patterns',
				nameUa: 'Паттерни',
				description: 'Design patterns, creational, structural, and behavioral',
				icon: '🧩',
				color: '#EC4899',
				order: 11,
			},
		}),
	])

	console.log('✅ Categories created:', categories.length)

	// Create some sample questions
	const jsCategory = categories[0]
	const reactCategory = categories[3]

	const questions = await Promise.all([
		prisma.question.upsert({
			where: { slug: 'what-is-closure' },
			update: {},
			create: {
				slug: 'what-is-closure',
				titleEn: 'What is a closure in JavaScript?',
				titleUa: 'Що таке замикання в JavaScript?',
				descriptionEn: 'Learn about closures in JavaScript',
				descriptionUa: 'Дізнайтесь про замикання в JavaScript',
				contentMarkdown: `A closure is a fundamental concept in JavaScript that allows a function to access variables from its outer (enclosing) scope even after the outer function has returned.

## Key Points

- A closure is created every time a function is created
- The inner function maintains a reference to its lexical environment
- Closures enable data privacy and encapsulation

## Example

A **closure** is a function that has access to variables from its outer (enclosing) function's scope, even after the outer function has returned.

## Example

\`\`\`javascript
function createCounter() {
  let count = 0;
  
  return function() {
    count++;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 1
console.log(counter()); // 2
console.log(counter()); // 3
\`\`\`

In this example, the inner function maintains access to the \`count\` variable even after \`createCounter\` has finished executing.

## Common Use Cases

1. **Data privacy** - Creating private variables
2. **Function factories** - Creating specialized functions
3. **Event handlers** - Maintaining state in callbacks
4. **Module pattern** - Encapsulating code`,
				difficulty: 'MEDIUM',
				categoryId: jsCategory.id,
				order: 1,
			},
		}),
		prisma.question.upsert({
			where: { slug: 'what-is-event-loop' },
			update: {},
			create: {
				slug: 'what-is-event-loop',
				titleEn: 'Explain the Event Loop in JavaScript',
				titleUa: 'Поясніть Event Loop в JavaScript',
				descriptionEn: 'Learn about the Event Loop',
				descriptionUa: 'Дізнайтесь про Event Loop',
				contentMarkdown: `The event loop is JavaScript's mechanism for handling asynchronous operations in a single-threaded environment.

The **Event Loop** is a mechanism that allows JavaScript to perform non-blocking operations despite being single-threaded.

## Components

1. **Call Stack** - Where functions are executed
2. **Web APIs** - Browser-provided APIs (setTimeout, fetch, etc.)
3. **Callback Queue (Task Queue)** - Queue for callbacks
4. **Microtask Queue** - Higher priority queue (Promises)

## How it Works

\`\`\`javascript
console.log('1');

setTimeout(() => {
  console.log('2');
}, 0);

Promise.resolve().then(() => {
  console.log('3');
});

console.log('4');

// Output: 1, 4, 3, 2
\`\`\`

The event loop continuously checks if the call stack is empty, then processes microtasks first, followed by macrotasks.`,
				difficulty: 'HARD',
				categoryId: jsCategory.id,
				order: 2,
			},
		}),
		prisma.question.upsert({
			where: { slug: 'what-is-react' },
			update: {},
			create: {
				slug: 'what-is-react',
				titleEn: 'What is React and why is it needed?',
				titleUa: 'Що таке React і навіщо він потрібен?',
				descriptionEn: 'Learn about React library',
				descriptionUa: 'Дізнайтесь про бібліотеку React',
				contentMarkdown: `**React** is a declarative, component-based JavaScript library for building user interfaces.

React is a JavaScript library for building user interfaces. Understanding why it exists helps appreciate its design decisions.

## Why React?

1. **Declarative** - Describe what you want, not how to do it
2. **Component-Based** - Build encapsulated components
3. **Virtual DOM** - Efficient updates through diffing
4. **Unidirectional Data Flow** - Predictable state management

## Key Concepts

- **JSX** - Syntax extension for writing UI
- **Components** - Reusable building blocks
- **Props** - Data passed to components
- **State** - Internal component data
- **Hooks** - Functions to use React features

## Example

\`\`\`jsx
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

function App() {
  return <Welcome name="World" />;
}
\`\`\``,
				difficulty: 'EASY',
				categoryId: reactCategory.id,
				order: 1,
			},
		}),
		prisma.question.upsert({
			where: { slug: 'virtual-dom' },
			update: {},
			create: {
				slug: 'virtual-dom',
				titleEn: 'What is Virtual DOM and how does it work?',
				titleUa: 'Що таке Віртуальний DOM і як він працює?',
				descriptionEn: 'Learn about the Virtual DOM',
				descriptionUa: 'Дізнайтесь про Віртуальний DOM',
				contentMarkdown: `The **Virtual DOM** is a lightweight JavaScript representation of the actual DOM. React uses it to optimize rendering performance.

The Virtual DOM is one of React's key innovations for efficient rendering.

## How it Works

1. **Render** - React creates a virtual DOM tree
2. **Diff** - Compares new tree with previous one
3. **Patch** - Updates only changed parts in real DOM

## Benefits

- **Performance** - Minimizes expensive DOM operations
- **Declarative** - Write UI as if re-rendering everything
- **Cross-platform** - Same concept works for React Native

## Example Flow

\`\`\`javascript
// State change triggers re-render
setState({ count: count + 1 })

// React creates new Virtual DOM
// Compares with previous version
// Finds minimal changes needed
// Updates only affected DOM nodes
\`\`\``,
				difficulty: 'MEDIUM',
				categoryId: reactCategory.id,
				order: 2,
			},
		}),
	])

	console.log('✅ Questions created:', questions.length)

	// Create companies
	const companies = await Promise.all([
		prisma.company.upsert({
			where: { name: 'EPAM' },
			update: {},
			create: { name: 'EPAM' },
		}),
		prisma.company.upsert({
			where: { name: 'SoftServe' },
			update: {},
			create: { name: 'SoftServe' },
		}),
		prisma.company.upsert({
			where: { name: 'GlobalLogic' },
			update: {},
			create: { name: 'GlobalLogic' },
		}),
		prisma.company.upsert({
			where: { name: 'Luxoft' },
			update: {},
			create: { name: 'Luxoft' },
		}),
		prisma.company.upsert({
			where: { name: 'Ciklum' },
			update: {},
			create: { name: 'Ciklum' },
		}),
		prisma.company.upsert({
			where: { name: 'N-iX' },
			update: {},
			create: { name: 'N-iX' },
		}),
		prisma.company.upsert({
			where: { name: 'Grammarly' },
			update: {},
			create: { name: 'Grammarly' },
		}),
	])

	console.log('✅ Companies created:', companies.length)

	// Create sample problems
	const problems = await Promise.all([
		prisma.problem.upsert({
			where: { slug: 'implement-usestate' },
			update: {},
			create: {
				slug: 'implement-usestate',
				title: 'Implement a custom useState hook',  // Problems use single title field
				description: `Create a simplified version of React's useState hook that manages state and triggers re-renders.

## Requirements

- Accept an initial value
- Return an array with current state and setter function
- Setter should trigger a re-render (for this exercise, just update the value)

## Example

\`\`\`javascript
const [count, setCount] = useState(0);
setCount(1);
console.log(count); // 1
\`\`\``,
				difficulty: 'MEDIUM',
				starterCode: `function useState(initialValue) {
  // Your code here
}`,
				solution: `let state;

function useState(initialValue) {
  state = state ?? initialValue;
  
  const setState = (newValue) => {
    state = typeof newValue === 'function' ? newValue(state) : newValue;
  };
  
  return [state, setState];
}`,
				testCases: JSON.stringify([
					{ input: [0], expected: [0, 'function'] },
					{ input: ['hello'], expected: ['hello', 'function'] },
				]),
				companies: {
					connect: [{ id: companies[0].id }, { id: companies[1].id }],
				},
			},
		}),
		prisma.problem.upsert({
			where: { slug: 'debounce-function' },
			update: {},
			create: {
				slug: 'debounce-function',
				title: 'Implement a debounce function',  // Problems use single title field
				description: `Create a debounce function that delays invoking a function until after a certain amount of time has elapsed since the last time it was invoked.

## Requirements

- Accept a function and delay in milliseconds
- Return a debounced version of the function
- Cancel previous timer on each call

## Example

\`\`\`javascript
const debouncedFn = debounce(() => console.log('called'), 300);
debouncedFn(); // waits 300ms
debouncedFn(); // resets timer, waits another 300ms
\`\`\``,
				difficulty: 'MEDIUM',
				starterCode: `function debounce(fn, delay) {
  // Your code here
}`,
				solution: `function debounce(fn, delay) {
  let timeoutId;
  
  return function(...args) {
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}`,
				testCases: JSON.stringify([
					{ description: 'Should delay function call' },
					{ description: 'Should cancel previous call on new invocation' },
				]),
				companies: {
					connect: [{ id: companies[2].id }, { id: companies[3].id }],
				},
			},
		}),
		prisma.problem.upsert({
			where: { slug: 'flatten-array' },
			update: {},
			create: {
				slug: 'flatten-array',
				title: 'Flatten a nested array',  // Problems use single title field
				description: `Write a function that flattens a nested array to a specified depth.

## Requirements

- Accept an array and optional depth (default: 1)
- Return a new flattened array
- Don't modify the original array

## Example

\`\`\`javascript
flatten([1, [2, [3, [4]]]], 1); // [1, 2, [3, [4]]]
flatten([1, [2, [3, [4]]]], 2); // [1, 2, 3, [4]]
flatten([1, [2, [3, [4]]]], Infinity); // [1, 2, 3, 4]
\`\`\``,
				difficulty: 'EASY',
				starterCode: `function flatten(arr, depth = 1) {
  // Your code here
}`,
				solution: `function flatten(arr, depth = 1) {
  return arr.reduce((acc, val) => {
    if (Array.isArray(val) && depth > 0) {
      acc.push(...flatten(val, depth - 1));
    } else {
      acc.push(val);
    }
    return acc;
  }, []);
}`,
				testCases: JSON.stringify([
					{ input: [[1, [2, [3]]], 1], expected: [1, 2, [3]] },
					{ input: [[1, [2, [3]]], Infinity], expected: [1, 2, 3] },
				]),
				companies: {
					connect: [{ id: companies[4].id }, { id: companies[5].id }],
				},
			},
		}),
	])

	console.log('✅ Problems created:', problems.length)

	console.log('✅ Seed completed successfully!')
}

main()
	.catch((e) => {
		console.error('❌ Seed failed:', e)
		process.exit(1)
	})
	.finally(async () => {
		await prisma.$disconnect()
	})
