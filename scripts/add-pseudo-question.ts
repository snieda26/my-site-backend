/**
 * Add "CSS Pseudo-classes and Pseudo-elements" Question to Database
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
const englishContent = `**CSS** provides powerful styling tools: **pseudo-classes** and **pseudo-elements**. They help select elements based on their state or create styles for parts of elements.

## Pseudo-classes

**Pseudo-classes** are selectors that allow you to select elements in a specific state (for example, on hover).

### Pseudo-class Syntax

\`\`\`css
selector:pseudo-class {
  /* styles */
}
\`\`\`

## Examples of Popular Pseudo-classes

- \`:hover\` — on mouse hover.
- \`:focus\` — when element receives focus.
- \`:nth-child(n)\` — to select an element by its order number.
- \`:checked\` — for checked checkboxes or radio buttons.
- \`:not(selector)\` — selects elements that don't match the selector.

## Pseudo-class Example

\`\`\`css
button:hover {
  background-color: #007BFF;
  color: white;
}
\`\`\`

> **Tip:** Pseudo-classes allow you to create interactive elements, such as buttons that change appearance on interaction.

## Pseudo-elements

**Pseudo-elements** allow you to style parts of elements (for example, the first letter or add text before an element).

### Pseudo-element Syntax

\`\`\`css
selector::pseudo-element {
  /* styles */
}
\`\`\`

## Examples of Popular Pseudo-elements

- \`::before\` — inserts content before an element.
- \`::after\` — inserts content after an element.
- \`::first-letter\` — styles the first letter of text.
- \`::first-line\` — styles the first line of text.
- \`::placeholder\` — styles text inside input fields.

## Pseudo-element Example

\`\`\`css
p::first-line {
  font-weight: bold;
}

button::after {
  content: " →";
}
\`\`\`

> **Note:** Modern CSS uses **double colons (::)** for pseudo-elements, but a single colon (:) is also allowed for backward compatibility.

## Comparison Table

| **Feature** | **Pseudo-classes** | **Pseudo-elements** |
| --- | --- | --- |
| **Syntax** | \`:pseudo-class\` | \`::pseudo-element\` |
| **Focus** | On element state | On part of element |
| **Examples** | \`:hover\`, \`:focus\`, \`:nth-child\` | \`::before\`, \`::after\` |

> **Browser Support:** Before using, make sure the required pseudo-class or pseudo-element is supported by all target browsers!`

// Ukrainian translation
const ukrainianContent = `**CSS** надає потужні інструменти стилізації: **псевдокласи** та **псевдоелементи**. Вони допомагають вибирати елементи на основі їх стану або створювати стилі для частин елементів.

## Псевдокласи

**Псевдокласи** — це селектори, які дозволяють вибирати елементи в певному стані (наприклад, при наведенні курсору).

### Синтаксис Псевдокласу

\`\`\`css
selector:pseudo-class {
  /* стилі */
}
\`\`\`

## Приклади Популярних Псевдокласів

- \`:hover\` — при наведенні мишки.
- \`:focus\` — коли елемент отримує фокус.
- \`:nth-child(n)\` — для вибору елемента за його порядковим номером.
- \`:checked\` — для відмічених чекбоксів або радіо-кнопок.
- \`:not(selector)\` — вибирає елементи, які не відповідають селектору.

## Приклад Псевдокласу

\`\`\`css
button:hover {
  background-color: #007BFF;
  color: white;
}
\`\`\`

> **Порада:** Псевдокласи дозволяють створювати інтерактивні елементи, такі як кнопки, які змінюють вигляд при взаємодії.

## Псевдоелементи

**Псевдоелементи** дозволяють стилізувати частини елементів (наприклад, першу літеру або додавати текст перед елементом).

### Синтаксис Псевдоелементу

\`\`\`css
selector::pseudo-element {
  /* стилі */
}
\`\`\`

## Приклади Популярних Псевдоелементів

- \`::before\` — вставляє вміст перед елементом.
- \`::after\` — вставляє вміст після елемента.
- \`::first-letter\` — стилізує першу літеру тексту.
- \`::first-line\` — стилізує перший рядок тексту.
- \`::placeholder\` — стилізує текст всередині полів введення.

## Приклад Псевдоелементу

\`\`\`css
p::first-line {
  font-weight: bold;
}

button::after {
  content: " →";
}
\`\`\`

> **Примітка:** Сучасний CSS використовує **подвійні двокрапки (::)** для псевдоелементів, але одна двокрапка (:) також дозволена для зворотної сумісності.

## Таблиця Порівняння

| **Особливість** | **Псевдокласи** | **Псевдоелементи** |
| --- | --- | --- |
| **Синтаксис** | \`:pseudo-class\` | \`::pseudo-element\` |
| **Фокус** | На стан елемента | На частину елемента |
| **Приклади** | \`:hover\`, \`:focus\`, \`:nth-child\` | \`::before\`, \`::after\` |

> **Підтримка Браузерами:** Перед використанням переконайтеся, що потрібний псевдоклас або псевдоелемент підтримується всіма цільовими браузерами!`

async function addQuestion() {
  try {
    console.log('🚀 Adding "CSS Pseudo-classes and Pseudo-elements" question to database...')
    
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
    const slug = 'css-pseudo-classes-pseudo-elements'
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
          titleEn: 'CSS Pseudo-classes and Pseudo-elements',
          titleUa: 'CSS Псевдокласи та Псевдоелементи',
          descriptionEn: 'Learn about CSS pseudo-classes and pseudo-elements. How to style elements based on their state and parts.',
          descriptionUa: 'Дізнайтесь про CSS псевдокласи та псевдоелементи. Як стилізувати елементи на основі їх стану та частин.',
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
        titleEn: 'CSS Pseudo-classes and Pseudo-elements',
        titleUa: 'CSS Псевдокласи та Псевдоелементи',
        descriptionEn: 'Learn about CSS pseudo-classes and pseudo-elements. How to style elements based on their state and parts.',
        descriptionUa: 'Дізнайтесь про CSS псевдокласи та псевдоелементи. Як стилізувати елементи на основі їх стану та частин.',
        contentMarkdownEn: englishContent,
        contentMarkdownUa: ukrainianContent,
        difficulty: 'MIDDLE',
        order: 3,
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

console.log('\n🚀 Adding CSS Pseudo-classes Question to Database')
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
