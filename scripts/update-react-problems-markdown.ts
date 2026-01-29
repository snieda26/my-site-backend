/**
 * Update React Problems with Markdown Descriptions
 * @usage: ./node_modules/.bin/tsx scripts/update-react-problems-markdown.ts
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

const updates = [
	{
		slug: 'todo-list',
		description: `Create a Todo List application with full task management functionality.

### Requirements:
- [ ] List of tasks displaying all added items
- [ ] Input field for adding new tasks
- [ ] Ability to mark tasks as completed/incomplete (checkbox)
- [ ] Completed tasks should be green
- [ ] Delete button for each task
- [ ] Tasks should have unique IDs

### Additional:
- [ ] Add task on **Enter** key press
- [ ] Clear input field after adding a task
- [ ] Validation: don't add empty tasks`,
		descriptionUa: `Створіть додаток Список Справ з повним функціоналом управління задачами.

### Вимоги:
- [ ] Список задач, що відображає всі додані елементи
- [ ] Поле вводу для додавання нових задач
- [ ] Можливість позначити задачі як виконані/невиконані (чекбокс)
- [ ] Виконані задачі повинні бути зеленими
- [ ] Кнопка видалення для кожної задачі
- [ ] Задачі повинні мати унікальні ID

### Додатково:
- [ ] Додавання задачі по натисканню **Enter**
- [ ] Очищувати поле вводу після додавання задачі
- [ ] Валідація: не додавати порожні задачі`,
	},
	{
		slug: 'timer-with-controls',
		description: `Create a timer application with start, stop, and reset functionality.

### Requirements:
- [ ] Display time in seconds
- [ ] Start button to begin timer
- [ ] Stop button to pause timer
- [ ] Reset button to set timer to 0
- [ ] Timer should increment every second when running
- [ ] Time format: display in seconds`,
		descriptionUa: `Створіть додаток таймера з функціями старт, стоп та скидання.

### Вимоги:
- [ ] Відображення часу в секундах
- [ ] Кнопка старт для запуску таймера
- [ ] Кнопка стоп для призупинення таймера
- [ ] Кнопка скидання для встановлення таймера на 0
- [ ] Таймер повинен збільшуватися кожну секунду під час роботи
- [ ] Формат часу: відображення в секундах`,
	},
	{
		slug: 'controlled-vs-uncontrolled',
		description: `Create two input components demonstrating controlled and uncontrolled components.

### Requirements:
- [ ] One **controlled input** (value managed by React state)
- [ ] One **uncontrolled input** (value managed by DOM)
- [ ] Display both values below inputs
- [ ] Show real-time updates for controlled input
- [ ] Get uncontrolled value on button click`,
		descriptionUa: `Створіть два компоненти вводу, що демонструють контрольовані та неконтрольовані компоненти.

### Вимоги:
- [ ] Один **контрольований input** (значення керується React state)
- [ ] Один **неконтрольований input** (значення керується DOM)
- [ ] Відображення обох значень під полями вводу
- [ ] Показувати оновлення в реальному часі для контрольованого input
- [ ] Отримувати значення неконтрольованого input при натисканні кнопки`,
	},
	{
		slug: 'use-debounce-hook',
		description: `Implement a custom **useDebounce** hook that delays updating a value.

### Requirements:
- [ ] Create \`useDebounce\` custom hook
- [ ] Hook should accept \`value\` and \`delay\` (ms)
- [ ] Return debounced value
- [ ] Use the hook to debounce search input
- [ ] Display both immediate and debounced values`,
		descriptionUa: `Реалізуйте кастомний хук **useDebounce**, який затримує оновлення значення.

### Вимоги:
- [ ] Створити кастомний хук \`useDebounce\`
- [ ] Хук повинен приймати \`value\` та \`delay\` (мс)
- [ ] Повертати debounced значення
- [ ] Використовувати хук для debounce пошукового вводу
- [ ] Відображати як негайне, так і debounced значення`,
	},
	{
		slug: 'use-toggle-hook',
		description: `Create a custom **useToggle** hook for boolean state management.

### Requirements:
- [ ] Implement \`useToggle\` hook that returns \`[value, toggle]\`
- [ ] \`toggle\` function should flip boolean value
- [ ] Use the hook to toggle visibility of content
- [ ] Show/Hide button based on toggle state`,
		descriptionUa: `Створіть кастомний хук **useToggle** для управління булевим станом.

### Вимоги:
- [ ] Реалізувати хук \`useToggle\`, який повертає \`[value, toggle]\`
- [ ] Функція \`toggle\` повинна перемикати булеве значення
- [ ] Використовувати хук для перемикання видимості контенту
- [ ] Кнопка Показати/Сховати базується на стані toggle`,
	},
	{
		slug: 'use-hover-hook',
		description: `Create a custom **useHover** hook that detects when an element is hovered.

### Requirements:
- [ ] Implement \`useHover\` hook that returns \`[ref, isHovered]\`
- [ ] Track mouse enter/leave events
- [ ] Apply the hook to an element
- [ ] Display hover state visually
- [ ] Change element style when hovered`,
		descriptionUa: `Створіть кастомний хук **useHover**, який визначає, коли елемент наведений.

### Вимоги:
- [ ] Реалізувати хук \`useHover\`, який повертає \`[ref, isHovered]\`
- [ ] Відстежувати події mouse enter/leave
- [ ] Застосувати хук до елемента
- [ ] Відображати стан наведення візуально
- [ ] Змінювати стиль елемента при наведенні`,
	},
	{
		slug: 'accordion-component',
		description: `Create an **Accordion** component that shows/hides content sections.

### Requirements:
- [ ] Multiple accordion items
- [ ] Click header to toggle content visibility
- [ ] Only one item can be open at a time
- [ ] Smooth expand/collapse animation
- [ ] Visual indicator (arrow) for open/closed state`,
		descriptionUa: `Створіть компонент **Accordion**, який показує/ховає секції контенту.

### Вимоги:
- [ ] Кілька елементів accordion
- [ ] Клік по заголовку для перемикання видимості контенту
- [ ] Тільки один елемент може бути відкритим одночасно
- [ ] Плавна анімація розгортання/згортання
- [ ] Візуальний індикатор (стрілка) для відкритого/закритого стану`,
	},
	{
		slug: 'carousel-component',
		description: `Create a **Carousel/Slider** component with navigation controls.

### Requirements:
- [ ] Display one image/item at a time
- [ ] Next/Previous buttons for navigation
- [ ] Indicator dots showing current position
- [ ] Auto-advance every 3 seconds (optional)
- [ ] Wrap around (after last item, go to first)`,
		descriptionUa: `Створіть компонент **Carousel/Slider** з елементами навігації.

### Вимоги:
- [ ] Відображення одного зображення/елемента за раз
- [ ] Кнопки Наступний/Попередній для навігації
- [ ] Індикаторні точки, що показують поточну позицію
- [ ] Автоматичне перемикання кожні 3 секунди (опціонально)
- [ ] Зациклювання (після останнього елемента, перейти до першого)`,
	},
]

async function updateProblems() {
	console.log('🔄 Starting to update React problems with markdown...\n')

	try {
		let updatedCount = 0

		for (const update of updates) {
			console.log(`📝 Updating: ${update.slug}`)

			await db
				.update(schema.problems)
				.set({
					description: update.description,
					descriptionUa: update.descriptionUa,
					updatedAt: new Date(),
				})
				.where(eq(schema.problems.slug, update.slug))

			console.log(`  ✅ Updated successfully`)
			updatedCount++
		}

		console.log('\n========================================')
		console.log(`✅ Update complete! Updated ${updatedCount} React problems`)
		console.log('========================================\n')
	} catch (error) {
		console.error('❌ Error updating problems:', error)
		throw error
	} finally {
		await client.end()
	}
}

updateProblems()
