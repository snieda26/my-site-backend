/**
 * Add "CSS Selector Specificity" Question to Database
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
const englishContent = `CSS selector specificity determines which style will be applied when multiple selectors match the same element. The higher the specificity, the higher the style priority.

---

## Specificity Formula

Specificity is calculated based on categories that form a hierarchy. Each category has a different weight:

**Important**: The classical specificity counting system doesn't include \`!important\`, as it's a separate concept that overrides everything. Usually, we talk about **three** categories, but for completeness, \`!important\` can be mentioned as a special case:

1. **!important** — Overrides all normal styles (separate from the specificity mechanism)
2. **Inline styles** — Embedded styles (e.g., \`style="color: red;"\`) have the highest priority
3. **IDs** — Give a weight of 100 points each
4. **Classes, attributes, and pseudo-classes** — Add 10 points each
5. **Tags and pseudo-elements** — Add 1 point each

---

## Specificity Examples

| **Selector** | **Specificity** | **Explanation** |
| --- | --- | --- |
| \`*\` | 0, 0, 0 | Universal selector, minimum weight |
| \`p\` | 0, 0, 1 | One tag (1 point) |
| \`.class\` | 0, 1, 0 | One class (10 points) |
| \`#id\` | 1, 0, 0 | One identifier (100 points) |
| \`div.class\` | 0, 1, 1 | One tag (1) and one class (10) |
| \`#id .class p\` | 1, 1, 1 | One ID (100), one class (10), one tag (1) |
| \`style="color: red;"\` | Inline style | Maximum specificity |

---

## How Specificity Works

When styles from different selectors are applied to an element, the selector with greater specificity is used. If specificity is equal, the style that appears later in the code is applied (cascade rule).

---

## Example

\`\`\`html
<div id="example" class="box">
  Example text
</div>
\`\`\`

\`\`\`css
/* Styles */

div { color: black; }          /* 0, 0, 1 */
.box { color: blue; }          /* 0, 1, 0 */
#example { color: red; }       /* 1, 0, 0 */

/* Final style: text color will be red (#example) */
\`\`\`

> **Tip:** Avoid excessive use of ID selectors. This makes code less flexible and complicates style overriding.`

// Ukrainian translation
const ukrainianContent = `Специфічність CSS селекторів визначає, який стиль буде застосовано, коли кілька селекторів відповідають одному елементу. Чим вища специфічність, тим вищий пріоритет стилю.

---

## Формула Специфічності

Специфічність обчислюється на основі категорій, які формують ієрархію. Кожна категорія має різну вагу:

**Важливо**: Класична система підрахунку специфічності не включає \`!important\`, оскільки це окрема концепція, яка перевизначає все. Зазвичай ми говоримо про **три** категорії, але для повноти \`!important\` можна згадати як спеціальний випадок:

1. **!important** — Перевизначає всі звичайні стилі (окремо від механізму специфічності)
2. **Вбудовані стилі** — Вбудовані стилі (наприклад, \`style="color: red;"\`) мають найвищий пріоритет
3. **ID** — Дають вагу 100 балів кожен
4. **Класи, атрибути та псевдокласи** — Додають по 10 балів кожен
5. **Теги та псевдоелементи** — Додають по 1 балу кожен

---

## Приклади Специфічності

| **Селектор** | **Специфічність** | **Пояснення** |
| --- | --- | --- |
| \`*\` | 0, 0, 0 | Універсальний селектор, мінімальна вага |
| \`p\` | 0, 0, 1 | Один тег (1 бал) |
| \`.class\` | 0, 1, 0 | Один клас (10 балів) |
| \`#id\` | 1, 0, 0 | Один ідентифікатор (100 балів) |
| \`div.class\` | 0, 1, 1 | Один тег (1) і один клас (10) |
| \`#id .class p\` | 1, 1, 1 | Один ID (100), один клас (10), один тег (1) |
| \`style="color: red;"\` | Вбудований стиль | Максимальна специфічність |

---

## Як Працює Специфічність

Коли стилі з різних селекторів застосовуються до елемента, використовується селектор з більшою специфічністю. Якщо специфічність однакова, застосовується стиль, який з'являється пізніше в коді (правило каскаду).

---

## Приклад

\`\`\`html
<div id="example" class="box">
  Текст прикладу
</div>
\`\`\`

\`\`\`css
/* Стилі */

div { color: black; }          /* 0, 0, 1 */
.box { color: blue; }          /* 0, 1, 0 */
#example { color: red; }       /* 1, 0, 0 */

/* Підсумковий стиль: колір тексту буде червоним (#example) */
\`\`\`

> **Порада:** Уникайте надмірного використання ID селекторів. Це робить код менш гнучким і ускладнює перевизначення стилів.`

async function addQuestion() {
  try {
    console.log('🚀 Adding "CSS Selector Specificity" question to database...')
    
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
    const slug = 'css-selector-specificity'
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
          titleEn: 'CSS Selector Specificity',
          titleUa: 'Специфічність CSS Селекторів',
          descriptionEn: 'Learn how CSS specificity determines which styles are applied to elements.',
          descriptionUa: 'Дізнайтесь, як специфічність CSS визначає, які стилі застосовуються до елементів.',
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
        titleEn: 'CSS Selector Specificity',
        titleUa: 'Специфічність CSS Селекторів',
        descriptionEn: 'Learn how CSS specificity determines which styles are applied to elements.',
        descriptionUa: 'Дізнайтесь, як специфічність CSS визначає, які стилі застосовуються до елементів.',
        contentMarkdownEn: englishContent,
        contentMarkdownUa: ukrainianContent,
        difficulty: 'MIDDLE',
        order: 5,
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

console.log('\n🚀 Adding CSS Selector Specificity Question to Database')
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
