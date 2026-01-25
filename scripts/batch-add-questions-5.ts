/**
 * Batch Add Questions (Batch 5) - BEM, Margin Collapsing, Stacking Order
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
  // Question 1: BEM Methodology
  {
    slug: 'bem-methodology',
    titleEn: 'BEM Methodology (Block Element Modifier)',
    titleUa: 'Методологія BEM (Block Element Modifier)',
    descriptionEn: 'Learn about BEM naming convention for organizing and maintaining CSS code.',
    descriptionUa: 'Дізнайтесь про конвенцію іменування BEM для організації та підтримки CSS коду.',
    difficulty: 'MIDDLE' as const,
    order: 17,
    contentMarkdownEn: `**BEM (Block — Element — Modifier)** is a **CSS class naming methodology** created for **organization, reusability and scalability** of HTML and CSS code.

It helps avoid style conflicts, makes code **understandable**, **predictable** and **easy to maintain** when working in a team.

---

## Breakdown

| **Component** | **Description** |
| --- | --- |
| **Block** | Independent entity, semantic component (e.g., \`header\`, \`button\`) |
| **Element** | Part of a block, has no meaning outside it (\`button__icon\`) |
| **Modifier** | State or variation of block/element (\`button--active\`, \`button__icon--small\`) |

---

## Naming Convention

\`\`\`
block__element--modifier
\`\`\`

### Examples:

\`\`\`css
.button { }                    /* Block */
.button__icon { }              /* Element */
.button--primary { }           /* Modifier */
.button__icon--large { }       /* Element with Modifier */
\`\`\`

---

## Practical Example

\`\`\`html
<div class="card card--featured">
  <h2 class="card__title">Title</h2>
  <p class="card__text">Description</p>
  <button class="card__button card__button--primary">
    <span class="card__button-icon"></span>
    Click me
  </button>
</div>
\`\`\`

\`\`\`css
/* Block */
.card {
  padding: 20px;
  border: 1px solid #ddd;
}

/* Modifier */
.card--featured {
  border-color: gold;
  background: #fffef0;
}

/* Elements */
.card__title {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.card__text {
  color: #666;
}

.card__button {
  padding: 10px 20px;
}

/* Element with modifier */
.card__button--primary {
  background: blue;
  color: white;
}
\`\`\`

---

## Benefits of BEM

✅ **Clear structure** - Easy to understand which element belongs to which block
✅ **No conflicts** - Unique class names prevent style collisions
✅ **Reusability** - Blocks can be used anywhere
✅ **Easy maintenance** - Changes to one block don't affect others
✅ **Team-friendly** - Consistent naming convention for everyone

> **Benefits:** BEM makes code self-documenting, prevents style conflicts, and simplifies working in teams.`,
    contentMarkdownUa: `**BEM (Block — Element — Modifier)** — це **методологія іменування CSS класів**, створена для **організації, повторного використання та масштабованості** HTML та CSS коду.

Вона допомагає уникнути конфліктів стилів, робить код **зрозумілим**, **передбачуваним** та **легким у підтримці** при роботі в команді.

---

## Розбивка

| **Компонент** | **Опис** |
| --- | --- |
| **Block (Блок)** | Незалежна сутність, семантичний компонент (наприклад, \`header\`, \`button\`) |
| **Element (Елемент)** | Частина блоку, не має значення поза ним (\`button__icon\`) |
| **Modifier (Модифікатор)** | Стан або варіація блоку/елемента (\`button--active\`, \`button__icon--small\`) |

---

## Конвенція Іменування

\`\`\`
block__element--modifier
\`\`\`

### Приклади:

\`\`\`css
.button { }                    /* Блок */
.button__icon { }              /* Елемент */
.button--primary { }           /* Модифікатор */
.button__icon--large { }       /* Елемент з модифікатором */
\`\`\`

---

## Практичний Приклад

\`\`\`html
<div class="card card--featured">
  <h2 class="card__title">Заголовок</h2>
  <p class="card__text">Опис</p>
  <button class="card__button card__button--primary">
    <span class="card__button-icon"></span>
    Натисни мене
  </button>
</div>
\`\`\`

\`\`\`css
/* Блок */
.card {
  padding: 20px;
  border: 1px solid #ddd;
}

/* Модифікатор */
.card--featured {
  border-color: gold;
  background: #fffef0;
}

/* Елементи */
.card__title {
  font-size: 1.5rem;
  margin-bottom: 10px;
}

.card__text {
  color: #666;
}

.card__button {
  padding: 10px 20px;
}

/* Елемент з модифікатором */
.card__button--primary {
  background: blue;
  color: white;
}
\`\`\`

---

## Переваги BEM

✅ **Чітка структура** - Легко зрозуміти, який елемент належить якому блоку
✅ **Відсутність конфліктів** - Унікальні імена класів запобігають колізіям стилів
✅ **Повторне використання** - Блоки можна використовувати будь-де
✅ **Легка підтримка** - Зміни в одному блоці не впливають на інші
✅ **Зручність для команди** - Єдина конвенція іменування для всіх

> **Переваги:** BEM робить код самодокументованим, запобігає конфліктам стилів і спрощує роботу в командах.`,
  },
  
  // Question 2: Margin Collapsing
  {
    slug: 'css-margin-collapsing',
    titleEn: 'Margin Collapsing in CSS',
    titleUa: 'Схлопування Margin в CSS',
    descriptionEn: 'Understand how vertical margins collapse in CSS and how to prevent it.',
    descriptionUa: 'Зрозумійте, як вертикальні margin схлопуються в CSS та як це запобігти.',
    difficulty: 'MIDDLE' as const,
    order: 18,
    contentMarkdownEn: `**Margin collapsing** is a CSS feature where **vertical margins of adjacent blocks collapse** (i.e., they don't add up, but the larger one is taken).

This feature only works with **vertical margins** (\`margin-top\`, \`margin-bottom\`) and can cause unexpected visual effects.

---

## Example of Margin Collapsing

\`\`\`html
<div class="block1">...</div>
<div class="block2">...</div>
\`\`\`

\`\`\`css
.block1 {
  margin-bottom: 30px;
}

.block2 {
  margin-top: 50px;
}
\`\`\`

**What will be displayed between blocks?**

**50px**, not 80px. Because margins collapsed (the larger one was taken).

---

## When Does Collapsing Occur?

### 1. Adjacent vertically standing blocks

When \`margin-bottom\` of one element borders \`margin-top\` of another. Only works vertically.

### 2. Parent and first/last child

If parent has no \`padding\`, \`border\`, or inline content, margin of first/last child collapses with parent's margin.

\`\`\`html
<div class="parent">
  <div class="child">Text</div>
</div>
\`\`\`

\`\`\`css
.parent {
  margin-top: 20px;
}

.child {
  margin-top: 30px;
}
/* Result: 30px total (not 50px) */
\`\`\`

### 3. Empty blocks

If block is empty, top and bottom margins collapse into one.

---

## How to Prevent Collapsing?

- Add \`padding\` or \`border\` to parent
- Use \`overflow: hidden\` or \`overflow: auto\`
- Use Flexbox or Grid (they don't collapse margins)
- Add \`display: flow-root\` to parent

\`\`\`css
.parent {
  display: flow-root; /* Prevents margin collapsing */
}
\`\`\`

> **Important:** Margin collapsing only works vertically and only for block elements in normal flow.`,
    contentMarkdownUa: `**Схлопування margin** — це особливість CSS, коли **вертикальні margin сусідніх блоків схлопуються** (тобто вони не додаються, а береться більший).

Ця особливість працює тільки з **вертикальними margin** (\`margin-top\`, \`margin-bottom\`) і може викликати неочікувані візуальні ефекти.

---

## Приклад Схлопування Margin

\`\`\`html
<div class="block1">...</div>
<div class="block2">...</div>
\`\`\`

\`\`\`css
.block1 {
  margin-bottom: 30px;
}

.block2 {
  margin-top: 50px;
}
\`\`\`

**Що буде відображено між блоками?**

**50px**, а не 80px. Тому що margin схлопнулися (взявся більший).

---

## Коли Відбувається Схлопування?

### 1. Сусідні вертикально розташовані блоки

Коли \`margin-bottom\` одного елемента межує з \`margin-top\` іншого. Працює тільки вертикально.

### 2. Батько і перша/остання дитина

Якщо батько не має \`padding\`, \`border\` або inline контенту, margin першої/останньої дитини схлопується з margin батька.

\`\`\`html
<div class="parent">
  <div class="child">Текст</div>
</div>
\`\`\`

\`\`\`css
.parent {
  margin-top: 20px;
}

.child {
  margin-top: 30px;
}
/* Результат: 30px загалом (не 50px) */
\`\`\`

### 3. Порожні блоки

Якщо блок порожній, верхній і нижній margin схлопуються в один.

---

## Як Запобігти Схлопуванню?

- Додати \`padding\` або \`border\` до батька
- Використати \`overflow: hidden\` або \`overflow: auto\`
- Використати Flexbox або Grid (вони не схлопують margin)
- Додати \`display: flow-root\` до батька

\`\`\`css
.parent {
  display: flow-root; /* Запобігає схлопуванню margin */
}
\`\`\`

> **Важливо:** Схлопування margin працює тільки вертикально і тільки для блокових елементів у звичайному потоці.`,
  },
  
  // Question 3: Stacking Order
  {
    slug: 'css-stacking-order',
    titleEn: 'Stacking Order in CSS',
    titleUa: 'Порядок Накладання в CSS',
    descriptionEn: 'Learn about CSS stacking order, z-index, and stacking contexts.',
    descriptionUa: 'Дізнайтесь про порядок накладання в CSS, z-index та контексти накладання.',
    difficulty: 'MIDDLE' as const,
    order: 19,
    contentMarkdownEn: `**Stacking Order** is the order in which **elements overlay each other** along the Z-axis (depth). This determines **which element will be "on top"** if they overlap.

---

## How Does Stacking Order Work?

### Basic Rules

1. By default, elements overlay **in the order they appear in the DOM**
2. Elements with \`position\` (\`relative\`, \`absolute\`, \`fixed\`, \`sticky\`) and \`z-index\` **can overlay** each other
3. Creating **stacking context** affects display priority

---

## Stacking Order Algorithm

Elements are displayed in this order (from bottom to top):

1. **Root element context** (\`html\`)
2. **Block background and borders** with \`z-index: auto\`
3. **Block elements** without positioning (\`position: static\`)
4. **Positioned elements** (\`relative\`, \`absolute\`, \`fixed\`, \`sticky\`) with \`z-index: auto\`
5. **Positioned elements with z-index > 0**
6. **Created stacking contexts** (inside \`transform\`, \`opacity < 1\`, \`filter\`, \`will-change\`, etc.)

---

## What is Stacking Context?

**Stacking Context** is an **isolated layering area** where layer order works independently of parents.

### How Stacking Context is Created

- \`z-index\` (with positioned elements)
- \`opacity\` < 1
- \`transform\`, \`filter\`, \`perspective\`
- \`will-change\`
- \`position: fixed\` or \`position: sticky\`

---

## Example

\`\`\`html
<div class="parent">
  <div class="child-1">Child 1 (z-index: 100)</div>
</div>
<div class="other">
  <div class="child-2">Child 2 (z-index: 1)</div>
</div>
\`\`\`

\`\`\`css
.parent {
  position: relative;
  z-index: 1;
}

.child-1 {
  position: absolute;
  z-index: 100;
}

.other {
  position: relative;
  z-index: 2;
}

.child-2 {
  position: absolute;
  z-index: 1;
}
\`\`\`

**Result:** \`child-2\` will be on top, even though \`child-1\` has \`z-index: 100\`. This is because \`.parent\` has \`z-index: 1\`, which is less than \`.other\`'s \`z-index: 2\`.

> **Tip:** If \`z-index\` doesn't work, check if the element creates its own stacking context.`,
    contentMarkdownUa: `**Порядок накладання** — це порядок, в якому **елементи накладаються один на одного** вздовж осі Z (глибини). Це визначає, **який елемент буде "зверху"**, якщо вони перекриваються.

---

## Як Працює Порядок Накладання?

### Базові Правила

1. За замовчуванням елементи накладаються **в порядку, в якому вони з'являються в DOM**
2. Елементи з \`position\` (\`relative\`, \`absolute\`, \`fixed\`, \`sticky\`) та \`z-index\` **можуть накладатися** один на одного
3. Створення **контексту накладання** впливає на пріоритет відображення

---

## Алгоритм Порядку Накладання

Елементи відображаються в такому порядку (знизу вгору):

1. **Контекст кореневого елемента** (\`html\`)
2. **Фони та рамки блоків** з \`z-index: auto\`
3. **Блокові елементи** без позиціонування (\`position: static\`)
4. **Позиціоновані елементи** (\`relative\`, \`absolute\`, \`fixed\`, \`sticky\`) з \`z-index: auto\`
5. **Позиціоновані елементи з z-index > 0**
6. **Створені контексти накладання** (всередині \`transform\`, \`opacity < 1\`, \`filter\`, \`will-change\` тощо)

---

## Що Таке Контекст Накладання?

**Контекст накладання** — це **ізольована область шарування**, де порядок шарів працює незалежно від батьків.

### Як Створюється Контекст Накладання

- \`z-index\` (з позиціонованими елементами)
- \`opacity\` < 1
- \`transform\`, \`filter\`, \`perspective\`
- \`will-change\`
- \`position: fixed\` або \`position: sticky\`

---

## Приклад

\`\`\`html
<div class="parent">
  <div class="child-1">Дитина 1 (z-index: 100)</div>
</div>
<div class="other">
  <div class="child-2">Дитина 2 (z-index: 1)</div>
</div>
\`\`\`

\`\`\`css
.parent {
  position: relative;
  z-index: 1;
}

.child-1 {
  position: absolute;
  z-index: 100;
}

.other {
  position: relative;
  z-index: 2;
}

.child-2 {
  position: absolute;
  z-index: 1;
}
\`\`\`

**Результат:** \`child-2\` буде зверху, навіть якщо \`child-1\` має \`z-index: 100\`. Це тому, що \`.parent\` має \`z-index: 1\`, що менше ніж \`z-index: 2\` у \`.other\`.

> **Порада:** Якщо \`z-index\` не працює, перевірте, чи елемент створює свій власний контекст накладання.`,
  },
];

async function addQuestions() {
  try {
    console.log('🚀 Adding batch 5 questions to database...\n')
    
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
      console.log(`📝 Processing: ${questionData.titleEn}`)
      
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
      console.log('')
    }
    
  } catch (error) {
    console.error('❌ Error:', error)
    throw error
  } finally {
    await client.end()
  }
}

console.log('\n🚀 Batch 5: BEM, Margins, Stacking')
console.log('===================================\n')

addQuestions()
  .then(() => {
    console.log('✅ Batch 5 complete!\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error)
    process.exit(1)
  })
