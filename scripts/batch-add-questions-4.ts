/**
 * Batch Add Questions (Batch 4) - CSS Units, Media Queries, etc.
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
  // Question 1: px, rem, em
  {
    slug: 'css-units-px-rem-em',
    titleEn: 'CSS Units: px, rem, em',
    titleUa: 'CSS Одиниці: px, rem, em',
    descriptionEn: 'Learn about CSS units px, rem, and em, and when to use each for responsive design.',
    descriptionUa: 'Дізнайтесь про CSS одиниці px, rem та em, і коли використовувати кожну для адаптивного дизайну.',
    difficulty: 'MIDDLE' as const,
    order: 12,
    contentMarkdownEn: `In CSS, various **units of measurement** are used to set sizes (margins, fonts, widths, etc.). Among them, especially important are: \`px\`, \`em\`, \`rem\`. They affect **responsiveness**, **scalability** and **style inheritance**.

---

## px — pixels

- **Absolute** unit of measurement
- Sets fixed size, independent of parent or root font
- Doesn't adapt to scaling, **poorly suited for responsive design**

\`\`\`css
font-size: 16px;
padding: 10px 20px;
\`\`\`

- Suitable for pixel-perfect design
- Scales poorly and doesn't account for user settings

---

## em — relative unit

- Relative to parent element's font size
- \`1em\` = current parent's \`font-size\`
- Used for margins, padding and even font-size, but can behave unpredictably when nested

\`\`\`css
/* parent */
.parent {
  font-size: 16px;
}

/* child */
.child {
  font-size: 1.5em; /* 24px relative to parent */
}
\`\`\`

**em nesting can accumulate:**

\`\`\`css
.outer {
  font-size: 16px;
}

.inner {
  font-size: 1.2em; /* 16px × 1.2 = 19.2px */
}

.inner .text {
  font-size: 1.2em; /* 19.2px × 1.2 = ~23px */
}
\`\`\`

---

## rem — root em

- Relative to root element's (\`html\`) font size
- \`1rem\` = \`font-size\` at \`<html>\` level (16px by default)
- Independent of parent, making \`rem\` more predictable

\`\`\`css
html {
  font-size: 16px;
}

.button {
  font-size: 1.25rem; /* 20px */
  padding: 0.5rem 1rem; /* 8px 16px */
}
\`\`\`

- Convenient for responsive typography
- Works well with media queries
- Easy to scale (change 1 value in \`html\` — everything changes)

---

## Comparison Table

| **Unit** | **Relative to?** | **Scaling Support** | **Application** |
| --- | --- | --- | --- |
| \`px\` | Absolute pixel | ❌ | Fixed sizes |
| \`em\` | Parent \`font-size\` | ✅ (but can accumulate) | Internal padding, margin |
| \`rem\` | \`html font-size\` | ✅ | Text sizes, layout, everything |

---

## When to use what?

- \`px\` — When you need to fix size regardless of context (e.g., 1px border)
- \`em\` — For component internal scalability (e.g., padding, margin)
- \`rem\` — For global typography, margins, responsive design

> **Tip:** Use \`rem\` for base sizes, \`em\` for component internal proportions, and \`px\` only in extreme cases.`,
    contentMarkdownUa: `У CSS використовуються різні **одиниці виміру** для встановлення розмірів (відступи, шрифти, ширини тощо). Серед них особливо важливі: \`px\`, \`em\`, \`rem\`. Вони впливають на **адаптивність**, **масштабованість** та **успадкування стилів**.

---

## px — пікселі

- **Абсолютна** одиниця виміру
- Встановлює фіксований розмір, незалежний від батьківського або кореневого шрифту
- Не адаптується до масштабування, **погано підходить для адаптивного дизайну**

\`\`\`css
font-size: 16px;
padding: 10px 20px;
\`\`\`

- Підходить для pixel-perfect дизайну
- Погано масштабується і не враховує налаштування користувача

---

## em — відносна одиниця

- Відносно розміру шрифту батьківського елемента
- \`1em\` = поточний \`font-size\` батька
- Використовується для відступів, padding і навіть font-size, але може поводитися непередбачувано при вкладеності

\`\`\`css
/* батько */
.parent {
  font-size: 16px;
}

/* дитина */
.child {
  font-size: 1.5em; /* 24px відносно батька */
}
\`\`\`

**Вкладеність em може накопичуватися:**

\`\`\`css
.outer {
  font-size: 16px;
}

.inner {
  font-size: 1.2em; /* 16px × 1.2 = 19.2px */
}

.inner .text {
  font-size: 1.2em; /* 19.2px × 1.2 = ~23px */
}
\`\`\`

---

## rem — root em

- Відносно розміру шрифту кореневого елемента (\`html\`)
- \`1rem\` = \`font-size\` на рівні \`<html>\` (16px за замовчуванням)
- Незалежний від батька, що робить \`rem\` більш передбачуваним

\`\`\`css
html {
  font-size: 16px;
}

.button {
  font-size: 1.25rem; /* 20px */
  padding: 0.5rem 1rem; /* 8px 16px */
}
\`\`\`

- Зручний для адаптивної типографіки
- Добре працює з медіа-запитами
- Легко масштабувати (змінити 1 значення в \`html\` — все зміниться)

---

## Таблиця Порівняння

| **Одиниця** | **Відносно чого?** | **Підтримка Масштабування** | **Застосування** |
| --- | --- | --- | --- |
| \`px\` | Абсолютний піксель | ❌ | Фіксовані розміри |
| \`em\` | Батьківський \`font-size\` | ✅ (але може накопичуватися) | Внутрішні padding, margin |
| \`rem\` | \`html font-size\` | ✅ | Розміри тексту, макет, все |

---

## Коли що використовувати?

- \`px\` — Коли потрібно зафіксувати розмір незалежно від контексту (наприклад, рамка 1px)
- \`em\` — Для внутрішньої масштабованості компонента (наприклад, padding, margin)
- \`rem\` — Для глобальної типографіки, відступів, адаптивного дизайну

> **Порада:** Використовуйте \`rem\` для базових розмірів, \`em\` для внутрішніх пропорцій компонента, а \`px\` тільки в крайніх випадках.`,
  },
  
  // Question 2: vh, vw, vmin, vmax
  {
    slug: 'css-units-vh-vw-vmin-vmax',
    titleEn: 'CSS Units: vh, vw, vmin, vmax',
    titleUa: 'CSS Одиниці: vh, vw, vmin, vmax',
    descriptionEn: 'Learn about viewport units in CSS and how to use them for responsive layouts.',
    descriptionUa: 'Дізнайтесь про одиниці viewport у CSS та як використовувати їх для адаптивних макетів.',
    difficulty: 'MIDDLE' as const,
    order: 13,
    contentMarkdownEn: `These CSS units are based on **viewport dimensions**. This is useful for creating adaptive, "fluid" layouts.

---

## Unit Overview

| **Unit** | **Value** | **Meaning** |
| --- | --- | --- |
| \`1vh\` | 1% of window height | Height in 1/100 of viewport height |
| \`1vw\` | 1% of window width | Width in 1/100 of viewport width |
| \`1vmin\` | 1% of smaller value between vh or vw | Minimum of width/height |
| \`1vmax\` | 1% of larger value between vh or vw | Maximum of width/height |

---

## Example

\`\`\`css
.box {
  width: 50vmin;   /* will be 50% of smaller window side */
  height: 50vmax;  /* will be 50% of larger window side */
  background: lightcoral;
}
\`\`\`

Such a block will adapt to screen orientation: when rotating the device, \`vmin\`/\`vmax\` change.

---

## Application

- \`vh\` and \`vw\` — For fullscreen sections, blocks, slides
- \`vmin\` — So blocks don't exceed the smaller side
- \`vmax\` — For creating elements that stretch along the larger side (e.g., in horizontal layout)

---

## Important for Mobile

Mobile browsers change \`vh\` height when showing/hiding the address bar. To solve this problem, use CSS variables with JavaScript:

\`\`\`javascript
document.documentElement.style.setProperty('--vh', \`\${window.innerHeight * 0.01}px\`);
\`\`\`

\`\`\`css
.full-height {
  height: calc(var(--vh, 1vh) * 100);
}
\`\`\`

> **Tip:** Use \`vmin\`/\`vmax\` for responsive fonts, spacing, and interface scaling, especially if you don't want to tie to screen width or height only.`,
    contentMarkdownUa: `Ці CSS одиниці базуються на **розмірах viewport**. Це корисно для створення адаптивних, "плавних" макетів.

---

## Огляд Одиниць

| **Одиниця** | **Значення** | **Значення** |
| --- | --- | --- |
| \`1vh\` | 1% висоти вікна | Висота в 1/100 висоти viewport |
| \`1vw\` | 1% ширини вікна | Ширина в 1/100 ширини viewport |
| \`1vmin\` | 1% меншого значення між vh або vw | Мінімум ширини/висоти |
| \`1vmax\` | 1% більшого значення між vh або vw | Максимум ширини/висоти |

---

## Приклад

\`\`\`css
.box {
  width: 50vmin;   /* буде 50% від меншої сторони вікна */
  height: 50vmax;  /* буде 50% від більшої сторони вікна */
  background: lightcoral;
}
\`\`\`

Такий блок адаптується до орієнтації екрану: при повороті пристрою \`vmin\`/\`vmax\` змінюються.

---

## Застосування

- \`vh\` та \`vw\` — Для повноекранних секцій, блоків, слайдів
- \`vmin\` — Щоб блоки не перевищували меншу сторону
- \`vmax\` — Для створення елементів, що розтягуються вздовж більшої сторони (наприклад, у горизонтальному макеті)

---

## Важливо для Мобільних

Мобільні браузери змінюють висоту \`vh\` при показі/приховуванні адресного рядка. Для вирішення цієї проблеми використовуйте CSS змінні з JavaScript:

\`\`\`javascript
document.documentElement.style.setProperty('--vh', \`\${window.innerHeight * 0.01}px\`);
\`\`\`

\`\`\`css
.full-height {
  height: calc(var(--vh, 1vh) * 100);
}
\`\`\`

> **Порада:** Використовуйте \`vmin\`/\`vmax\` для адаптивних шрифтів, відступів та масштабування інтерфейсу, особливо якщо не хочете прив'язуватися тільки до ширини або висоти екрану.`,
  },
  
  // Question 3: Media Queries
  {
    slug: 'css-media-queries',
    titleEn: 'CSS Media Queries',
    titleUa: 'CSS Медіа-запити',
    descriptionEn: 'Understand how media queries enable responsive design for different devices and screen sizes.',
    descriptionUa: 'Зрозумійте, як медіа-запити забезпечують адаптивний дизайн для різних пристроїв та розмірів екрану.',
    difficulty: 'MIDDLE' as const,
    order: 14,
    contentMarkdownEn: `**Media queries** are a mechanism in CSS that allows **applying styles depending on device characteristics**, such as screen width, pixel density, orientation, etc.

---

## Why are Media Queries Needed?

Media queries allow creating **responsive** and **cross-device** interfaces that look good on:

- Smartphones
- Tablets
- Laptops
- Monitors with different resolutions

> **Goal:** Make the site work and look equally good on different screens — from iPhone to 4K monitor.

---

## Simple Example

\`\`\`css
/* Base style */
.container {
  padding: 20px;
}

/* Applied when screen width is less than 768px */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
}
\`\`\`

---

## Typical Use Cases

- Adapting fonts and margins for different screens
- Hiding or showing mobile menu
- Restructuring grids and flex containers
- Changing image or card sizes
- Handling dark/light theme via \`(prefers-color-scheme)\`

---

## Types of Media Features

| **Property** | **What it checks** |
| --- | --- |
| \`width\` / \`height\` | Screen/viewport size |
| \`max-width\` / \`min-width\` | Maximum or minimum width |
| \`orientation\` | Screen orientation (\`portrait\`/\`landscape\`) |
| \`resolution\` | Pixel density |
| \`prefers-color-scheme\` | System theme (\`dark\` / \`light\`) |

---

## Responsive Grid Example

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
\`\`\`

This way, grid restructures for screen size: 3 → 2 → 1 column.

---

## Mobile-First Strategy

Most often styles are written first for mobile devices, then media queries with \`min-width\` are added for wider screens:

\`\`\`css
.button {
  font-size: 14px;
}

@media (min-width: 768px) {
  .button {
    font-size: 16px;
  }
}
\`\`\`

---

## Summary

- **Media queries** are key to responsive layout
- Allow applying different styles depending on device, screen and user settings
- Help improve usability and site appearance on all devices

> **Conclusion:** If you're making a site for users who will access from different devices — media queries are mandatory.`,
    contentMarkdownUa: `**Медіа-запити** — це механізм у CSS, який дозволяє **застосовувати стилі залежно від характеристик пристрою**, таких як ширина екрану, щільність пікселів, орієнтація тощо.

---

## Навіщо Потрібні Медіа-запити?

Медіа-запити дозволяють створювати **адаптивні** та **кроссплатформні** інтерфейси, які добре виглядають на:

- Смартфонах
- Планшетах
- Ноутбуках
- Моніторах з різними роздільними здатностями

> **Мета:** Зробити так, щоб сайт працював і виглядав однаково добре на різних екранах — від iPhone до 4K монітора.

---

## Простий Приклад

\`\`\`css
/* Базовий стиль */
.container {
  padding: 20px;
}

/* Застосовується, коли ширина екрану менше 768px */
@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
}
\`\`\`

---

## Типові Випадки Використання

- Адаптація шрифтів та відступів для різних екранів
- Приховування або показ мобільного меню
- Реструктуризація сіток та flex контейнерів
- Зміна розмірів зображень або карток
- Обробка темної/світлої теми через \`(prefers-color-scheme)\`

---

## Типи Медіа-функцій

| **Властивість** | **Що перевіряє** |
| --- | --- |
| \`width\` / \`height\` | Розмір екрану/viewport |
| \`max-width\` / \`min-width\` | Максимальна або мінімальна ширина |
| \`orientation\` | Орієнтація екрану (\`portrait\`/\`landscape\`) |
| \`resolution\` | Щільність пікселів |
| \`prefers-color-scheme\` | Системна тема (\`dark\` / \`light\`) |

---

## Приклад Адаптивної Сітки

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 640px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
\`\`\`

Таким чином сітка реструктурується для розміру екрану: 3 → 2 → 1 колонка.

---

## Стратегія Mobile-First

Найчастіше стилі пишуться спочатку для мобільних пристроїв, а потім додаються медіа-запити з \`min-width\` для ширших екранів:

\`\`\`css
.button {
  font-size: 14px;
}

@media (min-width: 768px) {
  .button {
    font-size: 16px;
  }
}
\`\`\`

---

## Підсумок

- **Медіа-запити** — ключ до адаптивного макету
- Дозволяють застосовувати різні стилі залежно від пристрою, екрану та налаштувань користувача
- Допомагають покращити зручність використання та зовнішній вигляд сайту на всіх пристроях

> **Висновок:** Якщо ви робите сайт для користувачів, які будуть заходити з різних пристроїв — медіа-запити обов'язкові.`,
  },
  
  // Question 4: CSS Cascade
  {
    slug: 'css-cascade',
    titleEn: 'CSS Cascade',
    titleUa: 'CSS Каскад',
    descriptionEn: 'Learn how CSS cascade determines which styles are applied when multiple rules target the same element.',
    descriptionUa: 'Дізнайтесь, як CSS каскад визначає, які стилі застосовуються, коли кілька правил стосуються одного елемента.',
    difficulty: 'MIDDLE' as const,
    order: 15,
    contentMarkdownEn: `**Cascade (Cascading)** is the main mechanism that determines **which style will be applied** when **multiple CSS rules** target the same element.

CSS stands for **Cascading Style Sheets** — *cascading style sheets*. The word "cascading" indicates that styles **overlay each other** and are applied according to certain priority rules.

---

## What Influences Style Selection?

When multiple CSS rules are applied to one element, the browser chooses the one with **highest priority**. This considers:

### 1. Specificity

How "precisely" the CSS rule targets the element. Higher specificity means higher priority.

\`\`\`css
div a        /* low specificity */
.menu a      /* higher */
#header a    /* even higher */
\`\`\`

### 2. Importance (!important)

If \`!important\` is added to a property, it **overrides** even more specific rules.

\`\`\`css
p { color: red !important; }
\`\`\`

### 3. Style Source

Source of the style:

- User styles (in browser)
- Inline styles (\`style="..."\`)
- External stylesheets (\`<link>\` / \`@import\`)
- Default styles (user-agent styles)

### 4. Source Order

If specificity is equal, the style that comes **last** in code wins.

\`\`\`css
p { color: blue; }
p { color: red; }  /* This will be applied */
\`\`\`

> **Recommendation:** Avoid excessive use of \`!important\` — it complicates code support and debugging.`,
    contentMarkdownUa: `**Каскад (Cascading)** — це основний механізм, який визначає **який стиль буде застосовано**, коли **кілька CSS правил** стосуються одного елемента.

CSS означає **Cascading Style Sheets** — *каскадні таблиці стилів*. Слово "каскад" вказує на те, що стилі **накладаються один на одного** і застосовуються згідно з певними правилами пріоритету.

---

## Що Впливає на Вибір Стилю?

Коли кілька CSS правил застосовуються до одного елемента, браузер обирає те, що має **найвищий пріоритет**. При цьому враховується:

### 1. Специфічність

Наскільки "точно" CSS правило націлене на елемент. Вища специфічність означає вищий пріоритет.

\`\`\`css
div a        /* низька специфічність */
.menu a      /* вища */
#header a    /* ще вища */
\`\`\`

### 2. Важливість (!important)

Якщо до властивості додано \`!important\`, вона **перевизначає** навіть більш специфічні правила.

\`\`\`css
p { color: red !important; }
\`\`\`

### 3. Джерело Стилю

Джерело стилю:

- Стилі користувача (у браузері)
- Вбудовані стилі (\`style="..."\`)
- Зовнішні таблиці стилів (\`<link>\` / \`@import\`)
- Стилі за замовчуванням (user-agent стилі)

### 4. Порядок Джерел

Якщо специфічність однакова, перемагає стиль, який йде **останнім** у коді.

\`\`\`css
p { color: blue; }
p { color: red; }  /* Буде застосовано це */
\`\`\`

> **Рекомендація:** Уникайте надмірного використання \`!important\` — це ускладнює підтримку коду та налагодження.`,
  },
  
  // Question 5: Data Attributes
  {
    slug: 'html-data-attributes',
    titleEn: 'Data Attributes in HTML',
    titleUa: 'Data-атрибути в HTML',
    descriptionEn: 'Learn about HTML data attributes and how to use them for storing custom data in elements.',
    descriptionUa: 'Дізнайтесь про HTML data-атрибути та як використовувати їх для зберігання власних даних в елементах.',
    difficulty: 'JUNIOR' as const,
    order: 16,
    contentMarkdownEn: `**data attributes** are a way to store **custom data** in HTML elements. They start with the \`data-\` prefix and allow safely passing information from HTML to JavaScript **without creating non-standard attributes**.

---

## Syntax

\`\`\`html
<div data-user-id="1234" data-role="admin">Hello!</div>
\`\`\`

---

## Where are they used?

- To pass data to JavaScript
- To initialize components
- To store configurations
- When working with events (e.g., a button can have \`data-id\`)
- For event delegation (e.g., on lists)

---

## How to get data attribute in JavaScript?

\`\`\`html
<button data-product-id="42">Buy</button>
\`\`\`

\`\`\`javascript
const button = document.querySelector("button");
const productId = button.dataset.productId;

console.log(productId); // "42"
\`\`\`

All \`data-\` attributes become available through \`element.dataset\`, and the attribute name converts to \`camelCase\`.

---

## Using in CSS

You can also style elements based on data attributes:

\`\`\`css
[data-theme="dark"] {
  background: #000;
  color: #fff;
}

[data-status="active"] {
  border-color: green;
}
\`\`\`

> **Tip:** Use data attributes to store metadata directly in HTML — it's better than creating custom attributes or storing data in classes.`,
    contentMarkdownUa: `**data-атрибути** — це спосіб зберігання **власних даних** в HTML елементах. Вони починаються з префікса \`data-\` і дозволяють безпечно передавати інформацію з HTML в JavaScript **без створення нестандартних атрибутів**.

---

## Синтаксис

\`\`\`html
<div data-user-id="1234" data-role="admin">Привіт!</div>
\`\`\`

---

## Де Використовуються?

- Для передачі даних в JavaScript
- Для ініціалізації компонентів
- Для зберігання конфігурацій
- При роботі з подіями (наприклад, кнопка може мати \`data-id\`)
- Для делегування подій (наприклад, на списках)

---

## Як Отримати data-атрибут в JavaScript?

\`\`\`html
<button data-product-id="42">Купити</button>
\`\`\`

\`\`\`javascript
const button = document.querySelector("button");
const productId = button.dataset.productId;

console.log(productId); // "42"
\`\`\`

Всі \`data-\` атрибути стають доступними через \`element.dataset\`, а ім'я атрибута перетворюється на \`camelCase\`.

---

## Використання в CSS

Ви також можете стилізувати елементи на основі data-атрибутів:

\`\`\`css
[data-theme="dark"] {
  background: #000;
  color: #fff;
}

[data-status="active"] {
  border-color: green;
}
\`\`\`

> **Порада:** Використовуйте data-атрибути для зберігання метаданих безпосередньо в HTML — це краще, ніж створювати власні атрибути або зберігати дані в класах.`,
  },
];

async function addQuestions() {
  try {
    console.log('🚀 Adding batch 4 questions to database...\n')
    
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

console.log('\n🚀 Batch 4: CSS Units & Media Queries')
console.log('===================================\n')

addQuestions()
  .then(() => {
    console.log('✅ Batch 4 complete!\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error)
    process.exit(1)
  })
