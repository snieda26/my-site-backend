/**
 * Seed React Coding Problems
 * @usage: ./node_modules/.bin/tsx scripts/seed-react-problems.ts
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

const reactProblems = [
	{
		slug: 'todo-list',
		title: 'Todo List',
		titleUa: 'Список Справ',
		description: `Create a Todo List application with full task management functionality.

Requirements:
- List of tasks displaying all added items
- Input field for adding new tasks
- Ability to mark tasks as completed/incomplete (checkbox)
- Completed tasks should be green
- Delete button for each task
- Tasks should have unique IDs
- Add task on Enter key press
- Clear input field after adding
- Validation: don't add empty tasks

Additional:
- Tasks should have unique IDs
- Clear input field after adding a task
- Validation: don't add empty tasks`,
		descriptionUa: `Створіть додаток Список Справ з повним функціоналом управління задачами.

Вимоги:
- Список задач, що відображає всі додані елементи
- Поле вводу для додавання нових задач
- Можливість позначити задачі як виконані/невиконані (чекбокс)
- Виконані задачі повинні бути зеленими
- Кнопка видалення для кожної задачі
- Задачі повинні мати унікальні ID
- Додавання задачі по натисканню Enter
- Очищення поля вводу після додавання
- Валідація: не додавати порожні задачі

Додатково:
- Задачі повинні мати унікальні ID
- Очищувати поле вводу після додавання задачі
- Валідація: не додавати порожні задачі`,
		difficulty: 'JUNIOR' as const,
		category: 'react' as const,
		starterCode: `import './styles.css';

export default function App() {
  // Add your code here
  
}`,
		solution: `import { useState } from 'react';
import './styles.css';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  const addTask = () => {
    if (input.trim()) {
      setTasks([...tasks, { id: Date.now(), text: input, completed: false }]);
      setInput('');
    }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="app">
      <h1>Todo List</h1>
      <div>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTask()}
          placeholder="Add a task"
        />
        <button onClick={addTask}>Add</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task.id)}
            />
            <span style={{ color: task.completed ? 'green' : 'black' }}>
              {task.text}
            </span>
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}`,
		testCases: JSON.stringify([
			{ description: 'Can add a new task', expected: 'Task appears in list' },
			{ description: 'Can mark task as complete', expected: 'Task turns green' },
			{ description: 'Can delete a task', expected: 'Task is removed from list' },
		]),
		companies: ['EPAM', 'SoftServe'],
	},
	{
		slug: 'timer-with-controls',
		title: 'Timer with Controls',
		titleUa: 'Таймер з Елементами Керування',
		description: `Create a timer application with start, stop, and reset functionality.

Requirements:
- Display time in seconds
- Start button to begin timer
- Stop button to pause timer
- Reset button to set timer to 0
- Timer should increment every second when running
- Time format: display in seconds`,
		descriptionUa: `Створіть додаток таймера з функціями старт, стоп та скидання.

Вимоги:
- Відображення часу в секундах
- Кнопка старт для запуску таймера
- Кнопка стоп для призупинення таймера
- Кнопка скидання для встановлення таймера на 0
- Таймер повинен збільшуватися кожну секунду під час роботи
- Формат часу: відображення в секундах`,
		difficulty: 'JUNIOR' as const,
		category: 'react' as const,
		starterCode: `import { useState, useEffect } from 'react';
import './styles.css';

export default function App() {
  // Add your code here
  
}`,
		solution: `import { useState, useEffect } from 'react';
import './styles.css';

export default function App() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const handleStart = () => setIsRunning(true);
  const handleStop = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
  };

  return (
    <div className="app">
      <h1>Timer: {time}s</h1>
      <button onClick={handleStart}>Start</button>
      <button onClick={handleStop}>Stop</button>
      <button onClick={handleReset}>Reset</button>
    </div>
  );
}`,
		testCases: JSON.stringify([
			{ description: 'Timer starts counting', expected: 'Time increments' },
			{ description: 'Timer stops', expected: 'Time stops incrementing' },
			{ description: 'Timer resets', expected: 'Time goes to 0' },
		]),
		companies: ['GlobalLogic', 'Luxoft'],
	},
	{
		slug: 'controlled-vs-uncontrolled',
		title: 'Controlled vs Uncontrolled',
		titleUa: 'Контрольований vs Неконтрольований',
		description: `Create two input components demonstrating controlled and uncontrolled components.

Requirements:
- One controlled input (value managed by React state)
- One uncontrolled input (value managed by DOM)
- Display both values below inputs
- Show real-time updates for controlled input
- Get uncontrolled value on button click`,
		descriptionUa: `Створіть два компоненти вводу, що демонструють контрольовані та неконтрольовані компоненти.

Вимоги:
- Один контрольований input (значення керується React state)
- Один неконтрольований input (значення керується DOM)
- Відображення обох значень під полями вводу
- Показувати оновлення в реальному часі для контрольованого input
- Отримувати значення неконтрольованого input при натисканні кнопки`,
		difficulty: 'JUNIOR' as const,
		category: 'react' as const,
		starterCode: `import { useState, useRef } from 'react';
import './styles.css';

export default function App() {
  // Add your code here
  
}`,
		solution: `import { useState, useRef } from 'react';
import './styles.css';

export default function App() {
  const [controlledValue, setControlledValue] = useState('');
  const [uncontrolledValue, setUncontrolledValue] = useState('');
  const inputRef = useRef(null);

  const handleUncontrolledClick = () => {
    setUncontrolledValue(inputRef.current.value);
  };

  return (
    <div className="app">
      <h2>Controlled Input</h2>
      <input
        value={controlledValue}
        onChange={(e) => setControlledValue(e.target.value)}
      />
      <p>Controlled Value: {controlledValue}</p>

      <h2>Uncontrolled Input</h2>
      <input ref={inputRef} />
      <button onClick={handleUncontrolledClick}>Get Value</button>
      <p>Uncontrolled Value: {uncontrolledValue}</p>
    </div>
  );
}`,
		testCases: JSON.stringify([
			{ description: 'Controlled input updates state', expected: 'Value displays in real-time' },
			{ description: 'Uncontrolled input gets value on click', expected: 'Value displays after button click' },
		]),
		companies: ['EPAM'],
	},
	{
		slug: 'use-debounce-hook',
		title: 'useDebounce Hook',
		titleUa: 'Хук useDebounce',
		description: `Implement a custom useDebounce hook that delays updating a value.

Requirements:
- Create useDebounce custom hook
- Hook should accept value and delay (ms)
- Return debounced value
- Use the hook to debounce search input
- Display both immediate and debounced values`,
		descriptionUa: `Реалізуйте кастомний хук useDebounce, який затримує оновлення значення.

Вимоги:
- Створити кастомний хук useDebounce
- Хук повинен приймати значення та затримку (мс)
- Повертати debounced значення
- Використовувати хук для debounce пошукового вводу
- Відображати як негайне, так і debounced значення`,
		difficulty: 'MIDDLE' as const,
		category: 'react' as const,
		starterCode: `import { useState, useEffect } from 'react';
import './styles.css';

function useDebounce(value, delay) {
  // Implement hook here
}

export default function App() {
  // Add your code here
  
}`,
		solution: `import { useState, useEffect } from 'react';
import './styles.css';

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  return (
    <div className="app">
      <h1>useDebounce Hook</h1>
      <input
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Type to search..."
      />
      <p>Immediate value: {searchTerm}</p>
      <p>Debounced value: {debouncedSearchTerm}</p>
    </div>
  );
}`,
		testCases: JSON.stringify([
			{ description: 'Debounced value updates after delay', expected: 'Value updates 500ms after typing stops' },
		]),
		companies: ['N-iX', 'Grammarly'],
	},
	{
		slug: 'use-toggle-hook',
		title: 'useToggle Hook',
		titleUa: 'Хук useToggle',
		description: `Create a custom useToggle hook for boolean state management.

Requirements:
- Implement useToggle hook that returns [value, toggle]
- toggle function should flip boolean value
- Use the hook to toggle visibility of content
- Show/Hide button based on toggle state`,
		descriptionUa: `Створіть кастомний хук useToggle для управління булевим станом.

Вимоги:
- Реалізувати хук useToggle, який повертає [value, toggle]
- Функція toggle повинна перемикати булеве значення
- Використовувати хук для перемикання видимості контенту
- Кнопка Показати/Сховати базується на стані toggle`,
		difficulty: 'JUNIOR' as const,
		category: 'react' as const,
		starterCode: `import { useState } from 'react';
import './styles.css';

function useToggle(initialValue = false) {
  // Implement hook here
}

export default function App() {
  // Add your code here
  
}`,
		solution: `import { useState } from 'react';
import './styles.css';

function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = () => setValue(prev => !prev);
  
  return [value, toggle];
}

export default function App() {
  const [isVisible, toggleVisible] = useToggle(false);

  return (
    <div className="app">
      <h1>useToggle Hook</h1>
      <button onClick={toggleVisible}>
        {isVisible ? 'Hide' : 'Show'} Content
      </button>
      {isVisible && (
        <p>This content can be toggled!</p>
      )}
    </div>
  );
}`,
		testCases: JSON.stringify([
			{ description: 'Toggle shows/hides content', expected: 'Content visibility toggles' },
		]),
		companies: ['SoftServe'],
	},
	{
		slug: 'use-hover-hook',
		title: 'useHover Hook',
		titleUa: 'Хук useHover',
		description: `Create a custom useHover hook that detects when an element is hovered.

Requirements:
- Implement useHover hook that returns [ref, isHovered]
- Track mouse enter/leave events
- Apply the hook to an element
- Display hover state visually
- Change element style when hovered`,
		descriptionUa: `Створіть кастомний хук useHover, який визначає, коли елемент наведений.

Вимоги:
- Реалізувати хук useHover, який повертає [ref, isHovered]
- Відстежувати події mouse enter/leave
- Застосувати хук до елемента
- Відображати стан наведення візуально
- Змінювати стиль елемента при наведенні`,
		difficulty: 'MIDDLE' as const,
		category: 'react' as const,
		starterCode: `import { useState, useEffect, useRef } from 'react';
import './styles.css';

function useHover() {
  // Implement hook here
}

export default function App() {
  // Add your code here
  
}`,
		solution: `import { useState, useEffect, useRef } from 'react';
import './styles.css';

function useHover() {
  const [isHovered, setIsHovered] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const handleMouseEnter = () => setIsHovered(true);
    const handleMouseLeave = () => setIsHovered(false);

    node.addEventListener('mouseenter', handleMouseEnter);
    node.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      node.removeEventListener('mouseenter', handleMouseEnter);
      node.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return [ref, isHovered];
}

export default function App() {
  const [hoverRef, isHovered] = useHover();

  return (
    <div className="app">
      <h1>useHover Hook</h1>
      <div
        ref={hoverRef}
        style={{
          padding: '20px',
          backgroundColor: isHovered ? 'lightblue' : 'lightgray',
          transition: 'background-color 0.3s',
        }}
      >
        {isHovered ? 'Hovering!' : 'Hover over me'}
      </div>
    </div>
  );
}`,
		testCases: JSON.stringify([
			{ description: 'Detects hover state', expected: 'Background changes on hover' },
		]),
		companies: ['Luxoft', 'Ciklum'],
	},
	{
		slug: 'accordion-component',
		title: 'Accordion Component',
		titleUa: 'Компонент Accordion',
		description: `Create an accordion component that shows/hides content sections.

Requirements:
- Multiple accordion items
- Click header to toggle content visibility
- Only one item can be open at a time
- Smooth expand/collapse animation
- Visual indicator (arrow) for open/closed state`,
		descriptionUa: `Створіть компонент accordion, який показує/ховає секції контенту.

Вимоги:
- Кілька елементів accordion
- Клік по заголовку для перемикання видимості контенту
- Тільки один елемент може бути відкритим одночасно
- Плавна анімація розгортання/згортання
- Візуальний індикатор (стрілка) для відкритого/закритого стану`,
		difficulty: 'MIDDLE' as const,
		category: 'react' as const,
		starterCode: `import { useState } from 'react';
import './styles.css';

export default function App() {
  // Add your code here
  
}`,
		solution: `import { useState } from 'react';
import './styles.css';

const AccordionItem = ({ title, content, isOpen, onToggle }) => (
  <div className="accordion-item">
    <div className="accordion-header" onClick={onToggle}>
      <h3>{title}</h3>
      <span>{isOpen ? '▼' : '▶'}</span>
    </div>
    {isOpen && <div className="accordion-content">{content}</div>}
  </div>
);

export default function App() {
  const [openIndex, setOpenIndex] = useState(null);

  const items = [
    { title: 'Section 1', content: 'Content for section 1' },
    { title: 'Section 2', content: 'Content for section 2' },
    { title: 'Section 3', content: 'Content for section 3' },
  ];

  return (
    <div className="app">
      <h1>Accordion</h1>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          content={item.content}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex(openIndex === index ? null : index)}
        />
      ))}
    </div>
  );
}`,
		testCases: JSON.stringify([
			{ description: 'Opens accordion item', expected: 'Content becomes visible' },
			{ description: 'Closes other items when opening new one', expected: 'Only one item open at a time' },
		]),
		companies: ['EPAM', 'GlobalLogic'],
	},
	{
		slug: 'carousel-component',
		title: 'Carousel Component',
		titleUa: 'Компонент Carousel',
		description: `Create a carousel/slider component with navigation controls.

Requirements:
- Display one image/item at a time
- Next/Previous buttons for navigation
- Indicator dots showing current position
- Auto-advance every 3 seconds (optional)
- Wrap around (after last item, go to first)`,
		descriptionUa: `Створіть компонент carousel/slider з елементами навігації.

Вимоги:
- Відображення одного зображення/елемента за раз
- Кнопки Наступний/Попередній для навігації
- Індикаторні точки, що показують поточну позицію
- Автоматичне перемикання кожні 3 секунди (опціонально)
- Зациклювання (після останнього елемента, перейти до першого)`,
		difficulty: 'MIDDLE' as const,
		category: 'react' as const,
		starterCode: `import { useState } from 'react';
import './styles.css';

export default function App() {
  // Add your code here
  
}`,
		solution: `import { useState, useEffect } from 'react';
import './styles.css';

export default function App() {
  const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4'];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [items.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  return (
    <div className="app">
      <h1>Carousel</h1>
      <div className="carousel">
        <button onClick={goToPrevious}>←</button>
        <div className="carousel-content">{items[currentIndex]}</div>
        <button onClick={goToNext}>→</button>
      </div>
      <div className="dots">
        {items.map((_, index) => (
          <span
            key={index}
            className={\`dot \${index === currentIndex ? 'active' : ''}\`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
}`,
		testCases: JSON.stringify([
			{ description: 'Navigate to next item', expected: 'Shows next item' },
			{ description: 'Navigate to previous item', expected: 'Shows previous item' },
			{ description: 'Auto-advance', expected: 'Automatically moves to next item' },
		]),
		companies: ['SoftServe', 'Grammarly'],
	},
]

async function seedProblems() {
	console.log('🌱 Starting to seed React problems...\n')

	try {
		let addedCount = 0
		let skippedCount = 0

		for (const problemData of reactProblems) {
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
					titleUa: problemData.titleUa,
					description: problemData.description,
					descriptionUa: problemData.descriptionUa,
					difficulty: problemData.difficulty,
					category: problemData.category,
					starterCode: problemData.starterCode,
					solution: problemData.solution,
					testCases: problemData.testCases,
				})
				.returning()

			console.log(`  ✅ Added React problem: ${problem.slug}`)

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
		console.log(`   Added: ${addedCount} React problems`)
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
