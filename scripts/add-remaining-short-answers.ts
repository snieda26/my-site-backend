/**
 * Remaining categories short answers (HTML/CSS, General, Vue, Angular, Redux, Patterns, Principles, Architecture)
 * Usage: npx tsx scripts/add-remaining-short-answers.ts
 */

import { drizzle } from 'drizzle-orm/postgres-js'
import { eq } from 'drizzle-orm'
import * as dotenv from 'dotenv'
import * as schema from '../src/core/database/schema'

const postgres = require('postgres')
dotenv.config({ path: '.env' })

let connectionString = process.env.DATABASE_URL
if (!connectionString) throw new Error('DATABASE_URL is not set')
connectionString = connectionString.split('?')[0]

const client = postgres(connectionString)
const db = drizzle(client, { schema })

const shortAnswers: Record<string, { en: string; ua: string }> = {
  // ==================== HTML & CSS ====================
  'what-is-the-dom': {
    en: `**DOM** (Document Object Model) is a programming interface that represents HTML as a tree of nodes.

\`\`\`javascript
document.getElementById('app'); // Access element
element.innerHTML = 'Hello'; // Modify content
element.style.color = 'red'; // Change styles
\`\`\`

JavaScript manipulates DOM to create dynamic pages.`,
    ua: `**DOM** (Document Object Model) — програмний інтерфейс, що представляє HTML як дерево вузлів.

\`\`\`javascript
document.getElementById('app'); // Доступ до елемента
element.innerHTML = 'Hello'; // Зміна вмісту
element.style.color = 'red'; // Зміна стилів
\`\`\`

JavaScript маніпулює DOM для створення динамічних сторінок.`,
  },
  'css-selectors': {
    en: `**CSS Selectors** target elements to apply styles:

- \`element\` — by tag (\`p\`, \`div\`)
- \`.class\` — by class
- \`#id\` — by ID
- \`[attr]\` — by attribute
- \`:pseudo\` — pseudo-classes (\`:hover\`, \`:first-child\`)
- \`::pseudo\` — pseudo-elements (\`::before\`, \`::after\`)
- Combinators: \`>\`, \`+\`, \`~\`, space`,
    ua: `**CSS Селектори** вибирають елементи для застосування стилів:

- \`element\` — за тегом (\`p\`, \`div\`)
- \`.class\` — за класом
- \`#id\` — за ID
- \`[attr]\` — за атрибутом
- \`:pseudo\` — псевдокласи (\`:hover\`, \`:first-child\`)
- \`::pseudo\` — псевдоелементи (\`::before\`, \`::after\`)
- Комбінатори: \`>\`, \`+\`, \`~\`, пробіл`,
  },
  'css-selector-specificity': {
    en: `**Specificity** determines which CSS rule applies when multiple rules match.

**Calculation (a, b, c, d):**
- \`a\` — inline styles
- \`b\` — IDs
- \`c\` — classes, attributes, pseudo-classes
- \`d\` — elements, pseudo-elements

\`#id .class p\` = (0, 1, 1, 1)
\`!important\` overrides all (avoid using).`,
    ua: `**Специфічність** визначає яке CSS правило застосовується коли кілька правил збігаються.

**Обчислення (a, b, c, d):**
- \`a\` — inline стилі
- \`b\` — IDs
- \`c\` — класи, атрибути, псевдокласи
- \`d\` — елементи, псевдоелементи

\`#id .class p\` = (0, 1, 1, 1)
\`!important\` перевизначає все (уникайте).`,
  },
  'css-box-sizing-property': {
    en: `\`box-sizing\` defines how width/height are calculated:

- \`content-box\` (default) — width = content only
- \`border-box\` — width = content + padding + border

\`\`\`css
*, *::before, *::after {
  box-sizing: border-box; /* Recommended */
}
\`\`\``,
    ua: `\`box-sizing\` визначає як обчислюються width/height:

- \`content-box\` (за замовч.) — width = лише контент
- \`border-box\` — width = контент + padding + border

\`\`\`css
*, *::before, *::after {
  box-sizing: border-box; /* Рекомендовано */
}
\`\`\``,
  },
  'css-display-property': {
    en: `\`display\` controls element rendering:

- \`block\` — full width, new line
- \`inline\` — content width, same line
- \`inline-block\` — inline but respects width/height
- \`flex\` — flexbox container
- \`grid\` — grid container
- \`none\` — hidden, removed from flow`,
    ua: `\`display\` керує рендерингом елемента:

- \`block\` — повна ширина, новий рядок
- \`inline\` — ширина контенту, в рядку
- \`inline-block\` — inline але з width/height
- \`flex\` — flexbox контейнер
- \`grid\` — grid контейнер
- \`none\` — прихований, видалений з потоку`,
  },
  'css-position-property': {
    en: `\`position\` controls element positioning:

- \`static\` (default) — normal document flow
- \`relative\` — offset from normal position
- \`absolute\` — relative to positioned ancestor
- \`fixed\` — relative to viewport
- \`sticky\` — hybrid (relative until threshold, then fixed)`,
    ua: `\`position\` керує позиціонуванням елемента:

- \`static\` (за замовч.) — нормальний потік документа
- \`relative\` — зміщення від нормальної позиції
- \`absolute\` — відносно позиціонованого предка
- \`fixed\` — відносно viewport
- \`sticky\` — гібрид (relative до порогу, потім fixed)`,
  },
  'flexbox-vs-css-grid-comparison': {
    en: `**Flexbox** — 1-dimensional (row OR column)
\`\`\`css
.container { display: flex; justify-content: space-between; }
\`\`\`

**Grid** — 2-dimensional (rows AND columns)
\`\`\`css
.container { display: grid; grid-template-columns: 1fr 2fr 1fr; }
\`\`\`

Use Flexbox for components, Grid for page layouts.`,
    ua: `**Flexbox** — 1-вимірний (рядок АБО колонка)
\`\`\`css
.container { display: flex; justify-content: space-between; }
\`\`\`

**Grid** — 2-вимірний (рядки І колонки)
\`\`\`css
.container { display: grid; grid-template-columns: 1fr 2fr 1fr; }
\`\`\`

Flexbox для компонентів, Grid для макетів сторінок.`,
  },
  'css-pseudo-classes-and-pseudo-elements': {
    en: `**Pseudo-classes** (\`:\`) — state-based selectors
\`:hover\`, \`:focus\`, \`:first-child\`, \`:nth-child()\`

**Pseudo-elements** (\`::\`) — create virtual elements
\`::before\`, \`::after\`, \`::first-line\`, \`::placeholder\`

\`\`\`css
button:hover { background: blue; }
.quote::before { content: '"'; }
\`\`\``,
    ua: `**Псевдокласи** (\`:\`) — селектори на основі стану
\`:hover\`, \`:focus\`, \`:first-child\`, \`:nth-child()\`

**Псевдоелементи** (\`::\`) — створюють віртуальні елементи
\`::before\`, \`::after\`, \`::first-line\`, \`::placeholder\`

\`\`\`css
button:hover { background: blue; }
.quote::before { content: '"'; }
\`\`\``,
  },
  'what-is-cascade-in-css': {
    en: `**Cascade** is the algorithm determining which styles apply when multiple rules match.

**Priority order:**
1. Importance (\`!important\`)
2. Origin (user > author > browser)
3. Specificity
4. Source order (later wins)

Understanding cascade helps debug style conflicts.`,
    ua: `**Каскад** — алгоритм визначення які стилі застосовуються коли збігається кілька правил.

**Порядок пріоритету:**
1. Важливість (\`!important\`)
2. Походження (user > author > browser)
3. Специфічність
4. Порядок в коді (пізніше виграє)

Розуміння каскаду допомагає налагоджувати конфлікти стилів.`,
  },
  'css-units-px-rem-em': {
    en: `- \`px\` — absolute, fixed size
- \`em\` — relative to parent's font-size
- \`rem\` — relative to root (\`html\`) font-size
- \`%\` — relative to parent
- \`vw/vh\` — viewport width/height

\`\`\`css
html { font-size: 16px; }
.text { font-size: 1.5rem; } /* 24px */
\`\`\``,
    ua: `- \`px\` — абсолютні, фіксований розмір
- \`em\` — відносно font-size батька
- \`rem\` — відносно font-size кореня (\`html\`)
- \`%\` — відносно батька
- \`vw/vh\` — ширина/висота viewport

\`\`\`css
html { font-size: 16px; }
.text { font-size: 1.5rem; } /* 24px */
\`\`\``,
  },
  'why-media-queries-are-needed-in-css': {
    en: `**Media queries** apply styles based on device characteristics.

\`\`\`css
/* Mobile first */
.container { width: 100%; }

@media (min-width: 768px) {
  .container { width: 750px; }
}

@media (min-width: 1024px) {
  .container { width: 960px; }
}
\`\`\`

Essential for responsive design.`,
    ua: `**Media queries** застосовують стилі на основі характеристик пристрою.

\`\`\`css
/* Mobile first */
.container { width: 100%; }

@media (min-width: 768px) {
  .container { width: 750px; }
}

@media (min-width: 1024px) {
  .container { width: 960px; }
}
\`\`\`

Необхідні для адаптивного дизайну.`,
  },
  'css-variables-custom-properties': {
    en: `**CSS Variables** (Custom Properties) store reusable values.

\`\`\`css
:root {
  --primary: #6366f1;
  --spacing: 1rem;
}

.button {
  background: var(--primary);
  padding: var(--spacing);
}
\`\`\`

Can be changed with JavaScript or media queries.`,
    ua: `**CSS Змінні** (Custom Properties) зберігають багаторазові значення.

\`\`\`css
:root {
  --primary: #6366f1;
  --spacing: 1rem;
}

.button {
  background: var(--primary);
  padding: var(--spacing);
}
\`\`\`

Можна змінювати через JavaScript або media queries.`,
  },
  'semantic-html': {
    en: `**Semantic HTML** uses meaningful tags that describe content purpose.

\`\`\`html
<header>...</header>
<nav>...</nav>
<main>
  <article>
    <section>...</section>
  </article>
  <aside>...</aside>
</main>
<footer>...</footer>
\`\`\`

**Benefits:** Accessibility, SEO, maintainability.`,
    ua: `**Семантичний HTML** використовує змістовні теги, що описують призначення контенту.

\`\`\`html
<header>...</header>
<nav>...</nav>
<main>
  <article>
    <section>...</section>
  </article>
  <aside>...</aside>
</main>
<footer>...</footer>
\`\`\`

**Переваги:** Доступність, SEO, підтримуваність.`,
  },
  'what-is-bem-methodology-block-element-modifier': {
    en: `**BEM** (Block Element Modifier) — CSS naming convention.

\`\`\`css
/* Block */
.card { }

/* Element (part of block) */
.card__title { }
.card__image { }

/* Modifier (variation) */
.card--featured { }
.card__title--large { }
\`\`\`

Improves maintainability and avoids naming conflicts.`,
    ua: `**BEM** (Block Element Modifier) — конвенція найменування CSS.

\`\`\`css
/* Block */
.card { }

/* Element (частина блоку) */
.card__title { }
.card__image { }

/* Modifier (варіація) */
.card--featured { }
.card__title--large { }
\`\`\`

Покращує підтримуваність та уникає конфліктів імен.`,
  },
  'difference-between-script-async-and-defer': {
    en: `**Loading behavior:**

- \`<script>\` — blocks parsing, executes immediately
- \`<script async>\` — loads parallel, executes when ready (order not guaranteed)
- \`<script defer>\` — loads parallel, executes after parsing (order preserved)

\`\`\`html
<script defer src="app.js"></script>
\`\`\`

Use \`defer\` for most scripts, \`async\` for independent scripts.`,
    ua: `**Поведінка завантаження:**

- \`<script>\` — блокує парсинг, виконується одразу
- \`<script async>\` — завантажується паралельно, виконується коли готовий (порядок не гарантований)
- \`<script defer>\` — завантажується паралельно, виконується після парсингу (порядок збережений)

\`\`\`html
<script defer src="app.js"></script>
\`\`\`

Використовуйте \`defer\` для більшості скриптів, \`async\` для незалежних.`,
  },
  'difference-between-visibility-hidden-and-display-none': {
    en: `- \`display: none\` — element removed from layout, no space
- \`visibility: hidden\` — element invisible but keeps space

\`\`\`css
.removed { display: none; } /* No space */
.invisible { visibility: hidden; } /* Space preserved */
.transparent { opacity: 0; } /* Space preserved, can be animated */
\`\`\``,
    ua: `- \`display: none\` — елемент видалений з layout, без простору
- \`visibility: hidden\` — елемент невидимий, але займає простір

\`\`\`css
.removed { display: none; } /* Без простору */
.invisible { visibility: hidden; } /* Простір збережений */
.transparent { opacity: 0; } /* Простір збережений, можна анімувати */
\`\`\``,
  },
  'css-stacking-order': {
    en: `**Stacking context** determines element layering order.

**z-index** works only on positioned elements (\`position\` != \`static\`).

\`\`\`css
.modal { position: fixed; z-index: 100; }
.overlay { position: fixed; z-index: 99; }
\`\`\`

New stacking contexts: \`position\` + \`z-index\`, \`opacity < 1\`, \`transform\`, \`filter\`.`,
    ua: `**Контекст накладання** визначає порядок шарів елементів.

**z-index** працює лише на позиціонованих елементах (\`position\` != \`static\`).

\`\`\`css
.modal { position: fixed; z-index: 100; }
.overlay { position: fixed; z-index: 99; }
\`\`\`

Нові контексти: \`position\` + \`z-index\`, \`opacity < 1\`, \`transform\`, \`filter\`.`,
  },
  'what-is-margin-collapsing-in-css': {
    en: `**Margin collapsing** — vertical margins of adjacent blocks merge into one (larger margin wins).

\`\`\`css
.first { margin-bottom: 20px; }
.second { margin-top: 30px; }
/* Gap = 30px (not 50px) */
\`\`\`

**Prevents collapsing:** padding, border, flexbox/grid, \`overflow: hidden\`.`,
    ua: `**Злиття margin** — вертикальні margin сусідніх блоків зливаються в один (більший виграє).

\`\`\`css
.first { margin-bottom: 20px; }
.second { margin-top: 30px; }
/* Проміжок = 30px (не 50px) */
\`\`\`

**Запобігає злиттю:** padding, border, flexbox/grid, \`overflow: hidden\`.`,
  },
  'why-transform-is-better-for-animations-than-top-left': {
    en: `\`transform\` is GPU-accelerated and doesn't trigger layout/paint.

\`\`\`css
/* ❌ Slow: triggers layout */
.box { top: 100px; }

/* ✅ Fast: GPU compositing only */
.box { transform: translateY(100px); }
\`\`\`

Also use \`opacity\` instead of \`visibility\` for fade animations.`,
    ua: `\`transform\` використовує GPU і не викликає layout/paint.

\`\`\`css
/* ❌ Повільно: викликає layout */
.box { top: 100px; }

/* ✅ Швидко: лише GPU compositing */
.box { transform: translateY(100px); }
\`\`\`

Також використовуйте \`opacity\` замість \`visibility\` для анімацій появи.`,
  },
  'css-properties-for-creating-animations-and-smooth-transitions': {
    en: `**Transition** — smooth change between states
\`\`\`css
.button {
  transition: background 0.3s ease, transform 0.2s;
}
.button:hover { background: blue; transform: scale(1.05); }
\`\`\`

**Animation** — keyframe-based, more control
\`\`\`css
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.element { animation: fadeIn 0.5s ease-out; }
\`\`\``,
    ua: `**Transition** — плавна зміна між станами
\`\`\`css
.button {
  transition: background 0.3s ease, transform 0.2s;
}
.button:hover { background: blue; transform: scale(1.05); }
\`\`\`

**Animation** — на основі keyframes, більше контролю
\`\`\`css
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
.element { animation: fadeIn 0.5s ease-out; }
\`\`\``,
  },
  // ==================== GENERAL ====================
  'what-is-cors-and-how-does-it-work': {
    en: `**CORS** (Cross-Origin Resource Sharing) is a security mechanism that controls cross-origin HTTP requests.

**Headers:**
- \`Access-Control-Allow-Origin\` — allowed origins
- \`Access-Control-Allow-Methods\` — allowed HTTP methods
- \`Access-Control-Allow-Headers\` — allowed headers

Preflight (\`OPTIONS\`) request checks permissions before actual request.`,
    ua: `**CORS** (Cross-Origin Resource Sharing) — механізм безпеки, що контролює крос-доменні HTTP запити.

**Заголовки:**
- \`Access-Control-Allow-Origin\` — дозволені origin
- \`Access-Control-Allow-Methods\` — дозволені HTTP методи
- \`Access-Control-Allow-Headers\` — дозволені заголовки

Preflight (\`OPTIONS\`) запит перевіряє дозволи перед основним запитом.`,
  },
  'http-status-codes': {
    en: `**HTTP Status Codes:**

- **1xx** — Informational
- **2xx** — Success (\`200 OK\`, \`201 Created\`, \`204 No Content\`)
- **3xx** — Redirect (\`301 Moved\`, \`304 Not Modified\`)
- **4xx** — Client Error (\`400 Bad Request\`, \`401 Unauthorized\`, \`404 Not Found\`)
- **5xx** — Server Error (\`500 Internal\`, \`503 Unavailable\`)`,
    ua: `**HTTP Коди статусу:**

- **1xx** — Інформаційні
- **2xx** — Успіх (\`200 OK\`, \`201 Created\`, \`204 No Content\`)
- **3xx** — Перенаправлення (\`301 Moved\`, \`304 Not Modified\`)
- **4xx** — Помилка клієнта (\`400 Bad Request\`, \`401 Unauthorized\`, \`404 Not Found\`)
- **5xx** — Помилка сервера (\`500 Internal\`, \`503 Unavailable\`)`,
  },
  'what-is-rest-and-rest-principles-rest-api': {
    en: `**REST** — architectural style for APIs using HTTP methods.

**Principles:**
- **Stateless** — no session on server
- **Uniform interface** — standard HTTP methods
- **Resource-based** — URLs represent resources

\`\`\`
GET /users — list
POST /users — create
GET /users/1 — read
PUT /users/1 — update
DELETE /users/1 — delete
\`\`\``,
    ua: `**REST** — архітектурний стиль для API з використанням HTTP методів.

**Принципи:**
- **Stateless** — без сесії на сервері
- **Єдиний інтерфейс** — стандартні HTTP методи
- **На основі ресурсів** — URL представляють ресурси

\`\`\`
GET /users — список
POST /users — створення
GET /users/1 — читання
PUT /users/1 — оновлення
DELETE /users/1 — видалення
\`\`\``,
  },
  'csr-ssr-ssg-isr-difference-between-rendering-strategies': {
    en: `**Rendering strategies:**

- **CSR** (Client-Side) — renders in browser, slow initial load
- **SSR** (Server-Side) — renders on server per request, SEO-friendly
- **SSG** (Static Generation) — pre-built at build time, fastest
- **ISR** (Incremental Static) — SSG + revalidation, best of both`,
    ua: `**Стратегії рендерингу:**

- **CSR** (Client-Side) — рендер у браузері, повільне початкове завантаження
- **SSR** (Server-Side) — рендер на сервері при кожному запиті, SEO-friendly
- **SSG** (Static Generation) — попередня генерація при збірці, найшвидший
- **ISR** (Incremental Static) — SSG + ревалідація, найкраще з обох`,
  },
  'browser-storage-cookie-localstorage-sessionstorage-and-indexeddb': {
    en: `| Storage | Size | Expires | Access |
|---------|------|---------|--------|
| Cookie | 4KB | Set by server | Server + Client |
| localStorage | 5-10MB | Never | Client only |
| sessionStorage | 5-10MB | Tab close | Client only |
| IndexedDB | Large | Never | Client only |

Use localStorage for preferences, cookies for auth, IndexedDB for large data.`,
    ua: `| Сховище | Розмір | Закінчення | Доступ |
|---------|--------|------------|--------|
| Cookie | 4KB | Встановлюється сервером | Сервер + Клієнт |
| localStorage | 5-10MB | Ніколи | Лише клієнт |
| sessionStorage | 5-10MB | Закриття вкладки | Лише клієнт |
| IndexedDB | Великий | Ніколи | Лише клієнт |

localStorage для налаштувань, cookies для авторизації, IndexedDB для великих даних.`,
  },
  'what-is-webpack': {
    en: `**Webpack** is a module bundler that processes and bundles JavaScript and assets.

**Key concepts:**
- **Entry** — starting point
- **Output** — bundled files
- **Loaders** — transform files (Babel, CSS)
- **Plugins** — additional processing

Modern alternatives: Vite, esbuild, Turbopack.`,
    ua: `**Webpack** — бандлер модулів, що обробляє та збирає JavaScript і ресурси.

**Ключові концепції:**
- **Entry** — точка входу
- **Output** — зібрані файли
- **Loaders** — трансформують файли (Babel, CSS)
- **Plugins** — додаткова обробка

Сучасні альтернативи: Vite, esbuild, Turbopack.`,
  },
  'what-is-service-worker': {
    en: `**Service Worker** is a script running in background, enabling offline functionality.

**Capabilities:**
- Cache assets for offline access
- Background sync
- Push notifications
- Network request interception

\`\`\`javascript
navigator.serviceWorker.register('/sw.js');
\`\`\`

Foundation for PWAs (Progressive Web Apps).`,
    ua: `**Service Worker** — скрипт, що працює у фоні, дозволяючи офлайн-функціональність.

**Можливості:**
- Кешування ресурсів для офлайн-доступу
- Фонова синхронізація
- Push-сповіщення
- Перехоплення мережевих запитів

\`\`\`javascript
navigator.serviceWorker.register('/sw.js');
\`\`\`

Основа для PWA (Progressive Web Apps).`,
  },
  'what-are-web-workers': {
    en: `**Web Workers** run JavaScript in background threads without blocking UI.

\`\`\`javascript
// main.js
const worker = new Worker('worker.js');
worker.postMessage({ data: bigArray });
worker.onmessage = (e) => console.log(e.data);

// worker.js
onmessage = (e) => {
  const result = heavyComputation(e.data);
  postMessage(result);
};
\`\`\`

Use for CPU-intensive tasks.`,
    ua: `**Web Workers** виконують JavaScript у фонових потоках без блокування UI.

\`\`\`javascript
// main.js
const worker = new Worker('worker.js');
worker.postMessage({ data: bigArray });
worker.onmessage = (e) => console.log(e.data);

// worker.js
onmessage = (e) => {
  const result = heavyComputation(e.data);
  postMessage(result);
};
\`\`\`

Використовуйте для CPU-інтенсивних задач.`,
  },
  // ==================== VUE ====================
  'what-is-vuejs': {
    en: `**Vue.js** is a progressive JavaScript framework for building UIs.

**Key features:**
- Reactive data binding
- Component-based architecture
- Template syntax
- Vue Router, Vuex/Pinia for state

\`\`\`vue
<template>
  <button @click="count++">{{ count }}</button>
</template>
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>
\`\`\``,
    ua: `**Vue.js** — прогресивний JavaScript фреймворк для побудови UI.

**Ключові особливості:**
- Реактивне звʼязування даних
- Компонентна архітектура
- Шаблонний синтаксис
- Vue Router, Vuex/Pinia для стану

\`\`\`vue
<template>
  <button @click="count++">{{ count }}</button>
</template>
<script setup>
import { ref } from 'vue'
const count = ref(0)
</script>
\`\`\``,
  },
  'options-api-and-composition-api': {
    en: `**Options API** — organize code by options (data, methods, computed)
\`\`\`javascript
export default {
  data() { return { count: 0 } },
  methods: { increment() { this.count++ } }
}
\`\`\`

**Composition API** — organize by logic/feature (Vue 3+)
\`\`\`javascript
const count = ref(0)
const increment = () => count.value++
\`\`\``,
    ua: `**Options API** — організація коду за опціями (data, methods, computed)
\`\`\`javascript
export default {
  data() { return { count: 0 } },
  methods: { increment() { this.count++ } }
}
\`\`\`

**Composition API** — організація за логікою/функціоналом (Vue 3+)
\`\`\`javascript
const count = ref(0)
const increment = () => count.value++
\`\`\``,
  },
  'how-does-reactivity-work-in-vuejs': {
    en: `Vue 3 uses **Proxy** for reactivity (Vue 2 used Object.defineProperty).

\`\`\`javascript
const state = reactive({ count: 0 })
const count = ref(0)

// Access ref value
count.value++

// Reactive object - direct access
state.count++
\`\`\`

Vue automatically tracks dependencies and updates components when data changes.`,
    ua: `Vue 3 використовує **Proxy** для реактивності (Vue 2 використовував Object.defineProperty).

\`\`\`javascript
const state = reactive({ count: 0 })
const count = ref(0)

// Доступ до значення ref
count.value++

// Реактивний обʼєкт - прямий доступ
state.count++
\`\`\`

Vue автоматично відстежує залежності та оновлює компоненти при зміні даних.`,
  },
  'computed-methods-and-watchers-in-vuejs': {
    en: `- **computed** — cached derived values, recalculated when dependencies change
- **methods** — functions, called every render
- **watch** — side effects when specific data changes

\`\`\`javascript
const count = ref(0)
const doubled = computed(() => count.value * 2)
watch(count, (newVal) => console.log('Changed:', newVal))
\`\`\``,
    ua: `- **computed** — кешовані похідні значення, перераховуються при зміні залежностей
- **methods** — функції, викликаються кожен рендер
- **watch** — побічні ефекти при зміні конкретних даних

\`\`\`javascript
const count = ref(0)
const doubled = computed(() => count.value * 2)
watch(count, (newVal) => console.log('Changed:', newVal))
\`\`\``,
  },
  // ==================== ANGULAR ====================
  'what-is-angular': {
    en: `**Angular** is a TypeScript-based framework for building web applications.

**Key features:**
- Component-based architecture
- Two-way data binding
- Dependency Injection
- RxJS for reactive programming
- Built-in routing, forms, HTTP client

Maintained by Google, used for enterprise applications.`,
    ua: `**Angular** — це TypeScript-based фреймворк для побудови веб-застосунків.

**Ключові особливості:**
- Компонентна архітектура
- Двостороннє звʼязування даних
- Dependency Injection
- RxJS для реактивного програмування
- Вбудовані routing, forms, HTTP client

Підтримується Google, використовується для enterprise-застосунків.`,
  },
  'how-does-change-detection-work-in-angular': {
    en: `Angular's **Change Detection** checks component tree for changes after events.

**Strategies:**
- **Default** — checks entire component tree
- **OnPush** — checks only when inputs change or events occur

\`\`\`typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
\`\`\`

OnPush improves performance for large applications.`,
    ua: `**Change Detection** Angular перевіряє дерево компонентів на зміни після подій.

**Стратегії:**
- **Default** — перевіряє все дерево компонентів
- **OnPush** — перевіряє лише при зміні inputs або подіях

\`\`\`typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
\`\`\`

OnPush покращує продуктивність для великих застосунків.`,
  },
  // ==================== REDUX ====================
  'what-is-redux': {
    en: `**Redux** is a predictable state container for JavaScript apps.

**Core concepts:**
- **Store** — single source of truth
- **Actions** — describe what happened
- **Reducers** — pure functions that update state

\`\`\`javascript
const reducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + 1 }
    default: return state
  }
}
\`\`\``,
    ua: `**Redux** — передбачуваний контейнер стану для JavaScript застосунків.

**Основні концепції:**
- **Store** — єдине джерело правди
- **Actions** — описують що сталося
- **Reducers** — чисті функції, що оновлюють стан

\`\`\`javascript
const reducer = (state, action) => {
  switch (action.type) {
    case 'INCREMENT': return { count: state.count + 1 }
    default: return state
  }
}
\`\`\``,
  },
  'redux-toolkit': {
    en: `**Redux Toolkit** is the official, recommended way to write Redux logic.

\`\`\`javascript
import { createSlice, configureStore } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value++ }
  }
})
\`\`\`

Includes: \`createSlice\`, \`configureStore\`, \`createAsyncThunk\`, RTK Query.`,
    ua: `**Redux Toolkit** — офіційний, рекомендований спосіб писати Redux логіку.

\`\`\`javascript
import { createSlice, configureStore } from '@reduxjs/toolkit'

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value++ }
  }
})
\`\`\`

Включає: \`createSlice\`, \`configureStore\`, \`createAsyncThunk\`, RTK Query.`,
  },
  // ==================== PATTERNS & PRINCIPLES ====================
  'solid-principles': {
    en: `**SOLID** — five OOP design principles:

- **S**ingle Responsibility — one reason to change
- **O**pen/Closed — open for extension, closed for modification
- **L**iskov Substitution — subtypes replaceable
- **I**nterface Segregation — specific interfaces
- **D**ependency Inversion — depend on abstractions`,
    ua: `**SOLID** — пʼять принципів ООП дизайну:

- **S**ingle Responsibility — одна причина для зміни
- **O**pen/Closed — відкритий для розширення, закритий для модифікації
- **L**iskov Substitution — підтипи замінні
- **I**nterface Segregation — специфічні інтерфейси
- **D**ependency Inversion — залежність від абстракцій`,
  },
  'dry-dont-repeat-yourself': {
    en: `**DRY** (Don't Repeat Yourself) — avoid code duplication.

**Instead of:**
\`\`\`javascript
const area1 = width1 * height1;
const area2 = width2 * height2;
\`\`\`

**Do:**
\`\`\`javascript
const calculateArea = (w, h) => w * h;
\`\`\`

Extract repeated logic into functions, components, or modules.`,
    ua: `**DRY** (Don't Repeat Yourself) — уникайте дублювання коду.

**Замість:**
\`\`\`javascript
const area1 = width1 * height1;
const area2 = width2 * height2;
\`\`\`

**Робіть:**
\`\`\`javascript
const calculateArea = (w, h) => w * h;
\`\`\`

Виділяйте повторювану логіку у функції, компоненти або модулі.`,
  },
  'kiss-keep-it-simple-stupid': {
    en: `**KISS** (Keep It Simple, Stupid) — simplicity is key.

**Principles:**
- Avoid unnecessary complexity
- Write readable, maintainable code
- Choose simple solutions over clever ones
- Refactor complex code into smaller parts

Simple code is easier to understand, test, and debug.`,
    ua: `**KISS** (Keep It Simple, Stupid) — простота є ключем.

**Принципи:**
- Уникайте непотрібної складності
- Пишіть читабельний, підтримуваний код
- Обирайте прості рішення замість хитрих
- Рефакторіть складний код на менші частини

Простий код легше зрозуміти, тестувати та налагоджувати.`,
  },
  'yagni-you-arent-gonna-need-it': {
    en: `**YAGNI** (You Aren't Gonna Need It) — don't add functionality until needed.

**Avoid:**
- Premature optimization
- Features "just in case"
- Over-engineering

**Focus on:**
- Current requirements
- Working software now
- Refactoring when needed`,
    ua: `**YAGNI** (You Aren't Gonna Need It) — не додавайте функціонал поки він не потрібен.

**Уникайте:**
- Передчасної оптимізації
- Функцій "про всяк випадок"
- Надмірного проектування

**Фокусуйтесь на:**
- Поточних вимогах
- Працюючому софті зараз
- Рефакторингу коли потрібно`,
  },
  'singleton-pattern': {
    en: `**Singleton** ensures a class has only one instance globally.

\`\`\`javascript
class Database {
  static instance;
  
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
\`\`\`

Use for: loggers, caches, configuration. Avoid overuse — can complicate testing.`,
    ua: `**Singleton** гарантує, що клас має лише один екземпляр глобально.

\`\`\`javascript
class Database {
  static instance;
  
  static getInstance() {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }
}
\`\`\`

Використовуйте для: логерів, кешів, конфігурації. Уникайте надмірного використання — може ускладнити тестування.`,
  },
  'observer-pattern': {
    en: `**Observer** — defines one-to-many dependency between objects.

\`\`\`javascript
class EventEmitter {
  listeners = {};
  
  on(event, callback) {
    (this.listeners[event] ??= []).push(callback);
  }
  
  emit(event, data) {
    this.listeners[event]?.forEach(cb => cb(data));
  }
}
\`\`\`

Used in: Event systems, RxJS, Vue reactivity.`,
    ua: `**Observer** — визначає залежність один-до-багатьох між обʼєктами.

\`\`\`javascript
class EventEmitter {
  listeners = {};
  
  on(event, callback) {
    (this.listeners[event] ??= []).push(callback);
  }
  
  emit(event, data) {
    this.listeners[event]?.forEach(cb => cb(data));
  }
}
\`\`\`

Використовується в: Event-системах, RxJS, реактивності Vue.`,
  },
};

async function updateShortAnswers() {
  console.log('🚀 Updating remaining categories...\n')
  let updated = 0, notFound = 0
  
  for (const [slug, answers] of Object.entries(shortAnswers)) {
    try {
      const [question] = await db.select({ id: schema.questions.id }).from(schema.questions).where(eq(schema.questions.slug, slug)).limit(1)
      if (!question) { console.log(`❌ Not found: ${slug}`); notFound++; continue }
      await db.update(schema.questions).set({ shortAnswerEn: answers.en, shortAnswerUa: answers.ua, updatedAt: new Date() }).where(eq(schema.questions.id, question.id))
      console.log(`✅ ${slug}`)
      updated++
    } catch (error) { console.error(`❌ Error: ${slug}`, error) }
  }
  
  console.log(`\n✅ Updated: ${updated} | ❌ Not found: ${notFound}`)
  await client.end()
  process.exit(0)
}

updateShortAnswers().catch(console.error)
