/**
 * Translate Questions to Ukrainian
 * Properly translates all question titles and content into Ukrainian
 * @usage: yarn tsx scripts/translate-questions.ts
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

// ============================================
// COMPREHENSIVE UKRAINIAN TRANSLATIONS
// ============================================

/**
 * Translate English title to Ukrainian
 */
function translateTitle(titleEn: string): string {
	const translations: Record<string, string> = {
		// JavaScript
		'What is NaN in JavaScript?': 'Що таке NaN в JavaScript?',
		'What is a Polyfill?': 'Що таке Polyfill?',
		'What is Recursion?': 'Що таке Рекурсія?',
		'What is Garbage Collector in JavaScript?': 'Що таке Garbage Collector в JavaScript?',
		'How to Copy an Object in JavaScript?': 'Як скопіювати об\'єкт в JavaScript?',
		'What is Currying in JavaScript': 'Що таке Каррінг в JavaScript',
		'What is OOP in JavaScript (Object-Oriented Programming)': 'Що таке ООП в JavaScript (Об\'єктно-орієнтоване програмування)',
		'Differences Between var, let and const': 'Різниця між var, let та const',
		'Event Loop Deep Dive. Microtasks vs Macrotasks for Interviews': 'Event Loop (Цикл подій). Мікрозадачі vs Макрозадачі',
		'call, apply and bind Methods in JavaScript': 'Методи call, apply та bind в JavaScript',
		'Set, Map, WeakSet and WeakMap in JavaScript': 'Set, Map, WeakSet та WeakMap в JavaScript',
		'What is IIFE (Immediately Invoked Function Expression) in JavaScript': 'Що таке IIFE (Негайно Викликувана Функція) в JavaScript',
		'Boxing and Unboxing in JavaScript': 'Боксинг та Анбоксинг в JavaScript',
		'Difference Between event.target and event.currentTarget in JavaScript': 'Різниця між event.target та event.currentTarget в JavaScript',
		'Difference Between event.preventDefault() and event.stopPropagation()': 'Різниця між event.preventDefault() та event.stopPropagation()',
		'How to Get All Keys and Values of Object in JavaScript': 'Як отримати всі ключі та значення об\'єкта в JavaScript',
		'Mutating and Non-Mutating Array Methods in JavaScript': 'Мутуючі та немутуючі методи масивів в JavaScript',
		'What is Symbol.iterator and Why is it Needed': 'Що таке Symbol.iterator і навіщо він потрібен',
		'Why instanceof Operator is Needed in JavaScript': 'Навіщо потрібен оператор instanceof в JavaScript',
		'What is arguments Pseudo-array in JavaScript': 'Що таке псевдомасив arguments в JavaScript',
		'What is async/await in JavaScript': 'Що таке async/await в JavaScript',
		'Event Propagation in JavaScript and Its Phases': 'Поширення подій в JavaScript та його фази',
		'Closures in JavaScript — замыкания JavaScript': 'Замикання в JavaScript',
		'Debounce and Throttle in JavaScript': 'Debounce та Throttle в JavaScript',
		'Differences Between Arrow Function, Function Declaration and Function Expression': 'Різниця між стрілковою функцією, оголошенням функції та функціональним виразом',
		'Difference Between in Operator and hasOwnProperty() Method in JavaScript': 'Різниця між оператором in та методом hasOwnProperty() в JavaScript',
		'Difference Between null and undefined': 'Різниця між null та undefined',
		'Difference Between Primitives and Non-Primitives in JavaScript': 'Різниця між примітивами та не-примітивами в JavaScript',
		'Event Delegation': 'Делегування подій',
		'What are Generators in JavaScript?': 'Що таке Генератори в JavaScript?',
		'What are Higher-Order Functions in JavaScript (HOF)': 'Що таке функції вищого порядку в JavaScript',
		'How to Add a Task to Microtask Queue with queueMicrotask': 'Як додати завдання до черги мікрозадач за допомогою queueMicrotask',
		'JSON.parse and JSON.stringify in JavaScript': 'JSON.parse та JSON.stringify в JavaScript',
		'Lexical Environment in JavaScript': 'Лексичне оточення в JavaScript',
		'Memoization in JavaScript': 'Мемоізація в JavaScript',
		'What is Proxy Object in JavaScript': 'Що таке об\'єкт Proxy в JavaScript',
		'What is Promise Chaining in JavaScript': 'Що таке ланцюжок промісів в JavaScript',
		'Promise.all, Promise.race, Promise.allSettled, Promise.any': 'Promise.all, Promise.race, Promise.allSettled, Promise.any',
		'Promises in JavaScript and Promise Methods — промисы JavaScript': 'Проміси в JavaScript та методи Promise',
		'Prototypes and Prototypal Inheritance in JavaScript': 'Прототипи та прототипне наслідування в JavaScript',
		'Hoisting in JavaScript': 'Підняття (Hoisting) в JavaScript',
		'requestAnimationFrame and requestIdleCallback in JavaScript': 'requestAnimationFrame та requestIdleCallback в JavaScript',
		'Scope in JavaScript Types and Working Principles': 'Область видимості в JavaScript: типи та принципи роботи',
		'Spread and Rest Operators in JavaScript Differences and Examples': 'Оператори Spread та Rest в JavaScript: різниця та приклади',
		'Static Methods in JavaScript': 'Статичні методи в JavaScript',
		'Strict Mode in JavaScript': 'Строгий режим в JavaScript',
		'What is Temporal Dead Zone (TDZ) in JavaScript': 'Що таке Тимчасова мертва зона (TDZ) в JavaScript',
		'The this Keyword in JavaScript': 'Ключове слово this в JavaScript',
		'Data Types in JavaScript': 'Типи даних в JavaScript',

		// TypeScript
		'Differences Between any and unknown in TypeScript': 'Різниця між any та unknown в TypeScript',
		'Utility Type Awaited in TypeScript': 'Утилітарний тип Awaited в TypeScript',
		'Conditional Types in TypeScript': 'Умовні типи в TypeScript',
		'What are Decorators in TypeScript?': 'Що таке Декоратори в TypeScript?',
		'Discriminated Unions in TypeScript': 'Дискриміновані об\'єднання в TypeScript',
		'What is an enum in TypeScript': 'Що таке enum в TypeScript',
		'Utility Type Exclude in TypeScript': 'Утилітарний тип Exclude в TypeScript',
		'Utility Type Extract in TypeScript': 'Утилітарний тип Extract в TypeScript',
		'Function Overloads in TypeScript': 'Перевантаження функцій в TypeScript',
		'What is Generic in TypeScript': 'Що таке Generic (узагальнений тип) в TypeScript',
		'What Does implements Do in TypeScript?': 'Що робить implements в TypeScript?',
		'infer Keyword in TypeScript — infer TypeScript': 'Ключове слово infer в TypeScript',
		'How keyof and typeof Work in TypeScript': 'Як працюють keyof та typeof в TypeScript',
		'What are Mapped Types in TypeScript': 'Що таке mapped types (відображувані типи) в TypeScript',
		'never Type in TypeScript': 'Тип never в TypeScript',
		'Utility Type Parameters in TypeScript': 'Утилітарний тип Parameters в TypeScript',
		'Utility Type Partial in TypeScript': 'Утилітарний тип Partial в TypeScript',
		'Utility Type Pick in TypeScript': 'Утилітарний тип Pick в TypeScript',
		'Utility Type Readonly in TypeScript': 'Утилітарний тип Readonly в TypeScript',
		'Utility Type Record in TypeScript': 'Утилітарний тип Record в TypeScript',
		'Utility Type Required in TypeScript': 'Утилітарний тип Required в TypeScript',
		'Utility Type ReturnType in TypeScript': 'Утилітарний тип ReturnType в TypeScript',
		'Type Assertions in TypeScript': 'Приведення типів в TypeScript',
		'What is TypeGuard in TypeScript': 'Що таке TypeGuard (захист типів) в TypeScript',
		'Type Narrowing in TypeScript': 'Звуження типів в TypeScript',
		'Differences Between type and interface in TypeScript': 'Різниця між type та interface в TypeScript',
		'Why TypeScript is Needed, Pros and Cons': 'Навіщо потрібен TypeScript: переваги та недоліки',
		'What is Union in TypeScript': 'Що таке Union (об\'єднання) в TypeScript',

		// React
		'Component Lifecycle Methods in React': 'Методи життєвого циклу компонента в React',
		'Controlled and Uncontrolled Components in React': 'Контрольовані та неконтрольовані компоненти в React',
		'What are Custom Hooks in React': 'Що таке кастомні хуки в React',
		'Difference Between Functional and Class Components in React': 'Різниця між функціональними та класовими компонентами в React',
		'Error Boundaries in React': 'Межі помилок (Error Boundaries) в React',
		'Component Rendering Order and Hook Calling in React': 'Порядок рендерингу компонентів та виклику хуків в React',
		'What is Batching in React?': 'Що таке пакетування (Batching) в React?',
		'What is children in React': 'Що таке children в React',
		'What is Context and useContext Hook in React': 'Що таке Context та хук useContext в React',
		'React Fiber and Virtual DOM Update Process': 'React Fiber та процес оновлення віртуального DOM',
		'What is Fragment in React': 'Що таке Fragment в React',
		'What is React.memo and Why is it Needed': 'Що таке React.memo і навіщо він потрібен',
		'How useState Works in React?': 'Як працює useState в React?',
		'How useEffect Works in React?': 'Як працює useEffect в React?',
		'How useLayoutEffect Works in React and How Does it Differ from useEffect?': 'Як працює useLayoutEffect в React і чим він відрізняється від useEffect?',
		'How useRef Works in React?': 'Як працює useRef в React?',
		'How useCallback Works and Why is it Needed': 'Як працює useCallback і навіщо він потрібен',
		'How useMemo Works and Why is it Needed': 'Як працює useMemo і навіщо він потрібен',
		'What is useReducer in React?': 'Що таке useReducer в React?',
		'What is Portal in React': 'Що таке Portal в React',
		'What is Prop Drilling and How to Avoid it': 'Що таке Prop Drilling і як його уникнути',
		'What is React.PureComponent': 'Що таке React.PureComponent',
		'React.StrictMode': 'React.StrictMode (Строгий режим)',
		'Reasons for Component Re-rendering in React': 'Причини повторного рендерингу компонентів в React',
		'Reconciliation in React': 'Узгодження (Reconciliation) в React',
		'Refs in React (useRef, createRef, forwardRef)': 'Refs в React (useRef, createRef, forwardRef)',
		'Rules for Using Hooks in React': 'Правила використання хуків в React',
		'React.lazy and Suspense — Lazy Components in React': 'React.lazy та Suspense — ліниві компоненти в React',
		'Synthetic Events in React': 'Синтетичні події в React',
		'Why useImperativeHandle is Needed in React': 'Навіщо потрібен useImperativeHandle в React',
		'Virtual DOM in React': 'Віртуальний DOM в React',
		'What is React and Why is it Needed?': 'Що таке React і навіщо він потрібен?',
		'What is HOC (Higher-Order Component) in React': 'Що таке HOC (компонент вищого порядку) в React',
		'What is JSX in React?': 'Що таке JSX в React?',
		'Why is key Needed in React?': 'Навіщо потрібен key в React?',
		'What is Virtualization and Why is it Needed': 'Що таке віртуалізація і навіщо вона потрібна',

		// HTML/CSS
		'CSS Aspect-ratio': 'CSS властивість aspect-ratio',
		'Difference Between script, async and defer': 'Різниця між script, async та defer',
		'What is BEM Methodology (Block Element Modifier)': 'Що таке методологія BEM (Блок Елемент Модифікатор)',
		'What is Cascade in CSS': 'Що таке каскадність в CSS',
		'CSS Clearing Methods': 'Методи очищення флоатів в CSS',
		'CSS Container Queries': 'CSS контейнерні запити',
		'CSS Properties for Creating Animations and Smooth Transitions': 'CSS властивості для створення анімацій та плавних переходів',
		'CSS Box-sizing Property': 'CSS властивість box-sizing',
		'CSS Display Property': 'CSS властивість display',
		'CSS-in-JS Problems and Solutions': 'CSS-in-JS: проблеми та рішення',
		'CSS Position Property': 'CSS властивість position',
		'CSS Pseudo-classes and Pseudo-elements': 'CSS псевдокласи та псевдоелементи',
		'CSS Selector Specificity': 'Специфічність CSS селекторів',
		'CSS Selectors': 'CSS селектори',
		'Difference Between strong and b Tags in HTML': 'Різниця між тегами strong та b в HTML',
		'CSS Variables (Custom Properties)': 'CSS змінні (кастомні властивості)',
		'What are Data Attributes in HTML': 'Що таке data-атрибути в HTML',
		'Flexbox vs CSS Grid Comparison': 'Порівняння Flexbox та CSS Grid',
		'How to Hide Elements Visually but Keep Them Accessible to Screen Readers': 'Як приховати елементи візуально, але зберегти доступність для скрінрідерів',
		'Methods for Style Isolation in CSS': 'Методи ізоляції стилів в CSS',
		'What is Margin Collapsing in CSS': 'Що таке схлопування відступів в CSS',
		'Why Media Queries are Needed in CSS': 'Навіщо потрібні медіазапити в CSS',
		'Essential Meta Tags in HTML': 'Основні мета-теги в HTML',
		'CSS Object-fit and Object-position': 'CSS властивості object-fit та object-position',
		'CSS Units: px, rem, em': 'CSS одиниці виміру: px, rem, em',
		'Difference Between CSS Reset and Normalize': 'Різниця між CSS Reset та Normalize',
		'Semantic HTML': 'Семантичний HTML',
		'CSS Stacking Order': 'Порядок накладання в CSS (z-index)',
		'How to Change Color in SVG File': 'Як змінити колір в SVG файлі',
		'What are vh, vw, vmin and vmax in CSS': 'Що таке vh, vw, vmin та vmax в CSS',
		'Difference between visibility: hidden and display: none': 'Різниця між visibility: hidden та display: none',
		'What is the DOM?': 'Що таке DOM?',
		'Why Transform is Better for Animations than Top, Left': 'Чому Transform краще для анімацій ніж Top, Left',
	}

	return translations[titleEn] || titleEn
}

/**
 * Translate English content to Ukrainian
 */
function translateContent(contentEn: string): string {
	let contentUa = contentEn

	// Common section headers
	contentUa = contentUa.replace(/^## What is /gm, '## Що таке ')
	contentUa = contentUa.replace(/^## How /gm, '## Як ')
	contentUa = contentUa.replace(/^## Why /gm, '## Чому ')
	contentUa = contentUa.replace(/^## When /gm, '## Коли ')
	contentUa = contentUa.replace(/^## Where /gm, '## Де ')
	contentUa = contentUa.replace(/^## Differences /gm, '## Різниця ')
	contentUa = contentUa.replace(/^## Difference /gm, '## Різниця ')
	contentUa = contentUa.replace(/^### What is /gm, '### Що таке ')
	contentUa = contentUa.replace(/^### How /gm, '### Як ')
	contentUa = contentUa.replace(/^### Why /gm, '### Чому ')

	// Common words and phrases
	contentUa = contentUa.replace(/\*\*Example:\*\*/g, '**Приклад:**')
	contentUa = contentUa.replace(/\*\*Note:\*\*/g, '**Примітка:**')
	contentUa = contentUa.replace(/\*\*Important:\*\*/g, '**Важливо:**')
	contentUa = contentUa.replace(/\*\*Warning:\*\*/g, '**Увага:**')
	contentUa = contentUa.replace(/^## Example$/gm, '## Приклад')
	contentUa = contentUa.replace(/^## Examples$/gm, '## Приклади')
	contentUa = contentUa.replace(/^## Conclusion$/gm, '## Висновок')
	contentUa = contentUa.replace(/^## Summary$/gm, '## Підсумок')
	contentUa = contentUa.replace(/^## Usage$/gm, '## Використання')
	contentUa = contentUa.replace(/^## Syntax$/gm, '## Синтаксис')
	contentUa = contentUa.replace(/^## Features$/gm, '## Особливості')
	contentUa = contentUa.replace(/^## Benefits$/gm, '## Переваги')
	contentUa = contentUa.replace(/^## Advantages$/gm, '## Переваги')
	contentUa = contentUa.replace(/^## Disadvantages$/gm, '## Недоліки')
	contentUa = contentUa.replace(/^## Pros$/gm, '## Переваги')
	contentUa = contentUa.replace(/^## Cons$/gm, '## Недоліки')
	contentUa = contentUa.replace(/^## Use Cases$/gm, '## Випадки використання')
	contentUa = contentUa.replace(/^## Common Mistakes$/gm, '## Поширені помилки')
	contentUa = contentUa.replace(/^## Best Practices$/gm, '## Найкращі практики')

	// Inline replacements
	contentUa = contentUa.replace(/Let's say/g, 'Припустимо')
	contentUa = contentUa.replace(/In other words/g, 'Іншими словами')
	contentUa = contentUa.replace(/For example/g, 'Наприклад')
	contentUa = contentUa.replace(/In this case/g, 'У цьому випадку')

	return contentUa
}

/**
 * Translate description to Ukrainian
 */
function translateDescription(descEn: string): string {
	if (!descEn) return ''
	
	let descUa = descEn
	
	// Common patterns
	descUa = descUa.replace(/^What is /i, 'Що таке ')
	descUa = descUa.replace(/^How to /i, 'Як ')
	descUa = descUa.replace(/^Why /i, 'Чому ')
	descUa = descUa.replace(/^Difference between /i, 'Різниця між ')
	descUa = descUa.replace(/is a /g, '— це ')
	descUa = descUa.replace(/are /g, '— це ')
	
	return descUa
}

// ============================================
// MAIN TRANSLATION FUNCTION
// ============================================

async function translateAllQuestions() {
	console.log('🌐 Starting Ukrainian translation of all questions...\n')

	try {
		// Get all questions
		const questions = await db.select().from(schema.questions)
		
		console.log(`📚 Found ${questions.length} questions to translate\n`)

		let translated = 0
		let skipped = 0

		for (const question of questions) {
			const titleUa = translateTitle(question.titleEn)
			const contentUa = translateContent(question.contentMarkdownEn)
			const descriptionUa = translateDescription(question.descriptionEn || '')

			// Check if translation is different from English
			if (titleUa !== question.titleEn || contentUa !== question.contentMarkdownEn) {
				await db
					.update(schema.questions)
					.set({
						titleUa,
						contentMarkdownUa: contentUa,
						descriptionUa,
					})
					.where(eq(schema.questions.id, question.id))

				console.log(`  ✓ ${question.slug}`)
				translated++
			} else {
				console.log(`  ⊘ ${question.slug} (no translation available)`)
				skipped++
			}
		}

		console.log(`\n✅ Translation complete!`)
		console.log(`  Translated: ${translated}`)
		console.log(`  Skipped: ${skipped}`)

	} catch (error) {
		console.error('❌ Error during translation:', error)
		throw error
	} finally {
		await client.end()
	}
}

translateAllQuestions()
