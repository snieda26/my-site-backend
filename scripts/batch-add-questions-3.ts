/**
 * Batch Add Questions (Batch 3) to Database
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
  // Question 5: Transform vs Top/Left
  {
    slug: 'why-transform-better-than-top-left',
    titleEn: 'Why Transform is Better for Animations than Top, Left',
    titleUa: 'Чому Transform Краще для Анімацій ніж Top, Left',
    descriptionEn: 'Learn why CSS transform property provides better performance for animations compared to top and left properties.',
    descriptionUa: 'Дізнайтесь, чому властивість CSS transform забезпечує кращу продуктивність для анімацій порівняно з властивостями top та left.',
    difficulty: 'MIDDLE' as const,
    order: 10,
    contentMarkdownEn: `When it comes to animations in CSS, using **transform** to move elements is the preferred method compared to using **top** and **left** properties. Here are several reasons why:

---

## Performance

- **transform** is used to create **composite layers** by the browser, allowing the browser to optimize repainting
- This means the element moves without recalculating its position in the document flow, making animations with **transform** more performant
- In contrast, using **top** and **left** forces the browser to recalculate the element's position in the context of the entire document
- This can be more resource-intensive, especially with many animations

---

## Avoiding Layout Recalculation

- **transform** works in **composition**, meaning it doesn't affect the position of other elements on the page
- This means moving an element with transform doesn't trigger layout recalculation and doesn't affect document flow
- With **top** and **left**, the browser will recalculate the entire layout and positioning of other elements
- This can slow down performance, especially if animations are applied to many elements

---

## Better for GPU Acceleration

- **transform** is used by browsers for **GPU-accelerated** animations
- This means the browser can use the graphics processor to perform the animation, significantly increasing its performance and smoothness
- **top** and **left** are typically processed using the **CPU**, which can slow down animation on devices with less power or with many elements

---

## Animation Smoothness

- Animations using **transform** (e.g., \`translate\`, \`scale\`, \`rotate\`) are much smoother
- They don't cause "jumps" or "jerks" that can occur with **top** and **left** animations

---

## No Changes to Document Flow

- Moving an element with **transform** doesn't affect the positioning of other elements in the document
- The element continues to occupy its place in the flow, even if it visually moves
- Using **top** and **left**, you actually change the element's position in the flow
- This can disrupt the positioning of other elements, especially in complex layouts

---

## Conclusion

- **transform** is the best choice for animations as it's more performant, smooth, and doesn't affect other elements in the document
- Using **top** and **left** should be avoided for animations as it can lead to layout recalculation, as well as lower performance and less smooth animations

> **Recommendation:** To create smooth and efficient animations, always prefer **transform** (e.g., \`translate()\`, \`scale()\`, \`rotate()\`) over **top** and **left**.

\`\`\`css
/* ❌ Avoid for animations */
.element {
  position: absolute;
  top: 100px;
  left: 100px;
  transition: top 0.3s, left 0.3s;
}

/* ✅ Better for animations */
.element {
  transform: translate(100px, 100px);
  transition: transform 0.3s;
}
\`\`\``,
    contentMarkdownUa: `Коли йдеться про анімації в CSS, використання **transform** для переміщення елементів є кращим методом порівняно з використанням властивостей **top** та **left**. Ось кілька причин чому:

---

## Продуктивність

- **transform** використовується для створення **композитних шарів** браузером, що дозволяє браузеру оптимізувати перемальовування
- Це означає, що елемент рухається без перерахунку його позиції в потоці документа, роблячи анімації з **transform** більш продуктивними
- На відміну від цього, використання **top** та **left** змушує браузер перераховувати позицію елемента в контексті всього документа
- Це може бути більш ресурсомістким, особливо при великій кількості анімацій

---

## Уникнення Перерахунку Макету

- **transform** працює в **композиції**, тобто не впливає на позицію інших елементів на сторінці
- Це означає, що переміщення елемента з transform не викликає перерахунку макету та не впливає на потік документа
- З **top** та **left** браузер перераховуватиме весь макет і позиціонування інших елементів
- Це може сповільнити продуктивність, особливо якщо анімації застосовуються до багатьох елементів

---

## Краще для GPU Прискорення

- **transform** використовується браузерами для **GPU-прискорених** анімацій
- Це означає, що браузер може використовувати графічний процесор для виконання анімації, значно збільшуючи її продуктивність та плавність
- **top** та **left** зазвичай обробляються за допомогою **CPU**, що може сповільнити анімацію на пристроях з меншою потужністю або при великій кількості елементів

---

## Плавність Анімації

- Анімації з використанням **transform** (наприклад, \`translate\`, \`scale\`, \`rotate\`) набагато плавніші
- Вони не викликають "стрибків" або "ривків", які можуть виникати при анімації з **top** та **left**

---

## Відсутність Змін у Потоці Документа

- Переміщення елемента з **transform** не впливає на позиціонування інших елементів у документі
- Елемент продовжує займати своє місце в потоці, навіть якщо він візуально рухається
- Використовуючи **top** та **left**, ви фактично змінюєте позицію елемента в потоці
- Це може порушити позиціонування інших елементів, особливо у складних макетах

---

## Висновок

- **transform** є найкращим вибором для анімацій, оскільки він більш продуктивний, плавний і не впливає на інші елементи в документі
- Використання **top** та **left** слід уникати для анімацій, оскільки це може призвести до перерахунку макету, а також до нижчої продуктивності та менш плавних анімацій

> **Рекомендація:** Для створення плавних та ефективних анімацій завжди віддавайте перевагу **transform** (наприклад, \`translate()\`, \`scale()\`, \`rotate()\`) над **top** та **left**.

\`\`\`css
/* ❌ Уникайте для анімацій */
.element {
  position: absolute;
  top: 100px;
  left: 100px;
  transition: top 0.3s, left 0.3s;
}

/* ✅ Краще для анімацій */
.element {
  transform: translate(100px, 100px);
  transition: transform 0.3s;
}
\`\`\``,
  },
  
  // Question 6: Semantic HTML
  {
    slug: 'semantic-html-markup',
    titleEn: 'Semantic HTML Markup',
    titleUa: 'Семантична HTML Розмітка',
    descriptionEn: 'Learn about semantic HTML tags and why they are important for accessibility, SEO, and code maintainability.',
    descriptionUa: 'Дізнайтесь про семантичні HTML теги та чому вони важливі для доступності, SEO та підтримки коду.',
    difficulty: 'JUNIOR' as const,
    order: 11,
    contentMarkdownEn: `**Semantic markup** is an approach to creating HTML documents that uses tags reflecting the meaning of content. Unlike using only \`<div>\` or \`<span>\`, semantic tags give document structure more significance, making it more understandable for people, search engines, and assistive technologies.

---

## Why is Semantic Markup Important?

### 1. Improved Accessibility

Semantic tags help assistive technologies (such as screen readers) better interpret and interact with content. For example, using the \`<article>\` tag for an article allows screen readers to understand that it's a separate article.

### 2. SEO (Search Engine Optimization)

Search engines like Google use semantic elements to better understand page structure. Tags such as \`<header>\`, \`<footer>\`, \`<nav>\` help search engines accurately understand which parts of the page are important, which can affect rankings.

### 3. Maintainability and Scalability

Semantic markup makes code more readable and easier to maintain. Other developers can quickly understand your code structure and make changes without errors.

### 4. Better Interaction with Browsers and Devices

Semantic markup makes pages more compatible with various browsers and devices, helping improve performance and optimize pages.

---

## Examples of Semantic Tags

| **Tag** | **Description** |
| --- | --- |
| \`<header>\` | Represents the top part of a page or section, usually contains navigation, logo, and headings |
| \`<footer>\` | Contains footer information, such as links to privacy policy or contact details |
| \`<article>\` | Description of independent content, such as an article or blog post |
| \`<section>\` | Page section that usually includes a heading and themes |
| \`<nav>\` | Represents a navigation block containing links to other pages or site sections |
| \`<aside>\` | Contains auxiliary information that is not the main part of content, such as a sidebar |
| \`<main>\` | Main part of the page containing content directly related to the page's primary context |
| \`<h1>\`, \`<h2>\`, \`<h3>\` | Headings of various levels that help structure text and make it more understandable |

---

## Semantic Markup Example

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Semantic Markup Example</title>
</head>
<body>

  <header>
    <h1>My Website</h1>
    <nav>
      <ul>
        <li><a href="#">Home</a></li>
        <li><a href="#">About</a></li>
        <li><a href="#">Contact</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <h2>Article Title</h2>
      <p>Article text...</p>
    </article>

    <aside>
      <h3>Recommended Articles</h3>
      <ul>
        <li><a href="#">Article 1</a></li>
        <li><a href="#">Article 2</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <p>&copy; 2026 My Website</p>
  </footer>

</body>
</html>
\`\`\`

> **Tip:** Use semantic tags to improve your HTML code structure. This will not only increase accessibility and SEO, but also simplify project maintenance.`,
    contentMarkdownUa: `**Семантична розмітка** — це підхід до створення HTML документів, який використовує теги, що відображають значення контенту. На відміну від використання лише \`<div>\` або \`<span>\`, семантичні теги надають структурі документа більше значущості, роблячи її зрозумілішою для людей, пошукових систем і допоміжних технологій.

---

## Чому Семантична Розмітка Важлива?

### 1. Покращена Доступність

Семантичні теги допомагають допоміжним технологіям (таким як програми читання з екрана) краще інтерпретувати та взаємодіяти з контентом. Наприклад, використання тегу \`<article>\` для статті дозволяє програмам читання з екрана зрозуміти, що це окрема стаття.

### 2. SEO (Оптимізація для Пошукових Систем)

Пошукові системи, такі як Google, використовують семантичні елементи для кращого розуміння структури сторінки. Теги, такі як \`<header>\`, \`<footer>\`, \`<nav>\`, допомагають пошуковим системам точно зрозуміти, які частини сторінки є важливими, що може вплинути на рейтинг.

### 3. Підтримка та Масштабованість

Семантична розмітка робить код більш читабельним і легким для підтримки. Інші розробники можуть швидко зрозуміти структуру вашого коду та внести зміни без помилок.

### 4. Краща Взаємодія з Браузерами та Пристроями

Семантична розмітка робить сторінки більш сумісними з різними браузерами та пристроями, допомагаючи покращити продуктивність та оптимізувати сторінки.

---

## Приклади Семантичних Тегів

| **Тег** | **Опис** |
| --- | --- |
| \`<header>\` | Представляє верхню частину сторінки або розділу, зазвичай містить навігацію, логотип та заголовки |
| \`<footer>\` | Містить інформацію нижнього колонтитула, таку як посилання на політику конфіденційності або контактні дані |
| \`<article>\` | Опис незалежного контенту, такого як стаття або допис у блозі |
| \`<section>\` | Розділ сторінки, який зазвичай включає заголовок та теми |
| \`<nav>\` | Представляє блок навігації, що містить посилання на інші сторінки або розділи сайту |
| \`<aside>\` | Містить допоміжну інформацію, яка не є основною частиною контенту, наприклад, бічна панель |
| \`<main>\` | Основна частина сторінки, що містить контент, безпосередньо пов'язаний з основним контекстом сторінки |
| \`<h1>\`, \`<h2>\`, \`<h3>\` | Заголовки різних рівнів, які допомагають структурувати текст і робити його більш зрозумілим |

---

## Приклад Семантичної Розмітки

\`\`\`html
<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Приклад Семантичної Розмітки</title>
</head>
<body>

  <header>
    <h1>Мій Веб-сайт</h1>
    <nav>
      <ul>
        <li><a href="#">Головна</a></li>
        <li><a href="#">Про нас</a></li>
        <li><a href="#">Контакти</a></li>
      </ul>
    </nav>
  </header>

  <main>
    <article>
      <h2>Заголовок Статті</h2>
      <p>Текст статті...</p>
    </article>

    <aside>
      <h3>Рекомендовані Статті</h3>
      <ul>
        <li><a href="#">Стаття 1</a></li>
        <li><a href="#">Стаття 2</a></li>
      </ul>
    </aside>
  </main>

  <footer>
    <p>&copy; 2026 Мій Веб-сайт</p>
  </footer>

</body>
</html>
\`\`\`

> **Порада:** Використовуйте семантичні теги для покращення структури вашого HTML коду. Це не тільки підвищить доступність та SEO, але й спростить підтримку проекту.`,
  },
];

async function addQuestions() {
  try {
    console.log('🚀 Adding batch 3 questions to database...\n')
    
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

console.log('\n🚀 Batch 3: Final Questions to Database')
console.log('===================================\n')

addQuestions()
  .then(() => {
    console.log('\n✅ All 6 questions added successfully!\n')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error)
    process.exit(1)
  })
