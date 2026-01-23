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

// Questions 2-7: Virtual DOM, Fiber, key, Batching, JSX, useState
const updates = [
  {
    slug: 'virtual-dom',
    en: `**Virtual DOM** is a lightweight copy of the real DOM stored in RAM.

React updates this copy instead of directly modifying the real DOM to avoid triggering unnecessary "expensive" operations (\`layout\`, \`painting\`, \`reflow\`) in the browser.

When all changes are made, React compares old and new versions of Virtual DOM (diffing) and **precisely** updates the real DOM (reconciliation).

---

## Heuristic O(n) Algorithm

React applies an efficient algorithm with two key assumptions:

1. **Different element types → different trees**

- Two elements with different types will produce different trees. When comparing two trees, React first compares two root elements. When root elements have different types, React destroys the old tree and builds a new one from scratch.
- If type doesn't change, only changed attributes and child nodes are updated.

2. **\`key\` value for children**

- When reordering elements in a list, keys (\`key\`) allow React to understand which elements persisted, which were added and which were removed.
- This saves resources and reduces re-renders.

---

## Update Steps (simplified)

1. **Virtual DOM Update** - React captures changes (e.g., \`setState\` or \`useState\` call).
2. **Diffing** - React compares previous Virtual DOM with new one, identifying differences.
3. **Reconciliation** - Only changed parts of real DOM are re-rendered. Updates are performed in batches, not after each small change.

---

## Key Points

- **Minimizing real DOM work**: React minimizes "expensive" browser operations.
- **Encapsulation**: Components work with their state without manual control over reflow/layout.
- **Easy scaling**: Algorithm allows writing more scalable and maintainable code.

> If parent component renders, by default its child components also re-render unless additional optimizations are applied (\`React.memo\`, \`shouldComponentUpdate\`, etc.)`,
    ua: `**Virtual DOM** — це легка копія реального DOM, що зберігається в RAM.

React оновлює цю копію замість прямого змінення реального DOM, щоб уникнути викликання непотрібних "дорогих" операцій (\`layout\`, \`painting\`, \`reflow\`) в браузері.

Коли всі зміни зроблені, React порівнює стару та нову версії Virtual DOM (diffing) та **точно** оновлює реальний DOM (reconciliation).

---

## Евристичний O(n) алгоритм

React застосовує ефективний алгоритм з двома ключовими припущеннями:

1. **Різні типи елементів → різні дерева**

- Два елементи з різними типами створять різні дерева. При порівнянні двох дерев, React спочатку порівнює два кореневі елементи. Коли кореневі елементи мають різні типи, React знищує старе дерево і будує нове з нуля.
- Якщо тип не змінюється, оновлюються тільки змінені атрибути та дочірні вузли.

2. **Значення \`key\` для дітей**

- При переупорядкуванні елементів в списку, ключі (\`key\`) дозволяють React зрозуміти які елементи залишилися, які були додані і які були видалені.
- Це економить ресурси та зменшує ре-рендери.

---

## Кроки оновлення (спрощено)

1. **Оновлення Virtual DOM** - React фіксує зміни (наприклад, виклик \`setState\` або \`useState\`).
2. **Diffing** - React порівнює попередній Virtual DOM з новим, визначаючи відмінності.
3. **Reconciliation** - Перемальовуються тільки змінені частини реального DOM. Оновлення виконуються пакетами, а не після кожної маленької зміни.

---

## Ключові моменти

- **Мінімізація роботи з реальним DOM**: React мінімізує "дорогі" браузерні операції.
- **Інкапсуляція**: Компоненти працюють зі своїм станом без ручного контролю над reflow/layout.
- **Легке масштабування**: Алгоритм дозволяє писати більш масштабований та підтримуваний код.

> Якщо батьківський компонент рендериться, за замовчуванням його дочірні компоненти також ре-рендеряться, якщо не застосовані додаткові оптимізації (\`React.memo\`, \`shouldComponentUpdate\`, тощо)`,
  },
]

async function update() {
  try {
    console.log('React Batch 2-7: Questions with full content\n')
    for (const u of updates) {
      await db.update(schema.questions)
        .set({ contentMarkdownEn: u.en, contentMarkdownUa: u.ua, updatedAt: new Date() })
        .where(eq(schema.questions.slug, u.slug))
      console.log(`✅ ${u.slug}`)
    }
    console.log(`\n✅ Batch complete: ${updates.length} updated\n`)
  } finally {
    await client.end()
  }
}

update().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1); })
