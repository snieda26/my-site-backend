/**
 * Add "CSS Selectors" Question to Database
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

// Clean English content
const englishContent = `CSS selectors are tools for selecting and styling HTML elements. They allow you to apply styles to specific elements based on their tags, classes, IDs, and other characteristics.

---

## Types of CSS Selectors

### Basic Selectors

| **Selector** | **Syntax** | **Description** | **Example** |
| --- | --- | --- | --- |
| **Tag Selector** | \`element\` | Selects all elements of a specific type | \`p { color: red; }\` |
| **Class Selector** | \`.classname\` | Selects all elements with a specific class | \`.button { color: blue; }\` |
| **ID Selector** | \`#idname\` | Selects an element with a specific ID | \`#header { font-size: 24px; }\` |
| **Universal Selector** | \`*\` | Selects all elements | \`* { margin: 0; }\` |
| **Group Selector** | \`E, F\` | Selects multiple elements | \`h1, h2 { font-weight: bold; }\` |

### Combinator Selectors

- **Child selector** (\`E > F\`) — selects only direct descendants.

Example: \`div > p\` selects paragraphs that are direct children of \`div\`.

- **Adjacent sibling selector** (\`E + F\`) — selects the element immediately following the specified one.

Example: \`h1 + p\` selects the first paragraph immediately after an \`h1\` heading.

- **General sibling selector** (\`E ~ F\`) — selects all elements following the specified one.

Example: \`h1 ~ p\` selects all paragraphs following an \`h1\`.

### Attribute Selectors

| **Selector** | **Description** | **Example** |
| --- | --- | --- |
| \`[attr]\` | Elements with the attribute | \`[disabled]\` |
| \`[attr=value]\` | Elements where attribute equals value | \`[type="text"]\` |
| \`[attr*=value]\` | Elements where attribute contains value | \`[class*="btn"]\` |
| \`[attr^=value]\` | Elements where attribute starts with value | \`[href^="https"]\` |
| \`[attr$=value]\` | Elements where attribute ends with value | \`[src$=".jpg"]\` |

---

## Selector Usage Examples

\`\`\`css
/* Tag selector */
p {
  color: red;
}

/* Class selector */
.button {
  background-color: blue;
}

/* ID selector */
#header {
  font-size: 24px;
}

/* Attribute selector */
input[type="text"] {
  border: 1px solid #ccc;
}
\`\`\`

> **Tip:** Practice CSS selectors at [CSS Diner](https://flukeout.github.io/) - an interactive game that will help you master CSS selectors!`

// Ukrainian translation
const ukrainianContent = `CSS селектори — це інструменти для вибору та стилізації HTML елементів. Вони дозволяють застосовувати стилі до конкретних елементів на основі їх тегів, класів, ідентифікаторів та інших характеристик.

---

## Типи CSS Селекторів

### Базові Селектори

| **Селектор** | **Синтаксис** | **Опис** | **Приклад** |
| --- | --- | --- | --- |
| **Селектор Тегу** | \`element\` | Вибирає всі елементи певного типу | \`p { color: red; }\` |
| **Селектор Класу** | \`.classname\` | Вибирає всі елементи з певним класом | \`.button { color: blue; }\` |
| **Селектор ID** | \`#idname\` | Вибирає елемент з певним ID | \`#header { font-size: 24px; }\` |
| **Універсальний Селектор** | \`*\` | Вибирає всі елементи | \`* { margin: 0; }\` |
| **Груповий Селектор** | \`E, F\` | Вибирає декілька елементів | \`h1, h2 { font-weight: bold; }\` |

### Комбінаторні Селектори

- **Селектор дочірніх елементів** (\`E > F\`) — вибирає тільки прямих нащадків.

Приклад: \`div > p\` вибирає параграфи, які є прямими дітьми \`div\`.

- **Селектор сусіднього елемента** (\`E + F\`) — вибирає елемент, що йде безпосередньо після вказаного.

Приклад: \`h1 + p\` вибирає перший параграф відразу після заголовка \`h1\`.

- **Загальний селектор сусідніх елементів** (\`E ~ F\`) — вибирає всі елементи, що йдуть після вказаного.

Приклад: \`h1 ~ p\` вибирає всі параграфи після \`h1\`.

### Селектори Атрибутів

| **Селектор** | **Опис** | **Приклад** |
| --- | --- | --- |
| \`[attr]\` | Елементи з атрибутом | \`[disabled]\` |
| \`[attr=value]\` | Елементи, де атрибут дорівнює значенню | \`[type="text"]\` |
| \`[attr*=value]\` | Елементи, де атрибут містить значення | \`[class*="btn"]\` |
| \`[attr^=value]\` | Елементи, де атрибут починається зі значення | \`[href^="https"]\` |
| \`[attr$=value]\` | Елементи, де атрибут закінчується на значення | \`[src$=".jpg"]\` |

---

## Приклади Використання Селекторів

\`\`\`css
/* Селектор тегу */
p {
  color: red;
}

/* Селектор класу */
.button {
  background-color: blue;
}

/* Селектор ID */
#header {
  font-size: 24px;
}

/* Селектор атрибуту */
input[type="text"] {
  border: 1px solid #ccc;
}
\`\`\`

> **Порада:** Практикуйте CSS селектори на [CSS Diner](https://flukeout.github.io/) - інтерактивна гра, яка допоможе вам освоїти CSS селектори!`

async function addQuestion() {
  try {
    console.log('🚀 Adding "CSS Selectors" question to database...')
    
    // Find html-css category
    const [category] = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.slug, 'html-css'))
      .limit(1)

    if (!category) {
      throw new Error('HTML & CSS category not found')
    }

    console.log(`✓ Found category: ${category.nameEn}`)

    // Check if question already exists
    const slug = 'css-selectors'
    const [existing] = await db
      .select()
      .from(schema.questions)
      .where(eq(schema.questions.slug, slug))
      .limit(1)

    if (existing) {
      console.log('⚠️  Question already exists, updating...')
      
      const [updated] = await db
        .update(schema.questions)
        .set({
          titleEn: 'CSS Selectors',
          titleUa: 'CSS Селектори',
          descriptionEn: 'Learn about CSS selectors and how to select HTML elements for styling.',
          descriptionUa: 'Дізнайтесь про CSS селектори та як вибирати HTML елементи для стилізації.',
          contentMarkdownEn: englishContent,
          contentMarkdownUa: ukrainianContent,
          updatedAt: new Date()
        })
        .where(eq(schema.questions.id, existing.id))
        .returning()

      console.log('✅ Question updated successfully!')
      console.log(`   ID: ${updated.id}`)
      console.log(`   Slug: ${updated.slug}`)
      return
    }

    // Insert new question
    const [question] = await db
      .insert(schema.questions)
      .values({
        slug: slug,
        titleEn: 'CSS Selectors',
        titleUa: 'CSS Селектори',
        descriptionEn: 'Learn about CSS selectors and how to select HTML elements for styling.',
        descriptionUa: 'Дізнайтесь про CSS селектори та як вибирати HTML елементи для стилізації.',
        contentMarkdownEn: englishContent,
        contentMarkdownUa: ukrainianContent,
        difficulty: 'MIDDLE',
        order: 4,
        categoryId: category.id,
      })
      .returning()

    console.log('✅ Question added successfully!')
    console.log(`   ID: ${question.id}`)
    console.log(`   Slug: ${question.slug}`)
    console.log(`   Title EN: ${question.titleEn}`)
    console.log(`   Title UA: ${question.titleUa}`)
    console.log(`   Category: ${category.nameEn}`)
    
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.end()
  }
}

console.log('\n🚀 Adding CSS Selectors Question to Database')
console.log('===================================\n')

addQuestion()
  .then(() => {
    console.log('\n✅ Done!\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error)
    process.exit(1)
  })
