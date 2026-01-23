/**
 * Batch Add Questions (Batch 2) to Database
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

const questions = [
  // Question 3: CSS Display Property
  {
    slug: 'css-display-property',
    titleEn: 'CSS Display Property',
    titleUa: 'Властивість Display в CSS',
    descriptionEn: 'Learn about CSS display property and its various values for controlling element rendering.',
    descriptionUa: 'Дізнайтесь про властивість display в CSS та її різні значення для контролю відображення елементів.',
    difficulty: 'EASY' as const,
    order: 8,
    contentMarkdownEn: `The **display** property in CSS controls how an element is displayed on the page. It determines whether an element will be a block, inline element, or an element with another display type.

---

## Main Values for the Display Property

| **Value** | **Description** | **Example** |
| --- | --- | --- |
| \`block\` | Element takes up the full available width, starting from a new line | \`<div>\`, \`<p>\`, \`<h1>\` |
| \`inline\` | Element takes up only the necessary width and does not cause a line break | \`<span>\`, \`<a>\`, \`<strong>\` |
| \`inline-block\` | Element behaves like inline but allows setting dimensions | \`<img>\`, \`<button>\` |
| \`none\` | Element is not displayed and takes up no space | \`<div style="display: none;">\` |
| \`flex\` | Element becomes a flex container | \`<div style="display: flex;">\` |
| \`grid\` | Element becomes a grid container | \`<div style="display: grid;">\` |
| \`table\` | Element behaves like a table | \`<div style="display: table;">\` |
| \`list-item\` | Element behaves like a list item | \`<div style="display: list-item;">\` |
| \`inherit\` | Value is inherited from the parent element | \`<div style="display: inherit;">\` |

---

## When to Use Each Value

1. **\`block\`** — Use for elements that should take up the full width of the parent container
2. **\`inline\`** — Use for elements that should be placed in line with other elements
3. **\`inline-block\`** — Useful for creating elements that should be inline but have dimensions
4. **\`none\`** — Use to hide elements when you need to completely remove them from the document flow
5. **\`flex\`** — Use to create flexible, responsive layouts
6. **\`grid\`** — Use to create two-dimensional layouts with precise positioning
7. **\`table\`** — Use to create tables where elements should behave like table rows and cells

---

## Usage Example

\`\`\`css
/* Flex container */
.container {
  display: flex;
  justify-content: space-between;
}

/* Grid element */
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

/* Hiding element */
.hidden {
  display: none;
}
\`\`\`

> **Note:** When using \`display: none\`, the element is not only hidden but also takes up no space in the document flow. If you need to hide an element but keep its space, use \`visibility: hidden\`.`,
    contentMarkdownUa: `Властивість **display** в CSS контролює, як елемент відображається на сторінці. Вона визначає, чи буде елемент блоковим, рядковим або елементом з іншим типом відображення.

---

## Основні Значення Властивості Display

| **Значення** | **Опис** | **Приклад** |
| --- | --- | --- |
| \`block\` | Елемент займає всю доступну ширину, починаючи з нового рядка | \`<div>\`, \`<p>\`, \`<h1>\` |
| \`inline\` | Елемент займає тільки необхідну ширину і не викликає розриву рядка | \`<span>\`, \`<a>\`, \`<strong>\` |
| \`inline-block\` | Елемент поводиться як рядковий, але дозволяє встановлювати розміри | \`<img>\`, \`<button>\` |
| \`none\` | Елемент не відображається і не займає місця | \`<div style="display: none;">\` |
| \`flex\` | Елемент стає flex контейнером | \`<div style="display: flex;">\` |
| \`grid\` | Елемент стає grid контейнером | \`<div style="display: grid;">\` |
| \`table\` | Елемент поводиться як таблиця | \`<div style="display: table;">\` |
| \`list-item\` | Елемент поводиться як елемент списку | \`<div style="display: list-item;">\` |
| \`inherit\` | Значення успадковується від батьківського елемента | \`<div style="display: inherit;">\` |

---

## Коли Використовувати Кожне Значення

1. **\`block\`** — Використовуйте для елементів, які повинні займати всю ширину батьківського контейнера
2. **\`inline\`** — Використовуйте для елементів, які повинні розміщуватися в рядку з іншими елементами
3. **\`inline-block\`** — Корисно для створення елементів, які повинні бути в рядку, але мати розміри
4. **\`none\`** — Використовуйте для приховування елементів, коли потрібно повністю видалити їх з потоку документа
5. **\`flex\`** — Використовуйте для створення гнучких, адаптивних макетів
6. **\`grid\`** — Використовуйте для створення двовимірних макетів з точним позиціонуванням
7. **\`table\`** — Використовуйте для створення таблиць, де елементи повинні поводитися як рядки та комірки таблиці

---

## Приклад Використання

\`\`\`css
/* Flex контейнер */
.container {
  display: flex;
  justify-content: space-between;
}

/* Grid елемент */
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

/* Приховування елемента */
.hidden {
  display: none;
}
\`\`\`

> **Примітка:** При використанні \`display: none\`, елемент не тільки приховується, але й не займає місця в потоці документа. Якщо потрібно приховати елемент, але зберегти його простір, використовуйте \`visibility: hidden\`.`,
  },
  
  // Question 4: CSS Box-sizing
  {
    slug: 'css-box-sizing-property',
    titleEn: 'CSS Box-sizing Property',
    titleUa: 'Властивість Box-sizing в CSS',
    descriptionEn: 'Understand how box-sizing property affects element dimensions with padding and borders.',
    descriptionUa: 'Зрозумійте, як властивість box-sizing впливає на розміри елементів з padding та border.',
    difficulty: 'MEDIUM' as const,
    order: 9,
    contentMarkdownEn: `The **box-sizing** property in CSS determines how element dimensions are calculated, including its **padding** and **border**. It helps control how the **total width** and **height** of an element will be calculated when adding internal padding and borders.

---

## Box-sizing Property Values

### content-box

- With \`box-sizing: content-box\`, the \`width\` and \`height\` properties include **only the content**
- **Padding** and **border** are not included in the dimensions and are added separately
- **Element width** = content + padding + border
- This is the standard behavior used by most elements in browsers

**Example:**

\`\`\`css
.element {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
}
\`\`\`

In this example, the element will have a total width greater than 200px, as padding and border are added to the specified width.

---

### border-box

With \`box-sizing: border-box\`, the \`width\` and \`height\` properties include content, padding, and border. This means that the specified width and height are preserved, and padding and border are built into these dimensions.

- **Element width** = content (includes padding and border)
- This mode is convenient as it allows precise control over element dimensions without accounting for additional padding

**Example:**

\`\`\`css
.element {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
}
\`\`\`

In this case, the element will have a width of 200px, including padding and border, meaning the size remains exactly as specified.

---

## Important Points

- \`box-sizing: content-box\`: element dimensions can increase with the addition of padding and border
- \`box-sizing: border-box\`: dimensions remain constant, including padding and border

> **Recommendation:** Use \`box-sizing: border-box\` for all elements using the universal selector \`*\` to simplify layout and avoid unexpected size changes due to padding and border.

\`\`\`css
* {
  box-sizing: border-box;
}
\`\`\``,
    contentMarkdownUa: `Властивість **box-sizing** в CSS визначає, як обчислюються розміри елемента, включаючи його **padding** та **border**. Вона допомагає контролювати, як буде розраховуватися **загальна ширина** та **висота** елемента при додаванні внутрішніх відступів та рамок.

---

## Значення Властивості Box-sizing

### content-box

- З \`box-sizing: content-box\`, властивості \`width\` і \`height\` включають **тільки вміст**
- **Padding** та **border** не включені в розміри і додаються окремо
- **Ширина елемента** = вміст + padding + border
- Це стандартна поведінка, яка використовується більшістю елементів у браузерах

**Приклад:**

\`\`\`css
.element {
  box-sizing: content-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
}
\`\`\`

У цьому прикладі елемент матиме загальну ширину більше 200px, оскільки padding та border додаються до вказаної ширини.

---

### border-box

З \`box-sizing: border-box\`, властивості \`width\` і \`height\` включають вміст, padding та border. Це означає, що вказана ширина і висота зберігаються, а padding та border вбудовуються в ці розміри.

- **Ширина елемента** = вміст (включає padding і border)
- Цей режим зручний, оскільки дозволяє точно контролювати розміри елементів без урахування додаткових відступів

**Приклад:**

\`\`\`css
.element {
  box-sizing: border-box;
  width: 200px;
  padding: 20px;
  border: 5px solid black;
}
\`\`\`

У цьому випадку елемент матиме ширину 200px, включаючи padding та border, тобто розмір залишається точно таким, як вказано.

---

## Важливі Моменти

- \`box-sizing: content-box\`: розміри елемента можуть збільшуватися при додаванні padding та border
- \`box-sizing: border-box\`: розміри залишаються постійними, включаючи padding та border

> **Рекомендація:** Використовуйте \`box-sizing: border-box\` для всіх елементів за допомогою універсального селектора \`*\`, щоб спростити компонування та уникнути неочікуваних змін розміру через padding та border.

\`\`\`css
* {
  box-sizing: border-box;
}
\`\`\``,
  },
];

async function addQuestions() {
  try {
    console.log('🚀 Adding batch 2 questions to database...\n')
    
    const [category] = await db
      .select()
      .from(schema.categories)
      .where(eq(schema.categories.slug, 'html-css'))
      .limit(1)

    if (!category) {
      throw new Error('HTML & CSS category not found')
    }

    console.log(`✓ Found category: ${category.nameEn}\n`)

    for (const questionData of questions) {
      console.log(`\n📝 Processing: ${questionData.titleEn}`)
      
      const [existing] = await db
        .select()
        .from(schema.questions)
        .where(eq(schema.questions.slug, questionData.slug))
        .limit(1)

      if (existing) {
        console.log('⚠️  Question already exists, updating...')
        
        const [updated] = await db
          .update(schema.questions)
          .set({
            ...questionData,
            categoryId: category.id,
            updatedAt: new Date()
          })
          .where(eq(schema.questions.id, existing.id))
          .returning()

        console.log(`✅ Updated: ${updated.slug}`)
      } else {
        const [question] = await db
          .insert(schema.questions)
          .values({
            ...questionData,
            categoryId: category.id,
          })
          .returning()

        console.log(`✅ Added: ${question.slug}`)
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.end()
  }
}

console.log('\n🚀 Batch 2: Adding Questions to Database')
console.log('===================================\n')

addQuestions()
  .then(() => {
    console.log('\n✅ Batch 2 complete!\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error)
    process.exit(1)
  })
