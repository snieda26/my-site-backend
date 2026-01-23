/**
 * Batch Add Questions (Batch 6) - CSS-in-JS, Animations, Meta Tags, etc.
 * Questions: 5
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
  // Question 1: CSS-in-JS
  {
    slug: 'css-in-js-problems-solutions',
    titleEn: 'CSS-in-JS Problems and Solutions',
    titleUa: 'CSS-in-JS Проблеми та Рішення',
    descriptionEn: 'Understand the problems and solutions when using CSS-in-JS libraries in modern applications.',
    descriptionUa: 'Зрозумійте проблеми та рішення при використанні CSS-in-JS бібліотек у сучасних застосунках.',
    difficulty: 'HARD' as const,
    order: 20,
    contentMarkdownEn: `## What is CSS-in-JS?

**CSS-in-JS** is an approach to component styling where CSS is written **directly in JavaScript files**, often using libraries like \`styled-components\`, \`emotion\`, \`linaria\`, \`stitches\` and others.

This approach provides several advantages: scoped styles, dynamic styles, isolation, theme support, etc.

But it also has **drawbacks**, especially if used without understanding the pitfalls.

---

## Main CSS-in-JS Problems and Solutions

### Performance Loss on Render

Every time a component renders, the library may recreate classes or styles. This is especially critical in large lists or with frequent UI updates.

**Solution:**

- Use **static styles** when possible
- Wrap components in \`React.memo\` / \`useMemo\`
- Some libraries (e.g., Emotion) have \`css\` functions for caching

### Increased Bundle Size

CSS-in-JS libraries add their runtime to the JavaScript bundle, especially if used without optimizations.

**Solution:**

- Use **Zero-runtime** libraries such as:
  - \`vanilla-extract\`
  - \`astroturf\`
  - \`linaria\`
- Or use compilation at build time (\`babel plugin\`, \`babel macro\`, \`vite plugin\`, \`webpack loader\`)

### SSR Problems

CSS-in-JS can cause hydration issues or missing styles on first render.

**Solution:**

- Use proper SSR setup
- Configure server-side style extraction
- Use libraries with good SSR support

> **Recommendation:** Choose CSS-in-JS libraries wisely considering your project requirements and performance constraints.`,
    contentMarkdownUa: `## Що Таке CSS-in-JS?

**CSS-in-JS** — це підхід до стилізації компонентів, де CSS пишеться **безпосередньо в JavaScript файлах**, часто з використанням бібліотек на кшталт \`styled-components\`, \`emotion\`, \`linaria\`, \`stitches\` та інших.

Цей підхід надає кілька переваг: scoped стилі, динамічні стилі, ізоляцію, підтримку тем тощо.

Але він також має **недоліки**, особливо якщо використовувати без розуміння підводних каменів.

---

## Основні Проблеми CSS-in-JS та Рішення

### Втрата Продуктивності при Рендері

Кожного разу, коли компонент рендериться, бібліотека може створювати класи або стилі заново. Це особливо критично в великих списках або при частих оновленнях UI.

**Рішення:**

- Використовуйте **статичні стилі**, коли це можливо
- Обгортайте компоненти в \`React.memo\` / \`useMemo\`
- Деякі бібліотеки (наприклад, Emotion) мають \`css\` функції для кешування

### Збільшення Розміру Бандла

CSS-in-JS бібліотеки додають свій runtime до JavaScript бандлу, особливо якщо використовуються без оптимізацій.

**Рішення:**

- Використовуйте **Zero-runtime** бібліотеки, такі як:
  - \`vanilla-extract\`
  - \`astroturf\`
  - \`linaria\`
- Або використовуйте компіляцію на етапі збірки (\`babel plugin\`, \`babel macro\`, \`vite plugin\`, \`webpack loader\`)

### Проблеми з SSR

CSS-in-JS може викликати проблеми з гідратацією або відсутність стилів при першому рендері.

**Рішення:**

- Використовуйте правильне налаштування SSR
- Налаштуйте серверне вилучення стилів
- Використовуйте бібліотеки з хорошою підтримкою SSR

> **Рекомендація:** Обирайте CSS-in-JS бібліотеки мудро, враховуючи вимоги вашого проекту та обмеження продуктивності.`,
  },
  
  // Question 2: CSS Animation
  {
    slug: 'css-animations-transitions',
    titleEn: 'CSS Animations and Transitions',
    titleUa: 'CSS Анімації та Переходи',
    descriptionEn: 'Learn about CSS properties for creating animations and smooth transitions.',
    descriptionUa: 'Дізнайтесь про CSS властивості для створення анімацій та плавних переходів.',
    difficulty: 'MEDIUM' as const,
    order: 21,
    contentMarkdownEn: `## Main CSS Properties for Animations and Transitions

CSS provides two approaches for creating visual effects:

1. **Smooth transitions (\`transition\`)** — for simple effects (on hover, focus, etc.)
2. **Animations (\`@keyframes + animation\`)** — for complex and multi-step effects

---

## Transition — Smooth Transitions

Used for animating property changes when element state changes.

\`\`\`css
.button {
  background: blue;
  transition: background 0.3s ease;
}

.button:hover {
  background: red;
}
\`\`\`

### Main Properties:

- \`transition-property\` — which property to animate
- \`transition-duration\` — duration
- \`transition-timing-function\` — easing function
- \`transition-delay\` — delay before start

---

## Animation — Complex Animations

For multi-step animations with full control.

\`\`\`css
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.element {
  animation: slideIn 1s ease-out;
}
\`\`\`

### Main Properties:

- \`animation-name\` — keyframes name
- \`animation-duration\` — duration
- \`animation-timing-function\` — easing
- \`animation-delay\` — delay
- \`animation-iteration-count\` — repeat count
- \`animation-direction\` — direction

> **Tip:** Use \`transition\` for simple effects, \`animation\` for complex multi-step animations.`,
    contentMarkdownUa: `## Основні CSS Властивості для Анімацій та Переходів

CSS надає два підходи для створення візуальних ефектів:

1. **Плавні переходи (\`transition\`)** — для простих ефектів (при hover, focus тощо)
2. **Анімації (\`@keyframes + animation\`)** — для складних і багатоступінчастих ефектів

---

## Transition — Плавні Переходи

Використовується для анімації зміни властивостей при зміні стану елемента.

\`\`\`css
.button {
  background: blue;
  transition: background 0.3s ease;
}

.button:hover {
  background: red;
}
\`\`\`

### Основні Властивості:

- \`transition-property\` — яку властивість анімувати
- \`transition-duration\` — тривалість
- \`transition-timing-function\` — функція пом'якшення
- \`transition-delay\` — затримка перед початком

---

## Animation — Складні Анімації

Для багатоступінчастих анімацій з повним контролем.

\`\`\`css
@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.element {
  animation: slideIn 1s ease-out;
}
\`\`\`

### Основні Властивості:

- \`animation-name\` — назва keyframes
- \`animation-duration\` — тривалість
- \`animation-timing-function\` — пом'якшення
- \`animation-delay\` — затримка
- \`animation-iteration-count\` — кількість повторень
- \`animation-direction\` — напрямок

> **Порада:** Використовуйте \`transition\` для простих ефектів, \`animation\` для складних багатоступінчастих анімацій.`,
  },
  
  // Question 3: Meta Tags
  {
    slug: 'html-meta-tags',
    titleEn: 'Essential Meta Tags in HTML',
    titleUa: 'Основні Meta-теги в HTML',
    descriptionEn: 'Learn about essential HTML meta tags for SEO, responsive design, and social media sharing.',
    descriptionUa: 'Дізнайтесь про основні HTML meta-теги для SEO, адаптивного дизайну та ділення в соціальних мережах.',
    difficulty: 'EASY' as const,
    order: 22,
    contentMarkdownEn: `## What are Meta Tags?

**Meta tags** (\`<meta>\`) are tags placed inside \`<head>\` that **aren't displayed on the page**, but provide information about the page to browsers, search engines and social media.

---

## Main Meta Tags

### Page Encoding

\`\`\`html
<meta charset="UTF-8" />
\`\`\`

- Mandatory tag — sets document encoding
- Without it there may be character display problems

### Responsive Layout (viewport)

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
\`\`\`

- Makes page responsive on mobile devices
- Without it site will look "compressed"

### SEO Tags

\`\`\`html
<meta name="description" content="Brief page description for search engines" />
<meta name="keywords" content="html, metatags, frontend, seo" />
<meta name="robots" content="index, follow" />
\`\`\`

- **description** — brief description for search engines
- **keywords** — keywords (rarely used in modern search engines)
- **robots** — bot behavior: \`index\`, \`noindex\`, \`follow\`, \`nofollow\`

### Author and Language

\`\`\`html
<meta name="author" content="Your Name" />
<meta http-equiv="Content-Language" content="en" />
\`\`\`

### Open Graph (OG) — for Social Media

\`\`\`html
<meta property="og:title" content="Page Title" />
<meta property="og:description" content="Page Description" />
<meta property="og:image" content="https://site.com/image.png" />
<meta property="og:url" content="https://site.com" />
\`\`\`

Used by social media (Facebook, LinkedIn) to display page preview.

### Twitter Card

\`\`\`html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Title" />
<meta name="twitter:description" content="Description" />
<meta name="twitter:image" content="https://site.com/image.png" />
\`\`\`

> **Important:** Don't overuse \`keywords\` — modern search engines ignore them. But \`description\` and OG tags still play a role in SEO and social media.`,
    contentMarkdownUa: `## Що Таке Meta-теги?

**Meta-теги** (\`<meta>\`) — це теги, які розміщуються всередині \`<head>\` і **не відображаються на сторінці**, але надають інформацію про сторінку браузерам, пошуковим системам та соціальним мережам.

---

## Основні Meta-теги

### Кодування Сторінки

\`\`\`html
<meta charset="UTF-8" />
\`\`\`

- Обов'язковий тег — встановлює кодування документа
- Без нього можуть бути проблеми з відображенням символів

### Адаптивна Верстка (viewport)

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
\`\`\`

- Робить сторінку адаптивною на мобільних пристроях
- Без нього сайт виглядатиме "стиснутим"

### SEO Теги

\`\`\`html
<meta name="description" content="Короткий опис сторінки для пошукових систем" />
<meta name="keywords" content="html, metatags, frontend, seo" />
<meta name="robots" content="index, follow" />
\`\`\`

- **description** — короткий опис для пошукових систем
- **keywords** — ключові слова (рідко використовуються в сучасних пошукових системах)
- **robots** — поведінка ботів: \`index\`, \`noindex\`, \`follow\`, \`nofollow\`

### Автор та Мова

\`\`\`html
<meta name="author" content="Ваше Ім'я" />
<meta http-equiv="Content-Language" content="uk" />
\`\`\`

### Open Graph (OG) — для Соціальних Мереж

\`\`\`html
<meta property="og:title" content="Заголовок Сторінки" />
<meta property="og:description" content="Опис Сторінки" />
<meta property="og:image" content="https://site.com/image.png" />
<meta property="og:url" content="https://site.com" />
\`\`\`

Використовується соціальними мережами (Facebook, LinkedIn) для відображення превью сторінки.

### Twitter Card

\`\`\`html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Заголовок" />
<meta name="twitter:description" content="Опис" />
<meta name="twitter:image" content="https://site.com/image.png" />
\`\`\`

> **Важливо:** Не зловживайте \`keywords\` — сучасні пошукові системи їх ігнорують. Але \`description\` та OG теги все ще грають роль у SEO та соціальних мережах.`,
  },
  
  // Question 4: strong vs b
  {
    slug: 'html-strong-vs-b',
    titleEn: 'Difference Between <strong> and <b> Tags',
    titleUa: 'Різниця Між Тегами <strong> та <b>',
    descriptionEn: 'Understand the semantic difference between strong and b tags in HTML.',
    descriptionUa: 'Зрозумійте семантичну різницю між тегами strong та b в HTML.',
    difficulty: 'EASY' as const,
    order: 23,
    contentMarkdownEn: `Both tags visually make text **bold**, but they have **different purposes** and **semantic meaning**.

---

## <b> — just visual emphasis

- Makes text bold **without semantic load**
- Used **only** for styling

\`\`\`html
<p>This is an <b>important</b> point in design.</p>
\`\`\`

- Doesn't tell browser or screen readers that text is important
- Doesn't affect SEO

## <strong> — semantic emphasis of importance

- Makes text bold and indicates it's important information
- Semantic tag — screen readers announce it with emphasis

\`\`\`html
<p>This is <strong>important</strong> information!</p>
\`\`\`

- Improves **accessibility (a11y)**
- Can affect **SEO**, as search engines consider text importance

> **Tip:** If you just want bold text — use CSS (\`font-weight: bold;\`). If text **has semantic importance** — use \`<strong>\`.`,
    contentMarkdownUa: `Обидва теги візуально роблять текст **жирним**, але вони мають **різне призначення** та **семантичне значення**.

---

## <b> — просто візуальний акцент

- Робить текст жирним **без семантичного навантаження**
- Використовується **тільки** для стилізації

\`\`\`html
<p>Це <b>важливий</b> момент у дизайні.</p>
\`\`\`

- Не повідомляє браузеру або скрін-рідерам, що текст важливий
- Не впливає на SEO

## <strong> — семантичний акцент важливості

- Робить текст жирним і вказує на те, що це важлива інформація
- Семантичний тег — скрін-рідери оголошують його з наголосом

\`\`\`html
<p>Це <strong>важлива</strong> інформація!</p>
\`\`\`

- Покращує **доступність (a11y)**
- Може впливати на **SEO**, оскільки пошукові системи враховують важливість тексту

> **Порада:** Якщо ви просто хочете жирний текст — використовуйте CSS (\`font-weight: bold;\`). Якщо текст **має семантичну важливість** — використовуйте \`<strong>\`.`,
  },
  
  // Question 5: Hiding Elements
  {
    slug: 'css-hide-elements-accessible',
    titleEn: 'How to Hide Elements Visually but Keep Accessible',
    titleUa: 'Як Приховати Елементи Візуально але Залишити Доступними',
    descriptionEn: 'Learn techniques to hide elements visually while keeping them accessible to screen readers.',
    descriptionUa: 'Дізнайтесь про техніки приховання елементів візуально, зберігаючи їх доступними для скрін-рідерів.',
    difficulty: 'MEDIUM' as const,
    order: 24,
    contentMarkdownEn: `## Goal

Sometimes you need to **hide an element visually** but keep it **accessible to screen readers** (e.g., descriptions, hints, service text for blind users).

---

## Approach 1: CSS Class ".sr-only"

This is **the most common way** to hide an element from eyes but not from screen readers.

\`\`\`css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
\`\`\`

\`\`\`html
<p class="sr-only">Only screen reader sees this</p>
\`\`\`

Used in Tailwind, Bootstrap (.sr-only) and other UI frameworks.

## Approach 2: Attribute "aria-hidden="true""

**Opposite behavior** — hides **from screen readers** but **keeps on screen**.

\`\`\`html
<p aria-hidden="true">This text is visible but not read by screen readers</p>
\`\`\`

Use \`aria-hidden="true"\` **only for decorative or duplicate elements**.

## Approach 3: "span" with text + "aria-label"

When you want to visually show one element but pass different text to screen reader.

\`\`\`html
<button aria-label="Close modal">
  ❌
</button>
\`\`\`

## Approach 4: Text Off-screen (less preferable)

\`\`\`css
.hidden-offscreen {
  position: absolute;
  left: -9999px;
}
\`\`\`

This method works but is less reliable and can cause navigation problems.

## What Not to Do

- \`display: none\` and \`visibility: hidden\` — completely hide from both eyes and screen readers
- Removing element from DOM

> **Accessibility Tip:** Use \`.sr-only\` for explanations, hidden headings and text for screen readers. This makes your site **accessible to all users**, including those using assistive technologies.`,
    contentMarkdownUa: `## Мета

Іноді потрібно **приховати елемент візуально**, але залишити його **доступним для скрін-рідерів** (наприклад, описи, підказки, сервісний текст для незрячих користувачів).

---

## Підхід 1: CSS Клас ".sr-only"

Це **найпоширеніший спосіб** приховати елемент від очей, але не від скрін-рідерів.

\`\`\`css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
\`\`\`

\`\`\`html
<p class="sr-only">Тільки скрін-рідер бачить це</p>
\`\`\`

Використовується в Tailwind, Bootstrap (.sr-only) та інших UI фреймворках.

## Підхід 2: Атрибут "aria-hidden="true""

**Протилежна поведінка** — ховає **від скрін-рідерів**, але **залишає на екрані**.

\`\`\`html
<p aria-hidden="true">Цей текст видимий, але не читається скрін-рідерами</p>
\`\`\`

Використовуйте \`aria-hidden="true"\` **тільки для декоративних або дублюючих елементів**.

## Підхід 3: "span" з текстом + "aria-label"

Коли ви хочете візуально показати один елемент, але передати інший текст скрін-рідеру.

\`\`\`html
<button aria-label="Закрити модальне вікно">
  ❌
</button>
\`\`\`

## Підхід 4: Текст За Екраном (менш кращий)

\`\`\`css
.hidden-offscreen {
  position: absolute;
  left: -9999px;
}
\`\`\`

Цей метод працює, але менш надійний і може викликати проблеми з навігацією.

## Що Не Варто Робити

- \`display: none\` та \`visibility: hidden\` — повністю ховають і від очей, і від скрін-рідерів
- Видалення елемента з DOM

> **Порада з Доступності:** Використовуйте \`.sr-only\` для пояснень, прихованих заголовків та тексту для скрін-рідерів. Це робить ваш сайт **доступним для всіх користувачів**, включно з тими, хто використовує допоміжні технології.`,
  },
];

async function addQuestions() {
  try {
    console.log('🚀 Adding batch 6 questions to database...\n')
    
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

console.log('\n🚀 Batch 6: CSS-in-JS, Animations, Meta Tags')
console.log('=========================================\n')

addQuestions()
  .then(() => {
    console.log('✅ Batch 6 complete!\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error)
    process.exit(1)
  })
