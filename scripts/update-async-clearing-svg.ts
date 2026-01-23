/**
 * Update Questions with Full Content: async/defer, Clearing, SVG
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
    slug: 'html-script-async-defer',
    contentMarkdownEn: `The \`<script>\` tag is used to connect JavaScript files to HTML documents. Depending on \`async\` and \`defer\` attributes, script loading and execution behavior changes.

### script (without attributes)

- Downloaded and **executed immediately** as soon as HTML parser reaches it
- **Blocks** HTML parsing until script execution completes
- Suitable only for **small scripts at the end of the page**

\`\`\`html
<script src="script.js"></script>
\`\`\`

### script async

- Script loads **asynchronously** and **executes immediately** once loaded
- Doesn't guarantee execution order (if multiple async scripts)
- Suitable for **third-party scripts** (analytics, ads)

**Behavior:**
- Doesn't block HTML parsing during loading
- Can **block rendering** during execution

### script defer

- Script loads **asynchronously**, but **executes after full HTML load**
- **Preserves order** of script connections
- Ideal for most modern applications

\`\`\`html
<script src="script.js" defer></script>
\`\`\`

**Behavior:**
- Doesn't block HTML
- Executes after HTML parsing completes, but before \`DOMContentLoaded\` event

## Comparison Table

| **Attribute** | **Loading** | **Execution** | **Blocks Parsing?** | **Preserves Order?** |
| --- | --- | --- | --- | --- |
| (no attributes) | immediately | immediately after load | Yes | Yes |
| \`async\` | parallel | immediately after load | No (but can block execution) | No |
| \`defer\` | parallel | after HTML parsing | No | Yes |

> **Tip:** If you're not using \`type="module"\`, **always prefer \`defer\`** for internal scripts — it doesn't block HTML and preserves order.`,
    contentMarkdownUa: `Тег \`<script>\` використовується для підключення JavaScript файлів до HTML документів. Залежно від атрибутів \`async\` та \`defer\`, поведінка завантаження та виконання скриптів змінюється.

### script (без атрибутів)

- Завантажується та **виконується негайно**, як тільки HTML парсер досягає його
- **Блокує** парсинг HTML до завершення виконання скрипта
- Підходить лише для **невеликих скриптів в кінці сторінки**

\`\`\`html
<script src="script.js"></script>
\`\`\`

### script async

- Скрипт завантажується **асинхронно** і **виконується негайно** після завантаження
- Не гарантує порядок виконання (якщо кілька async скриптів)
- Підходить для **сторонніх скриптів** (аналітика, реклама)

**Поведінка:**
- Не блокує парсинг HTML під час завантаження
- Може **заблокувати рендеринг** під час виконання

### script defer

- Скрипт завантажується **асинхронно**, але **виконується після повного завантаження HTML**
- **Зберігає порядок** підключення скриптів
- Ідеальний для більшості сучасних застосунків

\`\`\`html
<script src="script.js" defer></script>
\`\`\`

**Поведінка:**
- Не блокує HTML
- Виконується після завершення парсингу HTML, але перед подією \`DOMContentLoaded\`

## Таблиця Порівняння

| **Атрибут** | **Завантаження** | **Виконання** | **Блокує Парсинг?** | **Зберігає Порядок?** |
| --- | --- | --- | --- | --- |
| (без атрибутів) | негайно | негайно після завантаження | Так | Так |
| \`async\` | паралельно | негайно після завантаження | Ні (але може заблокувати виконання) | Ні |
| \`defer\` | паралельно | після парсингу HTML | Ні | Так |

> **Порада:** Якщо ви не використовуєте \`type="module"\`, **завжди віддавайте перевагу \`defer\`** для внутрішніх скриптів — він не блокує HTML і зберігає порядок.`,
  },
  {
    slug: 'css-clearing-methods',
    contentMarkdownEn: `## Why is clear (clearing) needed in CSS?

When you use \`float\` on an element (e.g., \`float: left\`), it **exits the normal document flow**. This can cause the parent element, **containing nothing but float elements**, to **collapse** in height.

To make the parent "notice" such children, you need to **clear the float (clearing)**.

## Main Float Clearing Methods

### clear Property

Added to **element after floated ones**.

\`\`\`html
<div class="clearfix"></div>
\`\`\`

\`\`\`css
.clearfix {
  clear: both;
}
\`\`\`

This works, but requires **adding extra HTML**, which isn't always convenient.

### Clearfix Technique (pseudo-element)

Most popular and universal method.

\`\`\`css
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
\`\`\`

Applied to **parent element** containing floated child blocks.

\`\`\`html
<div class="container clearfix">
  <div class="left-box" style="float: left;"></div>
  <div class="right-box" style="float: right;"></div>
</div>
\`\`\`

Avoids adding extra markup and automatically clears float.

### Using "overflow: hidden"

\`\`\`css
.container {
  overflow: hidden;
}
\`\`\`

- Works because \`overflow\` creates new **block formatting context (BFC)**, which includes floated elements in height calculation
- Downside: may clip content with \`position: absolute\` or blocks extending beyond boundaries

### Modern Alternatives — Flexbox and Grid

If you use \`display: flex\` or \`display: grid\`, clearing isn't needed at all, because elements remain in flow and don't cause parent collapse.

\`\`\`css
.container {
  display: flex;
}
\`\`\`

Better to use them instead of float when possible.

> **Important:** Don't confuse \`clear\` and \`clearfix\`. \`clear\` is a **property**, \`clearfix\` is a **technique** using \`clear\` inside pseudo-element.`,
    contentMarkdownUa: `## Навіщо Потрібно clear (очищення) в CSS?

Коли ви використовуєте \`float\` на елементі (наприклад, \`float: left\`), він **виходить зі звичайного потоку документа**. Це може призвести до того, що батьківський елемент, **що містить лише float елементи**, **схлопується** за висотою.

Щоб батько "помітив" такі діти, потрібно **очистити float (clearing)**.

## Основні Методи Очищення Float

### Властивість clear

Додається до **елемента після float елементів**.

\`\`\`html
<div class="clearfix"></div>
\`\`\`

\`\`\`css
.clearfix {
  clear: both;
}
\`\`\`

Це працює, але вимагає **додавання зайвого HTML**, що не завжди зручно.

### Техніка Clearfix (псевдоелемент)

Найпопулярніший та універсальний метод.

\`\`\`css
.clearfix::after {
  content: "";
  display: table;
  clear: both;
}
\`\`\`

Застосовується до **батьківського елемента**, що містить float дочірні блоки.

\`\`\`html
<div class="container clearfix">
  <div class="left-box" style="float: left;"></div>
  <div class="right-box" style="float: right;"></div>
</div>
\`\`\`

Уникає додавання зайвої розмітки та автоматично очищає float.

### Використання "overflow: hidden"

\`\`\`css
.container {
  overflow: hidden;
}
\`\`\`

- Працює, тому що \`overflow\` створює новий **блоковий контекст форматування (BFC)**, який включає float елементи в розрахунок висоти
- Недолік: може обрізати контент з \`position: absolute\` або блоки, що виходять за межі

### Сучасні Альтернативи — Flexbox та Grid

Якщо використовуєте \`display: flex\` або \`display: grid\`, очищення взагалі не потрібне, тому що елементи залишаються в потоці та не викликають схлопування батька.

\`\`\`css
.container {
  display: flex;
}
\`\`\`

Краще використовувати їх замість float, коли це можливо.

> **Важливо:** Не плутайте \`clear\` та \`clearfix\`. \`clear\` — це **властивість**, \`clearfix\` — це **техніка**, що використовує \`clear\` всередині псевдоелемента.`,
  },
  {
    slug: 'svg-color-change',
    contentMarkdownEn: `In SVG, color is set through special **attributes**:

- \`fill\` — fill color
- \`stroke\` — outline color

## Changing Color in SVG File Itself

Color can be specified directly inside SVG:

\`\`\`html
<svg>
  <circle fill="red" stroke="blue" />
</svg>
\`\`\`

## Changing Color via CSS

If SVG is **inline** (inside HTML), you can style it with CSS:

\`\`\`css
svg circle {
  fill: green;
  stroke: black;
}
\`\`\`

## Using currentColor

\`currentColor\` inherits text color from parent:

\`\`\`html
<div style="color: blue;">
  <svg>
    <path fill="currentColor" />
  </svg>
</div>
\`\`\`

## Changing Color in External SVG

If SVG is loaded via \`<img>\`, color **cannot be changed** with CSS.

**Solution:**

- Load SVG inline
- Use \`<object>\` or \`<use>\` with \`<symbol>\`
- Use CSS variables in SVG

> **Tip:** Use \`currentColor\` for icon systems — icons will automatically inherit text color.`,
    contentMarkdownUa: `У SVG колір встановлюється через спеціальні **атрибути**:

- \`fill\` — колір заливки
- \`stroke\` — колір обведення

## Зміна Кольору в Самому SVG Файлі

Колір можна вказати безпосередньо всередині SVG:

\`\`\`html
<svg>
  <circle fill="red" stroke="blue" />
</svg>
\`\`\`

## Зміна Кольору Через CSS

Якщо SVG **вбудований** (всередині HTML), його можна стилізувати через CSS:

\`\`\`css
svg circle {
  fill: green;
  stroke: black;
}
\`\`\`

## Використання currentColor

\`currentColor\` успадковує колір тексту від батька:

\`\`\`html
<div style="color: blue;">
  <svg>
    <path fill="currentColor" />
  </svg>
</div>
\`\`\`

## Зміна Кольору в Зовнішньому SVG

Якщо SVG завантажено через \`<img>\`, колір **не можна змінити** з CSS.

**Рішення:**

- Завантажити SVG вбудовано
- Використати \`<object>\` або \`<use>\` з \`<symbol>\`
- Використати CSS змінні в SVG

> **Порада:** Використовуйте \`currentColor\` для систем іконок — іконки автоматично успадкують колір тексту.`,
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
        console.log(`✅ Updated with full content\\n`)
      }
    }
    console.log('✅ Batch update complete!')
  } finally {
    await client.end()
  }
}

updateQuestions().then(() => process.exit(0))
