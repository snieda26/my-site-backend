/**
 * Batch Add Multiple Questions to Database
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
  // Question 1: CSS Position Property
  {
    slug: 'css-position-property',
    titleEn: 'CSS Position Property',
    titleUa: 'Властивість Position в CSS',
    descriptionEn: 'Learn about CSS position property and its values: static, relative, absolute, fixed, and sticky.',
    descriptionUa: 'Дізнайтесь про властивість position в CSS та її значення: static, relative, absolute, fixed та sticky.',
    difficulty: 'MIDDLE' as const,
    order: 6,
    contentMarkdownEn: `The **position** property in CSS determines how an element will be placed on the page and what it will be positioned relative to.

---

## Position Property Values

### static

- Default value
- Element is placed in the document according to the normal flow
- Does not respond to \`top\`, \`right\`, \`bottom\`, \`left\`, \`z-index\` properties

\`\`\`css
.element {
  position: static;
}
\`\`\`

### relative

Element remains in the flow but can be shifted using \`top\`, \`right\`, \`bottom\`, \`left\`. The space occupied by the element remains in place.

\`\`\`css
.element {
  position: relative;
  top: 10px; /* Shifts element down */
}
\`\`\`

### absolute

Element is removed from the flow and positioned relative to the nearest ancestor with \`position: relative\`, \`absolute\`, \`fixed\`, or \`sticky\`. If no such ancestor exists, it's positioned relative to \`body\`.

\`\`\`css
.container {
  position: relative;
}

.element {
  position: absolute;
  top: 0;
  left: 0; /* Positioned relative to container */
}
\`\`\`

### fixed

Element is removed from the flow and fixed relative to the browser window. Does not move when the page is scrolled. Used to create fixed elements such as headers or popup menus.

\`\`\`css
.element {
  position: fixed;
  top: 0;
  left: 0;
}
\`\`\`

### sticky

Element behaves like \`relative\` while its parent block is in the visible area of the screen. Positioned relative to the browser window when scrolling, if it crosses the specified \`top\`, \`right\`, \`bottom\`, \`left\` values.

\`\`\`css
.element {
  position: sticky;
  top: 10px; /* Fixed as soon as it reaches 10px from the top */
}
\`\`\`

> **Note:** When using \`sticky\`, make sure the parent container has height. Otherwise, positioning won't work.

---

## Comparison Table

| **Property** | **Document Flow** | **Positioned Relative To** |
| --- | --- | --- |
| \`static\` | In flow | Not positioned |
| \`relative\` | In flow | Itself |
| \`absolute\` | Out of flow | Nearest positioned ancestor or \`body\` |
| \`fixed\` | Out of flow | Browser window |
| \`sticky\` | In flow until fixed | Nearest scrollable container or viewport boundaries |`,
    contentMarkdownUa: `Властивість **position** в CSS визначає, як елемент буде розміщений на сторінці та відносно чого він буде позиціонуватися.

---

## Значення Властивості Position

### static

- Значення за замовчуванням
- Елемент розміщується в документі згідно з нормальним потоком
- Не реагує на властивості \`top\`, \`right\`, \`bottom\`, \`left\`, \`z-index\`

\`\`\`css
.element {
  position: static;
}
\`\`\`

### relative

Елемент залишається в потоці, але може бути зміщений за допомогою \`top\`, \`right\`, \`bottom\`, \`left\`. Простір, який займає елемент, залишається на місці.

\`\`\`css
.element {
  position: relative;
  top: 10px; /* Зміщує елемент вниз */
}
\`\`\`

### absolute

Елемент видаляється з потоку і позиціонується відносно найближчого предка з \`position: relative\`, \`absolute\`, \`fixed\` або \`sticky\`. Якщо такого предка немає, він позиціонується відносно \`body\`.

\`\`\`css
.container {
  position: relative;
}

.element {
  position: absolute;
  top: 0;
  left: 0; /* Позиціонується відносно контейнера */
}
\`\`\`

### fixed

Елемент видаляється з потоку і фіксується відносно вікна браузера. Не рухається при прокручуванні сторінки. Використовується для створення фіксованих елементів, таких як заголовки або спливаючі меню.

\`\`\`css
.element {
  position: fixed;
  top: 0;
  left: 0;
}
\`\`\`

### sticky

Елемент поводиться як \`relative\`, поки батьківський блок знаходиться в видимій області екрану. Позиціонується відносно вікна браузера при прокручуванні, якщо він перетинає вказані значення \`top\`, \`right\`, \`bottom\`, \`left\`.

\`\`\`css
.element {
  position: sticky;
  top: 10px; /* Фіксується, як тільки досягає 10px від верху */
}
\`\`\`

> **Примітка:** При використанні \`sticky\`, переконайтеся, що батьківський контейнер має висоту. Інакше позиціонування не спрацює.

---

## Таблиця Порівняння

| **Властивість** | **Потік Документу** | **Позиціонується Відносно** |
| --- | --- | --- |
| \`static\` | У потоці | Не позиціонується |
| \`relative\` | У потоці | Себе самого |
| \`absolute\` | Поза потоком | Найближчого позиціонованого предка або \`body\` |
| \`fixed\` | Поза потоком | Вікна браузера |
| \`sticky\` | У потоці до фіксації | Найближчого контейнера з прокручуванням або межі вьюпорту |`,
  },
  
  // Question 2: Flexbox vs CSS Grid
  {
    slug: 'flexbox-vs-css-grid',
    titleEn: 'Flexbox vs CSS Grid',
    titleUa: 'Flexbox проти CSS Grid',
    descriptionEn: 'Understand the differences between Flexbox and CSS Grid and when to use each layout system.',
    descriptionUa: 'Зрозумійте різницю між Flexbox та CSS Grid і коли використовувати кожну систему компонування.',
    difficulty: 'MIDDLE' as const,
    order: 7,
    contentMarkdownEn: `**Flexbox** and **CSS Grid** are two powerful CSS tools used to create flexible and responsive layouts. Both methods are designed to control element placement on a page, but their approaches and capabilities differ.

---

## Flexbox

**Flexbox** (or **Flexible Box Layout**) is designed to create one-dimensional layouts where elements are arranged in one direction (horizontally or vertically).

### Flexbox Features

- Works in one dimension: **either horizontally or vertically**
- Elements can change their size to fill available space
- Convenient for centering elements, distributing space between them, and for responsive layouts

### Flexbox Usage Example

\`\`\`html
<div class="container">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
</div>
\`\`\`

\`\`\`css
.container {
  display: flex;
  justify-content: space-between; /* Horizontal element distribution */
  align-items: center; /* Vertical element alignment */
}

.item {
  flex: 1; /* Each element takes equal space */
}
\`\`\`

---

## CSS Grid

**CSS Grid** is designed to create two-dimensional layouts where elements are arranged in two directions (horizontally and vertically).

### CSS Grid Features

- Works on two axes: horizontal and vertical
- Allows creating complex grids with explicit control over element placement in cells
- Makes it easy to create layouts with fixed and responsive sizes

### CSS Grid Usage Example

\`\`\`html
<div class="container">
  <div class="item">Item 1</div>
  <div class="item">Item 2</div>
  <div class="item">Item 3</div>
</div>
\`\`\`

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr; /* Three columns with different widths */
  grid-template-rows: 100px auto; /* Two rows: first fixed, second responsive */
  gap: 10px; /* Space between cells */
}

.item {
  background-color: lightblue;
}
\`\`\`

---

## Key Differences Between Flexbox and CSS Grid

| **Characteristic** | **Flexbox** | **CSS Grid** |
| --- | --- | --- |
| **Working Axis** | One axis (horizontal or vertical) | Two dimensions (horizontal and vertical) |
| **Ease of Use** | Simple for one-axis layouts | More complex for two-dimensional layouts |
| **Flexibility** | Well-suited for flexible one-dimension layouts | Allows creating precise two-dimensional layouts |
| **Element Positioning** | Distribution along axis and alignment | Precise positioning in grid cells |
| **Structure Complexity** | Simple for basic layouts | Allows creating complex multi-cell layouts |
| **Legacy Browser Support** | Well-supported in older browsers | May require polyfills for older browsers |

> **Tip:** Use **Flexbox** for one-axis layouts, and **CSS Grid** for more complex two-dimensional layouts. In some cases, they can be used together to achieve optimal results.

---

## Useful Resources

- [Flexbox Froggy](https://flexboxfroggy.com/) - Flexbox trainer
- [Grid Garden](https://cssgridgarden.com/) - CSS Grid trainer
- [Grid by Example](https://gridbyexample.com) - Everything you need to understand CSS Grid
- [CSS Battle](https://cssbattle.dev/) - CSS challenges`,
    contentMarkdownUa: `**Flexbox** та **CSS Grid** — це два потужні інструменти CSS, які використовуються для створення гнучких і адаптивних макетів. Обидва методи призначені для контролю розміщення елементів на сторінці, але їх підходи та можливості відрізняються.

---

## Flexbox

**Flexbox** (або **Flexible Box Layout**) призначений для створення одновимірних макетів, де елементи розташовуються в одному напрямку (горизонтально або вертикально).

### Особливості Flexbox

- Працює в одному вимірі: **або горизонтально, або вертикально**
- Елементи можуть змінювати свій розмір, щоб заповнити доступний простір
- Зручний для центрування елементів, розподілу простору між ними та для адаптивних макетів

### Приклад Використання Flexbox

\`\`\`html
<div class="container">
  <div class="item">Елемент 1</div>
  <div class="item">Елемент 2</div>
  <div class="item">Елемент 3</div>
</div>
\`\`\`

\`\`\`css
.container {
  display: flex;
  justify-content: space-between; /* Горизонтальний розподіл елементів */
  align-items: center; /* Вертикальне вирівнювання елементів */
}

.item {
  flex: 1; /* Кожен елемент займає рівний простір */
}
\`\`\`

---

## CSS Grid

**CSS Grid** призначений для створення двовимірних макетів, де елементи розташовуються в двох напрямках (горизонтально і вертикально).

### Особливості CSS Grid

- Працює на двох осях: горизонтальній і вертикальній
- Дозволяє створювати складні сітки з явним контролем розміщення елементів у комірках
- Полегшує створення макетів з фіксованими та адаптивними розмірами

### Приклад Використання CSS Grid

\`\`\`html
<div class="container">
  <div class="item">Елемент 1</div>
  <div class="item">Елемент 2</div>
  <div class="item">Елемент 3</div>
</div>
\`\`\`

\`\`\`css
.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr; /* Три колонки з різною шириною */
  grid-template-rows: 100px auto; /* Два рядки: перший фіксований, другий адаптивний */
  gap: 10px; /* Простір між комірками */
}

.item {
  background-color: lightblue;
}
\`\`\`

---

## Ключові Відмінності Між Flexbox та CSS Grid

| **Характеристика** | **Flexbox** | **CSS Grid** |
| --- | --- | --- |
| **Робоча Вісь** | Одна вісь (горизонтальна або вертикальна) | Два виміри (горизонтальна і вертикальна осі) |
| **Простота Використання** | Простий для одновісних макетів | Складніший для двовимірних макетів |
| **Гнучкість** | Підходить для гнучких одновимірних макетів | Дозволяє створювати точні двовимірні макети |
| **Позиціонування Елементів** | Розподіл вздовж осі та вирівнювання | Точне позиціонування в комірках сітки |
| **Складність Структури** | Простий для базових макетів | Дозволяє створювати складні багатокомірні макети |
| **Підтримка Старих Браузерів** | Добре підтримується в старих браузерах | Може потребувати поліфілів для старих браузерів |

> **Порада:** Використовуйте **Flexbox** для одновісних макетів, а **CSS Grid** для складніших двовимірних макетів. У деяких випадках їх можна використовувати разом для досягнення оптимальних результатів.

---

## Корисні Ресурси

- [Flexbox Froggy](https://flexboxfroggy.com/) - Тренажер Flexbox
- [Grid Garden](https://cssgridgarden.com/) - Тренажер CSS Grid
- [Grid by Example](https://gridbyexample.com) - Все, що потрібно для розуміння CSS Grid
- [CSS Battle](https://cssbattle.dev/) - CSS челенджі`,
  },
];

async function addQuestions() {
  try {
    console.log('🚀 Adding multiple questions to database...\n')
    
    // Find html-css category
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
      
      // Check if question already exists
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

console.log('\n🚀 Batch Adding Questions to Database')
console.log('===================================\n')

addQuestions()
  .then(() => {
    console.log('\n✅ All questions processed!\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error)
    process.exit(1)
  })
