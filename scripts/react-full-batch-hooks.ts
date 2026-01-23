import { drizzle } from 'drizzle-orm/postgres-js'
import * as dotenv from 'dotenv'
import * as schema from '../src/core/database/schema'
import { eq } from 'drizzle-orm'

const postgres = require('postgres')
dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL not set')

const client = postgres(connectionString.split('?')[0])
const db = drizzle(client, { schema })

const updates = [
  {
    slug: 'use-state',
    en: `**useState** is a hook in **React** that allows adding state to functional components. Before hooks appeared, state was only available in class components. With \`useState\`, state can be used in functional components, simplifying code writing and maintenance.

## How Does useState Work?

- **State initialization**. The \`useState\` hook accepts initial value and returns array with two elements:
  1. Current state value.
  2. Function to update state.
- **State update**. When state changes, component re-renders with new state value.

### useState Usage Example

\`\`\`jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0); // Initialize state with initial value 0

  const increment = () => {
    setCount(count + 1); // Update state
  };

  return (
    <div>
      <p>Counter: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
\`\`\`

## Important Points When Using useState

- State update function can be called with new state value or function that accepts previous state:

\`\`\`jsx
setCount(prevCount => prevCount + 1);
\`\`\`

- If you want to update state based on its previous value, use function passed to setCount to avoid problems with update asynchrony.

### Update Function Example

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(prevCount => prevCount + 1); // Use previous state
  };

  return (
    <div>
      <p>Counter: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
\`\`\`

> When state changes, React re-renders component with new state value, allowing creation of dynamic and interactive interfaces.

## How Does useState(() => compute()) Work?

When you pass function to \`useState\`, this function will be executed only once — on component's first render. This can be useful for performance optimization if calculations are heavy or if you need to do something before setting initial state.

Instead of calculating value every time during render, React will call this function only once and use result as initial state.

### Usage Example:

\`\`\`jsx
import { useState } from "react";

// Function for complex calculations
function compute() {
  console.log("Calculations executing...");
  return 42; // For example, complex logic calculation
}

function MyComponent() {
  const [count, setCount] = useState(() => compute()); // compute called only once

  return (
    <div>
      <p>Value: {count}</p>
    </div>
  );
}
\`\`\``,
    ua: `**useState** — це хук в **React**, який дозволяє додавати стан до функціональних компонентів. До появи хуків, стан був доступний тільки в класових компонентах. З \`useState\`, стан можна використовувати в функціональних компонентах, спрощуючи написання та підтримку коду.

## Як працює useState?

- **Ініціалізація стану**. Хук \`useState\` приймає початкове значення і повертає масив з двох елементів:
  1. Поточне значення стану.
  2. Функція для оновлення стану.
- **Оновлення стану**. Коли стан змінюється, компонент ре-рендериться з новим значенням стану.

### Приклад використання useState

\`\`\`jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0); // Ініціалізуємо стан з початковим значенням 0

  const increment = () => {
    setCount(count + 1); // Оновлюємо стан
  };

  return (
    <div>
      <p>Лічильник: {count}</p>
      <button onClick={increment}>Збільшити</button>
    </div>
  );
}
\`\`\`

## Важливі моменти при використанні useState

- Функцію оновлення стану можна викликати з новим значенням стану або з функцією, яка приймає попередній стан:

\`\`\`jsx
setCount(prevCount => prevCount + 1);
\`\`\`

- Якщо ви хочете оновити стан на основі його попереднього значення, використовуйте функцію, передану в setCount, щоб уникнути проблем з асинхронністю оновлення.

### Приклад функції оновлення

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => {
    setCount(prevCount => prevCount + 1); // Використовуємо попередній стан
  };

  return (
    <div>
      <p>Лічильник: {count}</p>
      <button onClick={increment}>Збільшити</button>
    </div>
  );
}
\`\`\`

> Коли стан змінюється, React ре-рендерить компонент з новим значенням стану, дозволяючи створювати динамічні та інтерактивні інтерфейси.

## Як працює useState(() => compute())?

Коли ви передаєте функцію в \`useState\`, ця функція буде виконана тільки один раз — при першому рендері компонента. Це може бути корисним для оптимізації продуктивності, якщо обчислення важкі або якщо потрібно зробити щось перед встановленням початкового стану.

Замість обчислення значення кожен раз під час рендеру, React викличе цю функцію тільки один раз і використає результат як початковий стан.

### Приклад використання:

\`\`\`jsx
import { useState } from "react";

// Функція для складних обчислень
function compute() {
  console.log("Виконуються обчислення...");
  return 42; // Наприклад, обчислення складної логіки
}

function MyComponent() {
  const [count, setCount] = useState(() => compute()); // compute викликається тільки один раз

  return (
    <div>
      <p>Значення: {count}</p>
    </div>
  );
}
\`\`\``,
  },
]

async function update() {
  try {
    console.log('React useState Hook: Adding full content\n')
    for (const u of updates) {
      await db.update(schema.questions)
        .set({ contentMarkdownEn: u.en, contentMarkdownUa: u.ua, updatedAt: new Date() })
        .where(eq(schema.questions.slug, u.slug))
      console.log(`✅ ${u.slug}`)
    }
    console.log('\n✅ useState updated!\n')
  } finally {
    await client.end()
  }
}

update().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); })
