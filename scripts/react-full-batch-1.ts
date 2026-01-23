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
    slug: 'what-is-react',
    contentMarkdownEn: `**React** is a **JavaScript library** for creating fast and interactive user interfaces (UI). It helps developers build modern web and mobile applications.

## Why React?

- **Speeds up interface development** Instead of creating entire application manually, can break it into small independent parts — **components**.
- **Improves performance** React uses **virtual DOM** — a fast way to work with interface without unnecessary page updates.
- **Multifunctionality** React suits both client-side (frontend) and server-side applications. Can be combined with other tools and frameworks.

---

## How React Works

React uses **declarative** approach in programming. While **imperative** programming requires specifying each action, in declarative it's enough to describe final result and reaction to actions.

Simply put, when creating code developer specifies how interface should behave when receiving certain data or events occur.

Library allows optimizing development process because programmer doesn't need to describe details. \`React.js\` will independently update elements based on conditions. Programmer's task is to properly describe them.

Using this approach allows creating React applications as quickly as possible.

## React Advantages

### Component Approach

- React allows breaking interface into reusable components, simplifying development and maintenance.
- Components are isolated from each other, reducing error probability.

### Virtual DOM

- React uses virtual DOM, speeding up user interface updates.
- Only changed elements are redrawn, improving performance.

### Flexibility and Scalability

- React can be used for both small projects and complex applications.
- Easily integrates with other libraries and tools.

### Development Convenience

- JSX (JavaScript XML) simplifies interface creation by combining JavaScript and HTML.
- Using Hooks makes state management and side effects more convenient.

### Active Community and Support

- React is supported by Facebook and large developer community.
- Many ready solutions, libraries and extensive documentation.`,
    contentMarkdownUa: `**React** — це **JavaScript бібліотека** для створення швидких та інтерактивних користувацьких інтерфейсів (UI). Вона допомагає розробникам будувати сучасні веб та мобільні додатки.

## Навіщо React?

- **Прискорює розробку інтерфейсу** Замість створення всього додатку вручну, можна розбити його на маленькі незалежні частини — **компоненти**.
- **Покращує продуктивність** React використовує **віртуальний DOM** — швидкий спосіб роботи з інтерфейсом без зайвих оновлень сторінки.
- **Багатофункціональність** React підходить як для клієнтської (frontend), так і для серверної частини додатків. Може комбінуватися з іншими інструментами та фреймворками.

---

## Як працює React

React використовує **декларативний** підхід в програмуванні. У той час як **імперативне** програмування вимагає вказувати кожну дію, в декларативному достатньо описати кінцевий результат та реакцію на дії.

Простіше кажучи, при створенні коду розробник вказує як повинен вести себе інтерфейс при отриманні певних даних або подій.

Бібліотека дозволяє оптимізувати процес розробки тому що програмісту не потрібно описувати деталі. \`React.js\` самостійно оновить елементи на основі умов. Завдання програміста — правильно їх описати.

Використання цього підходу дозволяє створювати React додатки максимально швидко.

## Переваги React

### Компонентний підхід

- React дозволяє розбивати інтерфейс на повторно використовувані компоненти, спрощуючи розробку та підтримку.
- Компоненти ізольовані один від одного, що зменшує ймовірність помилок.

### Віртуальний DOM

- React використовує віртуальний DOM, прискорюючи оновлення користувацького інтерфейсу.
- Перемальовуються тільки змінені елементи, що покращує продуктивність.

### Гнучкість та масштабованість

- React може використовуватися як для невеликих проектів, так і для складних додатків.
- Легко інтегрується з іншими бібліотеками та інструментами.

### Зручність розробки

- JSX (JavaScript XML) спрощує створення інтерфейсу, поєднуючи JavaScript та HTML.
- Використання Hooks робить керування станом та побічними ефектами зручнішим.

### Активна спільнота та підтримка

- React підтримується Facebook та великою спільнотою розробників.
- Багато готових рішень, бібліотек та обширна документація.`,
  },
]

async function update() {
  try {
    console.log('React Batch 1: First question with full content\n')
    for (const u of updates) {
      await db.update(schema.questions)
        .set({ contentMarkdownEn: u.contentMarkdownEn, contentMarkdownUa: u.contentMarkdownUa, updatedAt: new Date() })
        .where(eq(schema.questions.slug, u.slug))
      console.log(`✅ ${u.slug}`)
    }
    console.log('\n✅ Batch 1 complete!\n')
  } finally {
    await client.end()
  }
}

update().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); })
