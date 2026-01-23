/**
 * Update Final 9 Questions with Full Comprehensive Content
 * This updates the previously added questions with complete markdown content
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import * as dotenv from 'dotenv'
import * as schema from '../src/core/database/schema'
import { eq } from 'drizzle-orm'

const postgres = require('postgres')

dotenv.config()

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL not set')
}

const cleanConnectionString = connectionString.split('?')[0]
const client = postgres(cleanConnectionString)
const db = drizzle(client, { schema })

const fullContentUpdates = [
  // 1. Style Isolation - FULL CONTENT
  {
    slug: 'css-style-isolation',
    contentMarkdownEn: `## What is Style Isolation?

**Style isolation** is an approach to writing CSS where styles of one component **don't affect** other parts of the application. This is important for:

- preventing style conflicts
- simplifying code scalability
- reusing components without side effects

## Style Isolation Methods

### BEM (Block Element Modifier)

Class naming methodology ensuring uniqueness and predictability of styles.

\`\`\`css
/* BEM style */
.button {}
.button__icon {}
.button--primary {}
\`\`\`

- Class names describe component hierarchy
- Works in any CSS, without tools

### CSS Modules

\`.module.css\` (or \`.module.scss\`) files used in React/Vue/etc. provide automatic **class localization**.

\`\`\`jsx
import styles from './Button.module.css';

function Button() {
  return <button className={styles.primary}>Click</button>;
}
\`\`\`

- Classes transform to unique ones
- No intersections between components

### Shadow DOM (Web Components)

Browser-level isolation — creates "shadow" DOM area hidden from external styles.

\`\`\`javascript
const shadow = element.attachShadow({ mode: "open" });
shadow.innerHTML = \`<style>p { color: red; }</style><p>Hello</p>\`;
\`\`\`

- Complete isolation
- Styles don't leak in or out
- Requires Web Components support

### CSS-in-JS

Styles written directly in JavaScript using libraries: **Styled-components**, **Emotion**, **Stitches**, **Vanilla Extract**

\`\`\`jsx
import styled from 'styled-components';

const Button = styled.button\`
  color: white;
  background: blue;
\`;
\`\`\`

### Atomic CSS (Utility-first)

Using classes with specific values (Tailwind CSS).

\`\`\`html
<button class="bg-blue-500 text-white px-4 py-2">Click</button>
\`\`\`

> **Recommendation:** Choose isolation method based on project scale and team preferences.`,
    contentMarkdownUa: `## Що Таке Ізоляція Стилів?

**Ізоляція стилів** — це підхід до написання CSS, де стилі одного компонента **не впливають** на інші частини застосунку. Це важливо для:

- запобігання конфліктів стилів
- спрощення масштабованості коду
- повторного використання компонентів без побічних ефектів

## Методи Ізоляції Стилів

### BEM (Block Element Modifier)

Методологія іменування класів, що забезпечує унікальність та передбачуваність стилів.

\`\`\`css
/* BEM стиль */
.button {}
.button__icon {}
.button--primary {}
\`\`\`

- Імена класів описують ієрархію компонентів
- Працює в будь-якому CSS, без інструментів

### CSS Modules

Файли \`.module.css\` (або \`.module.scss\`), що використовуються в React/Vue/тощо, надають автоматичну **локалізацію класів**.

\`\`\`jsx
import styles from './Button.module.css';

function Button() {
  return <button className={styles.primary}>Натисни</button>;
}
\`\`\`

- Класи перетворюються на унікальні
- Немає пересічень між компонентами

### Shadow DOM (Web Components)

Ізоляція на рівні браузера — створює "тіньову" DOM область, приховану від зовнішніх стилів.

\`\`\`javascript
const shadow = element.attachShadow({ mode: "open" });
shadow.innerHTML = \`<style>p { color: red; }</style><p>Привіт</p>\`;
\`\`\`

- Повна ізоляція
- Стилі не просочуються ні всередину, ні назовні
- Потребує підтримки Web Components

### CSS-in-JS

Стилі, написані безпосередньо в JavaScript з використанням бібліотек: **Styled-components**, **Emotion**, **Stitches**, **Vanilla Extract**

\`\`\`jsx
import styled from 'styled-components';

const Button = styled.button\`
  color: white;
  background: blue;
\`;
\`\`\`

### Atomic CSS (Utility-first)

Використання класів із конкретними значеннями (Tailwind CSS).

\`\`\`html
<button class="bg-blue-500 text-white px-4 py-2">Натисни</button>
\`\`\`

> **Рекомендація:** Обирайте метод ізоляції на основі масштабу проекту та переваг команди.`,
  },

  // Continue with async/defer... (I'll add all 9 updates in parts)
];

async function updateQuestions() {
  try {
    console.log('🔄 Updating questions with full comprehensive content...\\n')
    
    for (const update of fullContentUpdates) {
      console.log(`📝 Updating: ${update.slug}`)
      
      const [existing] = await db
        .select()
        .from(schema.questions)
        .where(eq(schema.questions.slug, update.slug))
        .limit(1)

      if (!existing) {
        console.log(`⚠️  Question not found: ${update.slug}`)
        continue
      }

      await db
        .update(schema.questions)
        .set({
          contentMarkdownEn: update.contentMarkdownEn,
          contentMarkdownUa: update.contentMarkdownUa,
          updatedAt: new Date()
        })
        .where(eq(schema.questions.id, existing.id))

      console.log(`✅ Updated with full content`)
      console.log('')
    }
    
    console.log('✅ Content update complete!')
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.end()
  }
}

updateQuestions()
  .then(() => process.exit(0))
  .catch((error) => { console.error('\\n❌ Failed:', error); process.exit(1); });
