/**
 * Update: Container Queries, Object-fit, Aspect-ratio with Full Content
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
    slug: 'css-container-queries',
    contentMarkdownEn: `**Container Queries** are a new CSS feature that allows you to apply styles based on the size of the **container**, not the size of the **browser window**. This is a revolutionary change for creating truly modular and reusable components.

## What are Container Queries?

Container Queries allow components to adapt to the size of their parent container, not the viewport size.

### Difference from Media Queries

**Media Queries** respond to browser window size:

\`\`\`css
@media (min-width: 768px) {
  .card { width: 50%; }
}
\`\`\`

**Container Queries** respond to container size:

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card { width: 50%; }
}
\`\`\`

## How to Use Container Queries

### Declaring a Container

\`\`\`css
.card-container {
  container-type: inline-size;  /* tracks width */
  /* or */
  container-type: size;          /* tracks both width and height */
}
\`\`\`

### Using @container

\`\`\`css
.card {
  padding: 1rem;
}

@container (min-width: 400px) {
  .card {
    padding: 2rem;
  }
}
\`\`\`

## Container Query Units

- \`cqw\` — 1% of container width
- \`cqh\` — 1% of container height
- \`cqi\` — 1% of container inline-size
- \`cqb\` — 1% of container block-size

\`\`\`css
.card {
  font-size: clamp(1rem, 4cqw, 2rem);
}
\`\`\`

> **Tip:** Container Queries are a powerful tool for creating modular components. Use them together with Media Queries to create flexible and responsive interfaces.`,
    contentMarkdownUa: `**Container Queries** — це нова можливість CSS, що дозволяє застосовувати стилі на основі розміру **контейнера**, а не розміру **вікна браузера**. Це революційна зміна для створення справді модульних і повторно використовуваних компонентів.

## Що Таке Container Queries?

Container Queries дозволяють компонентам адаптуватися до розміру їхнього батьківського контейнера, а не розміру viewport.

### Різниця від Media Queries

**Media Queries** реагують на розмір вікна браузера:

\`\`\`css
@media (min-width: 768px) {
  .card { width: 50%; }
}
\`\`\`

**Container Queries** реагують на розмір контейнера:

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card { width: 50%; }
}
\`\`\`

## Як Використовувати Container Queries

### Оголошення Контейнера

\`\`\`css
.card-container {
  container-type: inline-size;  /* відстежує ширину */
  /* або */
  container-type: size;          /* відстежує і ширину, і висоту */
}
\`\`\`

### Використання @container

\`\`\`css
.card {
  padding: 1rem;
}

@container (min-width: 400px) {
  .card {
    padding: 2rem;
  }
}
\`\`\`

## Одиниці Container Query

- \`cqw\` — 1% ширини контейнера
- \`cqh\` — 1% висоти контейнера
- \`cqi\` — 1% inline-size контейнера
- \`cqb\` — 1% block-size контейнера

\`\`\`css
.card {
  font-size: clamp(1rem, 4cqw, 2rem);
}
\`\`\`

> **Порада:** Container Queries — потужний інструмент для створення модульних компонентів. Використовуйте їх разом з Media Queries для створення гнучких і адаптивних інтерфейсів.`,
  },
  {
    slug: 'css-object-fit',
    contentMarkdownEn: `**\`object-fit\`** and **\`object-position\`** are CSS properties that allow you to control how content (images, videos) is displayed inside its container while maintaining aspect ratio.

## What is object-fit?

\`object-fit\` determines how content (usually \`<img>\` or \`<video>\`) should be scaled and positioned inside its container.

### object-fit Values

| **Value** | **Description** | **Behavior** |
| --- | --- | --- |
| \`fill\` | Fills entire container | Stretches, may distort |
| \`contain\` | Fits inside container | Preserves proportions, may have empty areas |
| \`cover\` | Fills container preserving proportions | May be cropped but fills entire container |
| \`none\` | Original size | Does not scale, may be cropped |
| \`scale-down\` | Scales down if needed | Like \`none\` or \`contain\`, chooses smaller |

## Usage Examples

### cover — Fill with Cropping

\`\`\`css
.image-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
\`\`\`

**Result:** Image fills entire container, preserving proportions. May be cropped but does not distort.

### contain — Fit Inside Container

\`\`\`css
.image-contain {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
\`\`\`

**Result:** Image fits inside container, preserving proportions. May have empty areas.

## Object-position

\`object-position\` determines the position of content inside the container.

\`\`\`css
.portrait {
  object-fit: cover;
  object-position: center top;
}

.focus-right {
  object-fit: cover;
  object-position: right center;
}
\`\`\`

> **Tip:** Use \`object-fit: cover\` to create beautiful cards and galleries where images should fill the container without distortion. Combine with \`object-position\` to control image focus.`,
    contentMarkdownUa: `**\`object-fit\`** та **\`object-position\`** — це CSS властивості, які дозволяють контролювати, як контент (зображення, відео) відображається всередині контейнера зі збереженням пропорцій.

## Що Таке object-fit?

\`object-fit\` визначає, як контент (зазвичай \`<img>\` або \`<video>\`) повинен масштабуватися і позиціонуватися всередині контейнера.

### Значення object-fit

| **Значення** | **Опис** | **Поведінка** |
| --- | --- | --- |
| \`fill\` | Заповнює весь контейнер | Розтягується, може спотворитися |
| \`contain\` | Вписується в контейнер | Зберігає пропорції, можуть бути порожні області |
| \`cover\` | Заповнює контейнер зберігаючи пропорції | Може бути обрізано, але заповнює весь контейнер |
| \`none\` | Оригінальний розмір | Не масштабується, може бути обрізано |
| \`scale-down\` | Зменшується за потреби | Як \`none\` або \`contain\`, обирає менший |

## Приклади Використання

### cover — Заповнення з Обрізанням

\`\`\`css
.image-cover {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
\`\`\`

**Результат:** Зображення заповнює весь контейнер, зберігаючи пропорції. Може бути обрізано, але не спотворюється.

### contain — Вписати в Контейнер

\`\`\`css
.image-contain {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
\`\`\`

**Результат:** Зображення вписується в контейнер, зберігаючи пропорції. Можуть бути порожні області.

## Object-position

\`object-position\` визначає позицію контенту всередині контейнера.

\`\`\`css
.portrait {
  object-fit: cover;
  object-position: center top;
}

.focus-right {
  object-fit: cover;
  object-position: right center;
}
\`\`\`

> **Порада:** Використовуйте \`object-fit: cover\` для створення красивих карток і галерей, де зображення повинні заповнювати контейнер без спотворення. Комбінуйте з \`object-position\` для контролю фокусу зображення.`,
  },
  {
    slug: 'css-aspect-ratio',
    contentMarkdownEn: `**\`aspect-ratio\`** is a CSS property that allows you to set the aspect ratio of an element, automatically calculating one of the dimensions based on the other. This is especially useful for creating responsive images, videos, and containers.

## What is aspect-ratio?

\`aspect-ratio\` defines the preferred ratio of width to height of an element. The browser automatically calculates one of the dimensions if the other is set.

### Syntax

\`\`\`css
.element {
  aspect-ratio: 16 / 9;  /* width / height */
  aspect-ratio: 1 / 1;    /* square */
  aspect-ratio: 4 / 3;    /* classic ratio */
  aspect-ratio: auto;     /* default */
}
\`\`\`

## Basic Usage

\`\`\`css
.video-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
}
\`\`\`

**Result:** Container will always have a 16:9 aspect ratio, regardless of screen width.

## Popular Aspect Ratios

| **Ratio** | **CSS Value** | **Usage** |
| --- | --- | --- |
| 1:1 | \`aspect-ratio: 1 / 1\` | Square images, avatars |
| 4:3 | \`aspect-ratio: 4 / 3\` | Classic photos, old monitors |
| 16:9 | \`aspect-ratio: 16 / 9\` | Videos, modern screens |
| 21:9 | \`aspect-ratio: 21 / 9\` | Ultrawide screens |
| 3:2 | \`aspect-ratio: 3 / 2\` | Photos, printing |

## Practical Examples

### Responsive Video

\`\`\`html
<div class="video-wrapper">
  <iframe src="https://www.youtube.com/embed/..." allowfullscreen></iframe>
</div>
\`\`\`

\`\`\`css
.video-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;
}

.video-wrapper iframe {
  position: absolute;
  width: 100%;
  height: 100%;
}
\`\`\`

### Product Cards

\`\`\`css
.product-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
\`\`\`

> **Tip:** Use \`aspect-ratio\` to create responsive containers, especially for images and videos. This is a modern and elegant way to control aspect ratios without needing to set fixed sizes.`,
    contentMarkdownUa: `**\`aspect-ratio\`** — це CSS властивість, яка дозволяє встановити співвідношення сторін елемента, автоматично розраховуючи одну з вимірностей на основі іншої. Це особливо корисно для створення адаптивних зображень, відео та контейнерів.

## Що Таке aspect-ratio?

\`aspect-ratio\` визначає бажане співвідношення ширини до висоти елемента. Браузер автоматично розраховує одну з вимірностей, якщо інша встановлена.

### Синтаксис

\`\`\`css
.element {
  aspect-ratio: 16 / 9;  /* ширина / висота */
  aspect-ratio: 1 / 1;    /* квадрат */
  aspect-ratio: 4 / 3;    /* класичне співвідношення */
  aspect-ratio: auto;     /* за замовчуванням */
}
\`\`\`

## Базове Використання

\`\`\`css
.video-container {
  width: 100%;
  aspect-ratio: 16 / 9;
  background: #000;
}
\`\`\`

**Результат:** Контейнер завжди матиме співвідношення 16:9, незалежно від ширини екрану.

## Популярні Співвідношення Сторін

| **Співвідношення** | **CSS Значення** | **Використання** |
| --- | --- | --- |
| 1:1 | \`aspect-ratio: 1 / 1\` | Квадратні зображення, аватари |
| 4:3 | \`aspect-ratio: 4 / 3\` | Класичні фото, старі монітори |
| 16:9 | \`aspect-ratio: 16 / 9\` | Відео, сучасні екрани |
| 21:9 | \`aspect-ratio: 21 / 9\` | Ultrawide екрани |
| 3:2 | \`aspect-ratio: 3 / 2\` | Фото, друк |

## Практичні Приклади

### Адаптивне Відео

\`\`\`html
<div class="video-wrapper">
  <iframe src="https://www.youtube.com/embed/..." allowfullscreen></iframe>
</div>
\`\`\`

\`\`\`css
.video-wrapper {
  width: 100%;
  aspect-ratio: 16 / 9;
  position: relative;
}

.video-wrapper iframe {
  position: absolute;
  width: 100%;
  height: 100%;
}
\`\`\`

### Картки Продуктів

\`\`\`css
.product-image {
  width: 100%;
  aspect-ratio: 1 / 1;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
\`\`\`

> **Порада:** Використовуйте \`aspect-ratio\` для створення адаптивних контейнерів, особливо для зображень і відео. Це сучасний і елегантний спосіб контролю співвідношень сторін без необхідності встановлювати фіксовані розміри.`,
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
          .set({ 
            contentMarkdownEn: update.contentMarkdownEn, 
            contentMarkdownUa: update.contentMarkdownUa, 
            updatedAt: new Date() 
          })
          .where(eq(schema.questions.id, existing.id))
        console.log(`✅ Updated with full content\n`)
      }
    }
    console.log('✅ Final batch update complete!')
  } finally {
    await client.end()
  }
}

updateQuestions().then(() => process.exit(0))
