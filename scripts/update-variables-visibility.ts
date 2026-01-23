/**
 * Update: CSS Variables & visibility/display with Full Content
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

const client = postgres(connectionString.split('?')[0])
const db = drizzle(client, { schema })

const updates = [
  {
    slug: 'css-variables',
    contentMarkdownEn: `**CSS Variables** (also known as **Custom Properties**) are a way to store values that can be reused throughout CSS code. They allow you to create more flexible and maintainable styles.

## What are CSS Variables?

CSS variables are custom properties that can be defined once and used multiple times. They work on the principle of inheritance and can be overridden in any element.

### Syntax

\`\`\`css
/* Defining a variable */
:root {
  --primary-color: #3498db;
  --font-size: 16px;
  --spacing: 20px;
}

/* Using a variable */
.button {
  background-color: var(--primary-color);
  font-size: var(--font-size);
  padding: var(--spacing);
}
\`\`\`

## Advantages of CSS Variables

1. **Centralized management**: All values in one place
2. **Dynamic changes**: Variables can be changed via JavaScript
3. **Inheritance**: Variables inherit from parent elements
4. **Fallback values**: You can specify a fallback value

### Example with fallback

\`\`\`css
.button {
  background-color: var(--primary-color, #3498db);
}
\`\`\`

## Variable Scope

\`\`\`css
:root {
  --main-color: blue;
}

.card {
  --card-padding: 20px;
  padding: var(--card-padding);
}

.card.dark {
  --main-color: darkblue;
}
\`\`\`

## Working with CSS Variables in JavaScript

\`\`\`javascript
const root = document.documentElement;
const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color');

root.style.setProperty('--primary-color', '#ff0000');
\`\`\`

> **Tip:** Use CSS variables to create flexible themes, centralized style management, and dynamic appearance changes in your application.`,
    contentMarkdownUa: `**CSS Змінні** (також відомі як **Custom Properties**) — це спосіб зберігання значень, які можна повторно використовувати в CSS коді. Вони дозволяють створювати більш гнучкі та легкі в підтримці стилі.

## Що Таке CSS Змінні?

CSS змінні — це власні властивості, які можна визначити один раз і використовувати багато разів. Вони працюють на принципі успадкування і можуть бути перевизначені в будь-якому елементі.

### Синтаксис

\`\`\`css
/* Визначення змінної */
:root {
  --primary-color: #3498db;
  --font-size: 16px;
  --spacing: 20px;
}

/* Використання змінної */
.button {
  background-color: var(--primary-color);
  font-size: var(--font-size);
  padding: var(--spacing);
}
\`\`\`

## Переваги CSS Змінних

1. **Централізоване управління**: Всі значення в одному місці
2. **Динамічні зміни**: Змінні можна змінювати через JavaScript
3. **Успадкування**: Змінні успадковуються від батьківських елементів
4. **Fallback значення**: Можна вказати резервне значення

### Приклад з fallback

\`\`\`css
.button {
  background-color: var(--primary-color, #3498db);
}
\`\`\`

## Область Видимості Змінних

\`\`\`css
:root {
  --main-color: blue;
}

.card {
  --card-padding: 20px;
  padding: var(--card-padding);
}

.card.dark {
  --main-color: darkblue;
}
\`\`\`

## Робота з CSS Змінними в JavaScript

\`\`\`javascript
const root = document.documentElement;
const primaryColor = getComputedStyle(root).getPropertyValue('--primary-color');

root.style.setProperty('--primary-color', '#ff0000');
\`\`\`

> **Порада:** Використовуйте CSS змінні для створення гнучких тем, централізованого управління стилями та динамічних змін зовнішнього вигляду вашого застосунку.`,
  },
  {
    slug: 'css-visibility-vs-display',
    contentMarkdownEn: `**\`visibility: hidden\`** and **\`display: none\`** are two ways to hide an element in CSS, but they work differently and have different consequences for the page layout.

## Key Differences

### display: none

- **Element is completely removed from document flow**
- **Does not take up space** on the page
- **Not accessible to screen readers**
- **Cannot animate** transition between states

### visibility: hidden

- **Element remains in document flow**
- **Takes up space** on the page (invisible)
- **Not accessible to screen readers**
- **Can be animated** via the \`visibility\` property

## Visual Comparison

\`\`\`html
<div class="box">Box 1</div>
<div class="box hidden-display">Box 2 (display: none)</div>
<div class="box">Box 3</div>

<div class="box">Box 1</div>
<div class="box hidden-visibility">Box 2 (visibility: hidden)</div>
<div class="box">Box 3</div>
\`\`\`

**Result:**
- With \`display: none\`: Box 2 completely disappears, Box 3 shifts to Box 2's position
- With \`visibility: hidden\`: Box 2 is invisible but its space remains empty, Box 3 does not shift

## Comparison Table

| **Property** | **Takes up space** | **Interactive** | **Accessible to screen readers** | **Can be animated** |
| --- | --- | --- | --- | --- |
| \`display: none\` | No | No | No | No |
| \`visibility: hidden\` | Yes | No | No | Yes |
| \`opacity: 0\` | Yes | Yes | Yes | Yes |

> **Important:** Choose the hiding method based on your needs: use \`display: none\` for complete removal from layout, \`visibility: hidden\` to preserve space, and \`opacity: 0\` if element should remain interactive.`,
    contentMarkdownUa: `**\`visibility: hidden\`** та **\`display: none\`** — це два способи приховати елемент у CSS, але вони працюють по-різному і мають різні наслідки для макета сторінки.

## Ключові Різниці

### display: none

- **Елемент повністю видаляється з потоку документа**
- **Не займає місце** на сторінці
- **Недоступний для скрін-рідерів**
- **Не можна анімувати** перехід між станами

### visibility: hidden

- **Елемент залишається в потоці документа**
- **Займає місце** на сторінці (невидимий)
- **Недоступний для скрін-рідерів**
- **Можна анімувати** через властивість \`visibility\`

## Візуальне Порівняння

\`\`\`html
<div class="box">Блок 1</div>
<div class="box hidden-display">Блок 2 (display: none)</div>
<div class="box">Блок 3</div>

<div class="box">Блок 1</div>
<div class="box hidden-visibility">Блок 2 (visibility: hidden)</div>
<div class="box">Блок 3</div>
\`\`\`

**Результат:**
- З \`display: none\`: Блок 2 повністю зникає, Блок 3 зміщується на позицію Блоку 2
- З \`visibility: hidden\`: Блок 2 невидимий, але його місце залишається порожнім, Блок 3 не зміщується

## Таблиця Порівняння

| **Властивість** | **Займає місце** | **Інтерактивний** | **Доступний скрін-рідерам** | **Можна анімувати** |
| --- | --- | --- | --- | --- |
| \`display: none\` | Ні | Ні | Ні | Ні |
| \`visibility: hidden\` | Так | Ні | Ні | Так |
| \`opacity: 0\` | Так | Так | Так | Так |

> **Важливо:** Обирайте метод приховання залежно від ваших потреб: \`display: none\` для повного видалення з макета, \`visibility: hidden\` для збереження місця, і \`opacity: 0\` якщо елемент повинен залишатися інтерактивним.`,
  },
];

async function updateQuestions() {
  try {
    for (const update of updates) {
      console.log(`📝 Updating: ${update.slug}`)
      const [existing] = await db.select().from(schema.questions)
        .where(eq(schema.questions.slug, update.slug)).limit(1)
      
      if (existing) {
        await db.update(schema.questions)
          .set({ contentMarkdownEn: update.contentMarkdownEn, contentMarkdownUa: update.contentMarkdownUa, updatedAt: new Date() })
          .where(eq(schema.questions.id, existing.id))
        console.log(`✅ Updated with full content\n`)
      }
    }
    console.log('✅ Batch update complete!')
  } finally {
    await client.end()
  }
}

updateQuestions().then(() => process.exit(0))
